// generate express.js file who will run the server with all fonctionnalities of classic static server
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 80;

// Middleware to parse URL parameters and query strings
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from various directories
app.use('/style', express.static(path.join(__dirname, 'style')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/items', express.static(path.join(__dirname, 'items')));
app.use('/sounds', express.static(path.join(__dirname, 'sounds')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/fonts', express.static(path.join(__dirname, 'fonts')));
app.use('/crafts', express.static(path.join(__dirname, 'crafts')));

// Serve static files from the root directory
app.use(express.static(__dirname));

// Serve specific HTML files with parameter support
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Route for game.html with optional parameters
app.get('/game.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'game.html'));
});

// Route for game with parameters (e.g., /game/level/1 or /game?mode=easy)
app.get('/game/:param?', (req, res) => {
    res.sendFile(path.join(__dirname, 'game.html'));
});

// Route for index with parameters
app.get('/index/:param?', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint to get URL parameters (accessible from client-side JavaScript)
app.get('/api/params', (req, res) => {
    res.json({
        query: req.query,
        params: req.params,
        url: req.url,
        originalUrl: req.originalUrl
    });
});

// Catch-all route - serve index.html for SPA routing
app.get('*', (req, res) => {
  // Check if the request is for an HTML file
  if (req.path.endsWith('.html') || req.path === '/' || !req.path.includes('.')) {
    res.sendFile(path.join(__dirname, 'index.html'));
  } else {
    res.status(404).send('File not found');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
