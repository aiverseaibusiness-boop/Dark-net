import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, 
  History as HistoryIcon, 
  Wallet, 
  User, 
  Database as DataIcon, 
  ArrowRight, 
  LogOut, 
  Copy, 
  Share2, 
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  IndianRupee,
  TrendingUp,
  Gift,
  Filter,
  ArrowUpDown,
  Sun,
  Moon,
  Zap,
  Eye,
  EyeOff,
  ShieldCheck,
  Star,
  UploadCloud,
  Image as ImageIcon,
  Scan,
  HelpCircle,
  MessageSquare,
  X,
  ExternalLink,
  Mail,
  Phone,
  Send,
  Crown
} from 'lucide-react';
import { generateEarningIllustration } from './services/illustrationService';
import SplashScreen from './components/SplashScreen';
import QRScanner from './components/QRScanner';
import MandatoryTasks from './components/MandatoryTasks';
import Auth from './components/Auth';
import { motion, AnimatePresence } from 'motion/react';
import { SpaceBackground } from './components/SpaceBackground';
import MembershipPurchase from './components/MembershipPurchase';

// --- Types ---
interface UserData {
  id: number;
  email: string;
  name: string;
  dob: string;
  age: number;
  profile_pic: string;
  referral_code: string;
  points: number;
  has_completed_tasks: number;
  has_seen_onboarding: number;
  membership_expires_at: string | null;
}

interface HistoryItem {
  id: number;
  type: string;
  amount: number;
  description: string;
  created_at: string;
}

const Onboarding = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(0);
  const steps = [
    {
      title: "Welcome to EarnUp!",
      description: "The most modern way to earn extra rewards from your phone.",
      icon: <TrendingUp size={48} className="text-blue-600" />,
    },
    {
      title: "Data Selling",
      description: "Simulate sharing your unused data to earn ₹5 for every 500MB.",
      icon: <DataIcon size={48} className="text-blue-600" />,
    },
    {
      title: "Easy Withdrawals",
      description: "Once you reach ₹50, withdraw your earnings directly to your UPI ID.",
      icon: <Wallet size={48} className="text-blue-600" />,
    },
  ];

  const next = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-950 z-[200] flex flex-col items-center justify-center p-8 text-center">
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="flex flex-col items-center"
      >
        <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-3xl flex items-center justify-center mb-8">
          {steps[step].icon}
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-4 tracking-tight">{steps[step].title}</h2>
        <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed mb-12 max-w-xs">{steps[step].description}</p>
      </motion.div>
      
      <div className="flex gap-2 mb-12">
        {steps.map((_, i) => (
          <div 
            key={i} 
            className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-blue-600' : 'w-2 bg-gray-200 dark:bg-gray-800'}`} 
          />
        ))}
      </div>

      <button 
        onClick={next}
        className="w-full max-w-xs bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-[0.98]"
      >
        {step === steps.length - 1 ? "Get Started" : "Next"}
        <ArrowRight size={20} />
      </button>
    </div>
  );
};

const BottomNav = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'history', icon: HistoryIcon, label: 'History' },
    { id: 'redeem', icon: Wallet, label: 'Redeem' },
    { id: 'membership', icon: Crown, label: 'Membership' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-xl border-t border-gray-800 px-6 py-3 flex justify-between items-center z-50">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeTab === tab.id ? 'text-blue-500 glow-blue' : 'text-gray-500 hover:text-gray-400'
          }`}
        >
          <tab.icon size={24} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
          <span className="text-[10px] font-medium uppercase tracking-wider">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center p-8">
    <div className="relative w-16 h-16 mb-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="absolute inset-0 border-4 border-blue-100 dark:border-blue-900/30 border-t-blue-600 rounded-full"
      />
    </div>
    <p className="mt-4 text-blue-600 font-bold animate-pulse tracking-widest uppercase text-xs">Processing...</p>
  </div>
);

const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-5 ${className}`}>
    {children}
  </div>
);

// --- Pages ---

const HomePage = ({ user, onUpdate, isDarkMode, toggleDarkMode, isLifetimeFree, isPendingVerification, onGoToPremium }: { 
  user: UserData, 
  onUpdate: () => void,
  isDarkMode: boolean,
  toggleDarkMode: () => void,
  isLifetimeFree: boolean,
  isPendingVerification: boolean,
  onGoToPremium: () => void
}) => {
  const [isSellingData, setIsSellingData] = useState(false);
  const [isBullRun, setIsBullRun] = useState(false);
  const [dataMb, setDataMb] = useState(0);
  const [dataEarnings, setDataEarnings] = useState(0);
  const [illustration, setIllustration] = useState<string | null>(null);
  const [stats, setStats] = useState({ referralCount: 0, todayPoints: 0 });
  const dataInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadIllustration = async () => {
      const img = await generateEarningIllustration();
      setIllustration(img);
    };
    loadIllustration();
  }, []);

  useEffect(() => {
    return () => {
      if (dataInterval.current) clearInterval(dataInterval.current);
    };
  }, []);

  useEffect(() => {
    if (!user || !user.id) return;
    const fetchStats = async () => {
      try {
        const res = await fetch(`/api/user/activity/${user.id}`);
        if (!res.ok) throw new Error("Failed to fetch activity");
        
        const text = await res.text();
        if (!text) {
          setStats({ referralCount: 0, todayPoints: 0 });
          return;
        }
        
        const data = JSON.parse(text);
        setStats(data);
      } catch (e) {
        console.error("Failed to fetch stats", e);
      }
    };
    fetchStats();
  }, [user?.id, user?.points]);



  const startDataSelling = () => {
    if (isSellingData) {
      setIsSellingData(false);
      setIsBullRun(false);
      if (dataInterval.current) clearInterval(dataInterval.current);
      // Finalize earnings
      if (dataEarnings > 0) {
        fetch('/api/earn/data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            userId: user.id, 
            amountInr: dataEarnings, 
            description: `Data Selling: ${dataMb.toFixed(2)} MB` 
          }),
        }).then(() => onUpdate());
      }
      return;
    }

    setIsSellingData(true);
    setIsBullRun(true);
    dataInterval.current = setInterval(() => {
      setDataMb(prev => prev + 0.1);
      // 500 MB = ₹5 => 1 MB = 5/500 = 0.01
      setDataEarnings(prev => prev + (0.1 * 0.01));
    }, 1000);
  };

  return (
    <div className="pb-24 pt-8 px-6 min-h-screen bg-gradient-to-tr from-purple-600 via-pink-500 to-yellow-500">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Current Balance</h2>
          <div className="flex items-center gap-1 mt-1">
            <IndianRupee size={24} className="text-white" />
            <span className="text-3xl font-bold text-white">{(user.points / 1000).toFixed(2)}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleDarkMode}
            className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors glow-blue"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-100 dark:border-blue-900/30 glow-blue"
          >
            <img src={user.profile_pic} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </motion.div>
        </div>
      </motion.div>

      {isPendingVerification && !isLifetimeFree && (
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="mb-6 bg-blue-600 rounded-2xl p-4 text-white shadow-lg shadow-blue-600/20 flex items-center gap-4 glow-blue"
        >
          <div className="bg-white/20 p-2 rounded-lg">
            <Clock size={20} className="animate-pulse" />
          </div>
          <div>
            <p className="text-sm font-bold">Verification in Progress</p>
            <p className="text-[10px] text-blue-100 uppercase tracking-wider">Estimated time: 12-24 hours</p>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none mb-8 relative overflow-hidden min-h-[200px] flex items-center glow-blue">
          <div className="relative z-10 flex-1">
            <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-1">Total Points</p>
            <h3 className="text-4xl font-bold mb-4">{user.points}</h3>
            <div className="flex gap-4">
              <div className="bg-white/10 rounded-lg px-3 py-2">
                <p className="text-[10px] text-blue-200 uppercase font-bold">Today</p>
                <p className="font-bold">+{stats.todayPoints}</p>
              </div>
              <div className="bg-white/10 rounded-lg px-3 py-2">
                <p className="text-[10px] text-blue-200 uppercase font-bold">Referrals</p>
                <p className="font-bold">{stats.referralCount}</p>
              </div>
            </div>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/2 flex items-center justify-center">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative w-full h-full flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-gradient-to-l from-indigo-700/50 to-transparent pointer-events-none" />
            </motion.div>
          </div>
        </Card>
      </motion.div>

      {isSellingData && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <Card className="mb-8 border-green-200 bg-green-50/50 dark:bg-green-900/10 dark:border-green-800 glow-emerald">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white animate-spin">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-gray-50">Sell Internet</h4>
                  <p className="text-xs text-gray-500">Selling background data</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-600">₹{dataEarnings.toFixed(4)}</p>
                <p className="text-[10px] text-gray-400 uppercase font-bold">{dataMb.toFixed(2)} MB</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
              <motion.div 
                className="bg-green-600 h-full"
                animate={{ width: `${(dataMb % 1) * 100}%` }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              />
            </div>
          </Card>
        </motion.div>
      )}

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">DARK NET</h3>
        
        <motion.button 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={startDataSelling}
          className="w-full group"
        >
          <Card className={`flex items-center gap-4 transition-all glow-blue ${isSellingData ? 'border-green-200 bg-green-50/30 glow-emerald' : 'hover:border-blue-200'}`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${isSellingData ? 'bg-green-100 text-green-600' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'}`}>
              <DataIcon size={28} />
            </div>
            <div className="flex-1 text-left">
              <h4 className="font-bold text-gray-900 dark:text-gray-50">{isSellingData ? 'Selling Data...' : 'Sell Internet Data'}</h4>
              <p className="text-xs text-gray-500">
                {isSellingData ? `${dataMb.toFixed(2)} MB Shared • ₹${dataEarnings.toFixed(5)}` : '500 MB = ₹5'}
              </p>
            </div>
            <div className={isSellingData ? 'text-green-600' : 'text-blue-600'}>
              {isSellingData ? <CheckCircle2 /> : <ChevronRight />}
            </div>
          </Card>
        </motion.button>
      </div>
    </div>
  );
};

const HistoryPage = ({ userId }: { userId: number }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('All');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`/api/history/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch history");
        
        const text = await res.text();
        if (!text) {
          setHistory([]);
          setLoading(false);
          return;
        }
        
        const data = JSON.parse(text);
        setHistory(data);
        setLoading(false);
      } catch (e) {
        console.error("Failed to fetch history", e);
        setLoading(false);
      }
    };
    fetchHistory();
  }, [userId]);

  const filteredHistory = history
    .filter(item => filterType === 'All' || item.type === filterType)
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') {
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else {
        comparison = a.amount - b.amount;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const types = ['All', 'Data', 'Referral', 'Withdraw'];

  return (
    <div className="pb-24 pt-8 px-6 min-h-screen bg-gradient-to-tr from-purple-600 via-pink-500 to-yellow-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">History</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="p-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <ArrowUpDown size={18} />
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-4">
        {types.map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              filterType === type 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                : 'bg-white text-gray-400 border border-gray-100'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setSortBy('date')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
            sortBy === 'date' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-gray-100 text-gray-400 bg-white'
          }`}
        >
          Sort by Date
        </button>
        <button 
          onClick={() => setSortBy('amount')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
            sortBy === 'amount' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-gray-100 text-gray-400 bg-white'
          }`}
        >
          Sort by Amount
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Clock className="animate-spin text-blue-600" /></div>
      ) : filteredHistory.length === 0 ? (
        <div className="text-center py-20 text-gray-400">No transactions found</div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((item) => (
            <Card key={item.id} className="flex items-center justify-between py-4">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  item.amount > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                }`}>
                  {item.type === 'Data' && <DataIcon size={20} />}
                  {item.type === 'Referral' && <Gift size={20} />}
                  {item.type === 'Withdraw' && <Wallet size={20} />}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">{item.description}</h4>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                    {new Date(item.created_at).toLocaleDateString()} • {item.type}
                  </p>
                </div>
              </div>
              <div className={`font-bold text-sm ${item.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {item.amount > 0 ? '+' : ''}{item.amount.toFixed(3)} ₹
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const RedeemPage = ({ user, onUpdate }: { user: UserData, onUpdate: () => void }) => {
  const [amount, setAmount] = useState('');
  const [upiId, setUpiId] = useState('');
  const [method, setMethod] = useState('UPI');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (parseFloat(amount) < 50) {
      alert('Minimum withdrawal is ₹50');
      return;
    }
    setLoading(true);
    const res = await fetch('/api/redeem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, method, details: upiId, amount: parseFloat(amount) }),
    });
    
    const text = await res.text();
    let data = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch (e) {
      console.error("Failed to parse JSON", e);
    }
    
    setLoading(false);
    if (res.ok) {
      setShowSuccess(true);
      onUpdate();
      setAmount('');
      setUpiId('');
    } else {
      alert(data.error || 'Redemption failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="pb-24 pt-8 px-6 min-h-screen bg-gradient-to-tr from-purple-600 via-pink-500 to-yellow-500 animate-white-pulse">
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
            onClick={() => setShowSuccess(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-gray-900 border border-blue-500/30 p-8 rounded-[32px] text-center max-w-sm w-full glow-blue"
            >
              <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} className="text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Request Submitted</h3>
              <p className="text-gray-400">Your payment will arrive within 24–72 hours.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <h2 className="text-2xl font-bold text-white mb-6">Redeem Earnings</h2>
      
      <Card className="bg-blue-50 border-blue-100 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-600 text-[10px] font-bold uppercase tracking-widest">Available for Withdrawal</p>
            <h3 className="text-2xl font-bold text-blue-900">₹{(user.points / 1000).toFixed(2)}</h3>
          </div>
          <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-bold">
            MIN ₹50
          </div>
        </div>
      </Card>

      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setMethod('UPI')}
          className={`flex-1 py-4 rounded-xl font-bold text-sm transition-all ${method === 'UPI' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-gray-50 text-gray-400 border border-gray-100'}`}
        >
          UPI Withdraw
        </button>
        <button 
          onClick={() => setMethod('Redeem Code')}
          className={`flex-1 py-4 rounded-xl font-bold text-sm transition-all ${method === 'Redeem Code' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-gray-50 text-gray-400 border border-gray-100'}`}
        >
          Redeem Code
        </button>
      </div>

      <form onSubmit={handleRedeem} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Withdraw Amount (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-4 focus:outline-none"
            placeholder="Min 50"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">{method === 'UPI' ? 'UPI ID' : 'Email for Code'}</label>
          <input
            type="text"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-4 focus:outline-none"
            placeholder={method === 'UPI' ? 'user@upi' : 'name@example.com'}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 mt-4 flex items-center justify-center gap-2"
        >
          {loading ? <Clock className="animate-spin" /> : <ArrowRight size={20} />}
          Submit Request
        </button>
      </form>
    </div>
  );
};

const MembershipTab = ({ user }: { user: UserData }) => {
  const [showScanner, setShowScanner] = useState(false);
  const isMembershipActive = user.membership_expires_at && new Date(user.membership_expires_at) > new Date();
  const expiryDate = user.membership_expires_at ? new Date(user.membership_expires_at).toLocaleDateString() : 'N/A';

  const handleScan = async (data: string) => {
    setShowScanner(false);
    try {
      const res = await fetch('/api/user/membership/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, token: data }),
      });
      if (res.ok) {
        alert('Membership updated successfully!');
        window.location.reload();
      } else {
        alert('Failed to update membership.');
      }
    } catch (error) {
      console.error('Scan error:', error);
      alert('An error occurred.');
    }
  };

  return (
    <div className="pb-24 pt-8 px-6 min-h-screen bg-gradient-to-tr from-purple-600 via-pink-500 to-yellow-500">
      {showScanner && <QRScanner onScan={handleScan} onClose={() => setShowScanner(false)} />}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Premium Status</h2>
          <h1 className="text-3xl font-black text-white tracking-tight">Membership</h1>
        </div>
        <button 
          onClick={() => setShowScanner(true)}
          className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30 glow-blue"
        >
          <Crown size={24} className="text-white" />
        </button>
      </motion.div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gray-900/80 backdrop-blur-xl border-blue-500/30 mb-8 relative overflow-hidden glow-blue">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600" />
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isMembershipActive ? 'bg-emerald-500/20 text-emerald-400 glow-emerald' : 'bg-red-500/20 text-red-400'}`}>
                {isMembershipActive ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">
                  {isMembershipActive ? 'Active Membership' : 'Inactive Membership'}
                </h3>
                <p className="text-xs text-gray-400">
                  {isMembershipActive ? `Expires on ${expiryDate}` : 'Please renew to continue'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-2xl p-5 border border-gray-700/50">
            <h4 className="text-sm font-bold text-gray-300 mb-4 uppercase tracking-widest">Benefits</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/20 p-1.5 rounded-lg">
                  <CheckCircle2 size={16} className="text-blue-400" />
                </div>
                <span className="text-gray-200 text-sm font-medium">Full App Access</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/20 p-1.5 rounded-lg">
                  <Zap size={16} className="text-blue-400" />
                </div>
                <span className="text-gray-200 text-sm font-medium">High Earning Rates</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/20 p-1.5 rounded-lg">
                  <ShieldCheck size={16} className="text-blue-400" />
                </div>
                <span className="text-gray-200 text-sm font-medium">Priority Withdrawals</span>
              </div>
            </div>
          </div>
        </Card>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl overflow-hidden shadow-lg mb-8"
        >
          <img
            src="https://i.postimg.cc/XYJSY0hL/IMG-20260308-WA0007.jpg"
            alt="Membership"
            className="w-full h-auto"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

const ProfilePage = ({ user, onLogout, isDarkMode, toggleDarkMode }: { 
  user: UserData, 
  onLogout: () => void, 
  isDarkMode: boolean, 
  toggleDarkMode: () => void
}) => {
  const [activeHelpSection, setActiveHelpSection] = useState<'support' | 'faq' | 'privacy' | null>(null);
  const referralLink = `https://earnup.app/ref=${user.referral_code}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const HelpModal = () => {
    if (!activeHelpSection) return null;

    const content = {
      faq: {
        title: 'Frequently Asked Questions',
        icon: <HelpCircle className="text-blue-600" />,
        body: (
          <div className="space-y-4">
            {[
              { q: 'How can I earn more money?', a: 'You can earn by selling your unused background data and referring friends. Premium members earn 2x more!' },
              { q: 'What is the minimum withdrawal?', a: 'The minimum withdrawal amount is ₹500. Once you reach this limit, you can request a payout via UPI or Gift Cards.' },
              { q: 'How long does payment verification take?', a: 'Payment verification for Premium membership usually takes 12-24 hours. Once verified, your account will be upgraded instantly.' },
              { q: 'Is my data safe while selling?', a: 'Yes, we only share non-personal, anonymous background data for market research. We never access your private files or messages.' },
              { q: 'Can I use multiple accounts?', a: 'No, using multiple accounts on the same device is strictly prohibited and may lead to a permanent ban.' }
            ].map((item, i) => (
              <div key={i} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                <p className="text-sm font-bold text-gray-900 dark:text-gray-50 mb-1">Q: {item.q}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        )
      },
      privacy: {
        title: 'Privacy Policy',
        icon: <ShieldCheck className="text-blue-600" />,
        body: (
          <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            <p>At EarnUp, we take your privacy seriously. This policy explains how we handle your information.</p>
            <div className="space-y-2">
              <p className="font-bold text-gray-900 dark:text-gray-50">1. Information We Collect</p>
              <p>We collect your name, email, and date of birth to create your account. We also collect anonymous background data if you choose to use the "Sell Data" feature.</p>
            </div>
            <div className="space-y-2">
              <p className="font-bold text-gray-900 dark:text-gray-50">2. How We Use Data</p>
              <p>Your profile info is used for account management. Background data is used for market research and trend analysis. We never sell your personal identity.</p>
            </div>
            <div className="space-y-2">
              <p className="font-bold text-gray-900 dark:text-gray-50">3. Security</p>
              <p>We use industry-standard encryption to protect your data. Your payment screenshots are deleted after verification.</p>
            </div>
            <div className="space-y-2">
              <p className="font-bold text-gray-900 dark:text-gray-50">4. Third Parties</p>
              <p>We do not share your personal information with third-party advertisers. Anonymous data may be shared with research partners.</p>
            </div>
          </div>
        )
      }
    };

    const active = content[activeHelpSection];

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl"
        >
          <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                {active.icon}
              </div>
              <h3 className="font-bold text-gray-900 dark:text-gray-50">{active.title}</h3>
            </div>
            <button onClick={() => setActiveHelpSection(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
              <X size={20} className="text-gray-400" />
            </button>
          </div>
          <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {active.body}
          </div>
          <div className="p-6 bg-gray-50 dark:bg-gray-800/50">
            <button 
              onClick={() => setActiveHelpSection(null)}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="pb-24 pt-8 px-6 min-h-screen bg-gradient-to-tr from-purple-600 via-pink-500 to-yellow-500">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex justify-between items-start mb-8"
      >
        <div className="flex flex-col items-center flex-1">
          <div className="relative mb-4">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-50 dark:border-blue-900/30 shadow-xl shadow-blue-600/10 glow-blue"
            >
              <img src={user.profile_pic} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </motion.div>
            <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 text-white text-[10px] font-bold px-3 py-1 rounded-full border-2 border-white dark:border-gray-950 uppercase tracking-wider shadow-lg whitespace-nowrap ${
              user.membership_expires_at && new Date(user.membership_expires_at) > new Date() ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 
              'bg-gradient-to-r from-gray-500 to-slate-500'
            }`}>
              {user.membership_expires_at && new Date(user.membership_expires_at) > new Date() ? 'Premium Member' : 'Free User'}
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mt-2">{user.name}</h2>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleDarkMode}
          className="p-3 bg-gray-100 dark:bg-gray-800 rounded-2xl text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors glow-blue"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </motion.button>
      </motion.div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-4 mb-8"
      >
        <Card className="text-center glow-blue">
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Age</p>
          <p className="font-bold text-gray-900 dark:text-gray-50">{user.age} Years</p>
        </Card>
        <Card className="text-center glow-blue">
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Earnings</p>
          <p className="font-bold text-blue-600">₹{(user.points / 1000).toFixed(2)}</p>
        </Card>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Refer & Earn</h3>
        <Card className="mb-8 glow-blue">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Referral Code</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-50">{user.referral_code}</p>
            </div>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => copyToClipboard(user.referral_code)}
              className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 p-3 rounded-xl glow-blue"
            >
              <Copy size={20} />
            </motion.button>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800">
            <div className="flex-1 mr-4 overflow-hidden">
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Referral Link</p>
              <p className="text-xs text-gray-500 truncate">{referralLink}</p>
            </div>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => copyToClipboard(referralLink)}
              className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 p-3 rounded-xl glow-blue"
            >
              <Share2 size={20} />
            </motion.button>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle size={18} className="text-blue-600" />
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Help & Support</h3>
        </div>
        <Card className="mb-8 p-0 overflow-hidden border-gray-100 dark:border-gray-800 glow-blue">
          <div className="divide-y divide-gray-50 dark:divide-gray-800/50">
            <motion.button 
              whileHover={{ x: 5 }}
              onClick={() => setActiveHelpSection('faq')}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 glow-emerald">
                  <HelpCircle size={18} />
                </div>
                <span className="text-sm font-medium text-gray-900">FAQs</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </motion.button>
            <motion.button 
              whileHover={{ x: 5 }}
              onClick={() => setActiveHelpSection('privacy')}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 glow-blue">
                  <ShieldCheck size={18} />
                </div>
                <span className="text-sm font-medium text-gray-900">Privacy Policy</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </motion.button>
            <motion.button 
              whileHover={{ x: 5 }}
              onClick={() => window.open('https://t.me/HP_MG00', '_blank')}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 glow-blue">
                  <Send size={18} />
                </div>
                <span className="text-sm font-medium text-gray-900">Telegram Support</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </motion.button>
          </div>
        </Card>
      </motion.div>

      <AnimatePresence>
        <HelpModal />
      </AnimatePresence>

      <motion.button 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          localStorage.removeItem('hasSeenOnboarding');
          localStorage.removeItem('hasCompletedMandatoryTasks');
          localStorage.removeItem('hasSeenSubscription');
          localStorage.removeItem('trialStartTime');
          window.location.reload();
        }}
        className="w-full flex items-center justify-center gap-2 text-blue-600 font-bold py-4 rounded-xl border border-blue-100 dark:border-blue-900/30 bg-blue-50/30 dark:bg-blue-900/10 mb-4"
      >
        <Clock size={20} />
        Restart App Flow
      </motion.button>

      <motion.button 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onLogout}
        className="w-full flex items-center justify-center gap-2 text-red-500 font-bold py-4 rounded-xl border border-red-100 dark:border-red-900/30 bg-red-50/30 dark:bg-red-900/10 glow-blue"
      >
        <LogOut size={20} />
        Logout Account
      </motion.button>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState<UserData | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [authLoading, setAuthLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [previousTab, setPreviousTab] = useState('home');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showMandatoryTasks, setShowMandatoryTasks] = useState(false);
  const [showMembershipPurchase, setShowMembershipPurchase] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('isDarkMode');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('isDarkMode', String(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (!user) return;
    if (!user.email) {
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      setUser(null);
      return;
    }
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/user/by-email/${encodeURIComponent(user.email)}`);
        if (!res.ok) {
          if (res.status === 404) {
             localStorage.removeItem('user');
             localStorage.removeItem('userId');
             setUser(null);
             return;
          }
          throw new Error("Failed to fetch user data");
        }
        
        const text = await res.text();
        if (!text) return;
        
        const data = JSON.parse(text);
        if (data && data.id) {
          setUser(data);
          localStorage.setItem('userId', data.id.toString());
        }
      } catch (e) {
        console.error("Failed to fetch user data", e);
      }
    };
    fetchUser();
  }, [user?.email]);

  // Flow control: Tasks -> Membership -> Home
  useEffect(() => {
    const checkStatus = () => {
      if (user) {
        // Check if mandatory tasks are completed
        if (!user.has_completed_tasks) {
          setShowMandatoryTasks(true);
          setShowMembershipPurchase(false);
          setShowOnboarding(false);
        } else {
          // Check if membership is active
          const isMembershipActive = user.membership_expires_at && new Date(user.membership_expires_at) > new Date();
          if (!isMembershipActive) {
            setShowMandatoryTasks(false);
            setShowMembershipPurchase(true);
            setShowOnboarding(false);
          } else {
            // All good, show home
            setShowMandatoryTasks(false);
            setShowMembershipPurchase(false);
            setShowOnboarding(false);
          }
        }
      }
    };

    checkStatus();
  }, [user]);

  const completeMandatoryTasks = async () => {
    if (!user) return;
    try {
      await fetch('/api/user/complete-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });
      updateUserData();
      setShowMandatoryTasks(false);
    } catch (e) {
      console.error("Failed to complete tasks", e);
    }
  };

  const completeOnboarding = async () => {
    if (!user) return;
    try {
      await fetch('/api/user/complete-onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });
      updateUserData();
      setShowOnboarding(false);
    } catch (e) {
      console.error("Failed to complete onboarding", e);
    }
  };

  const completeMembershipPurchase = () => {
    if (user) {
      setUser({ ...user, membership_expires_at: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString() });
    }
    updateUserData();
    setShowMembershipPurchase(false);
    setActiveTab('home');
  };

  const fetchUser = async (id: number) => {
    try {
      const res = await fetch(`/api/user/${id}`);
      if (!res.ok) {
        if (res.status === 404) {
          localStorage.removeItem('user');
          localStorage.removeItem('userId');
          setUser(null);
          return;
        }
        throw new Error("Failed to fetch user data by id");
      }
      const data = await res.json();
      if (data && data.id) {
        setUser(data);
      }
    } catch (e) {
      console.error("Failed to fetch user data by id", e);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    setUser(null);
  };

  const updateUserData = () => {
    if (user) fetchUser(user.id);
  };

  return (
    <div className="min-h-screen bg-black text-gray-50">
      <SpaceBackground />
      <div className="fixed inset-0 pointer-events-none animate-white-light bg-white/5" />
      <AnimatePresence mode="wait">
        {showSplash || authLoading ? (
          <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />
        ) : !user ? (
          <Auth key="auth" onSuccess={(user) => setUser(user)} />
        ) : (
          <>
            {user && (
              <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex flex-col">
                {showMandatoryTasks && <MandatoryTasks onComplete={completeMandatoryTasks} />}
                {showOnboarding && !showMandatoryTasks && <Onboarding onComplete={completeOnboarding} />}
                {/* Mandatory Membership Check */}
                {showMembershipPurchase && !showMandatoryTasks && !showOnboarding && (
                  <MembershipPurchase onComplete={completeMembershipPurchase} userId={user.id} />
                )}
                <div className="flex-1 overflow-y-auto">
                  {activeTab === 'home' && (
                    <HomePage 
                      user={user} 
                      onUpdate={updateUserData} 
                      isDarkMode={isDarkMode}
                      toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
                    />
                  )}
                  {activeTab === 'history' && <HistoryPage userId={user.id} />}
                  {activeTab === 'redeem' && <RedeemPage user={user} onUpdate={updateUserData} />}
                  {activeTab === 'membership' && <MembershipTab user={user} />}
                  {activeTab === 'profile' && (
                    <ProfilePage 
                      user={user} 
                      onLogout={handleLogout}
                      isDarkMode={isDarkMode}
                      toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
                    />
                  )}
                </div>
                <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
              </motion.div>
            )}
            {!user && (
              <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
              </div>
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
