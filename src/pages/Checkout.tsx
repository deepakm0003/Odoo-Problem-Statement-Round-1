import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  CreditCard, 
  Smartphone, 
  MapPin, 
  User, 
  Phone, 
  Mail,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Address, PaymentDetails, Order, OrderItem } from '../types';
import Button from '../components/UI/Button';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

const addressSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  street_address: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postal_code: z.string().min(5, 'Postal code is required'),
  country: z.string().min(2, 'Country is required'),
});

const paymentSchema = z.object({
  method: z.enum(['points', 'upi', 'cash']) as any, // allow 'points' for demo
  upi_id: z.string().optional(),
});

type AddressFormData = z.infer<typeof addressSchema>;
type PaymentFormData = z.infer<typeof paymentSchema>;

export default function Checkout() {
  const navigate = useNavigate();
  const { items, getTotalPoints, clearCart } = useCart();
  const { user, updateProfile } = useAuth();
  const [step, setStep] = useState<'address' | 'payment' | 'confirmation'>('address');
  const [address, setAddress] = useState<Address | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [loading, setLoading] = useState(false);

  const addressForm = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
  });

  const paymentForm = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
  });

  const totalPoints = getTotalPoints();
  const canUsePoints = user && user.points >= totalPoints;

  const handleAddressSubmit = (data: AddressFormData) => {
    setAddress(data);
    setStep('payment');
  };

  const handlePaymentSubmit = async (data: any) => {
    setLoading(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      const payment: PaymentDetails = {
        method: data.method,
        upi_id: data.upi_id,
        transaction_id: `TXN_${Date.now()}`,
        amount: totalPoints,
        status: 'completed'
      };
      setPaymentDetails(payment);
      setStep('confirmation');
      // Store order in localStorage (mock supabase)
      if (user && address) {
        const orderItems: OrderItem[] = items.map(cartItem => ({
          id: `orderitem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          order_id: '', // will be set by supabase mock
          item_id: cartItem.item.id,
          item: cartItem.item,
          quantity: cartItem.quantity,
          points_value: cartItem.item.point_value * cartItem.quantity
        }));
        const order: Partial<Order> = {
          user_id: user.id,
          items: orderItems,
          total_points: totalPoints,
          payment_method: payment.method,
          payment_status: payment.status,
          order_status: 'pending',
          shipping_address: address,
        };
        await supabase.from('orders').insert(order);
        // Deduct points if paid by points
        if (String(payment.method) === 'points') {
          await updateProfile({ points: user.points - totalPoints });
        }
      }
      // Clear cart after successful order
      clearCart();
      toast.success('Order placed successfully!');
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToAddress = () => {
    setStep('address');
  };

  const handleBackToPayment = () => {
    setStep('payment');
  };

  if (items.length === 0 && step !== 'confirmation') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some items to your cart to continue</p>
          <Button onClick={() => navigate('/browse')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/browse')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shopping
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-center mt-6">
            <div className={`flex items-center ${step === 'address' ? 'text-emerald-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step === 'address' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-gray-300'
              }`}>
                1
              </div>
              <span className="ml-2 font-medium">Address</span>
            </div>
            
            <div className={`w-16 h-0.5 mx-4 ${step === 'payment' || step === 'confirmation' ? 'bg-emerald-600' : 'bg-gray-300'}`} />
            
            <div className={`flex items-center ${step === 'payment' ? 'text-emerald-600' : step === 'confirmation' ? 'text-gray-400' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step === 'payment' ? 'border-emerald-600 bg-emerald-600 text-white' : 
                step === 'confirmation' ? 'border-emerald-600 text-emerald-600' : 'border-gray-300'
              }`}>
                2
              </div>
              <span className="ml-2 font-medium">Payment</span>
            </div>
            
            <div className={`w-16 h-0.5 mx-4 ${step === 'confirmation' ? 'bg-emerald-600' : 'bg-gray-300'}`} />
            
            <div className={`flex items-center ${step === 'confirmation' ? 'text-emerald-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step === 'confirmation' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-gray-300'
              }`}>
                3
              </div>
              <span className="ml-2 font-medium">Confirm</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 'address' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Shipping Address
                </h2>
                
                <form onSubmit={addressForm.handleSubmit(handleAddressSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        {...addressForm.register('full_name')}
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      {addressForm.formState.errors.full_name && (
                        <p className="text-sm text-red-600 mt-1">{addressForm.formState.errors.full_name.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        {...addressForm.register('phone')}
                        type="tel"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      {addressForm.formState.errors.phone && (
                        <p className="text-sm text-red-600 mt-1">{addressForm.formState.errors.phone.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                    <input
                      {...addressForm.register('street_address')}
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    {addressForm.formState.errors.street_address && (
                      <p className="text-sm text-red-600 mt-1">{addressForm.formState.errors.street_address.message}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        {...addressForm.register('city')}
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      {addressForm.formState.errors.city && (
                        <p className="text-sm text-red-600 mt-1">{addressForm.formState.errors.city.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input
                        {...addressForm.register('state')}
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      {addressForm.formState.errors.state && (
                        <p className="text-sm text-red-600 mt-1">{addressForm.formState.errors.state.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                      <input
                        {...addressForm.register('postal_code')}
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      {addressForm.formState.errors.postal_code && (
                        <p className="text-sm text-red-600 mt-1">{addressForm.formState.errors.postal_code.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input
                      {...addressForm.register('country')}
                      type="text"
                      defaultValue="India"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    {addressForm.formState.errors.country && (
                      <p className="text-sm text-red-600 mt-1">{addressForm.formState.errors.country.message}</p>
                    )}
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Continue to Payment
                  </Button>
                </form>
              </motion.div>
            )}

            {step === 'payment' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Payment Method
                  </h2>
                  <Button variant="outline" onClick={handleBackToAddress}>
                    Back
                  </Button>
                </div>
                
                <form onSubmit={paymentForm.handleSubmit(handlePaymentSubmit)} className="space-y-6">
                  {/* Payment Options */}
                  <div className="space-y-4">
                    {canUsePoints && (
                      <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          {...paymentForm.register('method')}
                          type="radio"
                          value="points"
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                        />
                        <div className="ml-3">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-900">Pay with Points</span>
                            <span className="ml-2 text-sm text-gray-500">({user?.points} points available)</span>
                          </div>
                          <p className="text-sm text-gray-500">Use your ReWear points to pay</p>
                        </div>
                      </label>
                    )}
                    
                    <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        {...paymentForm.register('method')}
                        type="radio"
                        value="upi"
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div className="ml-3">
                        <div className="flex items-center">
                          <Smartphone className="h-4 w-4 mr-2" />
                          <span className="text-sm font-medium text-gray-900">UPI Payment</span>
                        </div>
                        <p className="text-sm text-gray-500">Pay using UPI ID</p>
                      </div>
                    </label>
                    
                    <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        {...paymentForm.register('method')}
                        type="radio"
                        value="cash"
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div className="ml-3">
                        <div className="flex items-center">
                          <CreditCard className="h-4 w-4 mr-2" />
                          <span className="text-sm font-medium text-gray-900">Cash on Delivery</span>
                        </div>
                        <p className="text-sm text-gray-500">Pay when you receive your order</p>
                      </div>
                    </label>
                  </div>
                  
                  {/* UPI ID Input */}
                  {paymentForm.watch('method') === 'upi' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                      <input
                        {...paymentForm.register('upi_id')}
                        type="text"
                        placeholder="yourname@upi"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    loading={loading}
                    disabled={!paymentForm.watch('method')}
                  >
                    {loading ? 'Processing Payment...' : 'Place Order'}
                  </Button>
                </form>
              </motion.div>
            )}

            {step === 'confirmation' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center"
              >
                <CheckCircle className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
                <p className="text-gray-600 mb-6">Thank you for your order. We'll send you updates on your delivery.</p>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                  <h3 className="font-medium text-gray-900 mb-2">Order Details</h3>
                  <p className="text-sm text-gray-600">Order ID: ORD_{Date.now()}</p>
                  <p className="text-sm text-gray-600">Payment Method: {paymentDetails?.method}</p>
                  {paymentDetails?.transaction_id && (
                    <p className="text-sm text-gray-600">Transaction ID: {paymentDetails.transaction_id}</p>
                  )}
                </div>
                
                <div className="space-y-3">
                  <Button onClick={() => navigate('/dashboard')} className="w-full">
                    View My Orders
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/browse')} className="w-full">
                    Continue Shopping
                  </Button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-4">
                {items.map((cartItem) => (
                  <div key={cartItem.item.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={cartItem.item.images[0]}
                        alt={cartItem.item.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{cartItem.item.title}</p>
                        <p className="text-sm text-gray-500">Qty: {cartItem.quantity}</p>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {cartItem.item.point_value * cartItem.quantity} pts
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span>{totalPoints} points</span>
                </div>
                
                {user && (
                  <div className="mt-2 text-sm text-gray-600">
                    Your balance: {user.points} points
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 