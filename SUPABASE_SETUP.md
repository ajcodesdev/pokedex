# Supabase Authentication Setup Guide

## 1. Environment Variables Setup

Create a `.env.local` file in your project root:

```
VITE_SUPABASE_URL=https://ursgxqphmypajaggqima.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Get your ANON_KEY from Supabase Dashboard:
- Go to Project Settings → API
- Copy the "anon" public key

## 2. Install Supabase Package

```bash
npm install @supabase/supabase-js
```

## 3. Create Profiles Table (Optional but Recommended)

Run this SQL in your Supabase SQL Editor:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  username TEXT UNIQUE,
  phone TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read their own profile
CREATE POLICY "Users can read their own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Create policy for users to update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create policy for users to insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);
```

## 4. Update App.jsx Routes

Add authentication routes to your `src/App.jsx`:

```jsx
import Login from './pages/Login';
import Register from './pages/Register';

// Add these routes in your Routes component:
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
```

## 5. Files Created

- `src/lib/supabase.js` - Supabase client initialization
- `src/pages/Login.jsx` - Login form component
- `src/pages/Register.jsx` - Registration form component
- `src/css/Auth.css` - Authentication page styles

## 6. Email Confirmation

By default, Supabase requires email confirmation. Users will receive a confirmation email.

To disable email confirmation (development only):
- Go to Supabase Dashboard
- Authentication → Providers → Email
- Uncheck "Confirm email"

## 7. Custom Claims & Metadata

User metadata is stored in auth.users.user_metadata and includes:
- `full_name`
- `username`
- `phone`

Access it in components:
```javascript
const { data } = await supabase.auth.getUser();
const fullName = data.user.user_metadata.full_name;
```

## 8. Check Authentication Status

```javascript
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

const MyComponent = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  return user ? <p>Logged in: {user.email}</p> : <p>Not logged in</p>;
};
```

## 9. Sign Out

```javascript
const handleLogout = async () => {
  await supabase.auth.signOut();
  navigate('/login');
};
```

## 10. Protect Routes (Optional)

Create a ProtectedRoute component:

```jsx
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export const ProtectedRoute = ({ element }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    };

    checkUser();
  }, []);

  if (loading) return <div>Loading...</div>;
  return user ? element : <Navigate to="/login" />;
};
```

Use it:
```jsx
<Route path="/" element={<ProtectedRoute element={<Home />} />} />
```
