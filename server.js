const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.render('index', { 
        title: 'Dev Utility Hub',
        features: [
            { name: 'UUID Generator', icon: '🔑', endpoint: '/api/uuid' },
            { name: 'Hash Generator', icon: '🔒', endpoint: '/api/hash' },
            { name: 'Base64 Tools', icon: '📄', endpoint: '/api/base64' },
            { name: 'QR Code', icon: '📱', endpoint: '/api/qrcode' },
            { name: 'URL Shortener', icon: '🔗', endpoint: '/api/shorten' },
            { name: 'Time Converter', icon: '⏰', endpoint: '/api/time' },
            { name: 'Password Gen', icon: '🎯', endpoint: '/api/password' },
            { name: 'JSON Tools', icon: '📊', endpoint: '/api/json' }
        ]
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Dev Utility Hub running on http://localhost:${PORT}`);
});