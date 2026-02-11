# Troubleshooting UMD Bundle Loading

## Issue: "Loading Bryntum Gantt library..." message persists

If you're seeing this message, the UMD bundle isn't loading or exposing Bryntum correctly.

### Step 1: Check Browser Console

Open your browser's developer console (F12) and look for:

1. **Script loading errors**:
   - `Failed to load Bryntum UMD bundle from /gantt.umd.js`
   - 404 errors for `/gantt.umd.js`

2. **Debugging logs**:
   - `[HTML] Bryntum UMD bundle loaded successfully`
   - `[App] Checking for Bryntum...`
   - `[App] window.Bryntum: ...`

### Step 2: Verify File Location

Ensure `gantt.umd.js` exists in the `public/` folder:
- ✅ `public/gantt.umd.js` should exist
- ✅ File should be accessible at `/gantt.umd.js` when running dev server

### Step 3: Check How Bryntum is Exposed

The UMD bundle might expose Bryntum differently. Check the console for:
- `window.Bryntum` - should be an object
- `window.Bryntum.GanttReact` - React wrapper
- `window.Bryntum.Gantt` - Core Gantt class

### Step 4: Common Issues

#### Issue: Script not loading
**Solution**: Check that Vite is serving files from `public/` folder correctly.

#### Issue: Bryntum object exists but wrong structure
**Solution**: The code checks multiple possible structures. Check console logs to see what's available.

#### Issue: CORS or module errors
**Solution**: Ensure the UMD bundle is loaded as a regular script, not as a module.

### Step 5: Manual Check

Open browser console and run:
```javascript
// Check if script loaded
console.log('window.Bryntum:', window.Bryntum);

// Check all Bryntum-related globals
Object.keys(window).filter(k => k.toLowerCase().includes('bryntum') || k.toLowerCase().includes('gantt'));

// Check structure
if (window.Bryntum) {
    console.log('Keys:', Object.keys(window.Bryntum));
    console.log('GanttReact:', window.Bryntum.GanttReact);
    console.log('Gantt:', window.Bryntum.Gantt);
}
```

### Step 6: Alternative Loading Methods

If the current method doesn't work, try:

1. **Load script in public/index.html directly** (already done)
2. **Use dynamic import** (if UMD supports it)
3. **Check UMD bundle format** - might need different access pattern

### Step 7: Verify UMD Bundle Format

The bundle might be:
- **UMD format**: Exposes to `window.Bryntum`
- **AMD format**: Requires AMD loader
- **CommonJS**: Requires bundler
- **ES Module**: Requires import

Check the first few lines of `gantt.umd.js` to see the format.

### Step 8: Fallback Solution

If UMD bundle doesn't work, you can:
1. Use npm packages instead (revert changes)
2. Contact Bryntum support for correct UMD bundle
3. Check if you need a different bundle format

## Quick Fixes

### Fix 1: Ensure script loads before React
The script is loaded in `index.html` before React, which is correct.

### Fix 2: Check file path
In development, Vite serves `public/` files at root (`/`), so `/gantt.umd.js` should work.

### Fix 3: Check build output
After `npm run build`, verify `gantt.umd.js` is copied to `dist/` folder.

## Still Having Issues?

1. Check browser console for specific errors
2. Verify file exists and is accessible
3. Check network tab for 404 errors
4. Share console logs for further debugging
