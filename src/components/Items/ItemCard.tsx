import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, MapPin, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Item } from '../../types';
import { useCart } from '../../contexts/CartContext';
import Button from '../UI/Button';

interface ItemCardProps {
  item: Item;
}

export default function ItemCard({ item }: ItemCardProps) {
  const { addToCart } = useCart();
  const primaryImage = item.images?.[0] || 'https://images.pexels.com/photos/6311479/pexels-photo-6311479.jpeg';

  const conditionColors = {
    'New': 'bg-emerald-100 text-emerald-800',
    'Like New': 'bg-blue-100 text-blue-800',
    'Good': 'bg-amber-100 text-amber-800',
    'Fair': 'bg-orange-100 text-orange-800',
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group"
    >
      <Link to={`/item/${item.id}`}>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-200">
          {/* Image */}
          <div className="aspect-square relative overflow-hidden bg-gray-100">
            <img
              src={primaryImage}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-3 left-3">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${conditionColors[item.condition as keyof typeof conditionColors]}`}>
                {item.condition}
              </span>
            </div>
            <button className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full transition-colors">
              <Heart className="h-4 w-4 text-gray-600" />
            </button>
            {item.status !== 'available' && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="bg-white text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
                  {item.status === 'pending' ? 'Pending' : 'Swapped'}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">
              {item.title}
            </h3>
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
              {item.description}
            </p>
            
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Size {item.size}</span>
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 text-amber-400 fill-current" />
                <span className="text-xs text-gray-500">New</span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-1">
                <span className="text-emerald-600 font-semibold">{item.point_value}</span>
                <span className="text-emerald-600 text-sm">points</span>
              </div>
              {item.user && (
                <div className="flex items-center space-x-1">
                  <div className="w-5 h-5 bg-gray-200 rounded-full overflow-hidden">
                    {item.user.avatar_url ? (
                      <img src={item.user.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-emerald-100 flex items-center justify-center">
                        <span className="text-emerald-600 text-xs font-medium">
                          {item.user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">{item.user.name}</span>
                </div>
              )}
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCart(item);
              }}
              size="sm"
              className="w-full"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}