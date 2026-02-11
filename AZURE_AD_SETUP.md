# Azure AD App Registration Setup

This guide will help you configure the redirect URI in Azure AD to fix the authentication error.

## Error Message
```
AADSTS50011: The redirect URI 'http://localhost:5173/' specified in the request 
does not match the redirect URIs configured for the application.
```

## Solution: Add Redirect URI to Azure AD

### Step 1: Navigate to Azure Portal

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** (or **Microsoft Entra ID**)
3. Click on **App registrations**
4. Find and click on your application: `d7cedaf0-7f7e-4779-9985-37d8ac9fb8c0`

### Step 2: Add Redirect URI

1. In the left menu, click on **Authentication**
2. Under **Platform configurations**, click **Add a platform**
3. Select **Single-page application**
4. In the **Redirect URIs** section, add the following URIs:
   - `http://localhost:5173` (for local development)
   - `http://localhost:5173/` (with trailing slash - add both to be safe)
   
   **Note**: If you're using a different port (check your Vite dev server output), use that port instead of 5173.

5. Click **Configure**

### Step 3: Configure API Permissions

1. In the left menu, click on **API permissions**
2. Click **Add a permission**
3. Select **APIs my organization uses**
4. Search for your Dataverse environment: `orgab553a6a.crm8.dynamics.com`
5. Select the appropriate permissions (typically `user_impersonation` or `Delegated permissions`)
6. Click **Add permissions**
7. Click **Grant admin consent** (if you have admin rights)

### Step 4: Update Redirect URIs for Different Environments

If you need to support multiple environments, add all redirect URIs:

**Development:**
- `http://localhost:5173`
- `http://localhost:5173/`

**Production (when deployed):**
- `https://yourdomain.com`
- `https://yourdomain.com/`

### Step 5: Verify Configuration

After adding the redirect URI:

1. Save the changes
2. Wait a few seconds for the changes to propagate
3. Try logging in again from your application

## Alternative: Use Exact URI from Error

If you continue to see the error, check the exact URI in the error message and add that exact URI (including trailing slash) to Azure AD.

## Common Issues

### Issue: Still getting redirect URI mismatch

**Solutions:**
1. Clear browser cache and cookies
2. Wait 2-5 minutes for Azure AD changes to propagate
3. Verify the redirect URI in Azure AD matches exactly (including trailing slash)
4. Check if you're using a different port - update Azure AD accordingly

### Issue: Port number is different

If Vite is running on a different port (check the terminal output), update the redirect URI in:
1. Azure AD (add the new port)
2. `src/config/msalConfig.ts` (if you want to hardcode it)

### Issue: Popup blocked

If the login popup is blocked:
1. Allow popups for `localhost` in your browser settings
2. Try using redirect flow instead of popup (requires code changes)

## Testing

After configuration:

1. Restart your development server
2. Clear browser cache
3. Try logging in again
4. The authentication should work without the redirect URI error

## Additional Resources

- [Azure AD Redirect URI Documentation](https://learn.microsoft.com/azure/active-directory/develop/quickstart-register-app#add-a-redirect-uri)
- [MSAL.js Configuration](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md)
