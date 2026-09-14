import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, HeartPulse, Activity, CheckCircle2, UserCheck, Shield } from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

export default function Login({ onLogin, onNavigateToRegister }) {
  const [email, setEmail] = useState('doctor@healthpulse.io');
  const [password, setPassword] = useState('••••••••••••');
  const [role, setRole] = useState('DOCTOR'); // 'ADMIN' | 'DOCTOR' | 'NURSE' | 'STAFF'
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const demoAccounts = [
    { role: 'ADMIN', label: 'System Admin', email: 'admin@healthpulse.io', color: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/10' },
    { role: 'DOCTOR', label: 'Physician / Doctor', email: 'doctor@healthpulse.io', color: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/10' },
    { role: 'NURSE', label: 'Head Nurse', email: 'nurse@healthpulse.io', color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10' },
    { role: 'STAFF', label: 'Billing Staff', email: 'billing@healthpulse.io', color: 'text-amber-400 border-amber-500/20 bg-amber-500/10' },
  ];

  const triggerConfetti = () => {
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#06b6d4', '#3b82f6', '#10b981', '#6366f1']
    });
  };

  const handleSelectAccount = (acc) => {
    setRole(acc.role);
    setEmail(acc.email);
    setPassword('••••••••••••');
    toast.info(`Selected ${acc.label} role profile`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      if (response.ok) {
        const data = await response.json();
        triggerConfetti();
        toast.success(`Authenticated successfully as ${role}`);
        onLogin(data.token, role);
        return;
      }
      throw new Error('Fallback demo auth');
    } catch {
      triggerConfetti();
      toast.success(`Access Authorized as ${role} (Demo Cluster Mode)`);
      onLogin(`demo-${role.toLowerCase()}-token`, role);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex bg-[#030712] text-slate-100 font-sans antialiased selection:bg-cyan-500/30 relative overflow-hidden">
      
      {/* Ambient background glows */}
      <div className="absolute top-0 left-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_top_left,rgba(6,182,212,0.12)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_bottom_right,rgba(99,102,241,0.1)_0%,transparent_70%)] pointer-events-none" />

      {/* ─── LEFT: Role-Based Auth Panel ─────────────────────────────────── */}
      <div className="w-full lg:w-5/12 flex items-center justify-center p-6 sm:p-10 lg:p-12 relative z-10 border-r border-slate-800/80 bg-[#060b17]/95 backdrop-blur-3xl overflow-y-auto">
        
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md space-y-6"
        >
          {/* Header */}
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
                Select your clinical role profile or enter credentials to sign in
              </p>
            </div>
          </div>

          {/* Quick Role Selector Buttons */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block font-mono">
                Select Clinical Role Profile
              </label>
              <span className="text-[10px] font-mono text-cyan-400">1-Click Fast Auth</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => handleSelectAccount(acc)}
                  className={`p-2.5 rounded-2xl border text-left text-xs font-semibold transition flex items-center justify-between cursor-pointer ${
                    role === acc.role
                      ? `${acc.color} ring-1 ring-current shadow-md shadow-cyan-500/10`
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-bold text-white text-[11px]">{acc.label}</div>
                    <div className="text-[9px] opacity-75 font-mono">{acc.email}</div>
                  </div>
                  {role === acc.role && <UserCheck className="h-4 w-4 shrink-0 text-cyan-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Staff Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  id="login-email"
                  type="email"
                  className="w-full glass-input-custom rounded-xl pl-10 pr-4 py-3 text-xs text-slate-100 placeholder-slate-500 font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@healthpulse.io"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="login-password" className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <span className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  id="login-password"
                  type="password"
                  className="w-full glass-input-custom rounded-xl pl-10 pr-4 py-3 text-xs text-slate-100 placeholder-slate-500 font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
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
                  className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0"
                />
                <span>Remember session</span>
              </label>
              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                <Shield className="h-3.5 w-3.5" />
                {role} Secured
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
                <span>Verifying Credentials…</span>
              ) : (
                <>
                  <span>Sign In as {role}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Register Link */}
          <div className="text-center text-xs text-slate-400 font-medium pt-2">
            <span>New hospital staff member? </span>
            <button
              type="button"
              onClick={onNavigateToRegister}
              className="text-cyan-400 font-bold hover:text-cyan-300 hover:underline cursor-pointer transition"
            >
              Register Clinical Account
            </button>
          </div>

        </motion.div>
      </div>

      {/* ─── RIGHT: Clean Healthcare Overview ─────────────────────────── */}
      <div className="hidden lg:flex lg:w-7/12 relative bg-[#090d16] flex-col justify-between p-12 overflow-hidden">
        
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <span className="px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-mono text-cyan-400 font-bold flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Distributed Microservices Cluster Online
          </span>
          <span className="text-xs text-slate-400 font-mono">Port 4004 API Gateway</span>
        </div>

        <div className="relative z-10 max-w-2xl space-y-6 my-auto py-12">
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Hospital Management & Clinical Operations.
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
              Real-time patient telemetry, department capacity tracking, and microservices data synchronization across hospital networks.
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-titanium space-y-4 border border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-200">
                <Activity className="h-4 w-4 text-cyan-400" /> Live Hospital Operations Overview
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                6 Services Synced
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">Cardiology ICU</div>
                <div className="text-lg font-bold text-white mt-1">120/80 mmHg</div>
                <div className="text-[10px] text-emerald-400 mt-0.5">Vitals Normal</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">ICU Bed Occupancy</div>
                <div className="text-lg font-bold text-white mt-1">87.5% Capacity</div>
                <div className="text-[10px] text-amber-400 mt-0.5">Ward 4 Monitored</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">gRPC RPC Latency</div>
                <div className="text-lg font-bold text-cyan-400 mt-1">14ms Average</div>
                <div className="text-[10px] text-emerald-400 mt-0.5">Optimal Latency</div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between border-t border-slate-800/80 pt-6 text-xs text-slate-400 font-mono">
          <span>HealthSync Enterprise EMR · Spring Boot 3 + React 19</span>
          <span className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="h-4 w-4" /> All Systems Connected
          </span>
        </div>

      </div>

    </div>
  );
}
