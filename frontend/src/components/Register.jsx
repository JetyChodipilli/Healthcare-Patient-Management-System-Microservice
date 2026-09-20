import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Shield, HeartPulse, ArrowRight, CheckCircle2, UserCheck, Activity } from 'lucide-react';
import { toast } from 'sonner';

export default function Register({ onNavigateToLogin, onRegisterSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('DOCTOR'); // 'DOCTOR' | 'NURSE' | 'STAFF'
  const [loading, setLoading] = useState(false);

  // Available clinical staff roles (Admin accounts must be provisioned internally)
  const rolesList = [
    { id: 'DOCTOR', name: 'Physician / Doctor', desc: 'Patient records, vitals & clinical encounters' },
    { id: 'NURSE',  name: 'Clinical Nurse',     desc: 'Ward capacity, triage & vital updates' },
    { id: 'STAFF',  name: 'Administrative Staff',desc: 'Admissions & billing account records' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error('Please enter all required fields.');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password, role }),
      });

      if (response.ok) {
        toast.success(`Account registered successfully as ${role}. Please sign in.`);
        onRegisterSuccess();
        return;
      }

      if (response.status === 409) {
        toast.error('An account with this email address already exists.');
        return;
      }

      if (response.status === 403) {
        toast.error('Administrative accounts cannot be registered publicly.');
        return;
      }

      const errText = await response.text();
      toast.error(errText || 'Registration failed. Please try again.');
    } catch {
      toast.error('Unable to connect to authentication gateway.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex bg-[#030712] text-slate-100 font-sans antialiased selection:bg-cyan-500/30 relative overflow-hidden">
      
      {/* Background Lights */}
      <div className="absolute top-0 left-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_top_left,rgba(6,182,212,0.08)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_bottom_right,rgba(99,102,241,0.06)_0%,transparent_70%)] pointer-events-none" />

      {/* ─── LEFT: Clean Registration Panel ────────────────────────────────────────── */}
      <div className="w-full lg:w-5/12 flex items-center justify-center p-6 sm:p-10 lg:p-12 relative z-10 border-r border-slate-800/80 bg-[#060b17]/95 backdrop-blur-3xl overflow-y-auto">
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md space-y-5"
        >
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 ring-1 ring-white/20">
                <HeartPulse className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-extrabold text-base text-white tracking-tight leading-none">
                  HealthPulse Register
                </h1>
                <p className="text-[11px] text-cyan-400 font-mono mt-1 font-bold">Clinical Staff Onboarding</p>
              </div>
            </div>

            <div className="pt-2">
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Create Clinical Account
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Register your staff credentials to access patient records and hospital workflows
              </p>
            </div>
          </div>

          {/* Role Selection Options */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block font-mono">
              Select Your Clinical Role
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {rolesList.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={`p-3 rounded-2xl border text-left text-xs font-semibold transition flex flex-col justify-between cursor-pointer ${
                    role === r.id
                      ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500 shadow-md shadow-cyan-500/10'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-white text-[11px]">{r.name}</span>
                    {role === r.id && <UserCheck className="h-3.5 w-3.5 text-cyan-400" />}
                  </div>
                  <span className="text-[9px] opacity-75 text-slate-400 mt-1.5 leading-tight">{r.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor@hospital.org"
                  className="w-full glass-input-custom rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                  <input
                    type="password"
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="w-full glass-input-custom rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                  <input
                    type="password"
                    required
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full glass-input-custom rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
              <Shield className="h-4 w-4 text-cyan-400 shrink-0" />
              <span>
                Account role will be set to <strong className="text-white">{role}</strong>. Password stored with salted BCrypt hashing.
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full py-3.5 btn-shimmer-antigravity text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 transition duration-200 cursor-pointer disabled:opacity-50 uppercase tracking-wider mt-1"
            >
              {loading ? (
                <span>Registering Account…</span>
              ) : (
                <>
                  <span>Create {role} Account</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Navigation to Login */}
          <div className="text-center text-xs text-slate-400 font-medium pt-2 border-t border-slate-800/80">
            <span>Already have an authorized account? </span>
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="text-cyan-400 font-bold hover:text-cyan-300 hover:underline cursor-pointer transition ml-1"
            >
              Sign In Here
            </button>
          </div>

        </motion.div>
      </div>

      {/* ─── RIGHT: Professional Clinical Overview ────────────────────────────── */}
      <div className="hidden lg:flex lg:w-7/12 relative bg-[#090d16] flex-col justify-between p-12 overflow-hidden">
        
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <span className="px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-mono text-cyan-400 font-bold flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Healthcare Staff Provisioning Active
          </span>
          <span className="text-xs text-slate-400 font-mono">Role Verification</span>
        </div>

        <div className="relative z-10 max-w-2xl space-y-6 my-auto py-12">
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Hospital Operations Onboarding.
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
              Role-based access control enforces least-privilege security across departments, preventing unauthorized access to sensitive patient clinical records.
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-titanium space-y-4 border border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-200">
                <Activity className="h-4 w-4 text-cyan-400" /> Clinical Role Privileges
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                Role Matrix Active
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">Doctor Role</div>
                <div className="text-sm font-bold text-white mt-1">Full Clinical</div>
                <div className="text-[10px] text-cyan-400 mt-0.5">Diagnoses &amp; Vitals</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">Nurse Role</div>
                <div className="text-sm font-bold text-white mt-1">Ward Care</div>
                <div className="text-[10px] text-emerald-400 mt-0.5">Triage &amp; Beds</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">Staff Role</div>
                <div className="text-sm font-bold text-white mt-1">Operations</div>
                <div className="text-[10px] text-amber-400 mt-0.5">Billing &amp; Intake</div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between border-t border-slate-800/80 pt-6 text-xs text-slate-400 font-mono">
          <span>HealthPulse Enterprise Clinical Platform</span>
          <span className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="h-4 w-4" /> Role Security Policy Verified
          </span>
        </div>

      </div>

    </div>
  );
}
