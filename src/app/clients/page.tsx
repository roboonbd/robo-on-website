"use client";

import { motion } from "framer-motion";
import { Cpu, Handshake, Star, Quote, Building2, Globe } from "lucide-react";
import Link from "next/link";

export default function ClientsPage() {
  const clients = [
    { name: "TechNova Solutions", logo: "TN", desc: "Leading provider of industrial automation.", type: "Robotics" },
    { name: "EcoGrid Energy", logo: "EG", desc: "Renewable energy monitoring systems.", type: "IoT" },
    { name: "SkyLink Systems", logo: "SL", desc: "Next-gen flight controller hardware.", type: "Embedded" },
    { name: "FutureLabs", logo: "FL", desc: "R&D partner for bio-inspired robotics.", type: "Research" },
    { name: "Delta Manufacturing", logo: "DM", desc: "Smart factory sensor networks.", type: "IoT" },
    { name: "Quantum Circuitry", logo: "QC", desc: "High-precision PCB design client.", type: "Hardware" },
  ];

  const testimonials = [
    {
      text: "RoboON's expertise in embedded systems transformed our product development cycle. Their precision and technical depth are unmatched.",
      author: "Sarah Johnson",
      position: "CTO, TechNova Solutions"
    },
    {
      text: "Working with the RoboON team was a game-changer for our IoT project. They delivered a scalable solution that exceeded our expectations.",
      author: "Michael Chen",
      position: "Lead Engineer, EcoGrid Energy"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0414] text-white pt-24 pb-32 overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-40 right-0 translate-x-1/2 text-primary/5 pointer-events-none -z-10">
         <Globe size={800} strokeWidth={0.5} />
      </div>
      <div className="absolute bottom-40 left-0 -translate-x-1/2 text-primary/5 pointer-events-none -z-10">
         <Handshake size={600} strokeWidth={0.5} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-bold mb-6"
          >
            <Handshake size={16} /> Trusted by Industry Leaders
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-8 tracking-tight"
          >
            Our <span className="text-gradient">Partners</span> & Clients
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
          >
            We've had the privilege of collaborating with forward-thinking companies across the globe to engineer the future of robotics and embedded technology.
          </motion.p>
        </div>

        {/* Clients Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8 mb-32">
          {clients.map((client, index) => (
            <motion.div
              key={client.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="glass-card p-8 md:p-12 rounded-[40px] border border-white/5 flex flex-col items-center text-center group hover:border-primary/40 transition-all duration-500"
            >
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl font-black text-primary mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-black transition-all">
                {client.logo}
              </div>
              <h3 className="text-xl font-bold mb-2 text-white group-hover:text-primary transition-colors">{client.name}</h3>
              <p className="text-xs text-gray-500 font-mono uppercase tracking-widest mb-4">{client.type}</p>
              <p className="text-sm text-gray-400 leading-relaxed">{client.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Testimonials Section */}
        <div className="relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Client <span className="text-primary">Voice</span></h2>
            <p className="text-gray-400">Direct feedback from those we've partnered with.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="glass-card p-10 rounded-[40px] border border-white/5 relative"
              >
                <Quote className="absolute top-8 right-8 text-primary/10" size={64} />
                <div className="flex gap-1 text-yellow-500 mb-6">
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                </div>
                <p className="text-xl italic text-gray-300 mb-8 leading-relaxed">"{t.text}"</p>
                <div>
                  <h4 className="font-bold text-white text-lg">{t.author}</h4>
                  <p className="text-primary text-sm font-semibold">{t.position}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-40 glass-card p-12 md:p-20 rounded-[50px] border border-white/10 text-center relative overflow-hidden"
        >
          <div className="absolute -bottom-20 -left-20 text-white/5 pointer-events-none">
            <Building2 size={400} strokeWidth={1} />
          </div>
          
          <h2 className="text-4xl md:text-6xl font-extrabold mb-8">Ready to be our next <span className="text-primary">Success Story?</span></h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12">Join our network of satisfied clients and let's engineer something extraordinary together.</p>
          <Link href="/contact" className="inline-flex items-center justify-center bg-primary text-black px-12 py-5 rounded-full font-bold text-xl hover:bg-white transition-all shadow-[0_0_40px_rgba(22,163,74,0.4)]">
            Start a Collaboration
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
