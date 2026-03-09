import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Upload, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface PremiumPopupProps {
  onComplete: () => void;
}

export default function PremiumPopup({ onComplete }: PremiumPopupProps) {
  const [step, setStep] = useState<'buy' | 'upload' | 'verifying' | 'success'>('buy');
  const [screenshot, setScreenshot] = useState<string | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setScreenshot(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (!screenshot) return;
    setStep('verifying');
    
    // Simulate verification process
    setTimeout(() => {
      setStep('success');
      localStorage.setItem('isLifetimeFree', 'true');
    }, 3000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[400] flex items-center justify-center p-6">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-[32px] p-8 shadow-2xl text-center relative overflow-hidden"
      >
        {step === 'buy' && (
          <>
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={40} className="text-red-600 dark:text-red-500" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-3 tracking-tight">Trial Expired!</h2>
            
            <div className="space-y-4 mb-8">
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">
                Your 3-Day Free Trial has ended. To continue using the app and withdraw your earnings, you need to purchase the Premium Plan.
              </p>
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-6 rounded-2xl text-white shadow-lg shadow-blue-600/30">
                <div className="flex justify-center mb-2">
                  <ShieldCheck size={32} className="text-blue-200" />
                </div>
                <h3 className="font-bold text-lg mb-1">Lifetime Premium</h3>
                <p className="text-3xl font-black tracking-tight mb-2">₹300</p>
                <p className="text-blue-100 text-xs font-medium">One-time payment. Lifetime access.</p>
              </div>
            </div>

            <button 
              onClick={() => setStep('upload')}
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-[0.98]"
            >
              Buy Premium Now
            </button>
          </>
        )}

        {step === 'upload' && (
          <>
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Upload size={32} className="text-blue-600 dark:text-blue-500" />
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-2">Upload Payment Screenshot</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              Please pay ₹300 to UPI ID: <strong>premium@upi</strong> and upload the screenshot below.
            </p>

            <div className="mb-6">
              {screenshot ? (
                <div className="relative rounded-2xl overflow-hidden border-2 border-blue-500 aspect-[4/3]">
                  <img src={screenshot} alt="Payment Screenshot" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => setScreenshot(null)}
                    className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full text-xs font-bold backdrop-blur-sm"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Click to upload screenshot</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
                </label>
              )}
            </div>

            <button 
              onClick={handleSubmit}
              disabled={!screenshot}
              className={`w-full font-bold py-4 rounded-2xl transition-all ${
                screenshot 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-[0.98]' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
              }`}
            >
              Submit for Verification
            </button>
            <button 
              onClick={() => setStep('buy')}
              className="w-full mt-3 text-gray-500 text-sm font-medium hover:text-gray-700 dark:hover:text-gray-300"
            >
              Back
            </button>
          </>
        )}

        {step === 'verifying' && (
          <div className="py-8">
            <div className="w-24 h-24 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-2">Verifying Payment...</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Please wait while we verify your payment screenshot. This usually takes a few seconds.
            </p>
          </div>
        )}

        {step === 'success' && (
          <div className="py-4">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle2 size={48} className="text-green-600 dark:text-green-500" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-2">Payment Verified!</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
              Congratulations! Your account has been upgraded to Lifetime Premium. You can now enjoy all features without any limits.
            </p>
            <button 
              onClick={onComplete}
              className="w-full bg-green-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-600/20 hover:bg-green-700 transition-all active:scale-[0.98]"
            >
              Continue to App
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
