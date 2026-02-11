# Bryntum Gantt with Dataverse Integration

This project integrates Bryntum Gantt Chart with Microsoft Dataverse, allowing you to store and manage Gantt chart data in Dataverse.

## Architecture

- **Frontend**: React + TypeScript + Vite + Bryntum Gantt
- **Backend**: Node.js + Express + TypeScript
- **Database**: Microsoft Dataverse (via REST API)

## Project Structure

```
.
├── server/                 # Backend server
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── services/      # Dataverse service
│   │   ├── routes/        # API routes
│   │   ├── utils/         # Data transformation utilities
│   │   └── index.ts       # Server entry point
│   ├── package.json
│   └── tsconfig.json
├── src/                    # Frontend React app
│   ├── components/         # React components
│   ├── services/          # API service
│   ├── App.tsx
│   └── AppConfig.tsx
└── package.json
```

## Prerequisites

- Node.js >= 20.0.0
- npm or yarn
- Microsoft Dataverse environment with:
  - App registration (Client ID and Secret)
  - Table: `eppm_projecttasks` (or your custom table)
  - Required fields in the table (see Database Setup section)

## Setup Instructions

### Step 1: Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Copy `.env.example` to `.env` (if not exists)
   - Update the `.env` file with your Dataverse credentials:
```env
PORT=3001
DATAVERSE_ENVIRONMENT_URL=https://orgab553a6a.crm8.dynamics.com
DATAVERSE_TENANT_ID=cf50b276-a7b3-4cd0-bd1f-a3a13316b1a5
DATAVERSE_CLIENT_ID=d7cedaf0-7f7e-4779-9985-37d8ac9fb8c0
DATAVERSE_CLIENT_SECRET=UVu8Q~X~oW9YsKw62ilL-yr1U-JxaNqLmut9TdAh
DATAVERSE_TABLE_NAME=eppm_projecttasks
DATAVERSE_ALLOW_SELF_SIGNED_CERT=true
```

4. Start the backend server:
```bash
npm run dev
```

The server will start on `http://localhost:3001`

### Step 2: Frontend Setup

1. Navigate to the project root:
```bash
cd ..
```

2. Install dependencies (if not already installed):
```bash
npm install
```

3. Configure environment variables (optional):
   - Create `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:3001/api
```

4. Start the frontend development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:5173` (or another port if 5173 is busy)

## Database Setup (Dataverse)

### Required Table Fields

Your Dataverse table (`eppm_projecttasks` or custom table) should have the following fields:

| Field Name | Type | Description |
|------------|------|-------------|
| `eppm_projecttaskid` | GUID (Primary Key) | Unique identifier for the task |
| `eppm_name` | Single Line of Text | Task name |
| `eppm_startdate` | Date and Time | Task start date |
| `eppm_finishdate` | Date and Time | Task end date |
| `eppm_taskduration` | Whole Number | Task duration in days |
<!-- | `eppm_percentcomplete` | Whole Number | Percentage complete (0-100) | -->
| `eppm_parenttaskid` | Lookup | Reference to parent task (self-referencing) |
<!-- | `eppm_sortorder` | Whole Number | Sort order for tasks | -->
<!-- | `eppm_expanded` | Two Options | Whether the task is expanded in the tree | -->
<!-- | `eppm_constrainttype` | Option Set | Constraint type (0-5) |
| `eppm_constraintdate` | Date and Time | Constraint date |
| `eppm_notes` | Multiple Lines of Text | Task notes | -->

### Creating the Table in Dataverse

1. Go to Power Apps (https://make.powerapps.com)
2. Navigate to your environment
3. Go to **Tables** (previously called Entities)
4. Create a new table or use existing `eppm_projecttasks`
5. Add the required fields listed above
6. Ensure the table has proper security roles configured

### App Registration Setup

1. Go to Azure Portal (https://portal.azure.com)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Create a new app registration or use existing
4. Note down:
   - **Application (client) ID**
   - **Directory (tenant) ID**
5. Create a **Client secret**:
   - Go to **Certificates & secrets**
   - Click **New client secret**
   - Copy the secret value (you won't see it again)
6. Grant API permissions:
   - Go to **API permissions**
   - Add permission > **Dynamics CRM**
   - Select **Delegated permissions** > **user_impersonation**
   - Click **Add permissions**
   - Click **Grant admin consent**

## API Endpoints

### GET /api/tasks
Get all tasks in Bryntum format
- **Response**: Bryntum project data structure

### GET /api/tasks/:id
Get a single task by ID
- **Parameters**: `id` - Task GUID
- **Response**: Task object

### POST /api/tasks
Create a new task
- **Body**: Bryntum task object
- **Response**: Created task

### PUT /api/tasks/:id
Update an existing task
- **Parameters**: `id` - Task GUID
- **Body**: Updated task object
- **Response**: Success message

### DELETE /api/tasks/:id
Delete a task
- **Parameters**: `id` - Task GUID
- **Response**: Success message

### POST /api/tasks/sync
Sync multiple tasks (batch operation)
- **Body**: `{ tasks: BryntumTask[] }`
- **Response**: Updated tasks array

## Data Flow

1. **Load Data**: Frontend requests tasks → Backend fetches from Dataverse → Transforms to Bryntum format → Returns to frontend
2. **Save Data**: Frontend sends changes → Backend transforms to Dataverse format → Saves to Dataverse → Returns confirmation

## Development

### Backend Development
```bash
cd server
npm run dev    # Start with hot reload
npm run build  # Build for production
npm start      # Run production build
```

### Frontend Development
```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run preview # Preview production build
```

## Troubleshooting

### Backend Issues

1. **Authentication Errors**:
   - Verify your Dataverse credentials in `.env`
   - Check that the app registration has proper permissions
   - Ensure admin consent is granted

2. **Table Not Found**:
   - Verify the table name in `.env` matches your Dataverse table
   - Check that the table exists in your environment

3. **Field Mapping Errors**:
   - Ensure all required fields exist in your Dataverse table
   - Check field names match exactly (case-sensitive)

### Frontend Issues

1. **API Connection Errors**:
   - Ensure backend server is running on port 3001
   - Check CORS settings if accessing from different origin
   - Verify `VITE_API_URL` in `.env` matches backend URL

2. **Data Not Loading**:
   - Check browser console for errors
   - Verify backend is returning data in correct format
   - Check network tab for API responses

## Production Deployment

### Backend Deployment

1. Build the backend:
```bash
cd server
npm run build
```

2. Set environment variables on your hosting platform
3. Start the server:
```bash
npm start
```

### Frontend Deployment

1. Build the frontend:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting platform
3. Update `VITE_API_URL` to point to your production backend

## Security Notes

- Never commit `.env` files to version control
- Use environment variables for all sensitive data
- Implement proper authentication/authorization in production
- Use HTTPS in production
- Regularly rotate client secrets

## License

This project uses Bryntum Gantt, which requires a commercial license for production use.

## Support

For issues related to:
- **Bryntum Gantt**: Contact Bryntum support
- **Dataverse**: Check Microsoft Dataverse documentation
- **This Integration**: Check the code comments and API documentation
