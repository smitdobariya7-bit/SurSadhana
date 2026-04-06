import React from 'react';
import { Link } from 'react-router-dom';
import { Music2, Facebook, Twitter, Instagram, Youtube, Phone, Mail, MapPin, User } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Music2 className="h-8 w-8 text-amber-500" />
              <span className="text-xl font-bold text-gradient">Sur Sadhana</span>
            </div>
            <p className="text-gray-400 text-sm">
              Your digital companion for mastering Hindustani classical music.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-amber-500 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/riyaz-guide" className="text-gray-400 hover:text-amber-500 transition-colors text-sm">
                  Riyaz Guide
                </Link>
              </li>
              <li>
                <Link to="/raag-library" className="text-gray-400 hover:text-amber-500 transition-colors text-sm">
                  Raag Library
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-400 hover:text-amber-500 transition-colors text-sm">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/instruments" className="text-gray-400 hover:text-amber-500 transition-colors text-sm">
                  Instruments
                </Link>
              </li>
              <li>
                <Link to="/tabla-sadhana" className="text-gray-400 hover:text-amber-500 transition-colors text-sm">
                  Tabla Sadhana
                </Link>
              </li>
              <li>
                <Link to="/practice" className="text-gray-400 hover:text-amber-500 transition-colors text-sm">
                  Practice
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center space-x-2 hover:text-amber-500 transition-colors">
                <User className="h-4 w-4" />
                <span>Name: Smit Dobariya</span>
              </li>
              <li className="flex items-center space-x-2 hover:text-amber-500 transition-colors">
                <Mail className="h-4 w-4" />
                <span>Email: support@sursadhana.com</span>
              </li>
              <li className="flex items-center space-x-2 hover:text-amber-500 transition-colors">
                <Phone className="h-4 w-4" />
                <span>Phone: 6354682971</span>
              </li>
              <li className="flex items-center space-x-2 hover:text-amber-500 transition-colors">
                <MapPin className="h-4 w-4" />
                <span>Address: Surat, Gujarat</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Sur Sadhana. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


