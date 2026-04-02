import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calculator, 
  RefreshCw, 
  TrendingUp, 
  DollarSign, 
  Info,
  ArrowRightLeft,
  ChevronRight
} from 'lucide-react';
import { 
  fromDecimal, 
  fractionalToDecimal, 
  americanToDecimal, 
  impliedToDecimal,
  OddsState,
  OddsFormat
} from './lib/oddsUtils';

export default function App() {
  const [activeFormat, setActiveFormat] = useState<OddsFormat>('decimal');
  const [inputValue, setInputValue] = useState<string>('2.00');
  const [stake, setStake] = useState<string>('100');
  const [odds, setOdds] = useState<OddsState>({
    decimal: '2.00',
    fractional: '1/1',
    american: '+100',
    implied: '50.00%'
  });

  // Update all odds when input changes
  useEffect(() => {
    let decimal: number | null = null;

    if (inputValue === '') {
      setOdds({ decimal: '', fractional: '', american: '', implied: '' });
      return;
    }

    switch (activeFormat) {
      case 'decimal':
        decimal = parseFloat(inputValue);
        break;
      case 'fractional':
        decimal = fractionalToDecimal(inputValue);
        break;
      case 'american':
        decimal = americanToDecimal(inputValue);
        break;
      case 'implied':
        decimal = impliedToDecimal(inputValue);
        break;
    }

    if (decimal && decimal > 1) {
      setOdds(fromDecimal(decimal));
    }
  }, [inputValue, activeFormat]);

  const calculatePayout = () => {
    const d = parseFloat(odds.decimal);
    const s = parseFloat(stake);
    if (isNaN(d) || isNaN(s)) return { payout: 0, profit: 0 };
    const payout = d * s;
    const profit = payout - s;
    return { payout, profit };
  };

  const { payout, profit } = calculatePayout();

  const formats: { id: OddsFormat; label: string; placeholder: string }[] = [
    { id: 'decimal', label: 'Decimal', placeholder: 'e.g. 2.00' },
    { id: 'fractional', label: 'Fractional', placeholder: 'e.g. 1/1' },
    { id: 'american', label: 'American', placeholder: 'e.g. +100' },
    { id: 'implied', label: 'Implied Probability', placeholder: 'e.g. 50%' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center p-3 bg-indigo-600 rounded-2xl shadow-lg mb-4"
          >
            <Calculator className="w-8 h-8 text-white" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold text-slate-900 tracking-tight mb-2"
          >
            OddsMaster
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-lg"
          >
            Professional betting odds converter and payout calculator
          </motion.p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Calculator Section */}
          <div className="lg:col-span-2 space-y-6">
            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8"
            >
              <div className="flex items-center gap-2 mb-6">
                <ArrowRightLeft className="w-5 h-5 text-indigo-600" />
                <h2 className="text-xl font-semibold text-slate-800">Odds Converter</h2>
              </div>

              <div className="space-y-6">
                {/* Format Selector */}
                <div className="flex flex-wrap gap-2">
                  {formats.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => {
                        setActiveFormat(f.id);
                        setInputValue(odds[f.id].replace('%', ''));
                      }}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        activeFormat === f.id
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* Input Field */}
                <div className="relative">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Input {activeFormat.charAt(0).toUpperCase() + activeFormat.slice(1)} Odds
                  </label>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={formats.find(f => f.id === activeFormat)?.placeholder}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-2xl font-bold text-slate-800 focus:border-indigo-500 focus:ring-0 transition-all outline-none"
                  />
                  <div className="absolute right-6 top-[3.25rem] text-slate-300">
                    <RefreshCw className="w-6 h-6 animate-spin-slow" />
                  </div>
                </div>

                {/* Results Grid */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                  {formats.filter(f => f.id !== activeFormat).map((f) => (
                    <div key={f.id} className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                      <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                        {f.label}
                      </span>
                      <span className="text-xl font-bold text-slate-700">
                        {odds[f.id] || '—'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* Payout Section */}
            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8"
            >
              <div className="flex items-center gap-2 mb-6">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                <h2 className="text-xl font-semibold text-slate-800">Payout Calculator</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Stake Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                      <input
                        type="number"
                        value={stake}
                        onChange={(e) => setStake(e.target.value)}
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-10 pr-6 py-4 text-xl font-bold text-slate-800 focus:border-emerald-500 focus:ring-0 transition-all outline-none"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl text-blue-700 text-sm">
                    <Info className="w-5 h-5 flex-shrink-0" />
                    <p>Calculated using current decimal odds of <strong>{odds.decimal || '1.00'}</strong></p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                    <span className="block text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
                      Total Payout
                    </span>
                    <span className="text-3xl font-black text-emerald-700">
                      ${payout.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Net Profit
                    </span>
                    <span className="text-2xl font-bold text-slate-700">
                      ${profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </motion.section>
          </div>

          {/* Sidebar / Info Section */}
          <div className="space-y-6">
            <motion.section 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-indigo-900 rounded-3xl shadow-xl p-8 text-white"
            >
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Quick Guide
              </h3>
              <ul className="space-y-4 text-indigo-100 text-sm">
                <li className="flex gap-3">
                  <ChevronRight className="w-4 h-4 mt-0.5 text-indigo-400" />
                  <span><strong>Decimal:</strong> Total return for every $1 staked.</span>
                </li>
                <li className="flex gap-3">
                  <ChevronRight className="w-4 h-4 mt-0.5 text-indigo-400" />
                  <span><strong>Fractional:</strong> Profit relative to stake (e.g. 2/1 means $2 profit for $1 stake).</span>
                </li>
                <li className="flex gap-3">
                  <ChevronRight className="w-4 h-4 mt-0.5 text-indigo-400" />
                  <span><strong>American:</strong> Positive (+) is profit for $100 stake; Negative (-) is stake needed for $100 profit.</span>
                </li>
                <li className="flex gap-3">
                  <ChevronRight className="w-4 h-4 mt-0.5 text-indigo-400" />
                  <span><strong>Implied:</strong> The percentage chance of winning reflected by the odds.</span>
                </li>
              </ul>
            </motion.section>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 text-center"
            >
              <p className="text-slate-500 text-sm mb-4 italic">
                "The house always wins, but with OddsMaster, you'll know exactly how much they're winning."
              </p>
              <div className="h-px bg-slate-100 w-full mb-4" />
              <p className="text-xs text-slate-400">
                &copy; 2026 OddsMaster Calculator. For informational purposes only.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
