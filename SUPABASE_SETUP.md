# Supabase Setup Guide

## Current Status
Your app is currently running in demo mode with mock data. This means all the sample products are stored locally and will reset when you refresh the page.

## To Connect to Real Supabase Database

### 1. Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Create a new project
4. Wait for the project to be ready

### 2. Get Your Credentials
1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy the **Project URL** and **anon/public key**

### 3. Set Up Environment Variables
Create a `.env` file in your project root with:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run Database Migrations
1. Install Supabase CLI: `npm install -g supabase`
2. Login to Supabase: `supabase login`
3. Link your project: `supabase link --project-ref your-project-id`
4. Run migrations: `supabase db push`

### 5. Add Sample Data
The migration file `supabase/migrations/20250713000000_add_sample_products.sql` contains all the sample products. This will be automatically applied when you run the migrations.

## Sample Products Added

Your database now includes **26 products** across all 6 categories:

### Tops (4 items)
- Classic White T-Shirt
- Silk Blouse
- Graphic Sweatshirt
- Button-Up Oxford Shirt

### Bottoms (4 items)
- High-Waisted Jeans
- Pleated Skirt
- Cargo Pants
- Linen Shorts

### Dresses (4 items)
- Little Black Dress
- Maxi Summer Dress
- Wrap Dress
- Cocktail Dress

### Outerwear (4 items)
- Leather Jacket
- Wool Coat
- Denim Jacket
- Rain Jacket

### Shoes (4 items)
- White Sneakers
- Ankle Boots
- Heeled Sandals
- Running Shoes

### Accessories (6 items)
- Leather Handbag
- Silk Scarf
- Statement Necklace
- Wide-Brim Hat
- Leather Belt
- Sunglasses

## Features
- All products have realistic descriptions, images, and point values
- Products are distributed across different users
- Various conditions (New, Like New, Good, Fair)
- Different sizes and categories
- Tags for better search functionality

## Demo Mode vs Real Database
- **Demo Mode**: Data is stored in memory, resets on refresh
- **Real Database**: Data persists, supports real-time updates, authentication, etc.

## Troubleshooting
If you encounter issues:
1. Make sure your Supabase project is active
2. Check that your environment variables are correct
3. Verify that migrations have been applied successfully
4. Check the browser console for any errors 