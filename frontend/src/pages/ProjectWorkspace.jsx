import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Plus, ArrowLeft, MoreVertical, Trash2, Calendar, GripVertical } from "lucide-react";

const ProjectWorkspace = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState({ Todo: [], "In Progress": [], Done: [] });
    const [loading, setLoading] = useState(true);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [newTask, setNewTask] = useState({ title: "", description: "", priority: "Medium", dueDate: "" });

    useEffect(() => {
        fetchProjectData();
    }, [id]);

    const fetchProjectData = async () => {
        try {
            const res = await api.get(`/api/projects/${id}`);
            const { project, tasks } = res.data;
            setProject(project);

            // Group tasks by status
            const grouped = { Todo: [], "In Progress": [], Done: [] };
            tasks.forEach(t => {
                if (grouped[t.status]) grouped[t.status].push(t);
            });
            setTasks(grouped);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            await api.post("/api/tasks", { ...newTask, projectId: id });
            setShowTaskModal(false);
            setNewTask({ title: "", description: "", priority: "Medium", dueDate: "" });
            fetchProjectData(); // Refresh
        } catch (error) {
            alert("Failed to add task");
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (!confirm("Are you sure?")) return;
        try {
            await api.delete(`/api/tasks/${taskId}`);
            fetchProjectData();
        } catch (error) {
            alert("Failed to delete task");
        }
    };

    const onDragEnd = async (result) => {
        if (!result.destination) return;
        const { source, destination, draggableId } = result;

        if (source.droppableId === destination.droppableId) return;

        // Optimistic UI Update
        const sourceCol = [...tasks[source.droppableId]];
        const destCol = [...tasks[destination.droppableId]];
        const [movedTask] = sourceCol.splice(source.index, 1);
        movedTask.status = destination.droppableId;
        destCol.splice(destination.index, 0, movedTask);

        setTasks({
            ...tasks,
            [source.droppableId]: sourceCol,
            [destination.droppableId]: destCol
        });

        // API Call
        try {
            await api.put(`/api/tasks/${draggableId}`, { status: destination.droppableId });
        } catch (error) {
            console.error("Failed to update status");
            fetchProjectData(); // Revert on error
        }
    };

    if (loading) return <div className="p-10 text-center">Loading Workspace...</div>;
    if (!project) return <div className="p-10 text-center">Project not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-4">
                    <Link to="/projects" className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">{project.title}</h1>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className={`w-2 h-2 rounded-full ${project.status === 'Completed' ? 'bg-green-500' : 'bg-secondary'}`}></span>
                            {project.status}
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={async () => {
                            if (!confirm("Generate AI tasks for this project?")) return;
                            try {
                                setLoading(true); // Temporary loading state 
                                await api.post(`/api/projects/${id}/generate-tasks`);
                                fetchProjectData();
                            } catch (error) {
                                alert("Failed to generate plan");
                            } finally {
                                setLoading(false);
                            }
                        }}
                        className="bg-accent hover:bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-md transition-all"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                        AI Plan
                    </button>
                    <button
                        onClick={() => setShowTaskModal(true)}
                        className="bg-primary hover:bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-md"
                    >
                        <Plus size={16} /> Add Task
                    </button>
                </div>
            </div>

            {/* Kanban Board */}
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex-1 overflow-x-auto p-8">
                    <div className="flex gap-6 min-w-[1000px] h-full">
                        {Object.entries(tasks).map(([columnId, columnTasks]) => (
                            <Droppable key={columnId} droppableId={columnId}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className="flex-1 bg-gray-100/50 rounded-xl p-4 flex flex-col gap-3 min-h-[500px]"
                                    >
                                        <div className="flex justify-between items-center px-2 mb-2">
                                            <h3 className="font-semibold text-gray-700">{columnId}</h3>
                                            <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">{columnTasks.length}</span>
                                        </div>

                                        {columnTasks.map((task, index) => (
                                            <Draggable key={task._id} draggableId={task._id} index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 group hover:shadow-md transition-all relative"
                                                    >
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={task.status === 'Done'}
                                                                    onChange={async (e) => {
                                                                        const newStatus = e.target.checked ? 'Done' : 'Todo';
                                                                        // Optimistic update
                                                                        const newTasks = { ...tasks };
                                                                        // Remove from old column
                                                                        newTasks[columnId] = newTasks[columnId].filter(t => t._id !== task._id);
                                                                        // Add to new column
                                                                        const taskCopy = { ...task, status: newStatus };
                                                                        newTasks[newStatus] = [taskCopy, ...newTasks[newStatus]];
                                                                        setTasks(newTasks);

                                                                        try {
                                                                            await api.put(`/api/tasks/${task._id}`, { status: newStatus });
                                                                        } catch (err) {
                                                                            fetchProjectData(); // Revert
                                                                        }
                                                                    }}
                                                                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                                                                />
                                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${task.priority === 'High' ? 'bg-red-50 text-red-600 border-red-100' :
                                                                    task.priority === 'Medium' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                                                                        'bg-green-50 text-green-600 border-green-100'
                                                                    }`}>
                                                                    {task.priority}
                                                                </span>
                                                                {task.module && (
                                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded border bg-secondary/10 text-secondary border-secondary/20">
                                                                        {task.module}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <button onClick={() => handleDeleteTask(task._id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                        <h4 className={`font-medium text-gray-800 mb-1 ${task.status === 'Done' ? 'line-through text-gray-400' : ''}`}>{task.title}</h4>
                                                        {task.description && <p className="text-xs text-gray-500 mb-3">{task.description}</p>}
                                                        {task.dueDate && (
                                                            <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                                                <Calendar size={10} />
                                                                {new Date(task.dueDate).toLocaleDateString()}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        ))}
                    </div>
                </div>
            </DragDropContext>

            {/* Add Task Modal */}
            {showTaskModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl">
                        <h2 className="text-xl font-bold mb-4">Add New Task</h2>
                        <form onSubmit={handleCreateTask} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                                <input required type="text" className="w-full p-2 border rounded-lg text-sm"
                                    value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Priority</label>
                                <select className="w-full p-2 border rounded-lg text-sm"
                                    value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })}>
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Due Date</label>
                                <input type="date" className="w-full p-2 border rounded-lg text-sm"
                                    value={newTask.dueDate} onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })} />
                            </div>
                            <div className="flex gap-2 justify-end mt-4">
                                <button type="button" onClick={() => setShowTaskModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                                <button type="submit" className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-accent">
                                    Add Task
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectWorkspace;
