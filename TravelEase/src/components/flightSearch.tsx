// src/components/FlightSearch.tsx
import React, { useState, type ChangeEvent } from "react";
import axios from "axios";
import { AirportAutocomplete } from "./AirportAutocomplete";

interface FlightOffer {
  id: string;
  price: { total: string };
  itineraries?: Array<{
    segments?: Array<{
      departure: { iataCode: string; at: string };
      arrival:   { iataCode: string; at: string };
    }>;
  }>;
}

const FlightSearch: React.FC = () => {
  const API = import.meta.env.VITE_API_BASE_URL as string;

  const getInitialDate = () => {
    const t = new Date();
    t.setDate(t.getDate() + 1);
    return t.toISOString().split("T")[0];
  };

  // form state
  const [originInput, setOriginInput]       = useState(""); // what user types / sees
  const [origin, setOrigin]                 = useState(""); // the IATA code for API
  const [destinationInput, setDestinationInput] = useState("");
  const [destination, setDestination]       = useState("");
  const [date, setDate]                     = useState(getInitialDate());
  const [adults, setAdults]                 = useState(1);

  // results
  const [flights, setFlights]               = useState<FlightOffer[]>([]);
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState<string | null>(null);

  const handleSearch = async () => {
    if (!origin || !destination) {
      setError("Please select both an origin and destination.");
      return;
    }

    setLoading(true);
    setError(null);
    setFlights([]);

    try {
      const resp = await axios.get<{ data: FlightOffer[] }>(
        `https://booking-platformbtml.vercel.app//api/flights`,
        { params: { origin, destination, date, adults } }
      );
      const results = resp.data.data || [];
      setFlights(results);
      if (results.length === 0) {
        setError("No flights found for the selected criteria.");
      }
    } catch (err: unknown) {
      console.error(err);
      let msg = "Error fetching flight data.";
      if (axios.isAxiosError(err) && err.response) {
        msg = err.response.data?.detail || err.response.data?.error || err.message;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <div className="grid gap-4 md:grid-cols-4">
        {/* origin */}
        <div className="flex flex-col">
          <label htmlFor="origin-input">Origin</label>
          <AirportAutocomplete
            value={originInput}
            onInputChange={setOriginInput}
            onSelect={(code, label) => {
              setOrigin(code);
              setOriginInput(label);
            }}
          />
          {/* <input
            id="origin-input"
            list="origin-list"
            type="text"
            placeholder="Type airport code..."
            value={origin}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setOrigin(e.target.value.toUpperCase())}
            className="border p-2 rounded"
            required
          /> */}
          <datalist id="origin-list">
            {/* legacy fallback, no longer used */}
          </datalist>
        </div>

        {/* destination */}
        <div className="flex flex-col">
          <label htmlFor="dest-input">Destination</label>
          <AirportAutocomplete
            value={destinationInput}
            onInputChange={setDestinationInput}
            onSelect={(code, label) => {
              setDestination(code);
              setDestinationInput(label);
            }}
          />
          {/* <input
            id="dest-input"
            list="dest-list"
            type="text"
            placeholder="Type airport code..."
            value={destination}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setDestination(e.target.value.toUpperCase())}
            className="border p-2 rounded"
            required
          /> */}
          <datalist id="dest-list">
            {/* legacy fallback, no longer used */}
          </datalist>
        </div>

        {/* date */}
        <div className="flex flex-col">
          <label htmlFor="date-input">Date</label>
          <input
            id="date-input"
            type="date"
            value={date}
            min={getInitialDate()}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
            className="border p-2 rounded"
            required
          />
        </div>

        {/* adults */}
        <div className="flex flex-col">
          <label htmlFor="adults-input">No. of Persons</label>
          <input
            id="adults-input"
            type="number"
            min={1}
            value={adults}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setAdults(Number(e.target.value))}
            className="border p-2 rounded"
            required
          />
        </div>

        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Searching…" : "Search"}
        </button>
      </div>

      <div className="mt-8">
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {!loading && flights.length === 0 && !error && (
          <p>Enter search criteria and click Search.</p>
        )}

        {loading && <p>Loading flight data…</p>}

        {!loading && flights.length > 0 && (
          <ul className="space-y-4">
            {flights.map(f => {
              const itin = f.itineraries?.[0];
              const seg  = itin?.segments?.[0];
              if (!seg) return null;

              const { departure, arrival } = seg;
              return (
                <li key={f.id} className="border p-4 rounded">
                  <div>
                    <strong>From:</strong> {departure.iataCode} at{" "}
                    {new Date(departure.at).toLocaleString()}
                  </div>
                  <div>
                    <strong>To:</strong> {arrival.iataCode} at{" "}
                    {new Date(arrival.at).toLocaleString()}
                  </div>
                  <div className="font-bold mt-2">Price: ${f.price.total}</div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FlightSearch;
