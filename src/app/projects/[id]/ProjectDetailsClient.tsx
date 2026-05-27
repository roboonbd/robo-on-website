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
      <section className="relative h-[50vh] min-h-[400px] md:h-[80vh] w-full overflow-hidden bg-black/20">
        <AnimatePresence mode="popLayout">
          {project.images && project.images.length > 0 ? (
            <motion.img
              key={activeImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              src={project.images[activeImageIndex]}
              alt={project.title}
              className="w-full h-full object-cover relative z-0"
            />
          ) : (
            <div className="w-full h-full bg-gray-900 flex items-center justify-center">
               <Cpu size={48} className="text-white/10" />
            </div>
          )}
        </AnimatePresence>
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0414] via-[#0a0414]/40 to-transparent z-10 pointer-events-none" />
        
        <div className="absolute top-8 left-8 z-30">
          <Link href="/projects" className="flex items-center gap-2 bg-black/60 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full hover:bg-primary hover:text-black transition-all shadow-2xl">
            <ArrowLeft size={20} /> <span className="font-bold">Back</span>
          </Link>
        </div>

        <div className="absolute bottom-12 left-0 right-0 px-4 sm:px-6 lg:px-8 z-20 text-center">
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
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4 drop-shadow-2xl"
          >
            {project.title}
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center gap-4 mt-6"
          >
             <span className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-sm font-bold uppercase tracking-widest ${project.status === 'Completed' ? 'text-green-400' : 'text-primary'}`}>
                <CheckCircle2 size={16} /> {project.status || 'Active'}
             </span>
          </motion.div>
        </div>

        {/* Fullscreen Trigger */}
        <button 
          onClick={() => setIsFullScreen(true)}
          className="absolute bottom-8 right-8 z-30 p-4 bg-primary text-black rounded-full hover:bg-white transition-all shadow-[0_0_20px_rgba(22,163,74,0.4)] active:scale-95 cursor-pointer"
          aria-label="View Fullscreen"
        >
          <Maximize2 size={24} />
        </button>

        {/* Gallery Navigation Controls */}
        {project.images && project.images.length > 1 && (
          <div className="contents md:block">
            <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-4 bg-black/40 hover:bg-black/60 rounded-full backdrop-blur-md transition-all text-white border border-white/10 active:scale-90">
              <ChevronLeft size={32} />
            </button>
            <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-4 bg-black/40 hover:bg-black/60 rounded-full backdrop-blur-md transition-all text-white border border-white/10 active:scale-90">
              <ChevronRight size={32} />
            </button>
          </div>
        )}
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Thumbnail Strip */}
            {project.images && project.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar no-scrollbar touch-pan-x">
                {project.images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`flex-shrink-0 w-32 h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImageIndex === idx ? 'border-primary' : 'border-white/10 opacity-50'}`}
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
            className="fixed inset-0 z-[200] bg-black flex flex-col overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 md:p-6 z-[220] bg-black/60 backdrop-blur-md border-b border-white/10">
              <span className="text-sm font-mono text-white/70 bg-white/5 px-3 py-1 rounded-full">
                {activeImageIndex + 1} / {project.images?.length || 0}
              </span>
              <button 
                onClick={() => setIsFullScreen(false)} 
                className="p-2 bg-white/10 hover:bg-primary hover:text-black rounded-full transition-all text-white cursor-pointer"
              >
                <X size={32} />
              </button>
            </div>
            
            {/* Modal Content - Scrollable */}
            <div className="flex-grow overflow-y-auto overflow-x-hidden p-4 md:p-12 scroll-smooth">
               <div className="relative w-full max-w-5xl mx-auto flex items-start justify-center min-h-full py-8 md:py-12">
                 <button 
                   onClick={(e) => { e.stopPropagation(); prevImage(); }} 
                   className="fixed left-4 top-1/2 -translate-y-1/2 z-[230] p-4 bg-black/60 hover:bg-primary hover:text-black rounded-full transition-all text-white border border-white/10 backdrop-blur-md active:scale-90 hidden md:flex"
                 >
                   <ChevronLeft size={48} />
                 </button>
                 
                 <motion.img 
                   key={activeImageIndex}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   src={project.images[activeImageIndex]} 
                   className="w-full h-auto max-w-full shadow-[0_20px_80px_rgba(0,0,0,0.9)] rounded-2xl ring-1 ring-white/10"
                   onClick={(e) => e.stopPropagation()}
                 />

                 <button 
                   onClick={(e) => { e.stopPropagation(); nextImage(); }} 
                   className="fixed right-4 top-1/2 -translate-y-1/2 z-[230] p-4 bg-black/60 hover:bg-primary hover:text-black rounded-full transition-all text-white border border-white/10 backdrop-blur-md active:scale-90 hidden md:flex"
                 >
                   <ChevronRight size={48} />
                 </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
