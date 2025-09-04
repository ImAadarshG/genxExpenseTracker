# Cloud Sync Setup Guide

This guide will help you set up cloud sync for your Expense Tracker app using Vercel Edge Config and Vercel Postgres.

## Prerequisites

- A Vercel account (free tier is sufficient)
- Your app deployed to Vercel or running locally

## Step 1: Create Environment Variables File

Create a `.env.local` file in the root of your project with the following content:

```env
# Vercel Edge Config (you already have this)
EDGE_CONFIG=https://edge-config.vercel.com/ecfg_f1kakswqbhjhro9oa0e6zv1vzp7v?token=6b8f039e-e4c1-4fda-8d34-f36c05f2b864

# Vercel Postgres (to be added)
POSTGRES_URL=
POSTGRES_URL_NON_POOLING=
POSTGRES_USER=
POSTGRES_HOST=
POSTGRES_PASSWORD=
POSTGRES_DATABASE=

# Enable cloud sync (set to true when database is configured)
NEXT_PUBLIC_ENABLE_CLOUD_SYNC=false
```

## Step 2: Set up Vercel Postgres Database

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to the "Storage" tab
3. Click "Create Database"
4. Choose "Postgres"
5. Give your database a name (e.g., "expense-tracker-db")
6. Select your region (choose the closest to you)
7. Click "Create"

## Step 3: Copy Database Credentials

After creating the database:

1. Click on your new database
2. Go to the ".env.local" tab
3. Copy all the POSTGRES_* environment variables
4. Paste them into your local `.env.local` file

## Step 4: Enable Cloud Sync

In your `.env.local` file, change:
```env
NEXT_PUBLIC_ENABLE_CLOUD_SYNC=true
```

## Step 5: Initialize Database Tables

The app will automatically create the necessary tables when you first run it with cloud sync enabled.

If you're deploying to Vercel, make sure to add all environment variables to your Vercel project:

1. Go to your project settings in Vercel
2. Navigate to "Environment Variables"
3. Add each variable from your `.env.local` file

## Step 6: Test Cloud Sync

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Go to Settings → Cloud tab in your app

3. If everything is configured correctly, you should see "Cloud Sync" options

4. Click "Upload to Cloud" to sync your local data to the cloud

5. On another device or browser, login with the same account and click "Download from Cloud" to sync the data

## Troubleshooting

### Cloud Sync Not Available
- Make sure `NEXT_PUBLIC_ENABLE_CLOUD_SYNC=true` in your `.env.local`
- Restart your development server after changing environment variables

### Database Connection Failed
- Verify all POSTGRES_* variables are correctly set
- Check if your database is active in the Vercel dashboard
- Make sure you're not hitting rate limits (free tier has limits)

### Data Not Syncing
- Ensure you're logged in with the same email on both devices
- Check the browser console for any errors
- Verify your database tables are created (check Vercel dashboard → Storage → Data)

## Features

With cloud sync enabled, you can:
- ✅ Sync expenses, income, investments, and money lent across devices
- ✅ Backup your data to the cloud
- ✅ Access your financial data from any device
- ✅ Share data between mobile and desktop

## Security Notes

- Your data is stored securely in Vercel's Postgres database
- Each user's data is isolated by their email address
- Always use HTTPS in production
- Consider implementing additional encryption for sensitive data

## API Routes (Optional)

If you want to create API routes for syncing, create these files:

`app/api/sync/upload/route.ts` - For uploading data
`app/api/sync/download/route.ts` - For downloading data

This would allow for automatic background syncing.

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify all environment variables are set correctly
3. Check Vercel logs if deployed
4. Ensure your database is not at its storage limit
