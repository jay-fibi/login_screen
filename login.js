// ── World Clocks (US, UK, Russia, Japan, China) ───────────────────────────
(function () {
    // Each canvas reads its timezone from data-tz attribute
    const worldCanvases = document.querySelectorAll('#worldClocks canvas');

    // Per-clock hue offset so each has its own color phase
    const hueOffsets = [0, 72, 144, 216, 288];

    function drawWorldClock(canvas, hueBase) {
        const tz  = canvas.dataset.tz;
        const ctx = canvas.getContext('2d');
        const S   = canvas.width;
        const CX  = S / 2;
        const CY  = S / 2;
        const R   = CX - 3;

        // Get current time in target timezone
        const parts = new Intl.DateTimeFormat('en-US', {
            timeZone: tz,
            hour:   'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false
        }).formatToParts(new Date());

        const get = (type) => parseInt(parts.find(p => p.type === type)?.value || '0', 10);
        let h = get('hour') % 12;
        let m = get('minute');
        let s = get('second');

        // Add milliseconds for smooth sweep using local ms
        const ms  = new Date().getMilliseconds();
        const sec  = s + ms / 1000;
        const min  = m + sec / 60;
        const hour = h + min / 60;

        ctx.clearRect(0, 0, S, S);

        // Dial
        ctx.beginPath();
        ctx.arc(CX, CY, R, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${hueBase}, 75%, 12%)`;
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = `hsl(${hueBase}, 100%, 60%)`;
        ctx.stroke();

        // Tick marks
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
            const inner = i % 3 === 0 ? R - 8 : R - 5;
            ctx.beginPath();
            ctx.moveTo(CX + Math.cos(angle) * inner, CY + Math.sin(angle) * inner);
            ctx.lineTo(CX + Math.cos(angle) * (R - 2), CY + Math.sin(angle) * (R - 2));
            ctx.strokeStyle = `hsl(${(hueBase + i * 30) % 360}, 100%, 65%)`;
            ctx.lineWidth = i % 3 === 0 ? 1.5 : 1;
            ctx.stroke();
        }

        function drawHand(frac, len, width, color) {
            const angle = frac * Math.PI * 2 - Math.PI / 2;
            ctx.beginPath();
            ctx.moveTo(CX, CY);
            ctx.lineTo(CX + Math.cos(angle) * len, CY + Math.sin(angle) * len);
            ctx.strokeStyle = color;
            ctx.lineWidth   = width;
            ctx.lineCap     = 'round';
            ctx.stroke();
        }

        drawHand(hour / 12, R * 0.48, 2.5, `hsl(${(hueBase + 120) % 360}, 100%, 70%)`);
        drawHand(min  / 60, R * 0.68, 1.5, `hsl(${(hueBase + 200) % 360}, 100%, 75%)`);
        drawHand(sec  / 60, R * 0.78, 1,   `hsl(${(hueBase +  60) % 360}, 100%, 80%)`);

        ctx.beginPath();
        ctx.arc(CX, CY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${hueBase}, 100%, 80%)`;
        ctx.fill();
    }

    let worldHue = 0;

    function tickWorldClocks() {
        worldCanvases.forEach((canvas, i) => {
            drawWorldClock(canvas, (worldHue + hueOffsets[i]) % 360);
        });
        worldHue = (worldHue + 1) % 360;
    }

    setInterval(tickWorldClocks, 50);
    tickWorldClocks();
})();

// ── Weather Widget (Open-Meteo – no API key required) ────────────────────
(function () {
    const iconEl     = document.getElementById('weather-icon');
    const tempEl     = document.getElementById('weather-temp');
    const descEl     = document.getElementById('weather-desc');
    const locEl      = document.getElementById('weather-location');
    const humidEl    = document.getElementById('weather-humidity');
    const windEl     = document.getElementById('weather-wind');
    const statusEl   = document.getElementById('weather-status');

    // WMO Weather Interpretation Code → emoji + description
    const wmoMap = {
        0:  ['☀️',  'Clear sky'],
        1:  ['🌤',  'Mainly clear'],
        2:  ['⛅',  'Partly cloudy'],
        3:  ['☁️',  'Overcast'],
        45: ['🌫',  'Foggy'],
        48: ['🌫',  'Icy fog'],
        51: ['🌦',  'Light drizzle'],
        53: ['🌦',  'Drizzle'],
        55: ['🌧',  'Heavy drizzle'],
        61: ['🌧',  'Slight rain'],
        63: ['🌧',  'Moderate rain'],
        65: ['🌧',  'Heavy rain'],
        71: ['🌨',  'Slight snow'],
        73: ['🌨',  'Moderate snow'],
        75: ['❄️',  'Heavy snow'],
        80: ['🌦',  'Rain showers'],
        81: ['🌧',  'Heavy showers'],
        95: ['⛈',  'Thunderstorm'],
        96: ['⛈',  'Thunderstorm + hail'],
        99: ['⛈',  'Heavy thunderstorm']
    };

    function setError(msg) {
        iconEl.textContent  = '❓';
        tempEl.textContent  = '--°C';
        descEl.textContent  = '';
        statusEl.textContent = msg;
    }

    function fetchWeather(lat, lon) {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
            `&current_weather=true&hourly=relativehumidity_2m,windspeed_10m&timezone=auto&forecast_days=1`;

        fetch(url)
            .then(r => r.json())
            .then(data => {
                const cw      = data.current_weather;
                const code    = cw.weathercode;
                const [icon, desc] = wmoMap[code] || ['🌡', 'Unknown'];

                iconEl.textContent   = icon;
                tempEl.textContent   = `${Math.round(cw.temperature)}°C`;
                descEl.textContent   = desc;
                humidEl.textContent  = `💧 ${data.hourly.relativehumidity_2m[0]}%`;
                windEl.textContent   = `💨 ${Math.round(cw.windspeed)} km/h`;
                statusEl.textContent = '';
            })
            .catch(() => setError('Could not load weather'));
    }

    function reverseGeocode(lat, lon) {
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
            .then(r => r.json())
            .then(d => {
                const city = d.address.city || d.address.town || d.address.village || d.address.county || '';
                const country = d.address.country_code?.toUpperCase() || '';
                locEl.textContent = [city, country].filter(Boolean).join(', ');
            })
            .catch(() => { locEl.textContent = ''; });
    }

    if (navigator.geolocation) {
        statusEl.textContent = 'Locating…';
        iconEl.textContent   = '🔄';
        iconEl.classList.add('spin'); // spinning while fetching
        navigator.geolocation.getCurrentPosition(
            pos => {
                const { latitude: lat, longitude: lon } = pos.coords;
                iconEl.classList.remove('spin');
                fetchWeather(lat, lon);
                reverseGeocode(lat, lon);
            },
            () => {
                iconEl.classList.remove('spin');
                setError('Location denied');
            }
        );
    } else {
        setError('Geolocation unavailable');
    }
})();

// ── Currency Converter ────────────────────────────────────────────────────
(function () {
    // Static reference rates relative to USD (approximate)
    const rates = {
        USD: 1,
        EUR: 0.92,
        GBP: 0.79,
        JPY: 149.50,
        CNY: 7.24,
        RUB: 91.50,
        INR: 83.10,
        CAD: 1.36,
        AUD: 1.53,
        CHF: 0.90
    };

    const amountInput = document.getElementById('cc-amount');
    const fromSelect  = document.getElementById('cc-from');
    const toSelect    = document.getElementById('cc-to');
    const resultDiv   = document.getElementById('cc-result');
    const swapBtn     = document.getElementById('cc-swap-btn');

    function convert() {
        const amount = parseFloat(amountInput.value);
        if (isNaN(amount) || amount < 0) { resultDiv.textContent = '—'; return; }

        const from = fromSelect.value;
        const to   = toSelect.value;

        if (from === to) {
            resultDiv.textContent = `${amount.toFixed(2)} ${to}`;
            return;
        }

        // Convert via USD as base
        const inUSD  = amount / rates[from];
        const result = inUSD * rates[to];

        const formatted = result >= 1000
            ? result.toLocaleString('en-US', { maximumFractionDigits: 2 })
            : result.toFixed(4);

        resultDiv.textContent = `${formatted} ${to}`;
        // Pop animation on result change
        resultDiv.style.animation = 'none';
        void resultDiv.offsetWidth; // reflow to restart
        resultDiv.style.animation = 'resultPop 0.35s ease';
    }

    swapBtn.addEventListener('click', () => {
        const tmp = fromSelect.value;
        fromSelect.value = toSelect.value;
        toSelect.value   = tmp;
        convert();
    });

    amountInput.addEventListener('input', convert);
    fromSelect.addEventListener('change', convert);
    toSelect.addEventListener('change', convert);

    // Initial conversion
    convert();
})();

// ── Login Form ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const messageDiv = document.getElementById('message');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent actual form submission

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Simple mock authentication
        if (username === 'admin' && password === 'password123') {
            showMessage('Login successful! Redirecting...', 'success');
            // In a real app, you would redirect the user or set an auth token here
        } else {
            showMessage('Invalid username or password. Try admin / password123', 'error');
        }
    });

    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = type; // Applies the .success or .error CSS class
    }
});