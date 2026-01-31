import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { CheckCircle, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";

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
    const { logout } = useAuth(); // In case they want to logout
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
            navigate("/career-results"); // Redirect to results on success
        } catch (error) {
            console.error("Failed to save profile", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            {/* Sidebar / Progress */}
            <div className="w-full md:w-1/3 bg-white border-r border-gray-200 p-8 flex flex-col justify-between">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                        Build Your Digital Twin
                    </h1>
                    <p className="text-gray-500 mb-10">Help our AI understand you better for a personalized journey.</p>

                    <div className="space-y-6">
                        {steps.map((step) => (
                            <div key={step.id} className="flex items-start gap-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${currentStep >= step.id
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-gray-200 text-gray-300"
                                    }`}>
                                    {currentStep > step.id ? <CheckCircle className="w-5 h-5" /> : step.id}
                                </div>
                                <div>
                                    <h3 className={`font-medium ${currentStep >= step.id ? "text-gray-800" : "text-gray-400"}`}>
                                        {step.title}
                                    </h3>
                                    <p className="text-sm text-gray-400">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-8 text-center md:text-left">
                    <button onClick={logout} className="text-sm text-red-400 hover:text-red-500">Sign Out</button>
                </div>
            </div>

            {/* Form Area */}
            <div className="w-full md:w-2/3 p-8 lg:p-16 overflow-y-auto">
                <div className="max-w-xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {currentStep === 1 && <Step1Personal formData={formData} setFormData={setFormData} />}
                            {currentStep === 2 && <Step2Academic formData={formData} setFormData={setFormData} />}
                            {currentStep === 3 && <Step3Learning formData={formData} setFormData={setFormData} />}
                            {currentStep === 4 && <Step4Career formData={formData} setFormData={setFormData} />}
                        </motion.div>
                    </AnimatePresence>

                    <div className="mt-10 flex justify-between">
                        <button
                            onClick={handleBack}
                            disabled={currentStep === 1}
                            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${currentStep === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            <ChevronLeft className="w-4 h-4" /> Back
                        </button>

                        {currentStep < steps.length ? (
                            <button
                                onClick={handleNext}
                                className="bg-primary hover:bg-accent text-black px-8 py-3 rounded-lg font-medium shadow-lg shadow-primary/30 flex items-center gap-2 transition-all"
                            >
                                Continue <ChevronRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="bg-secondary hover:bg-orange-600 px-8 py-3 rounded-lg font-medium shadow-lg shadow-secondary/30 flex items-center text-black gap-2 transition-all"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : "Complete Profile"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProfiling;
