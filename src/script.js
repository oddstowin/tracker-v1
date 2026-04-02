/**
 * OddsMaster Logic
 */

const state = {
    activeFormat: 'decimal',
    odds: {
        decimal: '2.00',
        fractional: '1/1',
        american: '+100',
        implied: '50.00%'
    },
    stake: 100
};

// DOM Elements
const oddsInput = document.getElementById('oddsInput');
const stakeInput = document.getElementById('stakeInput');
const formatTabs = document.getElementById('formatTabs');
const resultsGrid = document.getElementById('resultsGrid');
const inputLabel = document.getElementById('inputLabel');
const currentDecimalDisplay = document.getElementById('currentDecimalDisplay');
const totalPayoutDisplay = document.getElementById('totalPayoutDisplay');
const netProfitDisplay = document.getElementById('netProfitDisplay');

/**
 * Initialization
 */
function init() {
    setupEventListeners();
    renderResults();
    updatePayouts();
}

function setupEventListeners() {
    // Odds Input
    oddsInput.addEventListener('input', (e) => {
        handleOddsChange(e.target.value);
    });

    // Stake Input
    stakeInput.addEventListener('input', (e) => {
        state.stake = parseFloat(e.target.value) || 0;
        updatePayouts();
    });

    // Format Tabs
    formatTabs.addEventListener('click', (e) => {
        const tab = e.target.closest('.tab');
        if (!tab) return;

        // Update UI
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Update State
        state.activeFormat = tab.dataset.format;
        
        // Update Label
        const label = tab.textContent;
        inputLabel.textContent = `Input ${label} Odds`;

        // Update Input Value to current format's value
        oddsInput.value = state.odds[state.activeFormat].replace('%', '');
        
        renderResults();
    });
}

/**
 * Logic
 */
function handleOddsChange(value) {
    if (value === '') {
        state.odds = { decimal: '', fractional: '', american: '', implied: '' };
        renderResults();
        updatePayouts();
        return;
    }

    let decimal = null;

    switch (state.activeFormat) {
        case 'decimal':
            decimal = parseFloat(value);
            break;
        case 'fractional':
            decimal = fractionalToDecimal(value);
            break;
        case 'american':
            decimal = americanToDecimal(value);
            break;
        case 'implied':
            decimal = impliedToDecimal(value);
            break;
    }

    if (decimal && decimal > 1) {
        state.odds = fromDecimal(decimal);
    } else {
        state.odds = { decimal: '', fractional: '', american: '', implied: '' };
    }

    renderResults();
    updatePayouts();
}

function renderResults() {
    const formats = [
        { id: 'decimal', label: 'Decimal' },
        { id: 'fractional', label: 'Fractional' },
        { id: 'american', label: 'American' },
        { id: 'implied', label: 'Implied Probability' }
    ];

    resultsGrid.innerHTML = '';

    formats.forEach(f => {
        if (f.id === state.activeFormat) return;

        const item = document.createElement('div');
        item.className = 'result-item';
        item.innerHTML = `
            <span class="label">${f.label}</span>
            <span class="value">${state.odds[f.id] || '—'}</span>
        `;
        resultsGrid.appendChild(item);
    });
}

function updatePayouts() {
    const d = parseFloat(state.odds.decimal);
    const s = state.stake;

    currentDecimalDisplay.textContent = state.odds.decimal || '1.00';

    if (isNaN(d) || isNaN(s) || d <= 0) {
        totalPayoutDisplay.textContent = '$0.00';
        netProfitDisplay.textContent = '$0.00';
        return;
    }

    const payout = d * s;
    const profit = payout - s;

    totalPayoutDisplay.textContent = `$${payout.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    netProfitDisplay.textContent = `$${profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Conversion Utilities
 */
function fromDecimal(decimal) {
    const decStr = decimal.toFixed(2);
    const implied = (1 / decimal * 100).toFixed(2) + '%';

    let american = '';
    if (decimal >= 2) {
        american = '+' + Math.round((decimal - 1) * 100).toString();
    } else {
        american = Math.round(-100 / (decimal - 1)).toString();
    }

    const fractional = decimalToFractional(decimal);

    return {
        decimal: decStr,
        fractional,
        american,
        implied
    };
}

function fractionalToDecimal(fractional) {
    const parts = fractional.split('/');
    if (parts.length !== 2) return null;
    const num = parseFloat(parts[0]);
    const den = parseFloat(parts[1]);
    if (isNaN(num) || isNaN(den) || den === 0) return null;
    return (num / den) + 1;
}

function americanToDecimal(american) {
    const val = parseInt(american);
    if (isNaN(val) || val === 0 || (val > -100 && val < 100)) return null;
    if (val >= 100) return (val / 100) + 1;
    return (100 / Math.abs(val)) + 1;
}

function impliedToDecimal(implied) {
    const val = parseFloat(implied.replace('%', ''));
    if (isNaN(val) || val <= 0 || val >= 100) return null;
    return 100 / val;
}

function decimalToFractional(decimal) {
    let numerator = decimal - 1;
    let denominator = 1;
    const precision = 1000;
    numerator = Math.round(numerator * precision);
    denominator = precision;
    const commonDivisor = gcd(numerator, denominator);
    return `${numerator / commonDivisor}/${denominator / commonDivisor}`;
}

function gcd(a, b) {
    return b ? gcd(b, a % b) : a;
}

// Start the app
init();
