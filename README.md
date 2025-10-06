Dev Utility API Hub

A futuristic developer utilities dashboard with a stunning 3D holographic interface. It offers multiple developer tools through REST APIs and an interactive web dashboard.








Features
Developer Utilities

UUID Generator: Generate random UUIDs (v4)

Hash Generator: Create MD5, SHA1, SHA256, and SHA512 hashes

Base64 Tools: Encode/decode text to/from Base64

QR Code Generator: Generate QR codes from text/URLs

URL Shortener: Create short URLs with analytics

Time Converter: Convert between timestamp formats

Password Generator: Generate strong random passwords

JSON Tools: Format, validate, and minify JSON

Unique Interface

3D Holographic Background with floating geometric shapes

Glass Morphism design with glow effects

Real-time mouse interaction

Matrix Theme toggle for cyberpunk aesthetics

Smooth animations and responsive layout

Quick Start
Prerequisites

Node.js 16.x or higher

npm or yarn

Installation
git clone <repository-url>
cd dev-utility-hub
npm install

Start the Server
# Production
npm start

# Development
npm run dev


Then open your browser at:

http://localhost:3000

API Documentation

Base URL:

http://localhost:3000/api

UUID Generator

GET /api/uuid
Parameters:

count (optional): Number of UUIDs to generate (default: 1)

Example:

curl "http://localhost:3000/api/uuid?count=3"

Hash Generator

POST /api/hash
Body:

{
  "text": "hello world",
  "algorithm": "sha256"
}


Supported algorithms: md5, sha1, sha256, sha512

Base64 Tools

POST /api/base64
Body:

{
  "action": "encode",
  "text": "Hello World"
}


Actions: encode, decode

QR Code Generator

GET /api/qrcode
Parameters:

text: Text to encode

size (optional): Size in pixels (default: 200)

Example:

http://localhost:3000/api/qrcode?text=Hello%20World&size=250

URL Shortener

POST /api/shorten

{
  "url": "https://example.com"
}


Access Short URL:
GET /api/redirect/:shortId

View Analytics:
GET /api/stats/:shortId

Time Converter

GET /api/time
Response:

{
  "unix": 1705318200,
  "iso": "2024-01-15T10:30:00.000Z",
  "utc": "Mon, 15 Jan 2024 10:30:00 GMT",
  "local": "Mon Jan 15 2024 15:30:00 GMT+0500",
  "formatted": "1/15/2024, 3:30:00 PM"
}

Password Generator

GET /api/password
Parameters:

length (optional): Password length (default: 12)

Example:

curl "http://localhost:3000/api/password?length=16"

JSON Tools

POST /api/json
Body:

{
  "action": "format",
  "json": "{\"name\":\"John\",\"age\":30}"
}


Actions: format, validate, minify

Using the Web Interface
Interactive Features

Hover effects with glow animations

Mouse-controlled 3D background

Matrix theme toggle

Copy-to-clipboard functionality

Real-time API output display

Utility Cards

Each utility represented as a card

Click to activate and input data

Instant result display

Technology Stack

Backend: Node.js, Express.js

Template Engine: EJS

Frontend: Vanilla JavaScript, Three.js

Styling: CSS3 (Glass Morphism + 3D Effects)

API Type: RESTful JSON APIs
