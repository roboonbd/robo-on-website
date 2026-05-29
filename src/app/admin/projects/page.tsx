"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Zap, Code2, Loader2, Image as ImageIcon, Upload, Save, X, Settings2, User as UserIcon } from "lucide-react";
import { db, PROJECT_ID, auth } from "@/lib/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, query, orderBy, updateDoc, setDoc } from "firebase/firestore";
import { useAuth } from "@/lib/AuthContext";

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  technicalDescription?: string;
  customerEmail?: string;
  images?: string[];
  status: string;
  team: number;
}

interface Category {
  id: string;
  name: string;
}

export default function AdminProjects() {
  const { user, role } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Category Management State
  const [isManagingCategories, setIsManagingCategories] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("Active");
  const [customerEmail, setCustomerEmail] = useState("");
  const [desc, setDesc] = useState("");
  const [techDesc, setTechDesc] = useState("");
  const [images, setImages] = useState<string[]>([""]);
  const [previews, setPreviews] = useState<(string | null)[]>([]);
  const [uploading, setUploading] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Parallelize fetching Categories and Projects
      const [catSnap, projectSnap] = await Promise.all([
        getDocs(collection(db, "categories")),
        getDocs(query(collection(db, "projects"), orderBy("createdAt", "desc")))
      ]);

      let catData = catSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Category[];
      
      // Default categories if none exist
      if (catData.length === 0) {
        const defaults = ["IoT", "Robotics", "Hardware", "Software"];
        for (const name of defaults) {
          const docRef = await addDoc(collection(db, "categories"), { name });
          catData.push({ id: docRef.id, name });
        }
      }
      setCategories(catData);
      if (!category && catData.length > 0) setCategory(catData[0].name);

      const data = projectSnap.docs.map(doc => {
        const d = doc.data();
        const images = d.images || (d.image ? [d.image] : []);
        return { id: doc.id, ...d, images };
      }) as Project[];
      setProjects(data);
      
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const filteredImages = images.filter(img => img.trim() !== "");
    try {
      const projectData = {
        title,
        category,
        status,
        customerEmail: customerEmail.toLowerCase().trim(),
        description: desc,
        technicalDescription: techDesc,
        images: filteredImages,
        team: 1,
      };

      if (editingId) {
        await updateDoc(doc(db, "projects", editingId), projectData);
        setProjects(projects.map(p => p.id === editingId ? { ...p, ...projectData } : p));
      } else {
        const docRef = await addDoc(collection(db, "projects"), {
          ...projectData,
          createdAt: serverTimestamp()
        });
        setProjects([{ id: docRef.id, ...projectData }, ...projects]);
      }
      resetForm();
    } catch (err: any) {
      console.error("SAVE ERROR:", err);
      alert("Failed to save project: " + err.message);
    }
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setTitle("");
    setDesc("");
    setTechDesc("");
    setCustomerEmail("");
    setStatus("Active");
    setImages([""]);
    setPreviews([]);
    if (categories.length > 0) setCategory(categories[0].name);
  };

  const handleEdit = (project: Project) => {
    setTitle(project.title);
    setCategory(project.category);
    setStatus(project.status || "Active");
    setCustomerEmail(project.customerEmail || "");
    setDesc(project.description);
    setTechDesc(project.technicalDescription || "");
    setImages(project.images && project.images.length > 0 ? project.images : [""]);
    setEditingId(project.id);
    setIsAdding(true);
  };

  // Category Management Handlers
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const docRef = await addDoc(collection(db, "categories"), { name: newCategoryName });
      setCategories([...categories, { id: docRef.id, name: newCategoryName }]);
      setNewCategoryName("");
    } catch (err) {
      console.error("Error adding category:", err);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !newCategoryName.trim()) return;
    try {
      await updateDoc(doc(db, "categories", editingCategory.id), { name: newCategoryName });
      setCategories(categories.map(c => c.id === editingCategory.id ? { ...c, name: newCategoryName } : c));
      setEditingCategory(null);
      setNewCategoryName("");
    } catch (err) {
      console.error("Error updating category:", err);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Delete this category? Projects using it will still show it but won't be filterable correctly.")) return;
    try {
      await deleteDoc(doc(db, "categories", id));
      setCategories(categories.filter(c => c.id !== id));
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  const handleFileUpload = async (index: number, file: File) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Image too large (max 2MB)");
      return;
    }

    try {
      setUploading(index);
      const localUrl = URL.createObjectURL(file);
      const newPreviews = [...previews];
      newPreviews[index] = localUrl;
      setPreviews(newPreviews);

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 1000;
          let width = img.width;
          let height = img.height;
          if (width > height ? width > MAX_SIZE : height > MAX_SIZE) {
            const ratio = MAX_SIZE / Math.max(width, height);
            width *= ratio; height *= ratio;
          }
          canvas.width = width; canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.7);
          handleImageChange(index, compressed);
          setUploading(null);
        };
      };
    } catch (err) {
      console.error("CONVERSION ERROR:", err);
      setUploading(null);
    }
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
    const newPreviews = [...previews];
    newPreviews[index] = null;
    setPreviews(newPreviews);
  };

  const addImageField = () => {
    setImages([...images, ""]);
    setPreviews([...previews, null]);
  };
  
  const removeImageField = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Project Showcase Management</h1>
          <p className="text-gray-400 text-sm">Add and organize your engineering portfolio items.</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setIsManagingCategories(!isManagingCategories)}
            className="bg-white/5 text-white font-bold px-6 py-2.5 rounded-full hover:bg-white/10 transition-colors flex items-center gap-2 border border-white/10"
          >
            <Settings2 size={18} /> Manage Categories
          </button>
          <button 
            onClick={() => isAdding ? resetForm() : setIsAdding(true)}
            className="bg-primary text-black font-bold px-6 py-2.5 rounded-full hover:bg-white transition-colors flex items-center gap-2 shadow-[0_4px_15px_rgba(255,87,34,0.3)]"
          >
            <Plus size={18} /> {isAdding && !editingId ? "Cancel" : "Add Project"}
          </button>
        </div>
      </div>

      {/* Category Manager */}
      {isManagingCategories && (
        <div className="mb-8 p-6 glass-card rounded-3xl border border-primary/30 space-y-4">
          <h3 className="text-xl font-bold text-white">Manage Project Categories</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              value={newCategoryName} 
              onChange={e => setNewCategoryName(e.target.value)}
              placeholder="Category Name" 
              className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-3 sm:py-2 text-white outline-none focus:border-primary" 
            />
            <button 
              onClick={editingCategory ? handleUpdateCategory : handleAddCategory}
              className="bg-primary text-black font-bold px-6 py-3 sm:py-2 rounded-xl hover:bg-white transition-all whitespace-nowrap"
            >
              {editingCategory ? "Update" : "Add Category"}
            </button>
            {editingCategory && <button onClick={() => {setEditingCategory(null); setNewCategoryName("");}} className="p-2 text-gray-400 hover:text-white flex items-center justify-center"><X /></button>}
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <div key={cat.id} className="flex items-center gap-2 bg-black/40 border border-white/10 px-3 py-1.5 rounded-full group">
                <span className="text-sm text-gray-300">{cat.name}</span>
                <button onClick={() => {setEditingCategory(cat); setNewCategoryName(cat.name);}} className="text-gray-500 hover:text-primary transition-colors"><Edit2 size={12}/></button>
                <button onClick={() => handleDeleteCategory(cat.id)} className="text-gray-500 hover:text-red-400 transition-colors"><X size={12}/></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {isAdding && (
        <form onSubmit={handleAddProject} className="mb-8 p-8 glass-card rounded-3xl border border-white/10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Project Title</label>
              <input required value={title} onChange={e => setTitle(e.target.value)} type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none">
                <option>Active</option><option>Completed</option><option>Archived</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none">
                {categories.map(c => <option key={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                 <UserIcon size={14} className="text-primary" /> Customer Email (Optional - for private dashboard tracking)
              </label>
              <input value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} type="email" placeholder="customer@email.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" />
            </div>
            
            <div className="md:col-span-3">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-gray-500 uppercase">Gallery (Free Upload or URL)</label>
                <button type="button" onClick={addImageField} className="text-primary text-xs font-bold hover:underline flex items-center gap-1">
                  <Plus size={14} /> Add Image Slot
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {images.map((img, idx) => (
                  <div key={idx} className="space-y-2 p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex gap-2">
                      <input value={img} onChange={e => handleImageChange(idx, e.target.value)} type="url" placeholder="URL or Upload →" className="flex-grow bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-primary" />
                      <label className="p-2 cursor-pointer bg-primary/10 border border-primary/20 rounded-lg hover:bg-primary/20 text-primary">
                        {uploading === idx ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                        <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFileUpload(idx, e.target.files[0])} />
                      </label>
                      <button type="button" onClick={() => removeImageField(idx)} className="p-2 text-gray-500 hover:text-red-400 bg-black/40 rounded-lg border border-white/5"><Trash2 size={16}/></button>
                    </div>
                    {(img || previews[idx]) && <div className="h-24 w-full rounded-lg overflow-hidden border border-white/10"><img src={previews[idx] || img} className="w-full h-full object-cover" /></div>}
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Main Description</label>
              <textarea required value={desc} onChange={e => setDesc(e.target.value)} placeholder="General overview of the project..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none min-h-[100px]" />
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2 text-primary">Technical Description (Specs, Components, Logic)</label>
              <textarea value={techDesc} onChange={e => setTechDesc(e.target.value)} placeholder="List technical specifications, hardware used, or complex logic details..." className="w-full bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 text-white focus:border-primary outline-none min-h-[150px]" />
            </div>
          </div>
          <div className="flex gap-4">
            <button type="submit" className="bg-primary text-black font-bold px-12 py-4 rounded-xl hover:bg-white transition-all shadow-xl shadow-primary/20 flex items-center gap-2">
              <Save size={20} /> Save Project Details
            </button>
            <button type="button" onClick={resetForm} className="bg-white/5 text-gray-400 font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition-all border border-white/10">Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-primary" size={32} /></div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 text-gray-500 border-2 border-dashed border-white/5 rounded-3xl"><ImageIcon size={48} className="mx-auto mb-4 opacity-20" /><p>Empty Portfolio</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div key={p.id} className="glass-card rounded-2xl border border-white/5 relative group overflow-hidden flex flex-col hover:border-primary/30 transition-all">
              <div className="h-44 bg-gray-900 relative">
                <img src={p.images?.[0] || "https://www.transparenttextures.com/patterns/cubes.png"} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 right-4 flex gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(p)} className="p-2 bg-black/60 backdrop-blur-md rounded-lg text-white hover:bg-primary hover:text-black transition-all"><Edit2 size={16} /></button>
                  <button onClick={async () => {if(confirm("Delete?")) {await deleteDoc(doc(db, "projects", p.id)); setProjects(projects.filter(pr => pr.id !== p.id))}}} className="p-2 bg-black/60 backdrop-blur-md rounded-lg text-white hover:bg-red-500 transition-all"><Trash2 size={16} /></button>
                </div>
                <div className="absolute bottom-4 left-4 flex gap-2">
                   <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${p.status === 'Completed' ? 'bg-green-500 text-black' : 'bg-primary text-black'}`}>{p.status}</span>
                   <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/60 text-white font-bold backdrop-blur-md border border-white/10 uppercase tracking-widest">{p.category}</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 truncate">{p.title}</h3>
                <p className="text-sm text-gray-400 line-clamp-2 mb-4">{p.description}</p>
                {p.customerEmail && <div className="text-[10px] text-primary/60 font-mono flex items-center gap-1 uppercase tracking-tighter border-t border-white/5 pt-4">Assigned to: {p.customerEmail}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
