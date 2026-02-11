# Step-by-Step Setup Guide

## Quick Start

Follow these steps to get the application running:

### 1. Install Dependencies

#### Backend
```bash
cd server
npm install
```

#### Frontend
```bash
cd ..
npm install
```

### 2. Configure Backend

1. Navigate to `server` directory
2. Create `.env` file with your Dataverse credentials:
```env
PORT=3001
DATAVERSE_ENVIRONMENT_URL=https://orgab553a6a.crm8.dynamics.com
DATAVERSE_TENANT_ID=cf50b276-a7b3-4cd0-bd1f-a3a13316b1a5
DATAVERSE_CLIENT_ID=d7cedaf0-7f7e-4779-9985-37d8ac9fb8c0
DATAVERSE_CLIENT_SECRET=UVu8Q~X~oW9YsKw62ilL-yr1U-JxaNqLmut9TdAh
DATAVERSE_TABLE_NAME=eppm_projecttasks
```

### 3. Start Backend Server

```bash
cd server
npm run dev
```

You should see:
```
🚀 Server is running on http://localhost:3001
📊 Dataverse Environment: https://orgab553a6a.crm8.dynamics.com
📋 Table Name: eppm_projecttasks
```

### 4. Start Frontend

Open a new terminal:
```bash
npm run dev
```

### 5. Verify Setup

1. Open browser to `http://localhost:5173` (or the port shown)
2. Check browser console for any errors
3. The Gantt chart should load tasks from Dataverse

## Database Setup in Dataverse

### Option 1: Using Power Apps Portal

1. Go to https://make.powerapps.com
2. Select your environment
3. Navigate to **Tables** (left sidebar)
4. Find or create `eppm_projecttasks` table
5. Add the following columns:

#### Required Columns

| Display Name | Schema Name | Type | Required |
|--------------|-------------|------|----------|
| Name | eppm_name | Single Line of Text | Yes |
| Start Date | eppm_startdate | Date and Time | No |
| End Date | eppm_finishdate | Date and Time | No |
| Duration | eppm_taskduration | Whole Number | No |
<!-- | Percent Complete | eppm_percentcomplete | Whole Number | No | -->
| Parent Task | eppm_parenttaskid | Lookup (self-reference) | No |
<!-- | Sort Order | eppm_sortorder | Whole Number | No | -->
<!-- | Expanded | eppm_expanded | Two Options | No | -->
<!-- | Constraint Type | eppm_constrainttype | Option Set | No |
| Constraint Date | eppm_constraintdate | Date and Time | No |
| Notes | eppm_notes | Multiple Lines of Text | No | -->

### Option 2: Using Solution Import

If you have a solution file, import it through Power Apps.

### Self-Referencing Lookup Setup

To create the parent task lookup:

1. In the table, go to **Relationships**
2. Create a new relationship
3. Set relationship type to **Self-referential**
4. Set the lookup field name to `eppm_parenttaskid`
5. Save

## Testing the Integration

### Test Backend Connection

```bash
curl http://localhost:3001/health
```

Should return:
```json
{"status":"ok","message":"Server is running"}
```

### Test Dataverse Connection

```bash
curl http://localhost:3001/api/tasks
```

Should return Bryntum-formatted task data.

### Test Frontend

1. Open browser developer tools (F12)
2. Go to Network tab
3. Refresh the page
4. Look for requests to `/api/tasks`
5. Verify responses are successful

## Common Issues and Solutions

### Issue: "Failed to fetch tasks"

**Solution**: 
- Check backend is running
- Verify Dataverse credentials in `.env`
- Check network connectivity to Dataverse

### Issue: "Table not found"

**Solution**:
- Verify table name in `.env` matches Dataverse table
- Check table exists in your environment
- Ensure you have read permissions

### Issue: "Authentication failed"

**Solution**:
- Verify Client ID, Secret, and Tenant ID
- Check app registration permissions
- Ensure admin consent is granted

### Issue: "CORS error"

**Solution**:
- Backend already has CORS enabled
- If issues persist, check browser console
- Verify frontend URL matches backend CORS settings

## Next Steps

1. **Customize Fields**: Update field mappings in `server/src/utils/dataTransformer.ts`
2. **Add Validation**: Add validation logic in `server/src/routes/tasks.routes.ts`
3. **Add Authentication**: Implement user authentication for production
4. **Add Error Handling**: Enhance error handling in frontend
5. **Add Loading States**: Add loading indicators in React components

## Production Checklist

- [ ] Set up production Dataverse environment
- [ ] Configure production app registration
- [ ] Set environment variables securely
- [ ] Enable HTTPS
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Set up CI/CD pipeline
- [ ] Perform security audit
- [ ] Load testing
- [ ] Documentation for team
