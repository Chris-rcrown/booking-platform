
export interface Hotel {
  id: number;
  name: string;
  location: string;
  pricePerNight: number;
  rating: number;
  image: string;
  available: boolean;
}import axios from 'axios';
import React, { useState, type ReactNode } from 'react';

// Define the Restaurant type
interface Restaurant {
  name: ReactNode;
  latitude: ReactNode;
  longitude: ReactNode;
  category: ReactNode;
};

interface RestaurantMock {
  id: number;
  name: string;
  location: string;
  cuisine: string;
  rating: number;
  priceRange: string; // e.g., "$", "$$", "$$$"
  image: string;
  available: boolean;
}

const RestaurantBookingSection: React.FC = () => {
  // Form state
  // const [location, setLocation] = useState<string>('');
  // const [date, setDate] = useState<string>('');
  // const [guests, setGuests] = useState<number>(2);

  const [lat, setLat] = useState('48.8566');
  const [lng, setLng] = useState('2.3522');
  const [radius, setRadius] = useState(3000);
  const [results, setResults] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);

  const searchRestaurants = async () => {
    setLoading(true); setError(null);
    try {
      const resp = await axios.get<{ data: Restaurant[] }>(
        `/api/restaurants`,
        { params: { latitude: lat, longitude: lng, radius, limit: 10 } }
      );
      setResults(resp.data.data);
    } catch (e: unknown) {
 let msg = "Error fetching restaurant data.";
 if (axios.isAxiosError(e) && e.response) {
 msg = e.response.data?.detail || e.response.data?.error || e.message;
 } else if (e instanceof Error) {
 msg = e.message;
 }
 setError(msg || 'Failed to load restaurants');
    } finally {
      setLoading(false);
    }
  };
  // Mock restaurant data
  const mockRestaurants: RestaurantMock[] = [
    {
      id: 1,
      name: "The Gourmet Garden",
      location: "New York",
      cuisine: "Italian",
      rating: 4.7,
      priceRange: "$$",
      image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80",
      available: true,
      
    },
    {
      id: 2,
      name: "Ocean Breeze Grill",
      location: "Miami",
      cuisine: "Seafood",
      rating: 4.5,
      priceRange: "$$$",
      image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=800&q=80",
      available: true
    },
    {
      id: 3,
      name: "Spice Valley",
      location: "San Francisco",
      cuisine: "Asian Fusion",
      rating: 4.3,
      priceRange: "$",
      image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/17/51/64/spices-best.jpg?w=500&h=-1&s=1",
      available: false
    },
    {
      id: 4,
      name: "The Cozy Corner Cafe",
      location: "Chicago",
      cuisine: "American",
      rating: 4.2,
      priceRange: "$",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80", // Example image
      available: true
    },{
      id: 5,
      name: "Urban Eats Bistro",
      location: "Austin",
      cuisine: "Modern American",
      rating: 4.6,
      priceRange: "$$",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
      available: true
    },
    {
      id: 6,
      name: "La Pizzeria Classic",
      location: "Rome",
      cuisine: "Italian",
      rating: 4.8,
      priceRange: "$$",
      image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80",
      available: false
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', { lat, lng, radius });
  };

  return (
    <section className="py-2 bg-gray-100">
      <div className="container mx-auto px-2">
        {/* Search Form */}
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Latitude</label>
            <input
              type="text"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              placeholder="Latitude"
              className="mt-1 block w-full px-4 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div>
            <label htmlFor='Longitude' className="block text-sm font-medium text-gray-700">Longitude</label>
            <input title='Longitude'
              type="text"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              placeholder='Longtitude'
              className="mt-1 block w-full px-4 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div>
            <label htmlFor='guests' className="block text-sm font-medium text-gray-700">Radius</label>
            <input title='guests'
              type="number"
              min={100}
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="mt-1 block w-full px-4 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              onClick={searchRestaurants}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
             {loading ? 'Searching...' : 'Search Restaurants'}
            </button>
            {error && <p className="text-red-500 mt-4">{error}</p>}
            {results.length > 0 &&
              <ul className="mt-2 space-y-2">
                {results.map((r, i) => (
                  <li key={i} className="border p-2 rounded">
                    <div className="font-bold">{r.name}</div>
                    <div> Category: {r.category}</div>
                    <div className="flex items-center mt-2">Lat/Lng: {r.latitude}, {r.longitude}</div>
                  </li>
                ))}

              </ul>} {/* Closing ul tag */}
          </div>
        </form>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockRestaurants.map((restaurant) => (
            <div key={restaurant.id} className="bg-white rounded-lg shadow overflow-hidden">
              <img src={restaurant.image} alt={restaurant.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold">{restaurant.name}</h3>
                <p className="text-gray-600">{restaurant.location} • {restaurant.cuisine}</p>
                <div className="flex items-center mt-2">
                  <span className="text-yellow-500">{restaurant.rating}</span>
                  <span className="ml-1 text-gray-600">★</span>
                  <span className="ml-2 text-gray-600">{restaurant.priceRange}</span>
                </div>
                {restaurant.available ? (
                  <button className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
                    Reserve Table
                  </button>
                ) : (
                  <button className="mt-4 w-full bg-gray-400 text-white py-2 rounded cursor-not-allowed">
                    Fully Booked
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RestaurantBookingSection;