import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Download, 
  Eye, 
  Search, 
  Filter,
  User,
  Mail,
  Calendar,
  Award,
  Activity,
  Clock,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { localAuth } from '../lib/localAuth';
import Button from '../components/UI/Button';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { SwapRequest, Order } from '../types';
import Modal from '../components/UI/Modal';

export default function Admin() {
  const { downloadUserData } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'high-points' | 'recent' | 'active'>('all');
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);
  const [swapLoading, setSwapLoading] = useState(false);
  const [editSwap, setEditSwap] = useState<SwapRequest | null>(null);
  const [editMessage, setEditMessage] = useState('');
  const [editStatus, setEditStatus] = useState<'pending' | 'accepted' | 'rejected' | 'completed'>('pending');
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderLoading, setOrderLoading] = useState(false);
  const [editOrder, setEditOrder] = useState<Order | null>(null);
  const [editOrderStatus, setEditOrderStatus] = useState<'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'>('pending');
  
  const allUsers = localAuth.getAllUsers();
  const allVisits = localAuth.getAllUserVisits();
  const allEmails = localAuth.getAllEmails();
  
  // Filter users based on search and filter criteria
  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (filterBy === 'high-points') {
      matchesFilter = user.points >= 200;
    } else if (filterBy === 'recent') {
      const userDate = new Date(user.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesFilter = userDate >= weekAgo;
    } else if (filterBy === 'active') {
      matchesFilter = (user.visit_count || 0) > 1;
    }
    
    return matchesSearch && matchesFilter;
  });

  const totalUsers = allUsers.length;
  const totalPoints = allUsers.reduce((sum, user) => sum + user.points, 0);
  const averagePoints = totalUsers > 0 ? Math.round(totalPoints / totalUsers) : 0;
  const totalVisits = allVisits.length;
  const totalUniqueEmails = allEmails.length;
  const recentUsers = allUsers.filter(user => {
    const userDate = new Date(user.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return userDate >= weekAgo;
  }).length;

  const activeUsers = allUsers.filter(user => (user.visit_count || 0) > 1).length;

  const handleDownloadData = () => {
    downloadUserData();
    toast.success('User data downloaded successfully!');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Fetch swap requests on mount
  React.useEffect(() => {
    fetchSwapRequests();
    fetchOrders();
  }, []);

  async function fetchSwapRequests() {
    setSwapLoading(true);
    try {
      const { data, error } = await supabase.from('swap_requests').select('*').order('created_at', { ascending: false });
      if (!error) setSwapRequests(data || []);
    } finally {
      setSwapLoading(false);
    }
  }

  async function handleApproveSwap(id: string) {
    setSwapLoading(true);
    try {
      const { error } = await supabase.from('swap_requests').update({ status: 'accepted' }).eq('id', id);
      if (!error) {
        toast.success('Swap request approved');
        fetchSwapRequests();
      }
    } finally {
      setSwapLoading(false);
    }
  }

  async function handleRejectSwap(id: string) {
    setSwapLoading(true);
    try {
      const { error } = await supabase.from('swap_requests').update({ status: 'rejected' }).eq('id', id);
      if (!error) {
        toast.success('Swap request rejected');
        fetchSwapRequests();
      }
    } finally {
      setSwapLoading(false);
    }
  }

  function openEditSwap(req: SwapRequest) {
    setEditSwap(req);
    setEditMessage(req.message);
    setEditStatus(req.status);
  }
  function closeEditSwap() {
    setEditSwap(null);
    setEditMessage('');
    setEditStatus('pending');
  }
  async function handleSaveEditSwap() {
    if (!editSwap) return;
    setSwapLoading(true);
    try {
      const { error } = await supabase.from('swap_requests').update({ message: editMessage, status: editStatus }).eq('id', editSwap.id);
      if (!error) {
        toast.success('Swap request updated');
        fetchSwapRequests();
        closeEditSwap();
      }
    } finally {
      setSwapLoading(false);
    }
  }

  async function fetchOrders() {
    setOrderLoading(true);
    try {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (!error) setOrders(data || []);
    } finally {
      setOrderLoading(false);
    }
  }
  function openEditOrder(order: Order) {
    setEditOrder(order);
    setEditOrderStatus(order.order_status);
  }
  function closeEditOrder() {
    setEditOrder(null);
    setEditOrderStatus('pending');
  }
  async function handleSaveEditOrder() {
    if (!editOrder) return;
    setOrderLoading(true);
    try {
      const { error } = await supabase.from('orders').update({ order_status: editOrderStatus }).eq('id', editOrder.id);
      if (!error) {
        toast.success('Order status updated');
        fetchOrders();
        closeEditOrder();
      }
    } finally {
      setOrderLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage and view user data with enhanced tracking</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Users className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Visits</p>
                <p className="text-2xl font-bold text-gray-900">{totalVisits}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Mail className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Unique Emails</p>
                <p className="text-2xl font-bold text-gray-900">{totalUniqueEmails}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Award className="h-6 w-6 text-amber-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Points</p>
                <p className="text-2xl font-bold text-gray-900">{totalPoints.toLocaleString()}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{activeUsers}</p>
                <p className="text-xs text-gray-500">Multiple visits</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">New This Week</p>
                <p className="text-2xl font-bold text-gray-900">{recentUsers}</p>
                <p className="text-xs text-gray-500">Last 7 days</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Award className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Points</p>
                <p className="text-2xl font-bold text-gray-900">{averagePoints}</p>
                <p className="text-xs text-gray-500">Per user</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              {/* Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value as any)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">All Users</option>
                  <option value="high-points">High Points (200+)</option>
                  <option value="recent">Recent (Last 7 days)</option>
                  <option value="active">Active (Multiple visits)</option>
                </select>
              </div>
            </div>

            {/* Download Button */}
            <Button onClick={handleDownloadData}>
              <Download className="h-4 w-4 mr-2" />
              Download User Data
            </Button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Users ({filteredUsers.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Points
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Visits
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Visit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-emerald-600" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {user.id.slice(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        {user.points} points
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{user.visit_count || 1}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {user.last_visit ? formatDate(user.last_visit) : 'Never'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {formatDate(user.created_at)}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Visits */}
        {allVisits.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Visits (Last 20)
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Visit Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allVisits.slice(-20).reverse().map((visit, index) => (
                    <motion.tr
                      key={`${visit.user_id}_${visit.visit_time}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {visit.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{visit.email}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {formatDate(visit.visit_time)}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Swap Requests Section */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Swap Requests ({swapRequests.length})</h3>
            <div className="flex items-center gap-2">
              {swapLoading && <span className="text-xs text-gray-500">Loading...</span>}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchSwapRequests}
                disabled={swapLoading}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requester</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {swapRequests.map((req) => (
                  <tr key={req.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-xs">{req.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs">{req.item_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs">{req.requester_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs">{req.message}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${req.status === 'pending' ? 'bg-orange-100 text-orange-800' : req.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>{req.status}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs">
                      {req.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleApproveSwap(req.id)}>Approve</Button>
                          <Button size="sm" variant="outline" onClick={() => handleRejectSwap(req.id)}>Reject</Button>
                          <Button size="sm" variant="outline" onClick={() => openEditSwap(req)}>Edit</Button>
                        </div>
                      )}
                      {req.status !== 'pending' && (
                        <Button size="sm" variant="outline" onClick={() => openEditSwap(req)}>Edit</Button>
                      )}
                    </td>
                  </tr>
                ))}
                {swapRequests.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-8 text-gray-400">No swap requests found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Orders Section */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Orders ({orders.length})</h3>
            <div className="flex items-center gap-2">
              {orderLoading && <span className="text-xs text-gray-500">Loading...</span>}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchOrders}
                disabled={orderLoading}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-xs">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs">{order.user_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.order_status === 'pending' ? 'bg-orange-100 text-orange-800' : order.order_status === 'confirmed' ? 'bg-blue-100 text-blue-800' : order.order_status === 'shipped' ? 'bg-purple-100 text-purple-800' : order.order_status === 'delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>{order.order_status}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs">{order.payment_method}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs">{order.total_points} pts</td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs">
                      <Button size="sm" variant="outline" onClick={() => openEditOrder(order)}>Edit</Button>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan={7} className="text-center py-8 text-gray-400">No orders found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Edit Order Modal */}
        {editOrder && (
          <Modal open={!!editOrder} onClose={closeEditOrder}>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Edit Order Status</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Status</label>
                <select value={editOrderStatus} onChange={e => setEditOrderStatus(e.target.value as any)} className="w-full border rounded px-3 py-2">
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={closeEditOrder}>Cancel</Button>
                <Button onClick={handleSaveEditOrder} loading={orderLoading}>Save</Button>
              </div>
            </div>
          </Modal>
        )}

        {/* Edit Swap Modal */}
        {editSwap && (
          <Modal open={!!editSwap} onClose={closeEditSwap}>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Edit Swap Request</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea value={editMessage} onChange={e => setEditMessage(e.target.value)} className="w-full border rounded px-3 py-2" rows={3} />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Status</label>
                <select value={editStatus} onChange={e => setEditStatus(e.target.value as any)} className="w-full border rounded px-3 py-2">
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={closeEditSwap}>Cancel</Button>
                <Button onClick={handleSaveEditSwap} loading={swapLoading}>Save</Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
} 