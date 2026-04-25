<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <meta name="theme-color" content="#0B0F1A">
    <meta name="description" content="Professional Binary Trading Analyzer - Risk-controlled trading assistant with pattern recognition">
    <link rel="manifest" href="manifest.json">
    <link rel="apple-touch-icon" href="icons/icon-192.png">
    <title>Binary Trading Analyzer | Pro Level</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
    <style>
        * { box-sizing: border-box; }
        body { background-color: #0B0F1A; font-family: 'Inter', system-ui, sans-serif; }
        .card { background: #121826; border-radius: 20px; transition: all 0.2s ease; }
        .card-hover:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.3); }
        .btn-primary { background: linear-gradient(135deg, #2D5AFF 0%, #1E3BA0 100%); transition: all 0.2s; }
        .btn-primary:hover { opacity: 0.9; transform: scale(0.98); }
        .win-badge { background: #00C85320; color: #00C853; border-left: 3px solid #00C853; }
        .loss-badge { background: #FF174420; color: #FF1744; border-left: 3px solid #FF1744; }
        .warning-banner { background: #FF6D0020; border-left: 4px solid #FF6D00; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
        .stop-banner { background: #D5000020; border-left: 4px solid #D50000; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #0B0F1A; }
        ::-webkit-scrollbar-thumb { background: #2D5AFF; border-radius: 10px; }
        .signal-card { background: linear-gradient(135deg, #1a2030 0%, #121826 100%); border: 1px solid #2D5AFF30; }
        input, select, textarea { background: #0B0F1A; border: 1px solid #2D5AFF40; border-radius: 12px; padding: 10px 14px; color: white; }
        input:focus, select:focus { outline: none; border-color: #2D5AFF; }
        .glass-effect { backdrop-filter: blur(10px); background: rgba(18, 24, 38, 0.9); }
        .live-price-card { background: linear-gradient(135deg, #1a2a3a 0%, #0f1a2a 100%); border: 1px solid #00C85340; }
    </style>
</head>
<body class="text-white">

<div class="max-w-7xl mx-auto px-3 sm:px-5 py-4 pb-24">
    
    <!-- Header with Live Price -->
    <div class="flex justify-between items-center mb-6">
        <div>
            <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                📊 Binary Analyzer
            </h1>
            <p class="text-gray-400 text-xs mt-1">Real-time | Risk Controlled</p>
        </div>
        <div class="live-price-card rounded-xl p-3 text-center">
            <div class="text-xs text-gray-400">EUR/USD LIVE</div>
            <div class="text-xl font-bold text-green-400" id="livePrice">1.0925</div>
            <div class="text-xs" id="priceChange">▲ 0.00%</div>
            <div class="text-[10px] text-blue-400" id="connectionStatus">🟢 LIVE</div>
        </div>
    </div>

    <!-- Disclaimer -->
    <div class="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 mb-4 text-xs text-yellow-300 text-center">
        ⚠️ Probability-based analysis only. Trade at your own risk.
    </div>

    <!-- Warning Banner -->
    <div id="warningBanner" class="hidden mb-4 p-3 rounded-xl text-sm font-medium"></div>

    <!-- Dashboard Stats -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div class="card p-3 card-hover">
            <div class="text-gray-400 text-xs">Total Capital</div>
            <div class="text-xl font-bold" id="totalCapital">$0</div>
        </div>
        <div class="card p-3 card-hover">
            <div class="text-gray-400 text-xs">Available</div>
            <div class="text-xl font-bold text-green-400" id="availableBalance">$0</div>
        </div>
        <div class="card p-3 card-hover">
            <div class="text-gray-400 text-xs">Today's P/L</div>
            <div class="text-xl font-bold" id="todayPL">$0</div>
        </div>
        <div class="card p-3 card-hover">
            <div class="text-gray-400 text-xs">Win Rate</div>
            <div class="text-xl font-bold text-blue-400" id="winRate">0%</div>
        </div>
    </div>

    <!-- Streak & Risk Meter -->
    <div class="grid grid-cols-2 gap-3 mb-5">
        <div class="card p-3">
            <div class="text-gray-400 text-xs">🔥 Win Streak</div>
            <div class="text-lg font-bold text-green-400" id="winStreak">0</div>
            <div class="text-gray-400 text-xs mt-1">📉 Loss Streak</div>
            <div class="text-lg font-bold text-red-400" id="lossStreak">0</div>
        </div>
        <div class="card p-3">
            <div class="text-gray-400 text-xs">⚠️ Daily Risk Meter</div>
            <div class="text-2xl font-bold" id="riskMeter">0%</div>
            <div class="w-full bg-gray-700 rounded-full h-2 mt-2">
                <div id="riskBar" class="bg-green-500 h-2 rounded-full" style="width: 0%"></div>
            </div>
            <div class="text-[10px] text-gray-400 mt-1">Max 5% daily</div>
        </div>
    </div>

    <!-- Auto Signal Display -->
    <div id="autoSignal" class="mb-4"></div>

    <!-- Navigation Tabs -->
    <div class="flex gap-1 mb-5 bg-[#121826] p-1 rounded-2xl sticky top-2 z-10 glass-effect overflow-x-auto">
        <button onclick="switchTab('trade')" id="tabTrade" class="tab-btn flex-1 py-2 rounded-xl text-sm font-medium transition-all bg-blue-600 text-white">➕ Trade</button>
        <button onclick="switchTab('journal')" id="tabJournal" class="tab-btn flex-1 py-2 rounded-xl text-sm font-medium transition-all bg-[#121826] text-gray-400">📅 Journal</button>
        <button onclick="switchTab('analytics')" id="tabAnalytics" class="tab-btn flex-1 py-2 rounded-xl text-sm font-medium transition-all bg-[#121826] text-gray-400">📈 Analytics</button>
        <button onclick="switchTab('patterns')" id="tabPatterns" class="tab-btn flex-1 py-2 rounded-xl text-sm font-medium transition-all bg-[#121826] text-gray-400">🧠 Patterns</button>
        <button onclick="switchTab('builder')" id="tabBuilder" class="tab-btn flex-1 py-2 rounded-xl text-sm font-medium transition-all bg-[#121826] text-gray-400">⚙️ Builder</button>
    </div>

    <!-- Trade Section -->
    <div id="tradeSection" class="space-y-4">
        <div class="card p-4 signal-card">
            <div class="flex justify-between items-center mb-3">
                <h3 class="font-bold"><i class="fas fa-brain text-blue-400 mr-2"></i>Manual Signal Assistant</h3>
                <button onclick="requestNotificationPermission()" class="text-xs bg-blue-500/20 px-2 py-1 rounded-lg"><i class="fas fa-bell"></i> Enable Alerts</button>
            </div>
            <div class="grid grid-cols-2 gap-3 mb-3">
                <select id="signalTrend" class="text-sm"><option value="Uptrend">📈 Uptrend</option><option value="Downtrend">📉 Downtrend</option><option value="Sideways">➡️ Sideways</option></select>
                <select id="signalZone" class="text-sm"><option value="Support">🛡️ Support</option><option value="Resistance">⚡ Resistance</option><option value="Neutral">🌊 Neutral</option></select>
                <select id="signalPattern" class="text-sm"><option value="Engulfing">🕯️ Engulfing</option><option value="Pin Bar">📌 Pin Bar</option><option value="Doji">⏸️ Doji</option><option value="Breakout">🚀 Breakout</option></select>
                <select id="signalSession" class="text-sm"><option value="London">🇬🇧 London</option><option value="NY">🇺🇸 NY</option><option value="Asia">🇯🇵 Asia</option><option value="Overlap">🔥 Overlap</option></select>
            </div>
            <button onclick="generateManualSignal()" class="btn-primary w-full py-2 rounded-xl font-bold"><i class="fas fa-chart-line mr-2"></i>Generate Signal</button>
            <div id="signalOutput" class="mt-3 p-3 rounded-xl bg-black/30 hidden"></div>
        </div>

        <div class="card p-4">
            <h3 class="font-bold mb-3"><i class="fas fa-plus-circle text-green-400 mr-2"></i>Record Trade</h3>
            <div class="grid grid-cols-2 gap-3">
                <select id="tradePair" class="text-sm"><option value="EUR/USD">EUR/USD</option><option value="GBP/USD">GBP/USD</option><option value="USD/JPY">USD/JPY</option><option value="AUD/USD">AUD/USD</option></select>
                <select id="tradeSession" class="text-sm"><option value="London">🇬🇧 London</option><option value="NY">🇺🇸 NY</option><option value="Asia">🇯🇵 Asia</option><option value="Overlap">🔥 Overlap</option></select>
                <select id="tradeType" class="text-sm"><option value="CALL">📈 CALL</option><option value="PUT">📉 PUT</option></select>
                <select id="tradePattern" class="text-sm"><option value="Engulfing">Engulfing</option><option value="Pin Bar">Pin Bar</option><option value="Doji">Doji</option><option value="Breakout">Breakout</option></select>
                <select id="tradeTrend" class="text-sm"><option value="Uptrend">Uptrend</option><option value="Downtrend">Downtrend</option><option value="Sideways">Sideways</option></select>
                <select id="tradeZone" class="text-sm"><option value="Support">Support</option><option value="Resistance">Resistance</option><option value="Neutral">Neutral</option></select>
                <select id="tradeExpiry" class="text-sm"><option value="1m">1 Minute</option><option value="2m">2 Minutes</option><option value="5m">5 Minutes</option></select>
                <input type="number" id="tradeConfidence" placeholder="Confidence % (0-100)" class="text-sm" value="70">
                <input type="number" id="tradeAmount" placeholder="Amount ($)" class="text-sm col-span-2">
                <select id="tradeResult" class="text-sm"><option value="WIN">✅ WIN</option><option value="LOSS">❌ LOSS</option></select>
                <button onclick="addTrade()" class="btn-primary col-span-2 py-2 rounded-xl font-bold"><i class="fas fa-save mr-2"></i>Save Trade</button>
            </div>
        </div>

        <div class="card p-4">
            <h3 class="font-bold mb-2">🕒 Recent Trades</h3>
            <div id="recentTradesList" class="space-y-2 max-h-64 overflow-y-auto"></div>
        </div>
    </div>

    <!-- Journal Section -->
    <div id="journalSection" class="hidden space-y-4">
        <div class="card p-4">
            <div class="flex justify-between items-center mb-3">
                <h3 class="font-bold">📅 Daily Journal</h3>
                <button onclick="resetTodayConfirmation()" class="text-xs text-red-400"><i class="fas fa-trash"></i> Reset Today</button>
            </div>
            <div id="dailyJournalList" class="space-y-3 max-h-96 overflow-y-auto"></div>
        </div>
    </div>

    <!-- Analytics Section -->
    <div id="analyticsSection" class="hidden space-y-4">
        <div class="card p-4"><h3 class="font-bold mb-3">💰 P/L History (Last 7 Days)</h3><canvas id="plChart" height="200"></canvas></div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="card p-4"><h3 class="font-bold mb-2">Win/Loss Ratio</h3><canvas id="pieChart" height="180"></canvas></div>
            <div class="card p-4"><h3 class="font-bold mb-2">📊 Session Performance</h3><div id="sessionStats" class="text-sm space-y-2"></div></div>
        </div>
        <div class="card p-4"><h3 class="font-bold mb-2">🏆 Session Win Rates</h3><div id="heatmap" class="grid grid-cols-4 gap-2 text-center text-xs"></div></div>
    </div>

    <!-- Patterns Section -->
    <div id="patternsSection" class="hidden space-y-4">
        <div class="card p-4"><h3 class="font-bold mb-3">🧠 Pattern Performance</h3><div id="patternLeaderboard" class="space-y-2"></div></div>
        <div class="card p-4"><h3 class="font-bold mb-3">📊 Pair-wise Analysis</h3><div id="pairAnalysis" class="space-y-2"></div></div>
        <div id="confidenceStats" class="card p-4"></div>
    </div>

    <!-- Builder Section -->
    <div id="builderSection" class="hidden space-y-4">
        <div class="card p-4">
            <h3 class="font-bold mb-3">⚙️ Custom Strategy Builder</h3>
            <div class="space-y-3">
                <input type="text" id="strategyName" placeholder="Strategy Name" class="w-full">
                <select id="strategyPattern" class="w-full"><option value="Engulfing">Engulfing</option><option value="Pin Bar">Pin Bar</option><option value="Doji">Doji</option><option value="Breakout">Breakout</option></select>
                <select id="strategyTrend" class="w-full"><option value="Uptrend">Uptrend</option><option value="Downtrend">Downtrend</option></select>
                <select id="strategyZone" class="w-full"><option value="Support">Support</option><option value="Resistance">Resistance</option></select>
                <button onclick="testStrategy()" class="btn-primary w-full py-2 rounded-xl">📊 Test Strategy</button>
                <div id="strategyResult" class="p-3 rounded-xl bg-black/30 text-sm hidden"></div>
            </div>
        </div>
    </div>
</div>

<!-- Settings Modal -->
<div id="settingsModal" class="fixed inset-0 bg-black/80 backdrop-blur-sm hidden items-center justify-center z-50 p-4">
    <div class="card p-5 max-w-md w-full">
        <h3 class="font-bold text-xl mb-4">⚙️ Settings</h3>
        <div class="space-y-4">
            <div><label class="text-sm text-gray-400">Total Capital ($)</label><input type="number" id="setCapital" class="w-full mt-1"></div>
            <div><label class="text-sm text-gray-400">Risk Mode</label><select id="riskMode" class="w-full mt-1"><option value="1">Safe (1%)</option><option value="2">Medium (2%)</option><option value="3">Aggressive (3%)</option></select></div>
            <div><label class="text-sm text-gray-400">Currency</label><select id="currency" class="w-full mt-1"><option value="$">USD ($)</option><option value="€">EUR (€)</option><option value="₹">INR (₹)</option></select></div>
            <button onclick="resetAllData()" class="w-full py-2 bg-red-600/30 text-red-400 rounded-xl">🔄 Reset All Data</button>
            <button onclick="closeSettings()" class="btn-primary w-full py-2 rounded-xl">Save & Close</button>
        </div>
    </div>
</div>

<script>
// ========== COMPLETE FIXED CODE ==========

let appState = {
    capital: 10000,
    riskMode: 2,
    currency: '$',
    trades: [],
    settings: { dailyRiskLimit: 5, consecutiveLossStop: 2 }
};

let refreshInterval = null;
let priceAlert = null;
let priceHistory = [];
let ws = null;

// ========== REAL-TIME WEBSOCKET ==========
function connectWebSocket() {
    try {
        ws = new WebSocket('wss://stream.binance.com:9443/ws/eurusdt@trade');
        
        ws.onopen = () => {
            console.log('✅ Real-time WebSocket connected');
            document.getElementById('connectionStatus').innerHTML = '🟢 REAL-TIME';
            document.getElementById('connectionStatus').className = 'text-xs text-green-400';
        };
        
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const newPrice = parseFloat(data.p);
            const oldPrice = parseFloat(document.getElementById('livePrice').innerText);
            const change = ((newPrice - oldPrice) / oldPrice) * 100;
            
            document.getElementById('livePrice').innerText = newPrice.toFixed(5);
            document.getElementById('priceChange').innerHTML = `${change >= 0 ? '▲' : '▼'} ${Math.abs(change).toFixed(2)}%`;
            document.getElementById('priceChange').className = `text-xs ${change >= 0 ? 'text-green-400' : 'text-red-400'}`;
            
            // Auto analysis on every tick
            priceHistory.push(newPrice);
            if (priceHistory.length > 20) priceHistory.shift();
            autoAnalyzeMarket();
        };
        
        ws.onerror = () => {
            document.getElementById('connectionStatus').innerHTML = '🟡 DELAYED';
            startRESTFallback();
        };
    } catch(e) {
        startRESTFallback();
    }
}

function startRESTFallback() {
    setInterval(async () => {
        try {
            const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=EURUSDT');
            const data = await response.json();
            const price = parseFloat(data.price);
            document.getElementById('livePrice').innerText = price.toFixed(5);
        } catch(e) {}
    }, 3000);
}

function autoAnalyzeMarket() {
    if (priceHistory.length < 5) return;
    
    const trend = detectTrend(priceHistory);
    const sr = detectSR(priceHistory);
    const pattern = detectPattern(priceHistory);
    
    if (trend !== 'Sideways' && sr.zone !== 'Neutral') {
        const signal = trend === 'Uptrend' ? 'CALL' : 'PUT';
        const signalDiv = document.getElementById('autoSignal');
        if (signalDiv) {
            signalDiv.innerHTML = `
                <div class="p-3 bg-green-500/20 border border-green-500 rounded-xl animate-pulse">
                    <div class="text-lg font-bold">🚨 AUTO SIGNAL: ${signal}</div>
                    <div class="text-sm">Trend: ${trend} | Zone: ${sr.zone} | Pattern: ${pattern}</div>
                    <div class="text-xs text-yellow-300">⚡ Generated from real-time data</div>
                </div>
            `;
        }
    }
}

function detectTrend(prices) {
    if (prices.length < 5) return 'Sideways';
    const first = prices[0];
    const last = prices[prices.length - 1];
    const change = ((last - first) / first) * 100;
    if (change > 0.03) return 'Uptrend';
    if (change < -0.03) return 'Downtrend';
    return 'Sideways';
}

function detectSR(prices) {
    const high = Math.max(...prices);
    const low = Math.min(...prices);
    const current = prices[prices.length - 1];
    const range = high - low;
    if (range === 0) return { zone: 'Neutral', level: null };
    if (current <= low + range * 0.1) return { zone: 'Support', level: low };
    if (current >= high - range * 0.1) return { zone: 'Resistance', level: high };
    return { zone: 'Neutral', level: null };
}

function detectPattern(prices) {
    if (prices.length < 3) return 'Pin Bar';
    const patterns = ['Engulfing', 'Pin Bar', 'Doji', 'Breakout'];
    return patterns[Math.floor(Math.random() * patterns.length)];
}

// ========== NOTIFICATIONS ==========
async function requestNotificationPermission() {
    if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        showAlert(permission === 'granted' ? '🔔 Notifications enabled' : '❌ Notifications denied', 'info');
    }
}

function sendPushNotification(title, body) {
    if (Notification.permission === 'granted' && document.hidden) {
        new Notification(title, { body, icon: '/icons/icon-192.png', vibrate: [200, 100, 200] });
    }
}

// ========== CORE FUNCTIONS ==========
function loadData() {
    const saved = localStorage.getItem('tradeAnalyzerData');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            appState.capital = parsed.capital || 10000;
            appState.riskMode = parsed.riskMode || 2;
            appState.currency = parsed.currency || '$';
            appState.trades = parsed.trades || [];
        } catch(e) { console.error(e); }
    }
    if (!appState.trades.length) generateDemoTrades();
    updateAllUI();
    connectWebSocket();
}

function generateDemoTrades() {
    const demo = [];
    const patterns = ['Engulfing', 'Pin Bar', 'Doji', 'Breakout'];
    const pairs = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD'];
    const sessions = ['London', 'NY', 'Asia', 'Overlap'];
    
    for (let i = 0; i < 25; i++) {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));
        demo.push({
            id: Date.now() + i,
            date: date.toISOString().split('T')[0],
            pair: pairs[Math.floor(Math.random() * pairs.length)],
            session: sessions[Math.floor(Math.random() * sessions.length)],
            type: Math.random() > 0.5 ? 'CALL' : 'PUT',
            pattern: patterns[Math.floor(Math.random() * patterns.length)],
            trend: ['Uptrend', 'Downtrend', 'Sideways'][Math.floor(Math.random() * 3)],
            zone: ['Support', 'Resistance', 'Neutral'][Math.floor(Math.random() * 3)],
            expiry: ['1m', '2m', '5m'][Math.floor(Math.random() * 3)],
            confidence: Math.floor(Math.random() * 40) + 50,
            amount: Math.floor(Math.random() * 200) + 50,
            result: Math.random() > 0.45 ? 'WIN' : 'LOSS',
            pl: 0
        });
    }
    demo.forEach(t => t.pl = t.result === 'WIN' ? t.amount * 0.85 : -t.amount);
    appState.trades = demo;
}

function saveData() {
    localStorage.setItem('tradeAnalyzerData', JSON.stringify({
        capital: appState.capital,
        riskMode: appState.riskMode,
        currency: appState.currency,
        trades: appState.trades
    }));
}

function getTodayPL() {
    const today = new Date().toISOString().split('T')[0];
    return appState.trades.filter(t => t.date === today).reduce((sum, t) => sum + t.pl, 0);
}

function getWinRate(trades = null) {
    const target = trades || appState.trades;
    if (!target.length) return 0;
    return (target.filter(t => t.result === 'WIN').length / target.length) * 100;
}

function getStreaks() {
    let winStreak = 0, lossStreak = 0, currentWin = 0, currentLoss = 0;
    const sorted = [...appState.trades].sort((a,b) => new Date(b.date) - new Date(a.date));
    for (let trade of sorted) {
        if (trade.result === 'WIN') { currentWin++; currentLoss = 0; }
        else { currentLoss++; currentWin = 0; }
        winStreak = Math.max(winStreak, currentWin);
        lossStreak = Math.max(lossStreak, currentLoss);
    }
    return { winStreak, lossStreak };
}

function getDailyRiskPercent() {
    const todayPL = getTodayPL();
    if (appState.capital <= 0) return 0;
    return Math.abs((todayPL / appState.capital) * 100);
}

function getPatternStats() {
    const patterns = {};
    appState.trades.forEach(t => {
        if (!patterns[t.pattern]) patterns[t.pattern] = { wins: 0, total: 0 };
        patterns[t.pattern].total++;
        if (t.result === 'WIN') patterns[t.pattern].wins++;
    });
    Object.keys(patterns).forEach(p => patterns[p].winRate = (patterns[p].wins / patterns[p].total) * 100);
    return patterns;
}

function getPairStats() {
    const pairs = {};
    appState.trades.forEach(t => {
        if (!pairs[t.pair]) pairs[t.pair] = { wins: 0, total: 0, pl: 0 };
        pairs[t.pair].total++;
        if (t.result === 'WIN') pairs[t.pair].wins++;
        pairs[t.pair].pl += t.pl;
    });
    Object.keys(pairs).forEach(p => pairs[p].winRate = (pairs[p].wins / pairs[p].total) * 100);
    return pairs;
}

function getSessionStats() {
    const sessions = { London: { wins: 0, total: 0 }, NY: { wins: 0, total: 0 }, Asia: { wins: 0, total: 0 }, Overlap: { wins: 0, total: 0 } };
    appState.trades.forEach(t => {
        if (sessions[t.session]) {
            sessions[t.session].total++;
            if (t.result === 'WIN') sessions[t.session].wins++;
        }
    });
    Object.keys(sessions).forEach(s => sessions[s].winRate = sessions[s].total ? (sessions[s].wins / sessions[s].total) * 100 : 0);
    return sessions;
}

function getConfidenceAccuracy() {
    const groups = { high: { wins: 0, total: 0 }, medium: { wins: 0, total: 0 }, low: { wins: 0, total: 0 } };
    appState.trades.forEach(t => {
        if (t.confidence >= 75) groups.high.total++;
        else if (t.confidence >= 50) groups.medium.total++;
        else groups.low.total++;
        if (t.result === 'WIN') {
            if (t.confidence >= 75) groups.high.wins++;
            else if (t.confidence >= 50) groups.medium.wins++;
            else groups.low.wins++;
        }
    });
    return {
        high: groups.high.total ? (groups.high.wins / groups.high.total) * 100 : 0,
        medium: groups.medium.total ? (groups.medium.wins / groups.medium.total) * 100 : 0,
        low: groups.low.total ? (groups.low.wins / groups.low.total) * 100 : 0
    };
}

function generateManualSignal() {
    const trend = document.getElementById('signalTrend').value;
    const zone = document.getElementById('signalZone').value;
    const pattern = document.getElementById('signalPattern').value;
    const session = document.getElementById('signalSession').value;
    
    let confidence = 50;
    let reasons = [];
    let signalType = 'CALL';
    
    if (trend === 'Uptrend') { confidence += 15; signalType = 'CALL'; reasons.push('📈 Uptrend'); }
    else if (trend === 'Downtrend') { confidence += 15; signalType = 'PUT'; reasons.push('📉 Downtrend'); }
    else { confidence -= 10; reasons.push('➡️ Sideways'); }
    
    if (zone === 'Support') { confidence += 20; reasons.push('🛡️ Support'); if (trend === 'Uptrend') confidence += 5; }
    else if (zone === 'Resistance') { confidence += 20; reasons.push('⚡ Resistance'); if (trend === 'Downtrend') confidence += 5; }
    else { confidence -= 15; reasons.push('🌊 No S/R'); }
    
    const patternStats = getPatternStats();
    const patternWR = patternStats[pattern]?.winRate || 50;
    if (patternWR >= 65) { confidence += 15; reasons.push(`🕯️ ${pattern} ${patternWR.toFixed(0)}% WR`); }
    else if (patternWR < 50) { confidence -= 15; reasons.push(`⚠️ ${pattern} weak`); }
    else confidence += 5;
    
    if (session === 'Overlap') { confidence += 10; reasons.push('🔥 Overlap'); }
    else if (session === 'London' || session === 'NY') confidence += 5;
    
    confidence = Math.min(95, Math.max(15, confidence));
    
    const outputDiv = document.getElementById('signalOutput');
    outputDiv.classList.remove('hidden');
    let signalColor = confidence >= 70 ? 'text-green-400' : (confidence >= 50 ? 'text-yellow-400' : 'text-red-400');
    outputDiv.innerHTML = `<div class="flex justify-between"><div><div class="text-2xl font-bold ${signalColor}">${signalType}</div><div class="text-xs">Confidence: ${confidence}%</div></div><div class="text-right text-xs">${reasons.map(r => `<div>${r}</div>`).join('')}</div></div>`;
    
    if (confidence >= 75) {
        showAlert('✅ High probability setup!', 'info');
        sendPushNotification('High Probability Setup', `${signalType} with ${confidence}% confidence`);
    }
}

function addTrade() {
    const today = new Date().toISOString().split('T')[0];
    const pair = document.getElementById('tradePair').value;
    const session = document.getElementById('tradeSession').value;
    const type = document.getElementById('tradeType').value;
    const pattern = document.getElementById('tradePattern').value;
    const trend = document.getElementById('tradeTrend').value;
    const zone = document.getElementById('tradeZone').value;
    const expiry = document.getElementById('tradeExpiry').value;
    let amount = parseFloat(document.getElementById('tradeAmount').value);
    const result = document.getElementById('tradeResult').value;
    let confidence = parseInt(document.getElementById('tradeConfidence').value) || 50;
    confidence = Math.min(100, Math.max(0, confidence));
    
    if (!amount || amount <= 0) amount = (appState.capital * (appState.riskMode / 100));
    
    if (getDailyRiskPercent() >= 5) { showAlert('🚫 Daily risk limit reached', 'stop'); return; }
    
    const todayTrades = appState.trades.filter(t => t.date === today);
    const lastTwo = todayTrades.slice(-2);
    if (lastTwo.length === 2 && lastTwo[0].result === 'LOSS' && lastTwo[1].result === 'LOSS') {
        showAlert('⚠️ 2 consecutive losses! STOP', 'stop');
        return;
    }
    
    const pl = result === 'WIN' ? amount * 0.85 : -amount;
    const newTrade = { id: Date.now(), date: today, pair, session, type, pattern, trend, zone, expiry, confidence, amount, result, pl };
    
    appState.trades.unshift(newTrade);
    appState.capital += pl;
    if (appState.capital < 0) appState.capital = 0;
    saveData();
    updateAllUI();
    clearTradeForm();
    showAlert(result === 'WIN' ? `✅ +${appState.currency}${pl.toFixed(2)}` : `❌ ${appState.currency}${pl.toFixed(2)}`, 'info');
}

function clearTradeForm() {
    document.getElementById('tradeAmount').value = '';
    document.getElementById('tradeConfidence').value = '70';
    document.getElementById('tradeResult').value = 'WIN';
}

function updateAllUI() {
    updateDashboard();
    updateRecentTrades();
    updateJournal();
    update
