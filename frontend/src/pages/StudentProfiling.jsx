import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { CheckCircle, ChevronRight, ChevronLeft, Loader2, Sparkles, Brain } from "lucide-react";

import Step1Personal from "../components/profile/Step1Personal";
import Step2Academic from "../components/profile/Step2Academic";
import Step3Learning from "../components/profile/Step3Learning";
import Step4Career from "../components/profile/Step4Career";

const steps = [
    { id: 1, title: "Personal Info", description: "Let's get to know you" },
    { id: 2, title: "Academic Base", description: "Your current standing" },
    { id: 3, title: "Learning Style", description: "How you learn best" },
    { id: 4, title: "Career Goals", description: "Future aspirations" }
];

const StudentProfiling = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        personalInfo: { age: "", gender: "", collegeName: "", degree: "", year: "", branch: "", city: "" },
        academicBaseline: { programmingLanguages: [], techInterests: [], cgpa: "", codingHoursPerDay: "" },
        learningStyle: { primaryStyle: "", attentionSpan: "", groupStudyPreference: false },
        digitalTwinAttributes: { curiosityLevel: 5, adaptability: 5, stressLevel: 5 },
        careerAspirations: { interests: [], preferredWorkEnvironment: "", expectedSalaryRange: "" }
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get("/api/student/profile");
                if (res.data) {
                    setFormData(prev => ({ ...prev, ...res.data }));
                }
            } catch (error) {
                // Ignore 404
            }
        };
        fetchProfile();
    }, []);

    const handleNext = () => {
        if (currentStep < steps.length) setCurrentStep(prev => prev + 1);
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await api.post("/api/student/profile", formData);
            navigate("/career-results");
        } catch (error) {
            console.error("Failed to save profile", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row selection:bg-indigo-100">
            {/* Sidebar / Progress */}
            <div className="w-full md:w-96 bg-white border-r border-slate-100 p-10 flex flex-col justify-between shadow-2xl shadow-indigo-500/5">
                <div>
                    <div className="flex items-center gap-3 mb-12">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/40">
                            <Brain className="text-white w-6 h-6" />
                        </div>
                        <span className="text-2xl font-black tracking-tight text-slate-900">
                            Shiksha<span className="text-indigo-600">Care</span>
                        </span>
                    </div>

                    <div className="space-y-2 mb-10">
                        <h1 className="text-3xl font-black text-slate-900 leading-tight">
                            Build Your <br />
                            <span className="text-indigo-600">Digital Twin</span>
                        </h1>
                        <p className="text-slate-500 font-medium">Our AI needs to understand your DNA to guide you effectively.</p>
                    </div>

                    <div className="space-y-8">
                        {steps.map((step) => (
                            <div key={step.id} className="flex items-center gap-5 relative group">
                                {step.id < steps.length && (
                                    <div className={`absolute left-5 top-10 w-0.5 h-6 transition-colors ${currentStep > step.id ? "bg-indigo-600" : "bg-slate-100"}`} />
                                )}
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${currentStep >= step.id
                                    ? "border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                                    : "border-slate-100 text-slate-300"
                                    }`}>
                                    {currentStep > step.id ? <CheckCircle className="w-5 h-5" /> : <span className="text-sm font-black">{step.id}</span>}
                                </div>
                                <div>
                                    <h3 className={`font-bold transition-colors ${currentStep >= step.id ? "text-slate-900" : "text-slate-400"}`}>
                                        {step.title}
                                    </h3>
                                    <p className={`text-xs font-semibold uppercase tracking-widest ${currentStep >= step.id ? "text-indigo-400" : "text-slate-300"}`}>
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-12 flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                            <Sparkles className="text-indigo-600 w-5 h-5" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 leading-tight">
                            AI Personalization <br /> <span className="text-indigo-600">Enabled</span>
                        </p>
                    </div>
                    <button onClick={logout} className="text-xs font-black text-rose-500 hover:text-rose-600 uppercase tracking-widest">Logout</button>
                </div>
            </div>

            {/* Form Area */}
            <div className="flex-1 p-8 lg:p-20 overflow-y-auto bg-mesh">
                <div className="max-w-2xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20, scale: 0.98 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -20, scale: 0.98 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="bg-white/40 backdrop-blur-xl p-10 md:p-14 rounded-[3rem] border border-white/60 shadow-2xl shadow-indigo-500/5 min-h-[500px]"
                        >
                            {currentStep === 1 && <Step1Personal formData={formData} setFormData={setFormData} />}
                            {currentStep === 2 && <Step2Academic formData={formData} setFormData={setFormData} />}
                            {currentStep === 3 && <Step3Learning formData={formData} setFormData={setFormData} />}
                            {currentStep === 4 && <Step4Career formData={formData} setFormData={setFormData} />}

                            <div className="mt-16 flex justify-between items-center pt-8 border-t border-slate-100">
                                <button
                                    onClick={handleBack}
                                    disabled={currentStep === 1}
                                    className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-black text-sm transition-all ${currentStep === 1
                                        ? "text-slate-300 cursor-not-allowed"
                                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 active:scale-95"
                                        }`}
                                >
                                    <ChevronLeft className="w-4 h-4" /> REVERSE
                                </button>

                                {currentStep < steps.length ? (
                                    <button
                                        onClick={handleNext}
                                        className="bg-slate-900 hover:bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-sm shadow-2xl shadow-slate-900/10 hover:shadow-indigo-500/30 flex items-center gap-3 transition-all active:scale-95"
                                    >
                                        PROCEED <ChevronRight className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className="bg-indigo-600 hover:bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-sm shadow-2xl shadow-indigo-500/30 flex items-center gap-3 transition-all active:scale-95"
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : (
                                            <>INITIALIZE TWIN <Sparkles className="w-4 h-4" /></>
                                        )}
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default StudentProfiling;
