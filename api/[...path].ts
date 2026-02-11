// Vercel serverless function - catch-all route for Express backend
import express from 'express';
import cors from 'cors';
import tasksRoutes from '../server/src/routes/tasks.routes.js';

const app = express();

// Middleware to rewrite paths - remove /api prefix for Express routing
// Vercel provides /api prefix, but Express routes expect paths without it
app.use((req, res, next) => {
    // Rewrite the URL to remove /api prefix if present
    if (req.url.startsWith('/api')) {
        req.url = req.url.replace(/^\/api/, '') || '/';
    }
    next();
});

// Middleware
app.use(cors({
    origin: true, // Allow all origins
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'OData-MaxVersion', 'OData-Version'],
    exposedHeaders: ['Authorization', 'Content-Type'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
}));

// Middleware to set response headers
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Handle OPTIONS preflight requests
app.options('*', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH', 'DELETE', 'OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, OData-MaxVersion, OData-Version');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400');
    res.status(204).end();
});

// Health check endpoint - accessible at /api/health
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// API routes - mount tasks routes at /tasks
// Requests to /api/tasks/* will be handled here
app.use('/tasks', tasksRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        error: err.message || 'Internal server error'
    });
});

// Vercel serverless function handler
// Export Express app - Vercel will handle the request/response conversion
export default app;
