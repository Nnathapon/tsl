import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone } from 'lucide-react';
import { supabase } from './supabaseClient';

interface Profile {
  id: string;
  full_name?: string;
  username?: string;
  about?: string;
  avatar_url?: string;
  phone_number?: string;
}

function UserProfile() {
  const { userid } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userid)
          .single();

        if (error) throw error;
        setProfile(data);

      } catch (error) {
        console.error('Error fetching profile:', error);
        setError((error as any).message);
      } finally {
        setLoading(false);
      }
    };

    if (userid) {
      fetchProfile();
    }
  }, [userid]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-2">Error Loading Profile</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link to="/" className="text-purple-400 hover:text-purple-300 transition-colors">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-6xl mb-4">👤</div>
          <h1 className="text-2xl font-bold text-white mb-2">Profile Not Found</h1>
          <p className="text-gray-400 mb-6">The user profile you're looking for doesn't exist.</p>
          <Link to="/" className="text-purple-400 hover:text-purple-300 transition-colors">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <Link 
            to="/"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Profile Content */}
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-2xl">
          {/* Profile Header */}
          <div className="relative">
            {/* Cover Photo Placeholder */}
            <div className="h-48 bg-gradient-to-r from-purple-600 to-blue-600"></div>
            
            {/* Profile Info */}
            <div className="px-8 pb-8">
              <div className="flex flex-col md:flex-row items-start md:items-end -mt-20 space-y-4 md:space-y-0">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 rounded-full border-4 border-gray-800 bg-gray-700 flex items-center justify-center overflow-hidden shadow-2xl">
                    {profile.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl">👤</span>
                    )}
                  </div>
                </div>

                {/* User Details */}
                <div className="flex-1 md:ml-6 md:mb-4 text-center md:text-left">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {profile.full_name || 'Anonymous User'}
                  </h1>
                  {profile.username && (
                    <p className="text-gray-400 text-lg">@{profile.username}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="px-8 pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* About Section */}
                {profile.about && (
                  <div className="bg-gray-750 rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-4">About</h2>
                    <p className="text-gray-300 leading-relaxed">{profile.about}</p>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Contact Card */}
                <div className="bg-gray-750 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Contact</h3>
                  <div className="space-y-3">
                    {/* Email would typically come from auth, not public profile */}
                    <div className="flex items-center text-gray-400">
                      <Mail className="w-4 h-4 mr-3" />
                      <span>Contact via message</span>
                    </div>
                    
                    {profile.phone_number && (
                      <div className="flex items-center text-gray-400">
                        <Phone className="w-4 h-4 mr-3" />
                        <span>{profile.phone_number}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Message Button */}
                  <button className="w-full mt-4 bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium">
                    Send Message
                  </button>
                </div>

                {/* Stats Card */}
                <div className="bg-gray-750 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4">Stats</h3>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-white">0</div>
                      <div className="text-sm text-gray-400">Listings</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">0</div>
                      <div className="text-sm text-gray-400">Reviews</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="mt-8 bg-gray-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
          <div className="text-center py-12">
            <div className="text-gray-500 text-6xl mb-4">📝</div>
            <p className="text-gray-400 text-lg">No recent activity to show</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;