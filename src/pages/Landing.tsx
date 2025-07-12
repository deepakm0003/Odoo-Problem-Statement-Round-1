import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Recycle, Users, Star, TrendingUp, Shirt, Scissors, Crown, Zap, Footprints, Watch } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Item, CATEGORIES } from '../types';
import ItemCard from '../components/Items/ItemCard';
import Button from '../components/UI/Button';

export default function Landing() {
  const [featuredItems, setFeaturedItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  // Icon mapping for categories
  const iconMap = {
    Shirt,
    Scissors,
    Crown,
    Zap,
    Footprints,
    Watch
  };

  useEffect(() => {
    fetchFeaturedItems();
  }, []);

  async function fetchFeaturedItems() {
    try {
      const { data, error } = await supabase
        .from('items')
        .select(`
          *,
          user:users(name, avatar_url)
        `)
        .eq('status', 'available')
        .order('created_at', { ascending: false })
        .limit(8);

      if (error) throw error;
      setFeaturedItems(data || []);
    } catch (error) {
      console.error('Error fetching featured items:', error);
    } finally {
      setLoading(false);
    }
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 via-white to-amber-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Swap, Share,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-amber-500">
                Sustain
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Join our community-driven platform where fashion meets sustainability. 
              Exchange your preloved clothing, earn points, and discover unique pieces 
              while reducing textile waste.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/browse">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Swapping
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Join Community
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 left-10 w-16 h-16 bg-emerald-200 rounded-full opacity-20"
          />
          <motion.div
            animate={{ 
              y: [0, 15, 0],
              rotate: [0, -5, 0]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-40 right-20 w-12 h-12 bg-amber-200 rounded-full opacity-20"
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={itemVariants} className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mx-auto mb-4">
                <Recycle className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">500+</h3>
              <p className="text-gray-600">Items Exchanged</p>
            </motion.div>
            <motion.div variants={itemVariants} className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mx-auto mb-4">
                <Users className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">150+</h3>
              <p className="text-gray-600">Active Members</p>
            </motion.div>
            <motion.div variants={itemVariants} className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-coral-100 rounded-full mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-coral-500" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">95%</h3>
              <p className="text-gray-600">Satisfaction Rate</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover amazing items across all categories, from trendy tops to vintage accessories.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {CATEGORIES.map((category) => {
              const IconComponent = iconMap[category.icon as keyof typeof iconMap];
              return (
                <motion.div key={category.id} variants={itemVariants}>
                  <Link
                    to={`/browse?category=${category.id}`}
                    className="group"
                  >
                    <div className="bg-white rounded-lg p-6 text-center hover:shadow-md transition-all duration-200 group-hover:-translate-y-1">
                      <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full mx-auto mb-3 group-hover:bg-emerald-200 transition-colors">
                        <IconComponent className="h-6 w-6 text-emerald-600" />
                      </div>
                      <p className="font-medium text-gray-900">{category.name}</p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Items</h2>
              <p className="text-gray-600">Discover the latest additions to our community</p>
            </div>
            <Link to="/browse">
              <Button variant="outline">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-80 animate-pulse" />
              ))}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {featuredItems.map((item) => (
                <motion.div key={item.id} variants={itemVariants}>
                  <ItemCard item={item} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-amber-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Sustainable Journey?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of users who are making fashion more sustainable, one swap at a time.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register">
                <Button className="bg-black text-green hover:bg-black-50 w-full sm:w-auto">
                  Get Started Today
                </Button>
              </Link>
              <Link to="/add-item">
                <Button variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
                  List Your First Item
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}