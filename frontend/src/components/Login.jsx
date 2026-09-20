import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, HeartPulse, Activity, CheckCircle2, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function Login({ onLogin, onNavigateToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error('Please enter your work email and password.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Authenticated successfully.');
        onLogin(data.token);
        return;
      }

      if (response.status === 401 || response.status === 400) {
        toast.error('Invalid email or password. Please verify your credentials.');
        return;
      }

      toast.error('Authentication service error. Please try again later.');
    } catch {
      toast.error('Unable to reach authentication gateway. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex bg-[#030712] text-slate-100 font-sans antialiased selection:bg-cyan-500/30 relative overflow-hidden">
      
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 left-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_top_left,rgba(6,182,212,0.08)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_bottom_right,rgba(99,102,241,0.06)_0%,transparent_70%)] pointer-events-none" />

      {/* ─── LEFT: Standard Production Login Panel ─────────────────────────────────── */}
      <div className="w-full lg:w-5/12 flex items-center justify-center p-6 sm:p-10 lg:p-12 relative z-10 border-r border-slate-800/80 bg-[#060b17]/95 backdrop-blur-3xl overflow-y-auto">
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md space-y-6"
        >
          {/* Brand Header */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 ring-1 ring-white/20">
                <HeartPulse className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-extrabold text-lg text-white tracking-tight leading-none">
                  HealthPulse Enterprise
                </h1>
                <p className="text-[11px] text-cyan-400 font-mono mt-1 font-bold">Clinical Operating System</p>
              </div>
            </div>

            <div className="pt-2">
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Staff Authentication
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Enter your authorized clinical credentials to access your workspace
              </p>
            </div>
          </div>

          {/* Secure Login Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="username"
                  className="w-full glass-input-custom rounded-xl pl-10 pr-4 py-3 text-xs text-slate-100 placeholder-slate-500 font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@hospital.org"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="login-password" className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => toast.info('Please contact your hospital system administrator to reset credentials.')}
                  className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  className="w-full glass-input-custom rounded-xl pl-10 pr-4 py-3 text-xs text-slate-100 placeholder-slate-500 font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your account password"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0 cursor-pointer"
                />
                <span>Remember session</span>
              </label>
              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                <Shield className="h-3.5 w-3.5" />
                TLS 1.3 Protected
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full py-3.5 btn-shimmer-antigravity text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 transition duration-200 cursor-pointer disabled:opacity-50 uppercase tracking-wider mt-2"
            >
              {loading ? (
                <span>Authenticating Credentials…</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Registration Link */}
          <div className="text-center text-xs text-slate-400 font-medium pt-2 border-t border-slate-800/80">
            <span>New clinical staff member? </span>
            <button
              type="button"
              onClick={onNavigateToRegister}
              className="text-cyan-400 font-bold hover:text-cyan-300 hover:underline cursor-pointer transition ml-1"
            >
              Register Clinical Account
            </button>
          </div>

        </motion.div>
      </div>

      {/* ─── RIGHT: Professional Hospital Operations Overview ─────────────────────────── */}
      <div className="hidden lg:flex lg:w-7/12 relative bg-[#090d16] flex-col justify-between p-12 overflow-hidden">
        
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <span className="px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-mono text-cyan-400 font-bold flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Healthcare Network Services Online
          </span>
          <span className="text-xs text-slate-400 font-mono">Gateway Active</span>
        </div>

        <div className="relative z-10 max-w-2xl space-y-6 my-auto py-12">
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Hospital Management & Clinical Operations.
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
              Enterprise clinical management platform supporting patient admissions, department vitals tracking, and automated gRPC billing account generation.
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-titanium space-y-4 border border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-200">
                <Activity className="h-4 w-4 text-cyan-400" /> Hospital Service Telemetry
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                All Clusters Operational
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">Cardiology Ward</div>
                <div className="text-lg font-bold text-white mt-1">120/80 mmHg</div>
                <div className="text-[10px] text-emerald-400 mt-0.5">Vitals Normal</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">Bed Capacity</div>
                <div className="text-lg font-bold text-white mt-1">87.5%</div>
                <div className="text-[10px] text-cyan-400 mt-0.5">Monitored</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">gRPC Billing Sync</div>
                <div className="text-lg font-bold text-cyan-400 mt-1">&lt; 15ms</div>
                <div className="text-[10px] text-emerald-400 mt-0.5">Active</div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between border-t border-slate-800/80 pt-6 text-xs text-slate-400 font-mono">
          <span>HealthPulse Enterprise Clinical EMR</span>
          <span className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="h-4 w-4" /> Secure Channel Active
          </span>
        </div>

      </div>

    </div>
  );
}
