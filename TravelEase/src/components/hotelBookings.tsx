import React, { useState } from 'react';
import axios from 'axios';
import { mockHotels } from '../data/data';


interface HotelOffer { 
  hotel: { name: string };
  offers: Array<{ price: { total: string } }>;
  // …you can expand this shape as needed
}
const HotelBookingSection: React.FC = () => {
  //Mock Form state
  // const [location, setLocation] = useState<string>('');
  // const [checkInDate, setCheckInDate] = useState<string>('');
  // const [checkOutDate, setCheckOutDate] = useState<string>('');
  // const [guests, setGuests] = useState<number>(1);

  // API hotel data
  const [city, setCity] = useState('PAR');
  const [checkIn, setCheckIn] = useState('2025-07-01');
  const [checkOut, setCheckOut] = useState('2025-07-05');
  const [adults, setAdults] = useState(1);
  const [rooms, setRooms] = useState(1);

  const [results, setResults] = useState<HotelOffer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);
  
  const searchHotels = async () => {
    setLoading(true); setError(null);
    try {
      const resp = await axios.get<{ data: HotelOffer[] }>(
        `/api/hotels`,
        {
          params: { cityCode: city, checkInDate: checkIn, checkOutDate: checkOut, adults, roomQuantity: rooms }
        }
      );
      setResults(resp.data.data);
    } catch (e) {
      let msg = "Error fetching hotel data.";
      if (axios.isAxiosError(e) && e.response) {
        msg = e.response.data?.detail || e.response.data?.error || e.message;
      } else if (e instanceof Error) {
        msg = e.message;
      }
      setError(msg || 'Failed to load hotels');
    } finally {
      setLoading(false);
    }
  };
  
  
  // Mock hotel data
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, this would fetch results based on the input
    console.log('Searching for:', { city, checkIn, checkOut, adults });
  };

  return (
    <section className="py-10 bg-gray-100">
      <div className="container mx-auto px-4">

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor='destination' className="block text-sm font-medium text-gray-700">Destination</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City Codee"
              className="mt-1 block w-full px-4 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div>
            <label htmlFor='check-in' className="block text-sm font-medium text-gray-700">Check-in</label>
            <input title='check-in'
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div>
            <label htmlFor='check-out' className="block text-sm font-medium text-gray-700">Check-out</label>
            <input title='check-out'
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div>
            <label htmlFor='guests' className="block text-sm font-medium text-gray-700">Guests</label>
            <input title='guests'
              type="number"
              min="1"
              value={adults}
              onChange={(e) => setAdults(Number(e.target.value))}
              className="mt-1 block w-full px-4 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div>
            <label htmlFor='number' className="block text-sm font-medium text-gray-700">No. of Rooms</label>
            <input title='number'
              type="number"
              min="1"
              value={rooms}
              onChange={(e) => setRooms(Number(e.target.value))}
              className="mt-1 block w-full px-4 py-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div className="md:col-span-4 flex justify-center">
            <button
              type="submit"
              onClick={searchHotels}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            >
              {loading ? 'Searching...' : 'Search Hotels'}
              
            </button>
            {error && <p className="text-red-500 mt-4">{error}</p>}
            <ul className='mt-2 space-y-2'>
              {results.map((result, i) => (
                <li key={i}
                  className='border p-2 rounded '
                >
                  <div className="font-bold">{result.hotel.name}</div>
                  <div>Price: {result.offers[0]?.price.total}</div>
                </li>)
)}
            </ul>
          </div>
        </form>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockHotels.map((hotel) => (
            <div key={hotel.id} className="bg-white rounded-lg shadow overflow-hidden">
              <img src={hotel.image} alt={hotel.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold">{hotel.name}</h3>
                <p className="text-gray-600">{hotel.location}</p>
                <div className="flex items-center mt-2">
                  <span className="text-yellow-500">{hotel.rating}</span>
                  <span className="ml-1 text-gray-600">★</span>
                </div>
                <p className="mt-2 text-lg font-bold">${hotel.pricePerNight} / night</p>
                {hotel.available ? (
                  <button className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
                    Book Now
                  </button>
                ) : (
                  <button className="mt-4 w-full bg-gray-400 text-white py-2 rounded cursor-not-allowed">
                    Sold Out
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

export default HotelBookingSection;