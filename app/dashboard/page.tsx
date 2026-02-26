"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Project {
    id: string;
    title: string;
    description: string;
    status: "ACTIVE" | "COMPLETED";
    createdAt: string;
}

export default function DashboardPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ title: "", description: "" });
    const [user, setUser] = useState<any>(null);

    // Pagination state
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const router = useRouter();

    const fetchProjects = useCallback(async (currentPage: number = 1) => {
        setError("");
        setLoading(true);

        try {
            const res = await fetch(`/api/projects?page=${currentPage}&limit=6`, {
                headers: { "Content-Type": "application/json" },
                // Use 'include' to send HttpOnly cookies
                credentials: "include",
            });

            const json = await res.json();

            if (res.status === 401) {
                // Auth failed, clean up and redirect
                setUser(null);
                localStorage.removeItem("user");
                router.push("/login");
                return;
            }

            if (!res.ok) {
                throw new Error(json.message || "Failed to fetch projects");
            }

            // Handle the new standardized response format: { success, data, meta }
            setProjects(json.data);
            if (json.meta) {
                setTotalPages(json.meta.pages);
                setPage(json.meta.page);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
        fetchProjects(1);
    }, [fetchProjects]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = editingId ? "PUT" : "POST";
        const url = editingId ? `/api/projects/${editingId}` : "/api/projects";

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(formData),
            });

            const json = await res.json();

            if (res.status === 401) {
                handleLogout();
                return;
            }

            if (!res.ok) throw new Error(json.message || "Operation failed");

            setFormData({ title: "", description: "" });
            setEditingId(null);
            setIsModalOpen(false);
            fetchProjects(page);
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this project?")) return;

        try {
            const res = await fetch(`/api/projects/${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (res.status === 401) {
                handleLogout();
                return;
            }

            if (!res.ok) throw new Error("Delete failed");
            fetchProjects(page);
        } catch (err: any) {
            alert(err.message);
        }
    };

    const toggleStatus = async (project: Project) => {
        const newStatus = project.status === "ACTIVE" ? "COMPLETED" : "ACTIVE";

        try {
            const res = await fetch(`/api/projects/${project.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.status === 401) {
                handleLogout();
                return;
            }

            if (!res.ok) throw new Error("Update failed");
            fetchProjects(page);
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
        } catch (e) {
            console.error("Logout error:", e);
        }
        localStorage.removeItem("user");
        setUser(null);
        router.push("/login");
    };

    return (
        <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100">
            {/* Navbar */}
            <nav className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-blue-600"></div>
                        <span className="text-xl font-bold tracking-tight text-white">RCWings</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <span className="text-sm font-medium text-white">{user?.name || "User"}</span>
                            <span className="text-[10px] text-zinc-500">{user?.email}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="ml-4 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Your Projects</h1>
                        <p className="mt-1 text-zinc-400">Manage and track your active tasks.</p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingId(null);
                            setFormData({ title: "", description: "" });
                            setIsModalOpen(true);
                        }}
                        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg shadow-blue-900/20"
                    >
                        <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Project
                    </button>
                </div>

                {/* Content Section */}
                <div className="mt-10">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-blue-600"></div>
                        </div>
                    ) : error ? (
                        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-center text-red-400">
                            {error}
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="rounded-2xl border-2 border-dashed border-zinc-800 py-20 text-center">
                            <svg className="mx-auto h-12 w-12 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <h3 className="mt-4 text-lg font-medium text-white">No projects found</h3>
                            <p className="mt-1 text-zinc-500">Get started by creating your first project.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {projects.map((project) => (
                                    <div
                                        key={project.id}
                                        className="group relative flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 transition-all hover:border-zinc-700 hover:bg-zinc-900/60 hover:shadow-xl hover:shadow-black/20"
                                    >
                                        <div className="flex items-start justify-between">
                                            <button
                                                onClick={() => toggleStatus(project)}
                                                className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-950 ${project.status === "COMPLETED"
                                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 focus:ring-emerald-500"
                                                    : "bg-blue-500/10 text-blue-400 border border-blue-500/20 focus:ring-blue-500"
                                                    }`}
                                                aria-pressed={project.status === "COMPLETED"}
                                            >
                                                {project.status}
                                            </button>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingId(project.id);
                                                        setFormData({ title: project.title, description: project.description });
                                                        setIsModalOpen(true);
                                                    }}
                                                    className="text-zinc-500 hover:text-white transition-colors"
                                                    aria-label={`Edit ${project.title}`}
                                                >
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(project.id)}
                                                    className="text-zinc-500 hover:text-red-400 transition-colors"
                                                    aria-label={`Delete ${project.title}`}
                                                >
                                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                        <h3 className="mt-4 text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                                            {project.title}
                                        </h3>
                                        <p className="mt-2 text-sm leading-relaxed text-zinc-400 line-clamp-3">
                                            {project.description || "No description provided."}
                                        </p>
                                        <div className="mt-auto pt-6 text-[10px] uppercase tracking-wider text-zinc-600 font-bold">
                                            Created {new Date(project.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="mt-10 flex items-center justify-center gap-2">
                                    <button
                                        disabled={page === 1}
                                        onClick={() => fetchProjects(page - 1)}
                                        className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 transition-all"
                                    >
                                        Previous
                                    </button>
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                            <button
                                                key={p}
                                                onClick={() => fetchProjects(p)}
                                                className={`h-10 w-10 rounded-lg text-sm font-bold transition-all ${p === page
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-zinc-900 text-zinc-400 hover:text-white"
                                                    }`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        disabled={page === totalPages}
                                        onClick={() => fetchProjects(page + 1)}
                                        className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 transition-all"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            {/* Modal */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                >
                    <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <h2 id="modal-title" className="text-2xl font-bold text-white">
                            {editingId ? "Edit Project" : "Create New Project"}
                        </h2>
                        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400">Title</label>
                                <input
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="mt-1 block w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-all"
                                    placeholder="Project name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-400">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="mt-1 block w-full h-32 rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-all resize-none"
                                    placeholder="Tell us more about this project..."
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="rounded-lg px-4 py-2.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20"
                                >
                                    {editingId ? "Save Changes" : "Create Project"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
