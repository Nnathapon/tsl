import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient, type User } from "@supabase/supabase-js";

const supabase = createClient(
  "https://pgajyljliehhfxmbhvnx.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnYWp5bGpsaWVoaGZ4bWJodm54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5NTc3NDQsImV4cCI6MjA3MTUzMzc0NH0.-2qqzzOmFeor3QwofbULz4-24Uo-CroWfio2c9Z6mLc"
);

const ProfileSettings = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profile, setProfile] = useState({
    fullName: '',
    about: '',
    phoneNumber: '',
    avatarUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Consolidated user fetching and profile loading
  useEffect(() => {
    async function fetchUserAndProfile() {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        console.error("Auth error or no user:", error);
        navigate('/login');
        return;
      }
      
      setUser(user);
      await fetchUserProfile(user);
    }
    
    fetchUserAndProfile();
  }, [navigate]);

  const fetchUserProfile = async (currentUser: User) => {
    try {      
      const { data: dbProfile, error: dbError } = await supabase
        .from('profiles')
        .select('full_name, about, phone_number, avatar_url')
        .eq('id', currentUser.id)
        .single();

      if (dbError && dbError.code === 'PGRST116') {
        console.log('No database profile found, using user_metadata');
        const metadataProfile = {
          fullName: currentUser.user_metadata?.full_name || '',
          about: currentUser.user_metadata?.about || '',
          phoneNumber: currentUser.user_metadata?.phone_number || '',
          avatarUrl: currentUser.user_metadata?.avatar_url || ''
        };
        
        setProfile(metadataProfile);
        await createProfileFromMetadata(currentUser.id, metadataProfile);
        
      } else if (dbError) {
        console.error('Error fetching profile:', dbError);
        throw dbError;
      } else {
        setProfile({
          fullName: dbProfile?.full_name || '',
          about: dbProfile?.about || '',
          phoneNumber: dbProfile?.phone_number || '',
          avatarUrl: dbProfile?.avatar_url || ''
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setMessage({ type: 'error', text: 'Failed to load profile' });
    } finally {
      setLoading(false);
    }
  };

  const createProfileFromMetadata = async (userId: string, metadataProfile: any) => {
    try {
      const updates = {
        id: userId,
        full_name: metadataProfile.fullName,
        about: metadataProfile.about,
        phone_number: metadataProfile.phoneNumber,
        avatar_url: metadataProfile.avatarUrl,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .insert(updates);

      if (error) throw error;
      console.log('Auto-created database profile from metadata');
    } catch (error) {
      console.error('Error creating profile from metadata:', error);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select an image file' });
      return;
    }

    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image must be smaller than 2MB' });
      return;
    }

    setUploading(true);
    try {
      const publicUrl = await uploadToSupabase(file);
      if (publicUrl) {
        setProfile(prev => ({ ...prev, avatarUrl: publicUrl }));
        setMessage({ type: 'success', text: 'Profile picture updated!' });
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({ type: 'error', text: 'Failed to upload image' });
    } finally {
      setUploading(false);
    }
  };

  const uploadToSupabase = async (file: File): Promise<string | null> => {
    try {
      // Create unique file name using user ID and timestamp
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
      const filePath = `profiles/${fileName}`;

      // Upload file to Supabase Storage :cite[4]:cite[5]
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars').upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL :cite[4]
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading to Supabase:', error);
      throw error;
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      if (!user) {
        throw new Error('No user found');
      }

      const updates = {
        id: user.id,
        full_name: profile.fullName,
        about: profile.about,
        phone_number: profile.phoneNumber,
        avatar_url: profile.avatarUrl,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(updates);

      if (error) throw error;

      // Update user metadata for backward compatibility
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          full_name: profile.fullName,
          about: profile.about,
          phone_number: profile.phoneNumber,
          avatar_url: profile.avatarUrl
        }
      });

      if (metadataError) {
        console.warn('Could not update user metadata:', metadataError);
      }

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: `Failed to update profile: ${error.message}` });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Improved full-screen layout */}
      <div className="container mx-auto px-8 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center space-x-4">
            <span className="text-3xl">🏠</span>
            <div>
              <h1 className="text-3xl font-bold">Profile Settings</h1>
              <p className="text-gray-400 mt-1">Manage your personal information</p>
            </div>
          </div>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div className={`mb-8 p-4 rounded-lg border ${
            message.type === 'error' 
              ? 'bg-red-500/10 border-red-500 text-red-300'
              : 'bg-green-500/10 border-green-500 text-green-300'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Picture */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-2xl p-8 sticky top-8">
              <h2 className="text-xl font-semibold mb-6">Profile Picture</h2>
              
              <div className="flex flex-col items-center space-y-6">
                {/* Profile Image Preview */}
                <div className="relative">
                  <div className="w-48 h-48 rounded-full border-4 border-purple-600 bg-gray-700 flex items-center justify-center overflow-hidden shadow-2xl">
                    {profile.avatarUrl ? (
                      <img 
                        src={profile.avatarUrl} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-6xl">👤</span>
                    )}
                  </div>
                  {uploading && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                
                {/* Upload Controls */}
                <div className="w-full space-y-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    disabled={uploading}
                    className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {uploading ? 'Uploading...' : 'Upload Image'}
                  </button>
                  
                  <p className="text-sm text-gray-400 text-center">
                    JPG, PNG or GIF. Max 2MB.
                  </p>
                </div>

                {/* Current Avatar URL Display */}
                {profile.avatarUrl && (
                  <div className="w-full mt-4 p-4 bg-gray-700/50 rounded-lg">
                    <p className="text-sm text-gray-300 mb-2">Current Avatar URL:</p>
                    <input
                      type="url"
                      value={profile.avatarUrl}
                      onChange={(e) => handleInputChange('avatarUrl', e.target.value)}
                      className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-sm text-white placeholder-gray-400 focus:border-purple-600 focus:outline-none"
                      placeholder="Avatar URL"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Form Fields */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-2xl p-8">
              <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={profile.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profile.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-colors"
                    placeholder="+66 12 345 6789"
                  />
                </div>

                {/* About Me - Full Width */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    About Me
                  </label>
                  <textarea
                    value={profile.about}
                    onChange={(e) => handleInputChange('about', e.target.value)}
                    rows={5}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-colors resize-vertical"
                    placeholder="Tell us about yourself, your interests, or anything you'd like to share..."
                    maxLength={500}
                  />
                  <div className="flex justify-between text-sm text-gray-400 mt-2">
                    <span>Brief description about yourself</span>
                    <span>{profile.about.length}/500 characters</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-8 mt-8 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="px-8 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 font-medium"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettings;