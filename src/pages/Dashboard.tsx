import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Package, Star, TrendingUp, Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Item, SwapRequest, Order } from '../types';
import ItemCard from '../components/Items/ItemCard';
import Button from '../components/UI/Button';

export default function Dashboard() {
  const { user } = useAuth();
  const [myItems, setMyItems] = useState<Item[]>([]);
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalItems: 0,
    availableItems: 0,
    completedSwaps: 0,
    pendingRequests: 0,
  });

  useEffect(() => {
    if (user) {
      fetchDashboardData();
      fetchOrders();
    }
  }, [user]);

  async function fetchDashboardData() {
    if (!user) return;

    try {
      // Fetch user's items
      const { data: items, error: itemsError } = await supabase
        .from('items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (itemsError) throw itemsError;

      // Fetch swap requests (both sent and received)
      const { data: requests, error: requestsError } = await supabase
        .from('swap_requests')
        .select(`
          *,
          requester:users!swap_requests_requester_id_fkey(name, avatar_url),
          item:items!swap_requests_item_id_fkey(title, images),
          offered_item:items!swap_requests_offered_item_id_fkey(title, images)
        `)
        .or(`requester_id.eq.${user.id},item.user_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (requestsError) throw requestsError;

      setMyItems(items || []);
      setSwapRequests(requests || []);

      // Calculate stats
      const totalItems = items?.length || 0;
      const availableItems = items?.filter(item => item.status === 'available').length || 0;
      const completedSwaps = requests?.filter(req => req.status === 'completed').length || 0;
      const pendingRequests = requests?.filter(req => req.status === 'pending').length || 0;

      setStats({
        totalItems,
        availableItems,
        completedSwaps,
        pendingRequests,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchOrders() {
    if (!user) return;
    try {
      const { data: ordersData, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setOrders((ordersData || []).filter((o: Order) => o.user_id === user.id));
    } catch (error) {
      setOrders([]);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-gray-600">Manage your items and track your swaps</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-lg">
                <span className="font-medium">{user?.points} points</span>
              </div>
              <Link to="/add-item">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
        >
          <motion.div variants={itemVariants} className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-8 w-8 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Star className="h-8 w-8 text-amber-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Available</p>
                <p className="text-2xl font-bold text-gray-900">{stats.availableItems}</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedSwaps}</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingRequests}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* My Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">My Swap Requests</h2>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    fetchDashboardData();
                    fetchOrders();
                  }}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
              {swapRequests.filter(r => r.requester_id === user?.id).length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 text-sm">No swap requests yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {swapRequests.filter((r: SwapRequest) => r.requester_id === user?.id).map((request: SwapRequest) => (
                    <div key={request.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        {request.status === 'pending' && <Clock className="h-5 w-5 text-orange-500" />}
                        {request.status === 'accepted' && <CheckCircle className="h-5 w-5 text-emerald-500" />}
                        {request.status === 'rejected' && <XCircle className="h-5 w-5 text-red-500" />}
                        {request.status === 'completed' && <CheckCircle className="h-5 w-5 text-emerald-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {`Swap for "${request.item?.title || request.item_id}"`}
                        </p>
                        <p className="text-xs text-gray-500">Status: {request.status}</p>
                        {request.message && <p className="text-xs text-gray-500">Admin: {request.message}</p>}
                        <p className="text-xs text-gray-400">Requested on {new Date(request.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Order History</h2>
              </div>
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 text-sm">No orders yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order: Order) => (
                    <div key={order.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900">Order #{order.id.slice(-6)}</span>
                        <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-800">{order.order_status}</span>
                      </div>
                      <div className="text-xs text-gray-500 mb-1">Placed on {new Date(order.created_at).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500 mb-1">Payment: {order.payment_method} ({order.payment_status})</div>
                      <div className="text-xs text-gray-500 mb-1">Total: {order.total_points} pts</div>
                      <div className="text-xs text-gray-500 mb-1">Shipping: {order.shipping_address?.city}, {order.shipping_address?.state}</div>
                      <div className="mt-2">
                        <span className="font-medium text-gray-700">Items:</span>
                        <ul className="list-disc ml-6">
                          {order.items?.map((oi: any) => (
                            <li key={oi.id} className="text-xs text-gray-600">{oi.item?.title || oi.item_id} x{oi.quantity}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* My Items panel remains unchanged below */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">My Items</h2>
                <Link to="/add-item">
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New
                  </Button>
                </Link>
              </div>

              {myItems.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No items yet</h3>
                  <p className="text-gray-600 mb-4">Start by adding your first item to the platform</p>
                  <Link to="/add-item">
                    <Button>Add Your First Item</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {myItems.slice(0, 6).map((item: Item) => (
                    <ItemCard key={item.id} item={item} />
                  ))}
                </div>
              )}

              {myItems.length > 6 && (
                <div className="mt-6 text-center">
                  <Button variant="outline">View All Items</Button>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>

              {swapRequests.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 text-sm">No recent activity</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {swapRequests.slice(0, 5).map((request) => (
                    <div key={request.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        {request.status === 'pending' && <Clock className="h-5 w-5 text-orange-500" />}
                        {request.status === 'accepted' && <CheckCircle className="h-5 w-5 text-emerald-500" />}
                        {request.status === 'rejected' && <XCircle className="h-5 w-5 text-red-500" />}
                        {request.status === 'completed' && <CheckCircle className="h-5 w-5 text-emerald-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {request.requester_id === user?.id
                            ? `You requested to swap for "${request.item?.title}"`
                            : `${request.requester?.name} wants to swap for your item`
                          }
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(request.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}