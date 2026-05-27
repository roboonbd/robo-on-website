import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import ProjectDetailsClient from "./ProjectDetailsClient";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

// This function is REQUIRED for 'output: export' with dynamic routes
export async function generateStaticParams() {
  try {
    const querySnapshot = await getDocs(collection(db, "projects"));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
    }));
  } catch (err) {
    console.error("Error generating static params:", err);
    return [];
  }
}

async function getProject(id: string) {
  try {
    const docRef = doc(db, "projects", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const d = docSnap.data();
      const images = d.images || (d.image ? [d.image] : []);
      return { id: docSnap.id, ...d, images };
    }
    return null;
  } catch (err) {
    console.error("Error fetching project:", err);
    return null;
  }
}

export default async function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0414] text-white">
        <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
        <Link href="/projects" className="text-primary hover:underline flex items-center gap-2">
          <ArrowLeft size={20} /> Back to Projects
        </Link>
      </div>
    );
  }

  return <ProjectDetailsClient project={project} />;
}
