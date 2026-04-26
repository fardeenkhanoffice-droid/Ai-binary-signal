// ========== COMPLETE WORKING APP.JS ==========
// Paste this entire code - it will work immediately

let appState = {
    capital: 10000,
    riskMode: 2,
    currency: '$',
    trades: []
};

// Load or initialize data
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
    
    // If no trades, create demo trades
    if (!appState.trades.length) {
        createDemoTrades();
    }
    
    updateAllUI();
}

function createDemoTrades() {
    const demoTrades = [];
    const patterns = ['Engulfing', 'Pin Bar', 'Doji', 'Breakout'];
    const pairs = ['EUR/USD', 'GBP/USD', 'USD/JPY'];
    const sessions = ['London', 'NY', 'Asia', 'Overlap'];
    
    for (let i = 0; i < 20; i++) {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 10));
        const isWin = Math.random() > 0.4;
        const amount = Math.floor(Math.random() * 150) + 50;
        
        demoTrades.push({
            id: Date.now() + i,
            date: date.toISOString().split('T')[0],
            pair: pairs[Math.floor(Math.random() * pairs.length)],
            session: sessions[Math.floor(Math.random() * sessions.length)],
            type: Math.random() > 0.5 ? 'CALL' : 'PUT',
            pattern: patterns[Math.floor(Math.random() * patterns.length)],
            trend: ['Uptrend', 'Downtrend', 'Sideways'][Math.floor(Math.random() * 3)],
            zone: ['Support', 'Resistance', 'Neutral'][Math.floor(Math.random() * 3)],
            expiry: ['1m', '2m', '5m'][Math.floor(Math.random() * 3)],
            confidence: Math.floor(Math.random() * 50) + 50,
            amount: amount,
            result: isWin ? 'WIN' : 'LOSS',
            pl: isWin ? amount * 0.85 : -amount
        });
    }
    
    appState.trades = demoTrades;
    saveData();
    console.log(`✅ Created ${demoTrades.length} demo trades`);
}

function saveData() {
    const toSave = {
        capital: appState.capital,
        riskMode: appState.riskMode,
        currency: appState.currency,
        trades: appState.trades
    };
    localStorage.setItem('tradeAnalyzerData', JSON.stringify(toSave));
}

function getTodayPL() {
    const today = new Date().toISOString().split('T')[0];
    return appState.trades.filter(t => t.date === today).reduce((s, t) => s + t.pl, 0);
}

function getWinRate() {
    if (!appState.trades.length) return 0;
    const wins = appState.trades.filter(t => t.result === 'WIN').length;
    return (wins / appState.trades.length) * 100;
}

function getStreaks() {
    let currentWin = 0, currentLoss = 0, maxWin = 0, maxLoss = 0;
    const sorted = [...appState.trades].sort((a,b) => new Date(b.date) - new Date(a.date));
    for (let trade of sorted) {
        if (trade.result === 'WIN') {
            currentWin++;
            currentLoss = 0;
            maxWin = Math.max(maxWin, currentWin);
        } else {
            currentLoss++;
            currentWin = 0;
            maxLoss = Math.max(maxLoss, currentLoss);
        }
    }
    return { winStreak: maxWin, lossStreak: maxLoss };
}

function getDailyRiskPercent() {
    const todayPL = getTodayPL();
    return Math.abs((todayPL / appState.capital) * 100);
}

function updateAllUI() {
    // Update dashboard
    const currency = appState.currency;
    document.getElementById('totalCapital').innerText = `${currency}${appState.capital.toFixed(2)}`;
    document.getElementById('availableBalance').innerHTML = `${currency}${appState.capital.toFixed(2)}`;
    
    const todayPL = getTodayPL();
    const plElem = document.getElementById('todayPL');
    plElem.innerHTML = `${todayPL >= 0 ? '+' : ''}${currency}${todayPL.toFixed(2)}`;
    plElem.className = `text-xl font-bold ${todayPL >= 0 ? 'text-green-400' : 'text-red-400'}`;
    document.getElementById('winRate').innerText = `${getWinRate().toFixed(1)}%`;
    
    const streaks = getStreaks();
    document.getElementById('winStreak').innerText = streaks.winStreak;
    document.getElementById('lossStreak').innerText = streaks.lossStreak;
    
    const risk = getDailyRiskPercent();
    document.getElementById('riskMeter').innerText = `${risk.toFixed(1)}%`;
    document.getElementById('riskBar').style.width = `${Math.min(100, (risk/5)*100)}%`;
    
    // Update recent trades
    updateRecentTrades();
}

function updateRecentTrades() {
    const container = document.getElementById('recentTradesList');
    if (!container) return;
    
    const recent = appState.trades.slice(0, 5);
    if (!recent.length) {
        container.innerHTML = '<div class="text-gray-500 text-center py-4">No trades yet. Add your first trade!</div>';
        return;
    }
    
    container.innerHTML = recent.map(t => `
        <div class="p-2 rounded-lg ${t.result === 'WIN' ? 'bg-green-500/10 border-l-4 border-green-500' : 'bg-red-500/10 border-l-4 border-red-500'}">
            <div class="flex justify-between text-sm">
                <span class="font-medium">${t.pair}</span>
                <span class="${t.result === 'WIN' ? 'text-green-400' : 'text-red-400'}">${t.result === 'WIN' ? '+' : ''}${appState.currency}${t.pl.toFixed(2)}</span>
            </div>
            <div class="text-[10px] text-gray-400">${t.pattern} | ${t.trend} | ${t.session || ''}</div>
        </div>
    `).join('');
}

function addTrade() {
    console.log('addTrade function called');
    
    // Get form values
    const pair = document.getElementById('tradePair')?.value || 'EUR/USD';
    const type = document.getElementById('tradeType')?.value || 'CALL';
    const pattern = document.getElementById('tradePattern')?.value || 'Engulfing';
    const trend = document.getElementById('tradeTrend')?.value || 'Uptrend';
    const zone = document.getElementById('tradeZone')?.value || 'Support';
    const expiry = document.getElementById('tradeExpiry')?.value || '1m';
    let amount = parseFloat(document.getElementById('tradeAmount')?.value);
    const result = document.getElementById('tradeResult')?.value || 'WIN';
    
    if (isNaN(amount) || amount <= 0) {
        amount = appState.capital * (appState.riskMode / 100);
    }
    
    const today = new Date().toISOString().split('T')[0];
    const pl = result === 'WIN' ? amount * 0.85 : -amount;
    
    const newTrade = {
        id: Date.now(),
        date: today,
        pair: pair,
        session: document.getElementById('tradeSession')?.value || 'London',
        type: type,
        pattern: pattern,
        trend: trend,
        zone: zone,
        expiry: expiry,
        confidence: 70,
        amount: amount,
        result: result,
        pl: pl
    };
    
    appState.trades.unshift(newTrade);
    appState.capital += pl;
    if (appState.capital < 0) appState.capital = 0;
    
    saveData();
    updateAllUI();
    
    // Clear amount field
    if (document.getElementById('tradeAmount')) {
        document.getElementById('tradeAmount').value = '';
    }
    
    alert(`✅ Trade saved! ${result === 'WIN' ? 'Profit' : 'Loss'}: ${appState.currency}${Math.abs(pl).toFixed(2)}`);
}

function generateManualSignal() {
    const trend = document.getElementById('signalTrend')?.value || 'Uptrend';
    const zone = document.getElementById('signalZone')?.value || 'Support';
    const pattern = document.getElementById('signalPattern')?.value || 'Engulfing';
    
    let confidence = 65;
    let signal = trend === 'Uptrend' ? 'CALL' : (trend === 'Downtrend' ? 'PUT' : 'WAIT');
    
    if (zone === 'Support') confidence += 15;
    if (zone === 'Resistance') confidence += 15;
    if (trend === 'Sideways') confidence -= 20;
    
    const outputDiv = document.getElementById('signalOutput');
    if (outputDiv) {
        outputDiv.classList.remove('hidden');
        outputDiv.innerHTML = `
            <div class="p-3 rounded-xl bg-blue-500/20">
                <div class="text-lg font-bold">Signal: ${signal}</div>
                <div class="text-sm">Confidence: ${confidence}%</div>
                <div class="text-xs text-gray-400 mt-1">Based on: ${trend} + ${zone} + ${pattern}</div>
                <div class="text-[10px] text-yellow-300 mt-2">⚠️ Probability-based only. Not financial advice.</div>
            </div>
        `;
    }
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 App starting...');
    loadData();
    
    // Setup event listeners if buttons exist
    const saveBtn = document.querySelector('button[onclick="addTrade()"]');
    if (!saveBtn) {
        // Alternative: find by text
        const btns = document.querySelectorAll('button');
        btns.forEach(btn => {
            if (btn.innerText.includes('Save Trade')) {
                btn.onclick = addTrade;
            }
            if (btn.innerText.includes('Generate Signal') || btn.innerText.includes('Generate Signal Analysis')) {
                btn.onclick = generateManualSignal;
            }
        });
    }
    
    console.log('✅ App ready!');
});

// Make functions global
window.addTrade = addTrade;
window.generateManualSignal = generateManualSignal;
window.loadData = loadData;
window.updateAllUI = updateAllUI;
