# MSAL Authentication Setup Guide

This project uses MSAL (Microsoft Authentication Library) for authentication with Dataverse.

## Configuration

The MSAL configuration is set up in `src/config/msalConfig.ts` with the following values:
- **Client ID**: `d7cedaf0-7f7e-4779-9985-37d8ac9fb8c0`
- **Tenant ID**: `cf50b276-a7b3-4cd0-bd1f-a3a13316b1a5`
- **Dataverse Resource**: `https://orgab553a6a.crm8.dynamics.com/`

## Environment Variables

### Frontend (.env in root)
```env
VITE_API_URL=http://localhost:3001/api
```

### Backend (server/.env)
```env
DATAVERSE_ENVIRONMENT_URL=https://orgab553a6a.crm8.dynamics.com
DATAVERSE_TABLE_NAME=eppm_projecttasks
PORT=3001
```

**Note**: The backend no longer requires `DATAVERSE_TENANT_ID`, `DATAVERSE_CLIENT_ID`, or `DATAVERSE_CLIENT_SECRET` as it now uses tokens from the frontend MSAL authentication.

## How It Works

1. **Frontend Authentication**: 
   - User logs in via MSAL popup
   - Access token is obtained for the Dataverse resource
   - Token is stored and automatically included in API requests

2. **Backend Token Handling**:
   - Backend receives the access token from the `Authorization` header
   - Token is used directly to make requests to Dataverse API
   - No client secret authentication needed

3. **Data Flow**:
   - Frontend → Backend (with MSAL token) → Dataverse API
   - Dataverse data is transformed to Bryntum Gantt format
   - Data is returned to frontend and displayed in the Gantt chart

## Field Mapping

The following Dataverse fields are mapped to Bryntum Gantt:
- `eppm_projecttaskid` → `id`
- `eppm_name` → `name`
- `eppm_startdate` → `startDate`
- `eppm_finishdate` → `endDate`
- `eppm_taskduration` → `duration`
- `eppm_parenttaskid` → `parentId`

## Troubleshooting

### No data showing in UI

1. **Check Authentication**:
   - Ensure you're logged in (check browser console for auth errors)
   - Verify the access token is being sent in API requests

2. **Check Backend Logs**:
   - Look for Dataverse API errors
   - Check if the token is valid

3. **Check Network Tab**:
   - Verify API calls are being made
   - Check response format matches Bryntum expectations

4. **Verify Dataverse Connection**:
   - Ensure the environment URL is correct
   - Verify the table name (`eppm_projecttasks`) exists
   - Check that the user has permissions to read the table

### Authentication Errors

- **401 Unauthorized**: Token may be expired or invalid. Try logging out and logging back in.
- **Token acquisition failed**: Check MSAL configuration and ensure the app is registered in Azure AD with correct permissions.

### Redirect URI Mismatch Error (AADSTS50011)

If you see an error like:
```
AADSTS50011: The redirect URI 'http://localhost:5173/' specified in the request 
does not match the redirect URIs configured for the application.
```

**Solution**: You need to add the redirect URI to your Azure AD app registration.

1. Go to [Azure Portal](https://portal.azure.com) → **Azure Active Directory** → **App registrations**
2. Find your app: `d7cedaf0-7f7e-4779-9985-37d8ac9fb8c0`
3. Click **Authentication** → **Add a platform** → **Single-page application**
4. Add these redirect URIs:
   - `http://localhost:5173` (without trailing slash)
   - `http://localhost:5173/` (with trailing slash)
   
   **Note**: If Vite is using a different port, use that port instead of 5173.

5. Click **Configure** and wait 2-5 minutes for changes to propagate
6. Clear browser cache and try again

For detailed instructions, see [AZURE_AD_SETUP.md](./AZURE_AD_SETUP.md)
