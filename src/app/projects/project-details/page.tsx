"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import ProjectDetailsClient from "../[id]/ProjectDetailsClient";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

function ProjectDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "projects", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const d = docSnap.data();
          const images = d.images || (d.image ? [d.image] : []);
          setProject({ id: docSnap.id, ...d, images });
        }
      } catch (err) {
        console.error("Error fetching project:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0414] text-white">
        <Loader2 size={48} className="text-primary animate-spin mb-4" />
        <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">Loading Project Data...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0414] text-white">
        <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
        <p className="text-gray-400 mb-8">The project you are looking for doesn't exist or has been removed.</p>
        <Link href="/projects" className="text-primary hover:underline flex items-center gap-2 bg-white/5 px-6 py-3 rounded-full border border-white/10 transition-all">
          <ArrowLeft size={20} /> Back to Projects
        </Link>
      </div>
    );
  }

  return <ProjectDetailsClient project={project} />;
}

export default function ProjectDetailsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0414] text-white">
        <Loader2 size={48} className="text-primary animate-spin mb-4" />
        <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">Initializing...</p>
      </div>
    }>
      <ProjectDetailContent />
    </Suspense>
  );
}
