# MSAL Initialization Fix

## Issues Fixed

### 1. **MSAL Uninitialized Error**
**Error**: `BrowserAuthError: uninitialized_public_client_application`

**Root Cause**: MSAL instance was being used before initialization completed, or multiple instances were being created.

**Solution**:
- Added `setMsalInstance()` function to share the initialized instance from AuthProvider
- Ensured MSAL is initialized before any operations
- Added proper initialization checks in `getMsalInstance()`

### 2. **No Access Token Provided Error**
**Error**: `"No access token provided. Please authenticate first."`

**Root Cause**: Token wasn't being retrieved from localStorage before making requests, or MSAL wasn't initialized when token was needed.

**Solution**:
- Prioritize localStorage token retrieval (synchronous, doesn't require MSAL)
- Only fall back to MSAL if no stored token exists
- Added better error handling and logging
- Ensure token is always checked from localStorage first in fetch functions

## Changes Made

### `src/services/auth.service.ts`
1. Added `setMsalInstance()` to share initialized instance
2. Improved `getMsalInstance()` to check initialization status
3. Token retrieval prioritizes localStorage (synchronous)

### `src/components/AuthProvider.tsx`
1. Initialize MSAL instance before any operations
2. Share initialized instance with auth.service using `setMsalInstance()`
3. Check localStorage token first (before MSAL operations)
4. Validate token expiry before using stored token

### `src/AppConfig.tsx`
1. Enhanced fetch functions to check localStorage first
2. Added error handling for MSAL operations
3. Added logging to debug token issues
4. Fallback to stored token if MSAL fails

## How It Works Now

1. **Page Load**:
   - AuthProvider initializes MSAL instance
   - Shares instance with auth.service
   - Checks localStorage for stored token
   - If valid token found, uses it immediately (no MSAL needed)

2. **Token Retrieval Priority**:
   1. Check cached token (in-memory)
   2. Check localStorage (synchronous)
   3. If expired or missing, get from MSAL (async)

3. **API Requests**:
   - Fetch functions check localStorage first (synchronous)
   - Only use MSAL if no stored token
   - Token is always included in Authorization header

## Testing

1. **First Load**:
   - Login should happen automatically
   - Token should be stored in localStorage
   - Requests should include Authorization header

2. **Page Refresh**:
   - Token should be retrieved from localStorage
   - No MSAL initialization needed for token retrieval
   - Requests should work immediately

3. **Check Browser Console**:
   - Should see "Found valid stored token" on refresh
   - Should see "Making request to: ... with token: Yes"
   - No "uninitialized_public_client_application" errors

4. **Check Network Tab**:
   - Requests to `/api/tasks` should have `Authorization: Bearer <token>` header
   - Should get 200 OK response with data

## Troubleshooting

### Still Getting "No access token provided"

1. **Check localStorage**:
   - Open DevTools → Application → Local Storage
   - Verify `dataverse_access_token` exists
   - Check `dataverse_token_expiry` is in the future

2. **Check Console Logs**:
   - Look for "Found valid stored token" message
   - Check for any token retrieval errors

3. **Clear and Re-login**:
   - Clear localStorage
   - Refresh page
   - Login again

### Still Getting MSAL Initialization Error

1. **Check Initialization Order**:
   - MSAL should initialize before any token operations
   - Check console for initialization errors

2. **Verify Instance Sharing**:
   - `setMsalInstance()` should be called after initialization
   - Check that only one MSAL instance exists
