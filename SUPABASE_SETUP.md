# UniRoomi + Supabase Integration Setup Guide

## 🚀 Quick Setup (5 minutes)

### 1. Get Your Supabase Credentials

1. Go to [supabase.com](https://supabase.com)
2. Create a new project or use your existing one: `viiomybpdszqgsqugpni`
3. Navigate to **Project Settings** → **API**
4. Copy your **Project URL** and **anon key**

### 2. Update Your Configuration

In `js/supabase-auth.js`, replace the placeholder:

```javascript
const supabaseUrl = 'https://viiomybpdszqgsqugpni.supabase.co';
const supabaseAnonKey = 'YOUR_ACTUAL_ANON_KEY_HERE'; // Replace this!
```

### 3. Setup Database Schema

1. Go to your Supabase project
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase-schema.sql`
4. Click **Run** to execute

### 4. Test the Integration

1. Open `supabase-index.html` in your browser
2. Click **"Login"** → **"Register here"**
3. Create a new account
4. Check your email for verification
5. Login and test the features

## 🔧 Features You Now Have

### ✅ Authentication
- **Real email verification** (no more demo codes!)
- **Password reset** functionality
- **Social login ready** (Google, GitHub, etc.)
- **Secure session management**
- **User profiles** with metadata

### ✅ Database
- **PostgreSQL database** with proper schema
- **Row Level Security** (RLS) for data protection
- **Real-time subscriptions** ready
- **Automatic APIs** for all tables

### ✅ Advanced Features
- **Save properties** functionality
- **University/Campus** data from database
- **Accommodation listings** with images
- **User-specific** data access

## 🛠 How It Works

### Authentication Flow
```
User Registers → Email Verification → Login → Session Created → Access Protected Features
```

### Database Architecture
```
auth.users (Supabase) → user_profiles (your table) → accommodations → saved_properties
```

### Security Model
- **RLS Policies** ensure users only see their own data
- **JWT tokens** handled automatically by Supabase
- **Secure APIs** with proper authorization

## 📱 Enhanced Features

### 1. User Dashboard
Create `supabase-dashboard.html` with:
```javascript
// Load user's saved properties
const { data } = await supabase
  .from('saved_properties')
  .select(`
    *,
    accommodation:accommodations(*)
  `)
  .eq('user_id', user.id);
```

### 2. Real-time Updates
```javascript
// Listen for new accommodations
const subscription = supabase
  .channel('accommodations')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'accommodations' },
    (payload) => {
      console.log('New accommodation:', payload.new);
      // Update UI in real-time
    }
  )
  .subscribe();
```

### 3. File Uploads
```javascript
// Upload accommodation images
const { data, error } = await supabase.storage
  .from('accommodation-images')
  .upload(`public/${file.name}`, file);
```

## 🔒 Security Best Practices

### Row Level Security
Your schema includes RLS policies that:
- ✅ Users can only see their own profiles
- ✅ Users can only manage their own saved properties
- ✅ Public can view active accommodations
- ✅ Owners can manage their accommodations

### API Security
- **Anon key** for public operations
- **Service role key** for admin operations (server-side only)
- **JWT tokens** auto-managed by Supabase
- **HTTPS enforced** in production

## 🚀 Next Steps

### 1. Enable Social Login
```javascript
// Google Login
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/dashboard`
  }
});
```

### 2. Add Real-time Features
- Live accommodation availability
- Real-time messaging between users
- Instant notifications for new listings

### 3. Implement File Storage
- Accommodation photo uploads
- User avatar uploads
- Document verification

### 4. Add Edge Functions
- Email notifications
- Payment processing
- Advanced search algorithms

## 📊 Monitoring & Analytics

### Supabase Dashboard
- **User activity** tracking
- **Database performance** metrics
- **API usage** statistics
- **Error logs** and debugging

### Custom Analytics
```javascript
// Track user interactions
await supabase
  .from('analytics_events')
  .insert({
    user_id: userId,
    event_type: 'property_view',
    property_id: propertyId,
    timestamp: new Date()
  });
```

## 🔄 Migration from Mock System

### What Changed
- ❌ Mock `localStorage` users
- ✅ Real Supabase authentication
- ❌ Demo 2FA codes
- ✅ Real email verification
- ❌ Static university data
- ✅ Database-driven content

### Benefits
- **Production ready** authentication
- **Scalable** database solution
- **Real-time** capabilities
- **Secure** by default
- **Maintainable** codebase

## 🛠 Troubleshooting

### Common Issues

**"Supabase client not loaded"**
- Ensure the Supabase CDN script is loaded
- Check network connectivity
- Verify your anon key is correct

**"Permission denied" errors**
- Check RLS policies in SQL Editor
- Ensure user is authenticated
- Verify table permissions

**Email verification not working**
- Check email templates in Supabase
- Verify SMTP settings
- Check spam folder

### Debug Mode
Add this to your auth.js for debugging:
```javascript
// Add to constructor
this.supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    debug: true // Enable debug logging
  }
});
```

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [JavaScript Client Reference](https://supabase.com/docs/reference/javascript)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Real-time Subscriptions](https://supabase.com/docs/guides/realtime)

## 🎉 You're Ready!

Your UniRoomi project now has:
- ✅ **Production-ready authentication**
- ✅ **Scalable database backend**
- ✅ **Real-time capabilities**
- ✅ **Secure data access**
- ✅ **Modern development workflow**

Start building amazing features on top of this solid foundation! 🚀
