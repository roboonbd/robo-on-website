"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Code2, Cpu, Wrench, LayoutGrid, Loader2 } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Fetch Categories from DB
        const catSnap = await getDocs(collection(db, "categories"));
        const catData = catSnap.docs.map(doc => doc.data().name);
        setCategories(["All", ...catData]);

        // Fetch Projects
        const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const projectsData = querySnapshot.docs.map(doc => {
          const d = doc.data();
          const images = d.images || (d.image ? [d.image] : []);
          return {
            id: doc.id,
            ...d,
            images,
            icon: d.category === 'Robotics' ? Wrench : Cpu
          };
        });
        
        setProjects(projectsData);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredProjects = activeCategory === "All" 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  return (
    <div className="w-full flex justify-center pb-32 relative overflow-hidden">
      <div className="absolute top-40 left-0 -translate-x-1/4 text-primary/5 pointer-events-none -z-10">
         <Cpu size={800} strokeWidth={0.5} />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 relative z-10 w-full">
        
        <div className="text-center mb-12 sm:mb-20 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full -z-10 pointer-events-none transform-gpu" style={{ background: 'radial-gradient(circle, rgba(22,163,74,0.15) 0%, rgba(22,163,74,0) 70%)' }} />
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-tight text-white px-4"
          >
            Engineering <span className="text-gradient">Portfolio</span>
          </motion.h1>
          
          {/* Dynamic Category Tabs */}
          {!loading && categories.length > 1 && (
            <div className="flex flex-wrap justify-center gap-2 mt-12 mb-8">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all uppercase tracking-widest border ${
                    activeCategory === cat 
                      ? "bg-primary text-black border-primary shadow-[0_0_20px_rgba(22,163,74,0.4)]" 
                      : "bg-white/5 text-gray-400 border-white/10 hover:border-primary/50 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
             <Loader2 size={48} className="text-primary animate-spin" />
             <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">Compiling Showcase...</p>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="glass-card rounded-2xl overflow-hidden group border border-white/5 hover:border-primary/40 transition-all duration-500 hover:shadow-[0_10px_40px_rgba(255,87,34,0.15)] flex flex-col h-full"
                >
                  {/* Project Image Header */}
                  <div className="relative h-64 bg-gray-900 flex items-center justify-center overflow-hidden">
                    <img 
                      src={project.images?.[0] || "https://www.transparenttextures.com/patterns/cubes.png"} 
                      alt={project.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-75 group-hover:brightness-100" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0414] to-transparent z-0 opacity-80" />
                    
                    <div className="absolute top-4 left-4 z-20 flex gap-2">
                       <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${project.status === 'Completed' ? 'bg-green-500 text-black' : 'bg-primary text-black'}`}>
                          {project.status || 'Active'}
                       </span>
                    </div>

                    <div className="absolute top-4 right-4 z-20">
                      <span className="bg-black/60 backdrop-blur-md text-white/90 text-[10px] font-black uppercase px-3 py-1.5 rounded-full border border-white/10 tracking-widest">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  {/* Project Details */}
                  <Link href={`/projects/${project.id}`} className="p-8 flex-grow flex flex-col relative z-20 -mt-6 bg-[#0a0414]/90 backdrop-blur-xl rounded-t-3xl shadow-[0_-10px_20px_rgba(0,0,0,0.5)] group/link">
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors flex items-center justify-between">
                      {project.title}
                      <ExternalLink size={20} className="opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all text-primary" />
                    </h3>
                    
                    <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                      {project.description}
                    </p>
                    
                    <div className="mt-auto flex items-center justify-between">
                       <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                          <LayoutGrid size={12} className="text-primary" /> Detail View →
                       </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {filteredProjects.length === 0 && !loading && (
          <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl">
             <LayoutGrid size={48} className="mx-auto mb-4 opacity-10 text-white" />
             <p className="text-gray-500 uppercase tracking-widest font-bold text-sm">No projects in this category yet</p>
          </div>
        )}
        
        <div className="mt-20 text-center">
          <p className="text-gray-400 mb-6">Have a challenging idea in mind?</p>
          <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-primary text-black hover:bg-white px-8 py-4 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(22,163,74,0.3)]">
            Let's Build It Together <Wrench size={18} />
          </Link>
        </div>

      </div>
    </div>
  );
}
