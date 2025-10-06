class APIInteractions {
    constructor() {
        this.currentUtility = null;
        this.initEventListeners();
    }

    initEventListeners() {
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', this.toggleTheme);
        
        // Card hover effects
        document.querySelectorAll('.utility-card').forEach(card => {
            card.addEventListener('mouseenter', this.onCardHover);
            card.addEventListener('mouseleave', this.onCardLeave);
        });
    }

    toggleTheme() {
        document.body.classList.toggle('matrix-theme');
        this.textContent = document.body.classList.contains('matrix-theme') 
            ? '🌞 Normal Mode' 
            : '🌙 Matrix Mode';
    }

    onCardHover(e) {
        const card = e.currentTarget;
        card.style.transform = 'translateY(-15px) scale(1.03)';
    }

    onCardLeave(e) {
        const card = e.currentTarget;
        card.style.transform = 'translateY(0) scale(1)';
    }
}

// Global function to load utilities
async function loadUtility(endpoint, index) {
    try {
        const response = await fetch(endpoint);
        const data = await response.json();
        
        displayOutput(data, endpoint);
        updateCardContent(data, index, endpoint);
        
    } catch (error) {
        displayOutput({ error: 'Failed to fetch data' }, endpoint);
    }
}

function displayOutput(data, endpoint) {
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

function updateCardContent(data, index, endpoint) {
    const contentDiv = document.getElementById(`content-${index}`);
    
    let contentHTML = '';
    switch(endpoint) {
        case '/api/uuid':
            contentHTML = `<div class="uuid-list">${data.uuids.map(uuid => 
                `<div class="uuid-item">${uuid}</div>`
            ).join('')}</div>`;
            break;
            
        case '/api/password':
            contentHTML = `
                <div class="password-result">
                    <div class="password-display">${data.password}</div>
                    <div class="password-strength ${data.strength.toLowerCase().replace(' ', '-')}">
                        Strength: ${data.strength}
                    </div>
                </div>
            `;
            break;
            
        case '/api/time':
            contentHTML = `
                <div class="time-display">
                    <div>Unix: ${data.unix}</div>
                    <div>UTC: ${data.utc}</div>
                </div>
            `;
            break;
            
        default:
            contentHTML = `<pre class="data-preview">${JSON.stringify(data, null, 2).substring(0, 100)}...</pre>`;
    }
    
    contentDiv.innerHTML = contentHTML;
}

function clearOutput() {
    document.getElementById('outputContent').innerHTML = 
        '<div class="welcome-message">💫 Output cleared. Select a utility to begin...</div>';
}

// Interactive forms for specific utilities
function showHashForm() {
    const contentDiv = document.querySelector('[data-endpoint="/api/hash"] .card-content');
    contentDiv.innerHTML = `
        <form onsubmit="generateHash(event)">
            <input type="text" name="text" placeholder="Enter text to hash" required>
            <select name="algorithm">
                <option value="md5">MD5</option>
                <option value="sha256">SHA-256</option>
                <option value="sha512">SHA-512</option>
                <option value="bcrypt">BCrypt</option>
            </select>
            <button type="submit">Generate Hash</button>
        </form>
    `;
}

async function generateHash(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
        text: formData.get('text'),
        algorithm: formData.get('algorithm')
    };
    
    try {
        const response = await fetch('/api/hash', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        displayOutput(result, '/api/hash');
    } catch (error) {
        displayOutput({ error: 'Hash generation failed' }, '/api/hash');
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    new APIInteractions();
});