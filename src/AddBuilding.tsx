import type { User } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { 
  Upload, 
  MapPin, 
  DollarSign, 
  Ruler, 
  Plus, 
  X, 
  Home,
  Wifi,
  Car,
  Snowflake,
  Dumbbell,
  Waves,
  Utensils
} from 'lucide-react';

const supabase = createClient(
  "https://pgajyljliehhfxmbhvnx.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnYWp5bGpsaWVoaGZ4bWJodm54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5NTc3NDQsImV4cCI6MjA3MTUzMzc0NH0.-2qqzzOmFeor3QwofbULz4-24Uo-CroWfio2c9Z6mLc"
);

interface FormData {
  location: string;
  price: string;
  size: string;
  amenities: string[];
  image_url: string;
}

const AddBuilding = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState<FormData>({
    location: '',
    price: '',
    size: '',
    amenities: [],
    image_url: ''
  });

  const [customAmenity, setCustomAmenity] = useState('');

  const predefinedAmenities = [
    { id: 'wifi', label: 'WiFi', icon: <Wifi className="w-4 h-4" /> },
    { id: 'parking', label: 'Parking', icon: <Car className="w-4 h-4" /> },
    { id: 'ac', label: 'Air Conditioning', icon: <Snowflake className="w-4 h-4" /> },
    { id: 'gym', label: 'Gym', icon: <Dumbbell className="w-4 h-4" /> },
    { id: 'pool', label: 'Swimming Pool', icon: <Waves className="w-4 h-4" /> },
    { id: 'restaurant', label: 'Restaurant', icon: <Utensils className="w-4 h-4" /> }
  ];

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
      return;
    }
    setUser(user);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const addCustomAmenity = () => {
    if (customAmenity.trim() && !formData.amenities.includes(customAmenity.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, customAmenity.trim()]
      }));
      setCustomAmenity('');
    }
  };

  const removeAmenity = (amenityToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter(amenity => amenity !== amenityToRemove)
    }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select an image file' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image must be smaller than 5MB' });
      return;
    }

    setUploading(true);
    try {
      const publicUrl = await uploadToSupabase(file);
      if (publicUrl) {
        setFormData(prev => ({ ...prev, image_url: publicUrl }));
        setMessage({ type: 'success', text: 'Image uploaded successfully!' });
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({ type: 'error', text: 'Failed to upload image' });
    } finally {
      setUploading(false);
    }
  };

  const uploadToSupabase = async (file: File) => {
    if (!user) throw new Error('User not found');
    const fileExt = file.name.split('.').pop();
    const fileName = `${user!.id}-${Date.now()}.${fileExt}`;
    const filePath = `buildings/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      if (!user) throw new Error('User not found');

      // Validate required fields
      if (!formData.location || !formData.price || !formData.size) {
        throw new Error('Please fill in all required fields');
      }

      const buildingData = {
        seller_id: user!.id,
        location: formData.location,
        price: parseFloat(formData.price),
        size: parseInt(formData.size),
        amenities: formData.amenities,
        image_url: formData.image_url,
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('buildings')
        .insert(buildingData);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Building listed successfully!' });
      
      // Reset form
      setFormData({
        location: '',
        price: '',
        size: '',
        amenities: [],
        image_url: ''
      });

      // Redirect after success
      setTimeout(() => navigate('/dashboard'), 2000);

    } catch (error) {
      console.error('Error creating listing:', error);
      setMessage({ type: 'error', text: (error as any).message });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2">
                <Home className="w-6 h-6 text-purple-500" />
                <h1 className="text-xl font-bold">Add New Property</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg border ${
            message.type === 'error' 
              ? 'bg-red-500/10 border-red-500 text-red-300'
              : 'bg-green-500/10 border-green-500 text-green-300'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image Upload Section */}
          <div className="bg-gray-800 rounded-2xl p-8">
            <h2 className="text-xl font-semibold mb-6">Property Images</h2>
            
            <div className="flex flex-col items-center space-y-6">
              {formData.image_url ? (
                <div className="relative">
                  <img 
                    src={formData.image_url} 
                    alt="Property" 
                    className="w-64 h-48 rounded-xl object-cover shadow-2xl"
                  />
                  <button
                    type="button"
                    onClick={() => handleInputChange('image_url', '')}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-600 rounded-2xl p-12 text-center hover:border-purple-500 transition-colors">
                  <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">Upload property image</p>
                  <input
                    type="file"
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                    id="property-image"
                  />
                  <label
                    htmlFor="property-image"
                    className="bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors cursor-pointer inline-block"
                  >
                    {uploading ? 'Uploading...' : 'Choose Image'}
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Property Details */}
          <div className="bg-gray-800 rounded-2xl p-8">
            <h2 className="text-xl font-semibold mb-6">Property Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Location */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>Location *</span>
                  </div>
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-colors"
                  placeholder="Enter full address or area"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4" />
                    <span>Price (THB) *</span>
                  </div>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="1000"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-colors"
                  placeholder="0.00"
                />
              </div>

              {/* Size */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  <div className="flex items-center space-x-2">
                    <Ruler className="w-4 h-4" />
                    <span>Size (sqm) *</span>
                  </div>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.size}
                  onChange={(e) => handleInputChange('size', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-colors"
                  placeholder="Square meters"
                />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-gray-800 rounded-2xl p-8">
            <h2 className="text-xl font-semibold mb-6">Amenities</h2>
            
            <div className="space-y-6">
              {/* Predefined Amenities */}
              <div>
                <h3 className="text-lg font-medium mb-4">Select Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {predefinedAmenities.map((amenity) => (
                    <button
                      key={amenity.id}
                      type="button"
                      onClick={() => handleAmenityToggle(amenity.id)}
                      className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center space-y-2 ${
                        formData.amenities.includes(amenity.id)
                          ? 'border-purple-600 bg-purple-600/20 text-white'
                          : 'border-gray-600 text-gray-400 hover:border-gray-500 hover:text-white'
                      }`}
                    >
                      {amenity.icon}
                      <span className="text-sm">{amenity.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Amenities */}
              <div>
                <h3 className="text-lg font-medium mb-4">Custom Amenities</h3>
                <div className="flex space-x-3 mb-4">
                  <input
                    type="text"
                    value={customAmenity}
                    onChange={(e) => setCustomAmenity(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomAmenity())}
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-purple-600 focus:outline-none"
                    placeholder="Add custom amenity"
                  />
                  <button
                    type="button"
                    onClick={addCustomAmenity}
                    className="bg-gray-700 border border-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>

                {/* Selected Amenities */}
                {formData.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.amenities.map((amenity) => (
                      <div
                        key={amenity}
                        className="bg-purple-600 text-white px-3 py-2 rounded-full flex items-center space-x-2"
                      >
                        <span>{amenity}</span>
                        <button
                          type="button"
                          onClick={() => removeAmenity(amenity)}
                          className="text-white hover:text-gray-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-8 py-4 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className="px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 font-medium"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Listing...</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Create Listing</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBuilding;