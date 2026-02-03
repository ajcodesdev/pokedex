# Session, Protected Routes, and Logout Setup

## Overview

The authentication system now includes:
- **Session Persistence**: Maintains user session across page reloads
- **Protected Routes**: Only authenticated users can access certain pages
- **Logout Functionality**: Sign out and redirect to login
- **Auth Context**: Centralized auth state management

## Files Created

1. `src/context/AuthContext.jsx` - Auth state provider and hooks
2. `src/components/ProtectedRoute.jsx` - Route protection component
3. `src/components/LogoutButton.jsx` - Example logout button
4. Updated `src/App.jsx` - Integrated AuthProvider and ProtectedRoute

## How It Works

### 1. AuthContext.jsx

Provides:
- `user` - Current logged-in user object
- `session` - Current session object
- `loading` - Loading state while checking auth
- `isAuthenticated` - Boolean flag
- `logout()` - Function to sign out

```jsx
import { useAuth } from './context/AuthContext';

const MyComponent = () => {
  const { user, isAuthenticated, logout } = useAuth();
  
  return (
    <div>
      {isAuthenticated && <p>Welcome, {user.email}</p>}
    </div>
  );
};
```

### 2. ProtectedRoute.jsx

Wraps routes that require authentication:

```jsx
<Route 
  path={"/home"} 
  element={<ProtectedRoute element={<Home />} />} 
/>
```

Behavior:
- **Authenticated**: Renders the component
- **Not authenticated**: Redirects to `/` (login)
- **Loading**: Shows loading spinner

### 3. LogoutButton.jsx

Ready-to-use logout button:

```jsx
import LogoutButton from './components/LogoutButton';

const Header = () => {
  return <LogoutButton />;
};
```

Or create your own:

```jsx
const { logout } = useAuth();

const handleLogout = async () => {
  try {
    await logout();
    // Auto-redirects when user state clears
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

return <button onClick={handleLogout}>Logout</button>;
```

## Usage Examples

### Check if user is authenticated

```jsx
import { useAuth } from './context/AuthContext';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <p>Please log in</p>;
  }
  
  return <p>Welcome, {user.email}</p>;
};
```

### Access user metadata

```jsx
const { user } = useAuth();

const fullName = user?.user_metadata?.full_name;
const username = user?.user_metadata?.username;
const phone = user?.user_metadata?.phone;
```

### Get session information

```jsx
const { session } = useAuth();

const expiresAt = session?.expires_at;
const accessToken = session?.access_token;
```

### Handle loading state

```jsx
const { loading, user } = useAuth();

if (loading) {
  return <p>Loading...</p>;
}

return <p>Logged in as: {user?.email}</p>;
```

## Current Route Structure

```
/ (Login)                    - Public
/register                    - Public
/home                        - Protected
/home/:pokemon               - Protected
```

## Session Persistence

The system automatically:
1. Checks for existing session on app load
2. Restores user from browser storage
3. Listens for auth state changes across all tabs
4. Maintains session until explicit logout

## Security

- Supabase handles secure token management
- Session data is stored in browser storage (secure by default)
- Protected routes redirect unauthenticated users
- All Supabase credentials use environment variables

## Adding More Protected Routes

Simply wrap new routes:

```jsx
<Route 
  path={"/profile"} 
  element={<ProtectedRoute element={<Profile />} />} 
/>
```

## Logout Flow

1. User clicks logout button
2. `logout()` calls `supabase.auth.signOut()`
3. Auth state updates (user becomes null)
4. User automatically redirects to login page
5. Session is cleared from storage
