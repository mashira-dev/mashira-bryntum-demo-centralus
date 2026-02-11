# Authentication Debugging Guide

## Common Issues and Solutions

### 1. "Authentication failed. Please try again."

This error can occur for several reasons. Check the browser console for detailed error messages.

#### Check Browser Console
Open DevTools (F12) → Console tab and look for:
- `Auth check error:` - Shows what went wrong during authentication
- `Login error:` - Shows login-specific errors
- `Error details:` - Provides error codes and messages

#### Common Error Codes

**`user_cancelled`**
- User closed the login popup
- **Solution**: Click "Retry Login" and don't close the popup

**`popup_window_error`**
- Popup was blocked by browser
- **Solution**: 
  1. Allow popups for `localhost` in browser settings
  2. Check browser's popup blocker settings
  3. Try clicking the login button again

**`interaction_in_progress`**
- Another login attempt is already happening
- **Solution**: Wait for current attempt to complete

**`uninitialized_public_client_application`**
- MSAL not initialized before use
- **Solution**: Should be fixed now, but if persists, check console logs

**`AADSTS50011` (Redirect URI mismatch)**
- Redirect URI doesn't match Azure AD configuration
- **Solution**: 
  1. Check Azure Portal → App Registration → Authentication
  2. Ensure `http://localhost:5173` (or your port) is added
  3. Add both with and without trailing slash

**`AADSTS70011` (Invalid scope)**
- Scope not configured correctly
- **Solution**: Check that Dataverse resource scope is correct

### 2. No Token Retrieved

#### Check localStorage
1. Open DevTools → Application → Local Storage
2. Look for:
   - `dataverse_access_token` - Should contain the token
   - `dataverse_token_expiry` - Should be a future timestamp

#### If Token Missing
- Login might have failed silently
- Check console for errors
- Try manual login button

#### If Token Expired
- Token expiry time has passed
- System should auto-refresh, but if not:
  1. Clear localStorage
  2. Refresh page
  3. Login again

### 3. MSAL Initialization Issues

#### Check Console Logs
Look for these messages:
- `Starting authentication check...`
- `Initializing MSAL instance...`
- `MSAL instance initialized successfully`
- `MSAL instance shared with auth.service`

If any are missing, initialization might have failed.

### 4. Network/API Issues

#### Check Network Tab
1. Open DevTools → Network tab
2. Look for request to `/api/tasks`
3. Check Request Headers:
   - Should have `Authorization: Bearer <token>`
4. Check Response:
   - 401 = Token missing or invalid
   - 500 = Backend error

## Debugging Steps

### Step 1: Check Console Logs
1. Open browser DevTools (F12)
2. Go to Console tab
3. Refresh the page
4. Look for error messages
5. Note any error codes

### Step 2: Check localStorage
1. DevTools → Application → Local Storage
2. Check for `dataverse_access_token`
3. If present, copy the token value
4. Check `dataverse_token_expiry` timestamp

### Step 3: Test Manual Login
1. Click "Retry Login with Microsoft" button
2. Watch console for logs
3. Don't close the popup window
4. Complete the login process

### Step 4: Verify Azure AD Configuration
1. Go to Azure Portal
2. Navigate to App Registrations
3. Find your app: `d7cedaf0-7f7e-4779-9985-37d8ac9fb8c0`
4. Check Authentication:
   - Redirect URIs should include your localhost URL
   - Platform should be "Single-page application"
5. Check API Permissions:
   - Should have Dataverse API permissions
   - Should be granted admin consent

### Step 5: Check Backend Logs
1. Check backend terminal/console
2. Look for:
   - `Token received, fetching tasks from Dataverse...`
   - Any error messages
   - Dataverse API errors

## Quick Fixes

### Clear Everything and Retry
```javascript
// Run in browser console
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### Check Current Configuration
```javascript
// Run in browser console to check MSAL config
console.log('Redirect URI:', window.location.origin);
console.log('Stored token:', localStorage.getItem('dataverse_access_token'));
console.log('Token expiry:', localStorage.getItem('dataverse_token_expiry'));
```

### Manual Token Check
```javascript
// Run in browser console
const token = localStorage.getItem('dataverse_access_token');
const expiry = localStorage.getItem('dataverse_token_expiry');
if (token) {
    console.log('Token exists:', token.substring(0, 20) + '...');
    if (expiry) {
        const expiryDate = new Date(parseInt(expiry));
        console.log('Token expires:', expiryDate);
        console.log('Is expired:', Date.now() >= parseInt(expiry));
    }
} else {
    console.log('No token found');
}
```

## Still Having Issues?

1. **Check all console errors** - They provide specific error codes
2. **Verify Azure AD setup** - Redirect URIs and permissions
3. **Check popup blockers** - Must allow popups for localhost
4. **Verify backend is running** - Should be on port 3001
5. **Check network connectivity** - Can reach Azure AD and Dataverse

## Contact Information

If issues persist, provide:
- Browser console errors (screenshot or copy)
- Network tab showing the failed request
- Backend logs
- Azure AD app registration details (screenshot)
