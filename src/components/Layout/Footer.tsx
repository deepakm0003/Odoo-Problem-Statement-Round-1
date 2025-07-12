import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Recycle, Users } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-xl font-bold">ReWear</span>
            </div>
            <p className="text-gray-400 text-sm">
              Promoting sustainable fashion through community-driven clothing exchanges.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <Recycle className="h-4 w-4 text-emerald-400" />
                <span className="text-gray-400">Eco-Friendly</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/browse" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Browse Items
              </Link>
              <Link to="/add-item" className="block text-gray-400 hover:text-white transition-colors text-sm">
                List an Item
              </Link>
              <Link to="/dashboard" className="block text-gray-400 hover:text-white transition-colors text-sm">
                My Dashboard
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <div className="space-y-2">
              <Link to="/browse?category=tops" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Tops
              </Link>
              <Link to="/browse?category=bottoms" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Bottoms
              </Link>
              <Link to="/browse?category=dresses" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Dresses
              </Link>
              <Link to="/browse?category=shoes" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Shoes
              </Link>
            </div>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-semibold mb-4">Community</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm">
                <Users className="h-4 w-4 text-emerald-400" />
                <span className="text-gray-400">Join our community</span>
              </div>
              <div className="text-sm text-gray-400">
                <p>Help reduce textile waste</p>
                <p>Share your preloved items</p>
                <p>Discover unique pieces</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm">
            © 2024 ReWear. All rights reserved.
          </div>
          <div className="flex items-center space-x-1 text-gray-400 text-sm mt-4 md:mt-0">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-400" />
            <span>for sustainable fashion</span>
          </div>
        </div>
      </div>
    </footer>
  );
}