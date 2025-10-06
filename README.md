# Dev Utility API Hub

A futuristic developer utilities dashboard with a stunning 3D holographic interface, offering multiple developer tools through REST APIs and an interactive web dashboard.

![Interface](https://img.shields.io/badge/Interface-3D%2520Holographic-blueviolet)
![Node.js](https://img.shields.io/badge/Node.js-20.x-green)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey)
![Template](https://img.shields.io/badge/Template-EJS-orange)

---

## Overview

**Dev Utility API Hub** provides a collection of essential developer tools accessible through both APIs and a modern interactive interface.  
Its design combines **3D holographic visuals**, **glassmorphism**, and **cyberpunk matrix themes** to deliver a next-generation developer experience.

---

## Features

### Developer Utilities
- **UUID Generator** – Generate random UUIDs (v4)
- **Hash Generator** – Create MD5, SHA1, SHA256, and SHA512 hashes
- **Base64 Tools** – Encode/decode text to/from Base64
- **QR Code Generator** – Generate QR codes from text or URLs
- **URL Shortener** – Create short URLs with analytics
- **Time Converter** – Convert between multiple timestamp formats
- **Password Generator** – Generate strong, random passwords
- **JSON Tools** – Format, validate, and minify JSON data

### Interface Highlights
- 3D holographic background with floating geometric shapes
- Glass morphism design with glow effects
- Real-time mouse-based scene interaction
- Cyberpunk “Matrix Mode” toggle
- Smooth animations and hover transitions
- Fully responsive and mobile-friendly

---

## Quick Start

### Prerequisites
- Node.js 16.x or higher
- npm or yarn

### Installation
```bash
git clone <repository-url>
cd dev-utility-hub
npm install
Running the Server
bash
Copy code
# Production mode
npm start

# Development mode (auto reload)
npm run dev
Open your browser at:

arduino
Copy code
http://localhost:3000
API Documentation
Base URL:

bash
Copy code
http://localhost:3000/api
1. UUID Generator
GET /api/uuid
Parameters:

count (optional): Number of UUIDs to generate (default: 1)

Example:

bash
Copy code
curl "http://localhost:3000/api/uuid?count=3"
2. Hash Generator
POST /api/hash
Body:

json
Copy code
{
  "text": "hello world",
  "algorithm": "sha256"
}
Supported Algorithms: md5, sha1, sha256, sha512

Example:

bash
Copy code
curl -X POST http://localhost:3000/api/hash \
  -H "Content-Type: application/json" \
  -d '{"text":"hello world","algorithm":"sha256"}'
3. Base64 Tools
POST /api/base64
Body:

json
Copy code
{
  "action": "encode",
  "text": "Hello World"
}
Actions: encode, decode

4. QR Code Generator
GET /api/qrcode
Parameters:

text: Text to encode

size (optional): QR code size in pixels (default: 200)

Example:

bash
Copy code
http://localhost:3000/api/qrcode?text=Hello%20World&size=250
5. URL Shortener
POST /api/shorten
Body:

json
Copy code
{
  "url": "https://example.com"
}
Access Short URL:

nginx
Copy code
GET /api/redirect/:shortId
View Analytics:

bash
Copy code
GET /api/stats/:shortId
6. Time Converter
GET /api/time
Response:

json
Copy code
{
  "unix": 1705318200,
  "iso": "2024-01-15T10:30:00.000Z",
  "utc": "Mon, 15 Jan 2024 10:30:00 GMT",
  "local": "Mon Jan 15 2024 15:30:00 GMT+0500",
  "formatted": "1/15/2024, 3:30:00 PM"
}
7. Password Generator
GET /api/password
Parameters:

length (optional): Password length (default: 12)

Example:

bash
Copy code
curl "http://localhost:3000/api/password?length=16"
8. JSON Tools
POST /api/json
Body:

json
Copy code
{
  "action": "format",
  "json": "{\"name\":\"John\",\"age\":30}"
}
Actions: format, validate, minify

Using the Web Interface
Interactive Features
Cards glow and lift on hover

Mouse movement affects the 3D background

Matrix Mode toggle for cyberpunk visuals

Copy-to-clipboard for generated results

Real-time output panel for API responses

Utility Cards
Each utility is represented as a card

Click or activate to use

Input forms for data entry

Results displayed dynamically


Technology Stack
Backend: Node.js, Express.js

Template Engine: EJS

Frontend: Vanilla JavaScript, Three.js

Styling: CSS3 (Glass Morphism + 3D Effects)

API Type: RESTful JSON APIs

