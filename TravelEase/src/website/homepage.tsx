import React, {useState} from 'react';
import HotelBookingSection from '../components/hotelBookings';
import RestaurantBookingSection from '../components/restaurantBooking';
import FlightSearch from '../components/flightSearch';
import Header from '../components/header';


const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('flights');
  const currentYear = new Date().getFullYear();

 


  return (
    <div className="h-[100vh] flex flex-col bg-[url('/Thailand-Allows-All-Tourists.jpg')] bg-cover bg-center bg-no-repeat">
      <Header/>
      {/* Enhanced Hero Section */}
      <section className="min-h-screen flex-grow flex flex-col items-center justify-center text-center text-white py-20 px-4">
        <h2
          className="text-5xl md:text-6xl font-bold mb-6"
          style={{ textShadow: '2px 2px 6px rgba(0,0,0,0.7)' }}
        >
          Book Your Perfect Trip
        </h2>
        <p
          className="text-xl md:text-2xl mb-10"
          style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.7)' }}
        >
          Search flights, hotels, restaurants, and more in one place.
        </p>
        <a
          href="#booking-form"
          className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition text-lg font-semibold shadow-lg"
        >
          Start Planning
        </a>
      </section>

      <main className="container mx-auto  px-4">
        {/* Tabs for Booking Sections */}
        <section id="booking-form" className="bg-white rounded-lg shadow-xl p-6 md:p-8 mb-16">
          <div className="border-b border-gray-200 mb-6">
            <ul className="flex flex-wrap -mb-px space-x-4 sm:space-x-6 text-sm font-medium">
              <li className={`pb-3 ${activeTab === 'flights' ?  'border-b-2 border-blue-500 text-blue-600' : " " }`}>
                <button
                  type="button"
                  onClick={() => setActiveTab('flights')}
                  className="inline-block p-2 rounded-t-lg text-lg  md:text-2xl hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300">Flights</button>
              </li>
              <li className={`pb-3 ${activeTab === 'hotels' ?  'border-b-2 border-blue-500 text-blue-600' : " " }`}>
                <button
                  type="button"
                  onClick={() => setActiveTab('hotels')}
                  className="inline-block p-2 rounded-t-lg text-lg  md:text-2xl hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300">Hotels</button>
              </li>
              <li className={`pb-3 ${activeTab === 'restaurants' ?  'border-b-2 border-blue-500 text-blue-600' : " " }`}>
                <button type="button"
                  onClick={() => setActiveTab('restaurants')}
                  className="inline-block p-2 rounded-t-lg text-lg md:text-2xl hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300">Restaurants</button>
              </li>
            </ul>
          </div>
    
          {/* Flight Search Form (Currently Active) */}
          {activeTab === 'flights' && (
            <div>
              <h3 className="text-xl font-semibold text-gray-300 mb-4">Search Flights</h3>
              <FlightSearch/>
              {/* <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor='from' className="block text-sm font-medium text-gray-700">From</label>
                    <input id="from" name="from" type="text" placeholder="Departure City" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-3 py-2" />
                  </div>
                  <div>
                    <label htmlFor='to' className="block text-sm font-medium text-gray-700">To</label>
                    <input id="to" name="to" type="text" placeholder="Destination City" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-3 py-2" />
                  </div>
                  <div>
                    <label htmlFor='date' className="block text-sm font-medium text-gray-700">Date</label>
                    <input id="date" name="date" title='date' type="date" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-3 py-2" />
                  </div>
                </div>

                <div className="flex justify-center pt-2">
                  <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition font-medium">
                    Search Flights
                  </button>
                </div>
              </form> */}
            </div>
          )}
          {/* Placeholder for Hotel Search Form */}
          {activeTab === 'hotels' && (
            <div>
              <h3 className="text-xl font-semibold text-gray-300 mb-4">Search Hotels</h3>
              <h2 className="text-sm font-normal mb-4">Find Your Perfect Stay</h2>
              <HotelBookingSection />
            </div>
          )}
         
          {/* Placeholder for Restaurant Search Form */}
          {activeTab === 'restaurants' && (
            <div>
              <h3 className="text-xl font-semibold text-gray-300 mb-4">Find Restaurants</h3>
              <p className="text-sm font-normal mb-4">Book a Table at Top Restaurants</p>

              <RestaurantBookingSection />
            </div>
          )}
         
        </section>        {/* About Us Section */}
        <section id="about" className="py-12 bg-white rounded-lg my-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">About TravelEase</h2>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <img src="/office-workspace_KV.jpg" alt="TravelEase Office" className="rounded-lg shadow-lg" />
              </div>
              <div className="md:w-1/2 text-gray-700">
                <p className="mb-4 text-lg">
                  TravelEase is your one-stop platform for planning and booking your perfect trip. We are dedicated to providing a seamless and enjoyable experience, from searching for the best flights and hotels to discovering amazing restaurants and activities.
                </p>
                <p className="mb-4 text-lg">
                  Our mission is to make travel accessible and stress-free for everyone. With a wide range of options and competitive prices, we help you create unforgettable memories without breaking the bank.
                </p>
                <p className="text-lg">
                  Join thousands of happy travelers who trust TravelEase for their adventures.
                </p>
              </div>
            </div>
          </div>
        </section>


        {/* Features Section */}
          <section id="features" className="py-12">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Why Travel with TravelEase?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                {/* Icon placeholder - you can use SVGs or an icon library */}
                <div className="text-blue-500 mb-4 text-4xl">✈️</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-700">Lowest Fares</h3>
                <p className="text-gray-600">Find the cheapest flights across all airlines, backed by our price match guarantee.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="text-blue-500 mb-4 text-4xl">🏨</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-700">Top-rated Hotels</h3>
                <p className="text-gray-600">Stay at the best-reviewed accommodations worldwide, handpicked for quality.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="text-blue-500 mb-4 text-4xl">🍽️</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-700">Gourmet Dining</h3>
                <p className="text-gray-600">Reserve tables at top restaurants with ease and discover local culinary delights.</p>
              </div>
            </div>
          </section>

          {/* Popular Destinations Section */}
          <section id="destinations" className="py-12">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Popular Destinations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Destination Card Example (Repeat for more destinations) */}
              {[
                { name: 'Paris, France', img: '/Paris .webp' },
                { name: 'Kyoto, Japan', img: '/tokyo.webp' },
              { name: 'Rome, Italy', img: '/colosseum-daylight-rome-italy.avif' },
                {name: 'Dubai, United Emirates', img: '/dubai.avif'}
              ].map(dest => (
                <div key={dest.name} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                  <img src={dest.img} alt={`View of ${dest.name}`} className="w-full h-56 object-cover" />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{dest.name}</h3>
                    <p className="text-gray-600 mb-4">Discover the charm and beauty of {dest.name}.</p>
                    <a href="#destination" className="text-blue-600 hover:text-blue-800 font-medium">Explore →</a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Testimonials Section */}
          <section id="testimonials" className="py-12 bg-gray-50 rounded-lg my-12">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">What Our Travelers Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <p className="text-gray-600 italic mb-4">"TravelEase made booking my dream vacation so simple and affordable. Highly recommended!"</p>
                <p className="text-gray-800 font-semibold">- Alex P.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <p className="text-gray-600 italic mb-4">"The customer service was outstanding, and I found the best hotel deals here. Will use again!"</p>
                <p className="text-gray-800 font-semibold">- Sarah M.</p>
              </div>
            </div>
          </section>

          {/* Call to Action / Newsletter Signup */}
          <section id="newsletter" className="py-16 px-4 md:px-0 text-center bg-blue-600 text-white rounded-lg my-12">
            <h2 className="text-3xl font-bold mb-4">Stay Updated!</h2>
            <p className="text-lg mb-8">Subscribe to our newsletter for the latest travel deals and inspirations.</p>
            <form className="max-w-md mx-auto flex">
              <input type="email" placeholder="Enter your email" className="w-full px-4 py-3 rounded-l-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300" />
              <button type="submit" className="bg-blue-800 text-white px-6 py-3 rounded-r-md hover:bg-blue-900 transition">Subscribe</button>
            </form>
          </section>

          {/* Contact Us Section */}
          <section id="contact" className="py-12 bg-white rounded-lg my-12">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Get in Touch</h2>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2">
                  <p className="text-gray-700 mb-4">
                    Have questions or need assistance? Feel free to reach out to us!
                  </p>
                  <p className="text-gray-700 mb-2">Email: support@travelease.com</p>
                  <p className="text-gray-700 mb-2">Phone: +1 (123) 456-7890</p>
                  <p className="text-gray-700">Address: 123 Travel Lane, Wanderlust City, 54321</p>
                </div>
                <div className="md:w-1/2">
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                      <input type="text" id="name" name="name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 px-3 py-2" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                      <input type="email" id="email" name="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 px-3 py-2" />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                      <textarea id="message" name="message" rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 px-3 py-2"></textarea>
                    </div>
                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition">Send Message</button>
                  </form>
                </div>
              </div>
            </div>
          </section>

      </main>

      <footer className="bg-gray-800 text-white p-8 mt-auto">
        <div className="container mx-auto text-center">
          <p>&copy; {currentYear} TravelEase. All rights reserved.</p>
          <p className="text-sm text-gray-400 mt-2">Your adventure starts here.</p>
        </div>
      </footer>
    </div>
  )
};


export default HomePage;