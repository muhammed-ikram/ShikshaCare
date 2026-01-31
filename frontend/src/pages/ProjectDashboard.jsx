import { useState, useEffect } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import { Plus, Folder, Calendar, Github, Globe, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const ProjectDashboard = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newProject, setNewProject] = useState({
        title: "", description: "", techStack: "", deadline: "", repoLink: "", liveLink: ""
    });
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await api.get("/api/projects");
            setProjects(res.data.projects);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setCreating(true);
        try {
            const payload = {
                ...newProject,
                techStack: newProject.techStack.split(",").map(s => s.trim())
            };
            await api.post("/api/projects", payload);
            setShowModal(false);
            setNewProject({ title: "", description: "", techStack: "", deadline: "", repoLink: "", liveLink: "" });
            fetchProjects();
        } catch (error) {
            alert("Failed to create project");
        } finally {
            setCreating(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading Projects...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
                        <p className="text-gray-500">Manage your portfolio and track progress</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-primary hover:bg-accent text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-primary/30 flex items-center gap-2 transition-all"
                    >
                        <Plus size={20} /> New Project
                    </button>
                </div>

                {projects.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                        <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-700">No projects yet</h3>
                        <p className="text-gray-500 mb-6">Start building your first masterpiece!</p>
                        <button onClick={() => setShowModal(true)} className="text-primary font-medium hover:underline">
                            Create now
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <Link to={`/projects/${project._id}`} key={project._id}>
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer h-full flex flex-col"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${project.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                            project.status === 'In Progress' ? 'bg-secondary/20 text-secondary' : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {project.status}
                                        </div>
                                        {project.repoLink && <Github size={18} className="text-gray-400" />}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">{project.title}</h3>
                                    <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">{project.description}</p>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {project.techStack.slice(0, 3).map((tech, i) => (
                                            <span key={i} className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-md border border-gray-200">
                                                {tech}
                                            </span>
                                        ))}
                                        {project.techStack.length > 3 && <span className="text-xs text-gray-400">+{project.techStack.length - 3}</span>}
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-auto pt-4 border-t border-gray-100">
                                        <Calendar size={14} />
                                        <span>Deadline: {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'}</span>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl">
                        <h2 className="text-2xl font-bold mb-6">Create New Project</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input required type="text" className="w-full p-3 border rounded-lg"
                                    value={newProject.title} onChange={e => setNewProject({ ...newProject, title: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea className="w-full p-3 border rounded-lg" rows="3"
                                    value={newProject.description} onChange={e => setNewProject({ ...newProject, description: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tech Stack (comma separated)</label>
                                <input type="text" className="w-full p-3 border rounded-lg" placeholder="React, Node, MongoDB"
                                    value={newProject.techStack} onChange={e => setNewProject({ ...newProject, techStack: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                                <input type="date" className="w-full p-3 border rounded-lg"
                                    value={newProject.deadline} onChange={e => setNewProject({ ...newProject, deadline: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Repo Link</label>
                                    <input type="url" className="w-full p-3 border rounded-lg"
                                        value={newProject.repoLink} onChange={e => setNewProject({ ...newProject, repoLink: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Live Link</label>
                                    <input type="url" className="w-full p-3 border rounded-lg"
                                        value={newProject.liveLink} onChange={e => setNewProject({ ...newProject, liveLink: e.target.value })} />
                                </div>
                            </div>
                            <div className="flex gap-3 justify-end mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                                <button type="submit" disabled={creating} className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-accent disabled:opacity-50">
                                    {creating ? "Creating..." : "Create Project"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectDashboard;
