// src/pages/BuildingPage.jsx

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from "./supabaseClient";
import getYouTubeEmbedUrl from './yt';
import { 
  MapPin, 
  DollarSign, 
  Ruler, 
  CheckCircle, 
  Image, 
  Video 
} from 'lucide-react';


interface BuildingType {
  id: string;
  location?: string;
  price?: number;
  size?: number;
  image_url?: string;
  video_url?: string;
  amenities?: string[];
}

function Building() {
  const { id } = useParams(); // Get the 'id' from the URL (e.g., /building/123)
  const [building, setBuilding] = useState<BuildingType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
    // ADD THIS LOG
    console.log('Attempting to fetch building with id:', id);

    async function fetchBuilding() {
      // ...
      try {
        const { data, error } = await supabase
          .from('buildings')
          .select('*')
          .eq('id', id)
          .single();

        // THIS IS THE MOST IMPORTANT LOG
        console.log('Supabase response:', { data, error });

        if (error) {
          throw error;
        }
        
        if (data) {
          setBuilding(data);
        } else {
          setError('Building not found.');
        }

      } catch (err) {
        console.error('Error fetching building:', (err as any).message);
        setError((err as any).message);
      } finally {
        setLoading(false);
      }
    }

    fetchBuilding();
  }, [id]);
  // Handle loading state
  if (loading) {
    return <div className="p-8">Loading building details...</div>;
  }

  // Handle error or not found state
  if (error || !building) {
    return <div className="p-8 text-red-500">Error: {error || 'Building not found.'}</div>;
  }
  
  // Get the embeddable YouTube URL
  const embedUrl = getYouTubeEmbedUrl(building.video_url ?? null);

  // Render the building details
  return (
    <div className="max-w-4xl mx-auto p-6 text-white space-y-6">
      <h1 className="text-3xl font-bold">{building.location || 'Building Details'}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          {/* Main Image */}
          {building.image_url && (
            <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
              <img 
                src={building.image_url} 
                alt={`View of ${building.location}`}
                className="w-full h-full object-cover" 
              />
            </div>
          )}

          {/* Core Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-lg">
            <div className="flex items-center text-white space-x-2 p-4 bg-gray-800 rounded-lg">
              <MapPin className="w-6 h-6 text-blue-500" />
              <span className="font-medium">{building.location}</span>
            </div>
            <div className="flex items-center space-x-2 p-4 bg-gray-800 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-500" />
              <span className="font-medium">
                {Number(building.price).toLocaleString()}฿
              </span>
            </div>
            <div className="flex items-center space-x-2 p-4 bg-gray-800 rounded-lg">
              <Ruler className="w-6 h-6 text-yellow-500" />
              <span className="font-medium">{building.size} m²</span>
            </div>
          </div>

          {/* Amenities List */}
          {building.amenities && building.amenities.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-3">Amenities</h2>
              <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {/* Assuming amenities is a text array from Supabase (e.g., {"Pool", "Gym"}) */}
                {building.amenities.map((amenity, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>{amenity}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {embedUrl && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-3">Video Tour</h2>
            <iframe
                src={embedUrl}
                title="Building Video Tour"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full aspect-video rounded-lg shadow-lg min-h-[400px]"
              ></iframe>
          </div>
        )}
      </div>

      {/* Show icon placeholders if data is missing */}
      {!building.image_url && (
        <div className="flex items-center text-gray-400">
          <Image className="w-5 h-5 mr-2" /> No image provided.
        </div>
      )}
      {!embedUrl && (
        <div className="flex items-center text-gray-400">
          <Video className="w-5 h-5 mr-2" /> No video provided.
        </div>
      )}
    </div>
  );
}

export default Building;