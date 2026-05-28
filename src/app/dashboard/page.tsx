"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { KeyRound, Shield, ArrowLeft, Send, CheckCircle2, User, Phone, MapPin, Package, ExternalLink, Loader2, Save } from "lucide-react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { auth, db } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { collection, query, where, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";
import { useAuth } from "@/lib/AuthContext";

export default function Dashboard() {
  const { user, role } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaveLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  
  // Profile state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [address, setAddress] = useState("");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      try {
        setLoading(true);
        
        // 1. Fetch User Profile Details
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setFirstName(data.firstName || "");
          setLastName(data.lastName || "");
          setWhatsapp(data.whatsapp || "");
          setAddress(data.address || "");
        }

        // 2. Fetch Assigned Projects
        const q = query(
          collection(db, "projects"), 
          where("customerEmail", "==", user.email?.toLowerCase())
        );
        const projectSnap = await getDocs(q);
        const projectData = projectSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProjects(projectData);

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaveLoading(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        whatsapp,
        address
      });
      setEditMode(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    try {
      await sendPasswordResetEmail(auth, user.email);
      setResetSent(true);
      setTimeout(() => setResetSent(false), 5000);
      alert("Password reset email sent! Please check your inbox (and spam folder).");
    } catch (err: any) {
      console.error("Reset Error:", err);
      alert("Failed to send reset email: " + (err.message || "Please try again later."));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0414]">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen pt-28 pb-20 px-4 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 opacity-10 pointer-events-none">
          <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full transform-gpu" style={{ background: 'radial-gradient(circle, rgba(22,163,74,0.3) 0%, rgba(22,163,74,0) 70%)' }} />
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
            <div>
              <h1 className="text-4xl font-black text-white mb-2">My <span className="text-primary">Dashboard</span></h1>
              <p className="text-gray-400">Welcome back, {firstName || 'User'}. Manage your projects and account information.</p>
            </div>
            {role === 'admin' && (
              <Link href="/admin" className="px-6 py-2.5 bg-primary text-black font-bold rounded-full hover:bg-white transition-all shadow-lg shadow-primary/20">
                Go to Admin Panel
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left: Project Section (Shows if projects exist) */}
            <div className="lg:col-span-2 space-y-8">
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary"><Package size={24}/></div>
                  <h2 className="text-2xl font-bold text-white">My Projects</h2>
                </div>

                {projects.length === 0 ? (
                  <div className="glass p-12 rounded-[40px] border border-white/5 text-center">
                    <p className="text-gray-500 mb-2">No active projects linked to your account yet.</p>
                    <p className="text-sm text-gray-600 italic">Once you start a project with us, it will appear here for tracking.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects.map(p => (
                      <div key={p.id} className="glass-card overflow-hidden rounded-3xl border border-white/5 group hover:border-primary/30 transition-all">
                        <div className="h-32 bg-gray-900 relative">
                          <img src={p.images?.[0] || "https://www.transparenttextures.com/patterns/cubes.png"} className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" />
                          <div className="absolute top-4 left-4"><span className="px-2 py-0.5 bg-primary text-black text-[10px] font-black uppercase rounded-full">{p.status}</span></div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-white mb-2">{p.title}</h3>
                          <p className="text-sm text-gray-400 line-clamp-2 mb-4">{p.description}</p>
                          <Link href={`/projects/project-details/?id=${p.id}`} className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                            View Live Details <ExternalLink size={12} />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Security Shortcut */}
              <section className="glass p-8 rounded-[40px] border border-white/5 bg-red-500/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-500/10 rounded-2xl text-red-500"><KeyRound size={24}/></div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Account Security</h3>
                      <p className="text-xs text-gray-500">Reset your password or update security settings.</p>
                    </div>
                  </div>
                  <button 
                    onClick={handlePasswordReset}
                    className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${resetSent ? 'bg-green-500 text-black' : 'bg-white/10 text-white hover:bg-white hover:text-black'}`}
                  >
                    {resetSent ? "Reset Email Sent!" : "Reset Password"}
                  </button>
                </div>
              </section>
            </div>

            {/* Right: Profile Info */}
            <div className="space-y-8">
              <section className="glass p-8 rounded-[40px] border border-white/10 bg-white/5 relative overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><User size={20}/></div>
                    <h2 className="text-xl font-bold text-white">My Information</h2>
                  </div>
                  <button onClick={() => setEditMode(!editMode)} className="text-xs font-bold text-primary hover:underline">
                    {editMode ? "Cancel" : "Edit Profile"}
                  </button>
                </div>

                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase font-black text-gray-500 mb-1">First Name</label>
                        <input 
                          disabled={!editMode}
                          value={firstName}
                          onChange={e => setFirstName(e.target.value)}
                          className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary outline-none disabled:opacity-60"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-black text-gray-500 mb-1">Last Name</label>
                        <input 
                          disabled={!editMode}
                          value={lastName}
                          onChange={e => setLastName(e.target.value)}
                          className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary outline-none disabled:opacity-60"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-black text-gray-500 mb-1 flex items-center gap-2"><Phone size={10}/> WhatsApp</label>
                      <input 
                        disabled={!editMode}
                        value={whatsapp}
                        onChange={e => setWhatsapp(e.target.value)}
                        className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary outline-none disabled:opacity-60"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-black text-gray-500 mb-1 flex items-center gap-2"><MapPin size={10}/> Full Address</label>
                      <textarea 
                        disabled={!editMode}
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:border-primary outline-none disabled:opacity-60 min-h-[80px]"
                      />
                    </div>
                  </div>

                  {editMode && (
                    <button 
                      type="submit" 
                      disabled={saving}
                      className="w-full bg-primary text-black font-bold py-3 rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                    >
                      {saving ? <Loader2 className="animate-spin" size={18}/> : <><Save size={18}/> Save Changes</>}
                    </button>
                  )}
                </form>

                {/* Email (Read Only) */}
                <div className="mt-8 pt-8 border-t border-white/5">
                  <label className="block text-[10px] uppercase font-black text-gray-600 mb-1">Email Address</label>
                  <p className="text-sm text-gray-400 font-mono">{user?.email}</p>
                  <div className="mt-4 flex items-center gap-2 text-[10px] text-green-500 font-bold uppercase tracking-widest bg-green-500/5 w-fit px-2 py-1 rounded-md border border-green-500/10">
                    <Shield size={12}/> Verified Account
                  </div>
                </div>
              </section>

              <section className="p-8 border border-white/5 rounded-[40px] text-center bg-white/5">
                 <p className="text-gray-500 text-sm mb-4">Need further help or have a new project inquiry?</p>
                 <Link href="/contact" className="text-primary font-black uppercase text-xs tracking-widest hover:underline">Contact Support →</Link>
              </section>
            </div>

          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
