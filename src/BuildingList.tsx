// src/pages/BuildingListPage.jsx

import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { DollarSign, Ruler, Search, Image as ImageIcon } from 'lucide-react';

interface Building {
  id: string;
  location?: string;
  price?: number;
  size?: number;
  amenities?: string[];
  image_url?: string;
}

function BuildingList() {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [areaQuery] = useState('');
  const [amenitiesQuery, setAmenitiesQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inputError, setInputError] = useState('');

  // 1. Fetch all buildings from Supabase on component mount
  useEffect(() => {
    async function fetchBuildings() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('buildings')
          .select('id, location, price, size, amenities, image_url');

        if (error) {
          throw error;
        }
        setBuildings(data || []);

      } catch (err) {
        console.error('Error fetching buildings:', (err as any).message);
        setError((err as any).message);
      } finally {
        setLoading(false);
      }
    }

    fetchBuildings();
  }, []);

  const filteredBuildings = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return buildings.filter((building) => {
      const locationMatch = building.location?.toLowerCase().includes(query);
      const price = Number(building.price);
      const min = Number(minPrice);
      const max = Number(maxPrice);
      const priceMatch =
        (!minPrice || price >= min) && (!maxPrice || price <= max);
      const areaMatch = areaQuery ? building.size?.toString().includes(areaQuery) : true;
      const amenitiesMatch = amenitiesQuery
        ? Array.isArray(building.amenities) &&
          amenitiesQuery
            .toLowerCase()
            .split(',')
            .map((term) => term.trim())
            .every((term) =>
              building.amenities?.some((a: string) =>
                a.toLowerCase().includes(term)
              )
            )
        : true;
      return locationMatch && priceMatch && areaMatch && amenitiesMatch;
    });
  }, [buildings, searchQuery, minPrice, maxPrice, areaQuery, amenitiesQuery]);

  // 3. Handle loading and error states
  if (loading) {
    return <div className="p-8 text-center dark:text-gray-300">Loading buildings...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  }

  // 4. Render the search bar and the list
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold">Find a Building</h1>

      {/* Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Location Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-3 pl-10 w-full rounded-lg border bg-gray-50 border-gray-300
                       dark:bg-gray-800 dark:border-gray-700 dark:text-white
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Min Price */}
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            min="1"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '' || /^[0-9]*$/.test(value)) {
                setMinPrice(value);
                setInputError('');
              } else {
                setInputError('Please enter numbers only for price.');
              }
            }}
            className="p-3 pl-10 w-full rounded-lg border bg-gray-50 border-gray-300
                       dark:bg-gray-800 dark:border-gray-700 dark:text-white
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Max Price */}
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            min="1"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '' || /^[0-9]*$/.test(value)) {
                setMaxPrice(value);
                setInputError('');
              } else {
                setInputError('Please enter numbers only for price.');
              }
            }}
            className="p-3 pl-10 w-full rounded-lg border bg-gray-50 border-gray-300
                       dark:bg-gray-800 dark:border-gray-700 dark:text-white
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Amenities */}
        <div className="relative">
          <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by amenities..."
            value={amenitiesQuery}
            onChange={(e) => setAmenitiesQuery(e.target.value)}
            className="p-3 pl-10 w-full rounded-lg border bg-gray-50 border-gray-300
                       dark:bg-gray-800 dark:border-gray-700 dark:text-white
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      {inputError && (
        <p className="text-red-500 text-sm mt-2">{inputError}</p>
      )}

      {/* Results List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBuildings.length > 0 ? (
          filteredBuildings.map(building => (
            <Link 
              to={`/building/${building.id}`} 
              key={building.id}
              className="block bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden
                         hover:shadow-xl transition-shadow duration-300"
            >
              {/* Image */}
              <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                {building.image_url ? (
                  <img 
                    src={building.image_url} 
                    alt={building.location}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                )}
              </div>
              
              {/* Content */}
              <div className="p-4 space-y-2">
                <h2 className="text-xl font-semibold truncate">{building.location}</h2>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <DollarSign className="w-5 h-5 mr-2 text-green-500" />
                  <span>{Number(building.price).toLocaleString()}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Ruler className="w-5 h-5 mr-2 text-yellow-500" />
                  <span>{building.size} sq ft</span>
                </div>
                {Array.isArray(building.amenities) && building.amenities.length > 0 && (
                  <div className="flex flex-wrap items-center text-gray-500 dark:text-gray-400 text-sm gap-2 mt-2">
                    {building.amenities.map((amenity: string, index: number) => (
                      <span
                        key={index}
                        className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-md text-xs font-medium"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))
        ) : (
          <p className="md:col-span-2 lg:col-span-3 text-center text-gray-500 dark:text-gray-400 text-lg">
            No buildings found matching your search.
          </p>
        )}
      </div>
    </div>
  );
}

export default BuildingList;