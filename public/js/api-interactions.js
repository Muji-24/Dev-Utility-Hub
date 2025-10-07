// Simple API Interactions - Debug Version
class APIInteractions {
    constructor() {
        this.initEventListeners();
        console.log("API Interactions initialized");
    }

    initEventListeners() {
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', this.toggleTheme);
        
        // Card click events
        document.querySelectorAll('.utility-card').forEach(card => {
            const actionBtn = card.querySelector('.action-btn');
            if (actionBtn) {
                actionBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const endpoint = card.getAttribute('data-endpoint');
                    const cardId = Array.from(document.querySelectorAll('.utility-card')).indexOf(card);
                    this.handleUtilityClick(endpoint, cardId);
                });
            }
        });
    }

    toggleTheme() {
        document.body.classList.toggle('matrix-theme');
        this.textContent = document.body.classList.contains('matrix-theme') 
            ? '🌞 Normal Mode' 
            : '🌙 Matrix Mode';
    }

    async handleUtilityClick(endpoint, cardId) {
        console.log(`Clicked: ${endpoint}, Card: ${cardId}`);
        
        try {
            let result;
            
            switch(endpoint) {
                case '/api/uuid':
                    result = await this.fetchData(`${endpoint}?count=3`);
                    break;
                    
                case '/api/password':
                    const length = prompt('Password length?', '12');
                    result = await this.fetchData(`${endpoint}?length=${length || '12'}`);
                    break;
                    
                case '/api/time':
                    result = await this.fetchData(endpoint);
                    break;
                    
                case '/api/qrcode':
                    const qrText = prompt('Text for QR code:', 'Hello World!');
                    if (qrText) {
                        // Show QR code image directly
                        const qrUrl = `${endpoint}?text=${encodeURIComponent(qrText)}&size=150`;
                        result = {
                            qrImageUrl: qrUrl,
                            text: qrText,
                            note: 'QR code generated successfully'
                        };
                        this.displayOutput(result, endpoint);
                        this.showQRCode(cardId, qrUrl, qrText);
                        return;
                    }
                    return;
                    
                case '/api/hash':
                    this.showSimpleForm(cardId, endpoint, 'hash');
                    return;
                    
                case '/api/base64':
                    this.showSimpleForm(cardId, endpoint, 'base64');
                    return;
                    
                case '/api/shorten':
                    this.showSimpleForm(cardId, endpoint, 'url');
                    return;
                    
                case '/api/json':
                    this.showSimpleForm(cardId, endpoint, 'json');
                    return;
                    
                default:
                    result = await this.fetchData(endpoint);
            }
            
            this.displayOutput(result, endpoint);
            this.updateCardContent(result, cardId, endpoint);
            
        } catch (error) {
            console.error('Error:', error);
            this.displayOutput({ 
                error: 'Failed to fetch data',
                details: error.message,
                endpoint: endpoint
            }, endpoint);
        }
    }

    async fetchData(url) {
        console.log('Fetching:', url);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    }

    async postData(url, data) {
        console.log('POSTing to:', url, data);
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return await response.json();
    }

    showSimpleForm(cardId, endpoint, type) {
        const contentDiv = document.getElementById(`content-${cardId}`);
        
        let formHTML = '';
        
        switch(type) {
            case 'hash':
                formHTML = `
                    <div class="simple-form">
                        <h4>Generate Hash</h4>
                        <input type="text" id="hash-text-${cardId}" placeholder="Enter text" value="hello world" class="form-input">
                        <select id="hash-algo-${cardId}" class="form-select">
                            <option value="md5">MD5</option>
                            <option value="sha256" selected>SHA-256</option>
                            <option value="sha512">SHA-512</option>
                        </select>
                        <button onclick="apiInteractions.submitHash(${cardId})" class="action-btn">Generate</button>
                    </div>
                `;
                break;
                
            case 'base64':
                formHTML = `
                    <div class="simple-form">
                        <h4>Base64 Tools</h4>
                        <select id="base64-action-${cardId}" class="form-select">
                            <option value="encode">Encode</option>
                            <option value="decode">Decode</option>
                        </select>
                        <textarea id="base64-text-${cardId}" class="form-textarea" placeholder="Enter text">Hello World!</textarea>
                        <button onclick="apiInteractions.submitBase64(${cardId})" class="action-btn">Process</button>
                    </div>
                `;
                break;
                
            case 'url':
                formHTML = `
                    <div class="simple-form">
                        <h4>URL Shortener</h4>
                        <input type="url" id="url-input-${cardId}" placeholder="https://example.com" value="https://google.com" class="form-input">
                        <button onclick="apiInteractions.submitURL(${cardId})" class="action-btn">Shorten URL</button>
                    </div>
                `;
                break;
                
            case 'json':
                formHTML = `
                    <div class="simple-form">
                        <h4>JSON Tools</h4>
                        <select id="json-action-${cardId}" class="form-select">
                            <option value="format">Format</option>
                            <option value="validate">Validate</option>
                        </select>
                        <textarea id="json-input-${cardId}" class="form-textarea">{"name":"John","age":30,"city":"New York"}</textarea>
                        <button onclick="apiInteractions.submitJSON(${cardId})" class="action-btn">Process</button>
                    </div>
                `;
                break;
        }
        
        contentDiv.innerHTML = formHTML;
    }

    // Form submission methods
    async submitHash(cardId) {
        try {
            const text = document.getElementById(`hash-text-${cardId}`).value;
            const algorithm = document.getElementById(`hash-algo-${cardId}`).value;
            
            const result = await this.postData('/api/hash', { text, algorithm });
            this.displayOutput(result, '/api/hash');
            this.updateCardContent(result, cardId, '/api/hash');
        } catch (error) {
            this.displayOutput({ error: error.message }, '/api/hash');
        }
    }

    async submitBase64(cardId) {
        try {
            const action = document.getElementById(`base64-action-${cardId}`).value;
            const text = document.getElementById(`base64-text-${cardId}`).value;
            
            const result = await this.postData('/api/base64', { action, text });
            this.displayOutput(result, '/api/base64');
            this.updateCardContent(result, cardId, '/api/base64');
        } catch (error) {
            this.displayOutput({ error: error.message }, '/api/base64');
        }
    }

    async submitURL(cardId) {
        try {
            const url = document.getElementById(`url-input-${cardId}`).value;
            
            const result = await this.postData('/api/shorten', { url });
            this.displayOutput(result, '/api/shorten');
            this.updateCardContent(result, cardId, '/api/shorten');
        } catch (error) {
            this.displayOutput({ error: error.message }, '/api/shorten');
        }
    }

    async submitJSON(cardId) {
        try {
            const action = document.getElementById(`json-action-${cardId}`).value;
            const json = document.getElementById(`json-input-${cardId}`).value;
            
            const result = await this.postData('/api/json', { action, json });
            this.displayOutput(result, '/api/json');
            this.updateCardContent(result, cardId, '/api/json');
        } catch (error) {
            this.displayOutput({ error: error.message }, '/api/json');
        }
    }

    showQRCode(cardId, qrUrl, text) {
        const contentDiv = document.getElementById(`content-${cardId}`);
        contentDiv.innerHTML = `
            <div class="qr-result">
                <img src="${qrUrl}" alt="QR Code" style="max-width: 120px; border: 1px solid #fff; padding: 5px; background: white;">
                <div style="font-size: 0.8rem; margin-top: 0.5rem;">${text.substring(0, 20)}...</div>
            </div>
        `;
    }

    displayOutput(data, endpoint) {
        const outputContent = document.getElementById('outputContent');
        const timestamp = new Date().toLocaleTimeString();
        
        const outputHTML = `
            <div class="output-item">
                <div class="output-header">
                    <span class="endpoint">${endpoint}</span>
                    <span class="timestamp">${timestamp}</span>
                </div>
                <pre class="output-data">${JSON.stringify(data, null, 2)}</pre>
            </div>
        `;
        
        outputContent.innerHTML = outputHTML + outputContent.innerHTML;
    }

    updateCardContent(data, cardId, endpoint) {
        const contentDiv = document.getElementById(`content-${cardId}`);
        
        let contentHTML = '';
        
        switch(endpoint) {
            case '/api/uuid':
                contentHTML = `
                    <div class="uuid-list">
                        ${data.uuids.map(uuid => 
                            `<div class="uuid-item" onclick="navigator.clipboard.writeText('${uuid}')" title="Click to copy">${uuid}</div>`
                        ).join('')}
                    </div>
                `;
                break;
                
            case '/api/password':
                contentHTML = `
                    <div class="password-result">
                        <div class="password-display" onclick="navigator.clipboard.writeText('${data.password}')" title="Click to copy">
                            ${data.password}
                        </div>
                        <div class="password-strength ${data.strength.toLowerCase().replace(' ', '-')}">
                            ${data.strength}
                        </div>
                    </div>
                `;
                break;
                
            case '/api/time':
                contentHTML = `
                    <div class="time-display">
                        <div><strong>Unix:</strong> ${data.unix}</div>
                        <div><strong>Local:</strong> ${data.local.split(' ')[4]}</div>
                    </div>
                `;
                break;
                
            case '/api/hash':
                if (data.hashes) {
                    contentHTML = `
                        <div class="hash-result">
                            <div><strong>${Object.keys(data.hashes)[0]}:</strong></div>
                            <div style="font-size: 0.8rem; word-break: break-all;">${Object.values(data.hashes)[0]}</div>
                        </div>
                    `;
                }
                break;
                
            case '/api/base64':
                if (data.result) {
                    contentHTML = `
                        <div class="base64-result">
                            <div style="font-size: 0.8rem; word-break: break-all;">${data.result}</div>
                        </div>
                    `;
                }
                break;
                
            case '/api/shorten':
                if (data.shortUrl) {
                    contentHTML = `
                        <div class="url-result">
                            <div class="short-url" onclick="navigator.clipboard.writeText('${data.shortUrl}')" title="Click to copy">
                                ${data.shortId}
                            </div>
                            <div style="font-size: 0.7rem;">Short URL Created</div>
                        </div>
                    `;
                }
                break;
                
            default:
                contentHTML = `<pre style="font-size: 0.8rem;">${JSON.stringify(data, null, 2).substring(0, 100)}...</pre>`;
        }
        
        if (contentHTML) {
            contentDiv.innerHTML = contentHTML;
        }
    }
}

// Global functions
function clearOutput() {
    document.getElementById('outputContent').innerHTML = 
        '<div class="welcome-message">💫 Output cleared. Select a utility to begin...</div>';
}

// Initialize when page loads
let apiInteractions;
document.addEventListener('DOMContentLoaded', () => {
    apiInteractions = new APIInteractions();
    console.log("Dev Utility Hub loaded successfully!");
});