"use client";

import { useState, useEffect } from "react";
import { Users, Search, ShieldCheck, Mail, Calendar, Loader2, Trash2, Edit2, X, Check } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'moderator' | 'customer';
  createdAt: string;
  whatsapp?: string;
  address?: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserData[];
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleUpdate = async (userId: string, newRole: 'admin' | 'moderator' | 'customer') => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { role: newRole });
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      setEditingId(null);
    } catch (err) {
      console.error("Error updating role:", err);
      alert("Failed to update role");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This cannot be undone.")) return;
    try {
      await deleteDoc(doc(db, "users", userId));
      setUsers(users.filter(u => u.id !== userId));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const filteredUsers = users.filter(u => 
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Customer Management</h1>
          <p className="text-gray-400 text-sm">Monitor and manage access for your platform users.</p>
        </div>
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search customers..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white focus:border-primary outline-none transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredUsers.map((u) => (
            <div key={u.id} className="glass-card p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all group">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 font-bold text-lg">
                    {(u.firstName?.[0] || u.email?.[0] || '?').toUpperCase()}
                    {(u.lastName?.[0] || '').toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-white font-bold flex items-center gap-2">
                      {u.firstName || 'Unknown'} {u.lastName || 'User'}
                      {u.role === 'admin' && <ShieldCheck size={16} className="text-primary" />}
                    </h3>
                    <p className="text-gray-500 text-sm flex items-center gap-1">
                      <Mail size={12} /> {u.email}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-grow lg:flex-grow-0 lg:px-8 border-l border-white/5">
                  <div>
                    <span className="text-[10px] uppercase text-gray-500 font-bold block mb-1">Access Role</span>
                    <div className="flex items-center gap-2">
                      {editingId === u.id ? (
                        <select 
                          className="bg-[#111] border border-white/10 rounded-md text-xs px-2 py-1 text-white outline-none focus:border-primary"
                          value={u.role || 'customer'}
                          onChange={(e) => handleRoleUpdate(u.id, e.target.value as any)}
                        >
                          <option value="customer">Customer</option>
                          <option value="moderator">Moderator</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span className={`text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                          u.role === 'admin' ? 'bg-primary/20 text-primary' : 
                          u.role === 'moderator' ? 'bg-blue-500/20 text-blue-400' : 
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {u.role || 'Customer'}
                        </span>
                      )}
                      <button onClick={() => setEditingId(editingId === u.id ? null : u.id)} className="text-gray-600 hover:text-white transition-colors">
                        {editingId === u.id ? <X size={14}/> : <Edit2 size={14}/>}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-[10px] uppercase text-gray-500 font-bold block mb-1">Joined Date</span>
                    <p className="text-xs text-gray-300 font-mono">
                      {(() => {
                        try {
                          return u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A';
                        } catch {
                          return 'N/A';
                        }
                      })()}
                    </p>
                  </div>

                  <div className="hidden md:block">
                    <span className="text-[10px] uppercase text-gray-500 font-bold block mb-1">WhatsApp</span>
                    <p className="text-xs text-gray-300">{u.whatsapp || 'None'}</p>
                  </div>

                  <div className="flex justify-end items-center">
                    <button 
                      onClick={() => handleDeleteUser(u.id)}
                      className="p-2 text-gray-600 hover:text-red-500 transition-colors bg-white/5 rounded-lg border border-white/10"
                      title="Delete User"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
