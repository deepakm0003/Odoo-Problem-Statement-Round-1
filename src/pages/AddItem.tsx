import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Upload, X, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { CATEGORIES, SIZES } from '../types';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import toast from 'react-hot-toast';

const addItemSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Please select a category'),
  size: z.string().min(1, 'Please select a size'),
  condition: z.enum(['New', 'Like New', 'Good', 'Fair']),
  point_value: z.number().min(1, 'Point value must be at least 1').max(500, 'Point value cannot exceed 500'),
  tags: z.string().optional(),
});

type AddItemFormData = z.infer<typeof addItemSchema>;

export default function AddItem() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<AddItemFormData>({
    resolver: zodResolver(addItemSchema),
    defaultValues: {
      point_value: 50,
    },
  });

  const watchedCondition = watch('condition');

  // Mock image upload for demo - in production, you'd upload to Supabase Storage
  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.forEach((file) => {
      if (images.length >= 5) {
        toast.error('Maximum 5 images allowed');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setImages(prev => [...prev, imageUrl]);
        setImageFiles(prev => [...prev, file]);
      };
      reader.readAsDataURL(file);
    });
  }

  function removeImage(index: number) {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  }

  async function onSubmit(data: AddItemFormData) {
    if (!user) return;
    if (images.length === 0) {
      toast.error('Please add at least one image');
      return;
    }

    setLoading(true);
    try {
      const tags = data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];
      
      // For demo purposes, we'll use placeholder images from Pexels
      const placeholderImages = [
        'https://images.pexels.com/photos/6311479/pexels-photo-6311479.jpeg',
        'https://images.pexels.com/photos/6311478/pexels-photo-6311478.jpeg',
        'https://images.pexels.com/photos/6311477/pexels-photo-6311477.jpeg',
        'https://images.pexels.com/photos/6311476/pexels-photo-6311476.jpeg',
        'https://images.pexels.com/photos/6311475/pexels-photo-6311475.jpeg',
      ];

      // Create new item with proper ID generation
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 11);
      const newItem = {
        id: `item_${timestamp}_${randomId}`,
        title: data.title,
        description: data.description,
        category: data.category,
        size: data.size,
        condition: data.condition,
        point_value: data.point_value,
        tags,
        images: placeholderImages.slice(0, images.length),
        user_id: user.id,
        status: 'available' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Save to localStorage
      const existingItems = JSON.parse(localStorage.getItem('rewear_items') || '[]');
      existingItems.push(newItem);
      localStorage.setItem('rewear_items', JSON.stringify(existingItems));

      // Also save to mock Supabase for consistency
      const mockSupabaseItems = JSON.parse(localStorage.getItem('mock_supabase_items') || '[]');
      mockSupabaseItems.push(newItem);
      localStorage.setItem('mock_supabase_items', JSON.stringify(mockSupabaseItems));

      toast.success('Item added successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error adding item:', error);
      toast.error(error.message || 'Failed to add item');
    } finally {
      setLoading(false);
    }
  }

  // Auto-suggest point value based on condition
  React.useEffect(() => {
    if (watchedCondition) {
      const suggestions = {
        'New': 100,
        'Like New': 80,
        'Good': 60,
        'Fair': 40,
      };
      setValue('point_value', suggestions[watchedCondition]);
    }
  }, [watchedCondition, setValue]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-100 p-8"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Item</h1>
            <p className="text-gray-600">Share your preloved clothing with the community</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Photos (Max 5)
              </label>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                
                {images.length < 5 && (
                  <label className="border-2 border-dashed border-gray-300 rounded-lg h-24 flex items-center justify-center cursor-pointer hover:border-emerald-500 transition-colors">
                    <div className="text-center">
                      <Upload className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                      <span className="text-xs text-gray-500">Add Photo</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Input
                  {...register('title')}
                  label="Item Title *"
                  placeholder="e.g., Vintage Denim Jacket"
                  error={errors.title?.message}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  {...register('category')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size *
                </label>
                <select
                  {...register('size')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select a size</option>
                  {SIZES.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                {errors.size && (
                  <p className="mt-1 text-sm text-red-600">{errors.size.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition *
                </label>
                <select
                  {...register('condition')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select condition</option>
                  <option value="New">New - With tags</option>
                  <option value="Like New">Like New - Worn once or twice</option>
                  <option value="Good">Good - Some signs of wear</option>
                  <option value="Fair">Fair - Noticeable wear but functional</option>
                </select>
                {errors.condition && (
                  <p className="mt-1 text-sm text-red-600">{errors.condition.message}</p>
                )}
              </div>

              <div>
                <Input
                  {...register('point_value', { valueAsNumber: true })}
                  type="number"
                  label="Point Value *"
                  placeholder="50"
                  min="1"
                  max="500"
                  error={errors.point_value?.message}
                  helperText="Suggested based on condition"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                {...register('description')}
                rows={4}
                placeholder="Describe your item in detail - brand, material, fit, any flaws, etc."
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Tags */}
            <div>
              <Input
                {...register('tags')}
                label="Tags (Optional)"
                placeholder="vintage, designer, summer, casual"
                helperText="Separate tags with commas"
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}