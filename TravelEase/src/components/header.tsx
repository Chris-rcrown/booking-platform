import React , {useState} from 'react'
import { FaBars, FaTimes } from 'react-icons/fa';

const Header: React.FC = () => {
      const [isMenuOpen, setIsMenuOpen] = useState(false);
    
      const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
      };
  return (
    <div>
       {/* Header */} 
       <header className="bg-transparent text-white p-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center ">
          <h1 className="text-2xl font-bold cursor-pointer"><a href="/">TravelEase</a></h1>
          <nav className="hidden md:block"> {/* Hide on small screens */}
            <ul className="flex space-x-20"> 
              <li><a href="#about" className="hover:underline">About</a></li>
              <li><a href="#contact" className="hover:underline">Contact</a></li> {/* Added Contact link */}
              <div className='flex justify-center gap-4'>

              <li><a href="/login" className=" border-1 border-blue-200 hover:border-blue-50 rounded-xl  px-4 py-2 hover:bg-blue-600 transition-colors duration-300">Login</a></li>
            <li><a href="/register" className=" border-1 border-blue-200 hover:border-blue-50 rounded-xl  px-4 py-2 bg-blue-600 hover:bg-blue-800  transition-colors duration-300">Register</a></li>
              </div>
            </ul>
          </nav>
          {/* Hamburger Icon */}
          <div className="md:hidden flex items-center">
          <button 
            onClick={toggleMenu}
            className="text-white text-2xl focus:outline-none"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
        </div>
          {/* Mobile navigation */}
          {isMenuOpen && (
                <div className="md:hidden mt-4 py-4 absolute left-0 w-full shadow-lg">
                <ul className="flex flex-col items-center space-y-6">
                  <li>
                    <a 
                      href="#about" 
                      className="hover:underline text-lg"
                      onClick={toggleMenu}
                    >
                      About
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#contact" 
                      className="hover:underline text-lg"
                      onClick={toggleMenu}
                    >
                      Contact
                    </a>
              </li>
              <ul className='flex justify-center gap-6 mt-4'>

           
                  <li>
                    <a 
                      href="/login" 
                      className="border-2 border-blue-400 hover:border-blue-50 rounded-xl px-6 py-3 hover:bg-blue-600 transition-colors text-lg inline-block mt-2"
                      onClick={toggleMenu}
                    >
                      Login
                    </a>
                  </li>
                  <li>
                    <a 
                      href="/register" 
                      className="border-2 border-blue-400 hover:border-blue-50 rounded-xl px-6 py-3 hover:bg-blue-800 bg-blue-600 transition-colors text-lg inline-block mt-2"
                      onClick={toggleMenu}
                    >
                      Register
                    </a>
                  </li>
              </ul>
                </ul>
              </div>
        )}
      </header>
    </div>
  )
}

export default Header

     