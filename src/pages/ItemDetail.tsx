import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Share2, MessageCircle, Star, ChevronLeft, ChevronRight, User, Calendar, Tag } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Item } from '../types';
import Button from '../components/UI/Button';
import toast from 'react-hot-toast';

export default function ItemDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [swapMessage, setSwapMessage] = useState('');

  useEffect(() => {
    if (id) {
      fetchItem();
    }
  }, [id]);

  async function fetchItem() {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from('items')
        .select(`
          *,
          user:users(name, avatar_url, id)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setItem(data);
    } catch (error) {
      console.error('Error fetching item:', error);
      toast.error('Item not found');
    } finally {
      setLoading(false);
    }
  }

  async function handleSwapRequest() {
    if (!user || !item) {
      toast.error('Please sign in to request a swap');
      return;
    }

    if (user.id === item.user_id) {
      toast.error('You cannot swap with yourself');
      return;
    }

    try {
      const { error } = await supabase
        .from('swap_requests')
        .insert({
          requester_id: user.id,
          item_id: item.id,
          message: swapMessage || 'Hi! I\'m interested in swapping for this item.',
          status: 'pending',
        });

      if (error) throw error;

      toast.success('Swap request sent!');
      setShowSwapModal(false);
      setSwapMessage('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send swap request');
    }
  }

  async function handleRedeemWithPoints() {
    if (!user || !item) {
      toast.error('Please sign in to redeem with points');
      return;
    }

    if (user.points < item.point_value) {
      toast.error('Insufficient points');
      return;
    }

    // In a real app, this would be a more complex transaction
    toast.success('Points redemption feature coming soon!');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Item not found</h1>
          <Link to="/browse" className="text-emerald-600 hover:text-emerald-700">
            ← Back to browse
          </Link>
        </div>
      </div>
    );
  }

  const images = item.images?.length > 0 ? item.images : ['https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg'];

  const conditionColors = {
    'New': 'bg-emerald-100 text-emerald-800',
    'Like New': 'bg-blue-100 text-blue-800',
    'Good': 'bg-amber-100 text-amber-800',
    'Fair': 'bg-orange-100 text-orange-800',
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link
            to="/browse"
            className="text-emerald-600 hover:text-emerald-700 flex items-center space-x-1"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back to browse</span>
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={images[currentImageIndex]}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              
              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Status Badge */}
              {item.status !== 'available' && (
                <div className="absolute top-4 left-4">
                  <span className="bg-gray-900/80 text-white px-3 py-1 rounded-full text-sm">
                    {item.status === 'pending' ? 'Pending' : 'Swapped'}
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                      currentImageIndex === index ? 'border-emerald-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${item.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Item Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Header */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${conditionColors[item.condition as keyof typeof conditionColors]}`}>
                  {item.condition}
                </span>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <Heart className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{item.title}</h1>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>Size {item.size}</span>
                <span>•</span>
                <span className="capitalize">{item.category}</span>
              </div>
            </div>

            {/* Points */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-800 font-semibold text-lg">{item.point_value} points</p>
                  <p className="text-emerald-600 text-sm">Required for this item</p>
                </div>
                {user && (
                  <div className="text-right">
                    <p className="text-gray-600 text-sm">Your balance</p>
                    <p className="font-semibold text-lg">{user.points} points</p>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{item.description}</p>
            </div>

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center space-x-1"
                    >
                      <Tag className="h-3 w-3" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Owner Info */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Listed by</h3>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                  {item.user?.avatar_url ? (
                    <img src={item.user.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-emerald-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-emerald-600" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{item.user?.name}</p>
                  <p className="text-sm text-gray-600 flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>Joined {new Date(item.created_at).toLocaleDateString()}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {user && user.id !== item.user_id && item.status === 'available' && (
              <div className="space-y-3">
                <Button
                  onClick={() => setShowSwapModal(true)}
                  className="w-full"
                  size="lg"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Request Swap
                </Button>
                
                <Button
                  onClick={handleRedeemWithPoints}
                  variant="outline"
                  className="w-full"
                  size="lg"
                  disabled={user.points < item.point_value}
                >
                  <Star className="h-5 w-5 mr-2" />
                  Redeem with Points ({item.point_value})
                </Button>
                
                {user.points < item.point_value && (
                  <p className="text-sm text-gray-500 text-center">
                    You need {item.point_value - user.points} more points to redeem this item
                  </p>
                )}
              </div>
            )}

            {!user && (
              <div className="text-center">
                <p className="text-gray-600 mb-4">Sign in to request a swap or redeem with points</p>
                <Link to="/login">
                  <Button className="w-full" size="lg">
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Swap Request Modal */}
      {showSwapModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Swap</h3>
            <p className="text-gray-600 mb-4">
              Send a message to {item.user?.name} about swapping for this item.
            </p>
            <textarea
              value={swapMessage}
              onChange={(e) => setSwapMessage(e.target.value)}
              placeholder="Hi! I'm interested in swapping for this item..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <div className="flex justify-end space-x-3 mt-4">
              <Button
                variant="outline"
                onClick={() => setShowSwapModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSwapRequest}>
                Send Request
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}