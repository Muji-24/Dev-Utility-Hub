const express = require('express');
const { v4: uuidv4, v5: uuidv5 } = require('uuid');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const qr = require('qr-image');
const router = express.Router();

// UUID Generator
router.get('/uuid', (req, res) => {
    const count = parseInt(req.query.count) || 1;
    const uuids = Array.from({ length: count }, () => uuidv4());
    res.json({ uuids, timestamp: new Date().toISOString() });
});

// Hash Generator
router.post('/hash', async (req, res) => {
    const { text, algorithm = 'sha256' } = req.body;
    
    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }

    try {
        const hashes = {
            md5: crypto.createHash('md5').update(text).digest('hex'),
            sha256: crypto.createHash('sha256').update(text).digest('hex'),
            sha512: crypto.createHash('sha512').update(text).digest('hex')
        };

        if (algorithm === 'bcrypt') {
            const saltRounds = 10;
            hashes.bcrypt = await bcrypt.hash(text, saltRounds);
        }

        res.json({ original: text, hashes });
    } catch (error) {
        res.status(500).json({ error: 'Hash generation failed' });
    }
});

// Base64 Tools
router.post('/base64', (req, res) => {
    const { action, text } = req.body;
    
    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }

    try {
        let result;
        if (action === 'encode') {
            result = Buffer.from(text).toString('base64');
        } else if (action === 'decode') {
            result = Buffer.from(text, 'base64').toString('utf8');
        } else {
            return res.status(400).json({ error: 'Action must be encode or decode' });
        }

        res.json({ action, original: text, result });
    } catch (error) {
        res.status(400).json({ error: 'Invalid base64 string' });
    }
});

// QR Code Generator
router.get('/qrcode', (req, res) => {
    const { text = 'Hello World', size = 200 } = req.query;
    
    try {
        const qr_png = qr.image(text, { type: 'png', size: parseInt(size) });
        res.setHeader('Content-type', 'image/png');
        qr_png.pipe(res);
    } catch (error) {
        res.status(500).json({ error: 'QR generation failed' });
    }
});

// Timestamp Converter
router.get('/time', (req, res) => {
    const now = new Date();
    const timestamp = {
        unix: Math.floor(now.getTime() / 1000),
        iso: now.toISOString(),
        utc: now.toUTCString(),
        local: now.toString(),
        formatted: now.toLocaleString()
    };
    res.json(timestamp);
});

// Password Generator
router.get('/password', (req, res) => {
    const length = parseInt(req.query.length) || 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    const strength = length >= 16 ? 'Very Strong' : 
                    length >= 12 ? 'Strong' : 
                    length >= 8 ? 'Moderate' : 'Weak';

    res.json({ password, length, strength });
});

// JSON Formatter/Validator
router.post('/json', (req, res) => {
    const { json, action = 'format' } = req.body;
    
    try {
        if (action === 'validate') {
            JSON.parse(json);
            res.json({ valid: true, message: 'Valid JSON' });
        } else if (action === 'format') {
            const parsed = JSON.parse(json);
            const formatted = JSON.stringify(parsed, null, 2);
            res.json({ original: json, formatted, valid: true });
        }
    } catch (error) {
        res.json({ valid: false, error: error.message });
    }
});

// URL Shortener (mock implementation)
const urlDatabase = new Map();
router.post('/shorten', (req, res) => {
    const { url } = req.body;
    
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    const shortId = Math.random().toString(36).substring(2, 8);
    urlDatabase.set(shortId, { url, clicks: 0, created: new Date() });

    res.json({ 
        original: url, 
        shortUrl: `http://localhost:3000/api/redirect/${shortId}`,
        shortId,
        analytics: `${shortId}/stats`
    });
});

router.get('/redirect/:id', (req, res) => {
    const { id } = req.params;
    const data = urlDatabase.get(id);
    
    if (data) {
        data.clicks++;
        res.redirect(data.url);
    } else {
        res.status(404).json({ error: 'Short URL not found' });
    }
});

module.exports = router;