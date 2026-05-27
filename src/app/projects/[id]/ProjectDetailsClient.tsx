"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Zap, Code2, ArrowLeft, Maximize2, X, ChevronLeft, ChevronRight, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ProjectDetailsClient({ project }: { project: any }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const nextImage = () => {
    if (project.images && project.images.length > 0) {
      setActiveImageIndex((prev) => (prev + 1) % project.images.length);
    }
  };

  const prevImage = () => {
    if (project.images && project.images.length > 0) {
      setActiveImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0414] text-white pb-20">
      {/* Hero Section with Active Image */}
      <section className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            src={project.images[activeImageIndex] || "https://www.transparenttextures.com/patterns/cubes.png"}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0414] via-[#0a0414]/20 to-transparent" />
        
        <div className="absolute top-8 left-8 z-20">
          <Link href="/projects" className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full hover:bg-primary hover:text-black transition-all">
            <ArrowLeft size={18} /> Back to Projects
          </Link>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-7xl px-4 sm:px-6 lg:px-8 z-10 text-center">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 py-1.5 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full text-xs font-bold text-primary tracking-widest uppercase mb-4 inline-block"
          >
            {project.category}
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4"
          >
            {project.title}
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center gap-4 mt-6"
          >
             <span className={`flex items-center gap-2 px-3 py-1 rounded-lg bg-black/40 border border-white/10 text-xs font-bold uppercase tracking-widest ${project.status === 'Completed' ? 'text-green-400' : 'text-primary'}`}>
                <CheckCircle2 size={14} /> {project.status || 'Active'}
             </span>
          </motion.div>
        </div>

        {/* Fullscreen Trigger */}
        <button 
          onClick={() => setIsFullScreen(true)}
          className="absolute bottom-8 right-8 p-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-full hover:bg-white/10 transition-all text-white/70 hover:text-white"
        >
          <Maximize2 size={24} />
        </button>

        {/* Gallery Navigation Controls */}
        {project.images && project.images.length > 1 && (
          <>
            <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-sm transition-all text-white/50 hover:text-white border border-white/5">
              <ChevronLeft size={32} />
            </button>
            <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-sm transition-all text-white/50 hover:text-white border border-white/5">
              <ChevronRight size={32} />
            </button>
          </>
        )}
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Thumbnail Strip */}
            {project.images && project.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                {project.images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`flex-shrink-0 w-32 h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImageIndex === idx ? 'border-primary' : 'border-white/10 opacity-50 hover:opacity-100'}`}
                  >
                    <img src={img} alt={`${project.title} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="glass-card p-8 md:p-12 rounded-[40px] border border-white/5">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                 <FileText className="text-primary" /> Project Overview
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
                {project.description}
              </p>
            </div>

            {/* Technical Description Section */}
            {project.technicalDescription && (
              <div className="glass-card p-8 md:p-12 rounded-[40px] border border-primary/20 bg-primary/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <Cpu size={200} />
                </div>
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-primary">
                   <Zap /> Technical Implementation
                </h2>
                <div className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap font-mono bg-black/40 p-6 rounded-2xl border border-white/5">
                  {project.technicalDescription}
                </div>
              </div>
            )}

            {/* Project Specs/Details (If any) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="glass-card p-8 rounded-3xl border border-white/5 flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl text-primary">
                    <Zap size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Current Status</h4>
                    <p className="text-gray-400 font-bold">{project.status || 'Completed'}</p>
                  </div>
               </div>
               <div className="glass-card p-8 rounded-3xl border border-white/5 flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl text-primary">
                    <Cpu size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Project Category</h4>
                    <p className="text-gray-400 font-bold">{project.category}</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="glass-card p-8 rounded-3xl border border-white/5 bg-primary/5">
              <h3 className="text-xl font-bold mb-4">Interested?</h3>
              <p className="text-gray-400 text-sm mb-6">We can help you build something similar or entirely custom for your business.</p>
              <Link href="/contact" className="w-full flex items-center justify-center gap-2 bg-primary text-black py-4 rounded-xl font-bold hover:bg-white transition-all shadow-[0_0_20px_rgba(22,163,74,0.3)]">
                Request a Consultation
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullScreen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex flex-col"
          >
            <div className="flex justify-between items-center p-6 text-white">
              <span className="text-sm font-mono">{activeImageIndex + 1} / {project.images?.length || 0}</span>
              <button onClick={() => setIsFullScreen(false)} className="p-2 hover:bg-white/10 rounded-full transition-all">
                <X size={32} />
              </button>
            </div>
            
            <div className="flex-grow flex items-center justify-center relative p-4">
               <button onClick={prevImage} className="absolute left-4 p-4 hover:bg-white/10 rounded-full transition-all text-white/50 hover:text-white">
                 <ChevronLeft size={48} />
               </button>
               
               <motion.img 
                 key={activeImageIndex}
                 initial={{ scale: 0.9, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 src={project.images[activeImageIndex]} 
                 className="max-w-full max-h-full object-contain shadow-2xl"
               />

               <button onClick={nextImage} className="absolute right-4 p-4 hover:bg-white/10 rounded-full transition-all text-white/50 hover:text-white">
                 <ChevronRight size={48} />
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
