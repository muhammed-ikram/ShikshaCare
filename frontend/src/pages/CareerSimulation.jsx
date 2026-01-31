import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Activity, Clock, TrendingUp, AlertCircle, ArrowRight } from 'lucide-react';

const CareerSimulation = () => {
    const [loading, setLoading] = useState(false);
    const [simulationData, setSimulationData] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSimulate = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.post('http://localhost:3000/api/career/simulate', {}, { withCredentials: true });
            if (res.data.success) {
                setSimulationData(res.data.data);
            }
        } catch (err) {
            console.error(err);
            setError("Failed to run simulation. Ensure your profile is complete.");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectCareer = async (careerName) => {
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:3000/api/career/generate-roadmap', { career_name: careerName }, { withCredentials: true });
            if (res.data.success) {
                navigate('/roadmap');
            }
        } catch (err) {
            console.error(err);
            setError("Failed to generate roadmap.");
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-16 h-16 border-t-4 border-b-4 border-indigo-600 rounded-full mb-4"
                />
                <h2 className="text-xl font-semibold text-gray-700">AI is Analyzing your Digital Twin...</h2>
                <p className="text-gray-500">Calculating readiness, stress load, and market fit.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <div className="max-w-6xl mx-auto">
                <header className="mb-10 text-center">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">AI Career Fit Simulation</h1>
                    <p className="text-gray-600">Discover paths tailored to your skills, stress tolerance, and timeline.</p>
                </header>

                {!simulationData ? (
                    <div className="flex justify-center">
                        <button
                            onClick={handleSimulate}
                            className="bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition shadow-lg flex items-center gap-2"
                        >
                            <User className="w-5 h-5" /> Start Simulation
                        </button>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {simulationData.simulated_careers.map((career, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow border border-gray-100 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-bold text-gray-800">{career.career_name}</h3>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${career.readiness_percent > 70 ? 'bg-green-100 text-green-700' :
                                            career.readiness_percent > 40 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {career.readiness_percent}% Ready
                                        </span>
                                    </div>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center text-sm text-gray-600 gap-2">
                                            <Activity className="w-4 h-4 text-orange-500" />
                                            <span>Stress Load: </span>
                                            <div className="flex-1 bg-gray-200 rounded-full h-2 ml-2">
                                                <div
                                                    className={`h-2 rounded-full ${career.predicted_stress_load > 7 ? 'bg-red-500' : 'bg-indigo-500'}`}
                                                    style={{ width: `${career.predicted_stress_load * 10}%` }}
                                                ></div>
                                            </div>
                                            <span className="font-semibold">{career.predicted_stress_load}/10</span>
                                        </div>

                                        <div className="flex items-center text-sm text-gray-600 gap-2">
                                            <Clock className="w-4 h-4 text-blue-500" />
                                            <span>Time to Ready: <span className="font-semibold text-gray-800">{career.estimated_time_to_ready}</span></span>
                                        </div>

                                        <div className="flex items-center text-sm text-gray-600 gap-2">
                                            <TrendingUp className="w-4 h-4 text-green-500" />
                                            <span>Market Demand: <span className="font-semibold text-gray-800">{career.market_demand_score}/10</span></span>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-xl mb-6">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4" /> Skill Gaps
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {career.top_3_skill_gaps.map((skill, i) => (
                                                <span key={i} className="text-xs bg-white border border-gray-200 px-2 py-1 rounded-md text-gray-600">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="text-sm text-gray-500 italic mb-6 border-l-2 border-indigo-200 pl-3">
                                        "{career.reasoning.fit_logic}"
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleSelectCareer(career.career_name)}
                                    className="w-full py-3 rounded-lg border-2 border-indigo-600 text-indigo-700 font-semibold hover:bg-indigo-600 hover:text-white transition-colors flex justify-center items-center gap-2"
                                >
                                    Select & Build Roadmap <ArrowRight className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}
                {error && (
                    <div className="mt-8 text-center text-red-600 bg-red-50 p-4 rounded-lg">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CareerSimulation;
