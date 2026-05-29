"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Wrench, TrendingUp, Loader2, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit, getCountFromServer, where } from "firebase/firestore";

interface Project {
  id: string;
  title: string;
  status: string;
  createdAt?: any;
  category: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState([
    { label: "Total Projects", value: "...", icon: Wrench, trend: "Live", trendUp: true },
    { label: "Completed Projects", value: "...", icon: CheckCircle2, trend: "Live", trendUp: true },
    { label: "Active Projects", value: "...", icon: Clock, trend: "Live", trendUp: false },
    { label: "Total Users", value: "...", icon: Users, trend: "Live", trendUp: true },
  ]);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Use count aggregations for efficiency
        const [
          totalProjectsSnap,
          completedProjectsSnap,
          activeProjectsSnap,
          totalUsersSnap,
          recentSnap
        ] = await Promise.all([
          getCountFromServer(collection(db, "projects")),
          getCountFromServer(query(collection(db, "projects"), where("status", "==", "Completed"))),
          getCountFromServer(query(collection(db, "projects"), where("status", "==", "Active"))),
          getCountFromServer(collection(db, "users")),
          getDocs(query(collection(db, "projects"), orderBy("createdAt", "desc"), limit(5)))
        ]);

        setStats([
          { label: "Total Projects", value: totalProjectsSnap.data().count.toString(), icon: Wrench, trend: "Live", trendUp: true },
          { label: "Completed Projects", value: completedProjectsSnap.data().count.toString(), icon: CheckCircle2, trend: "Live", trendUp: true },
          { label: "Active Projects", value: activeProjectsSnap.data().count.toString(), icon: Clock, trend: "Live", trendUp: false },
          { label: "Total Users", value: totalUsersSnap.data().count.toString(), icon: Users, trend: "Live", trendUp: true },
        ]);

        setRecentProjects(recentSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Project[]);

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-6 rounded-2xl border border-white/5 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-10 -mt-10 transition-all transform-gpu" style={{ background: 'radial-gradient(circle, rgba(255,87,34,0.1) 0%, rgba(255,87,34,0) 70%)' }}></div>
            
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 group-hover:border-primary/30 transition-colors">
                <stat.icon size={20} className="text-gray-400 group-hover:text-primary transition-colors" />
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-md bg-white/5 border border-white/10 text-gray-400`}>
                {stat.trend}
              </span>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-3xl font-extrabold text-white mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        {/* Recent Activity */}
        <div className="lg:col-span-2 glass-card rounded-2xl border border-white/5 p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Recent Projects</h2>
            <Link href="/admin/projects" className="text-sm text-primary hover:text-white transition-colors">View All →</Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          ) : recentProjects.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
               <p>No projects found. Add your first project to see it here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div key={project.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${project.status === 'Completed' ? 'bg-green-500' : 'bg-primary shadow-[0_0_10px_rgba(255,87,34,0.5)]'}`}></div>
                    <div>
                      <h4 className="font-semibold text-white group-hover:text-primary transition-colors">{project.title}</h4>
                      <p className="text-xs text-gray-500">{project.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${project.status === 'Completed' ? 'bg-green-500/10 text-green-500' : 'bg-primary/10 text-primary'}`}>
                      {project.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="glass-card rounded-2xl border border-white/5 p-6 md:p-8 flex flex-col">
          <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
          
          <div className="space-y-4 flex-1">
            <Link href="/admin/projects" className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-primary/10 hover:border-primary/30 group transition-all">
              <div className="p-2 bg-black/40 rounded-lg group-hover:bg-primary/20 transition-colors">
                <Wrench size={20} className="text-gray-400 group-hover:text-primary transition-colors" />
              </div>
              <div>
                <h4 className="font-semibold text-white group-hover:text-primary transition-colors">Manage Projects</h4>
                <p className="text-xs text-gray-500">Showcase a new client build</p>
              </div>
            </Link>

            <Link href="/admin/users" className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-primary/10 hover:border-primary/30 group transition-all">
              <div className="p-2 bg-black/40 rounded-lg group-hover:bg-primary/20 transition-colors">
                <Users size={20} className="text-gray-400 group-hover:text-primary transition-colors" />
              </div>
              <div>
                <h4 className="font-semibold text-white group-hover:text-primary transition-colors">Manage Users</h4>
                <p className="text-xs text-gray-500">Manage administrator access</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
