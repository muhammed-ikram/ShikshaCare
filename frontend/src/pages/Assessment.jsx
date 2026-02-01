import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

const Assessment = () => {
    const [formData, setFormData] = useState({
        stressLevel: '',
        sleepQuality: '',
        mood: '',
        socialInteraction: '',
        academicPressure: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token'); // Assuming token is stored here
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const response = await axios.post('http://localhost:3000/api/assessment/submit', formData, config);

            if (response.data) {
                // success('Assessment submitted successfully!');

                const exerciseType = response.data.exerciseType;

                navigate(`/exercises/${exerciseType}`, {
                    state: {
                        assessmentData: formData,
                        recommendationDetails: response.data
                    }
                });
            }
        } catch (err) {
            console.error('Assessment submission error:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to submit assessment';
            alert(`Failed: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = () => {
        return Object.values(formData).every(value => value !== '');
    };

    return (
        <div className="min-h-screen py-16 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                        Mental Health
                        <span className="block text-indigo-600">Assessment</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Take a moment to reflect on your current mental state. Your honest responses help us provide better support and personalized recommendations.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Stress Level */}
                        <div>
                            <label className="block text-lg font-medium text-gray-700 mb-4">
                                How would you rate your current stress level?
                            </label>
                            <select
                                name="stressLevel"
                                value={formData.stressLevel}
                                onChange={handleChange}
                                className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none text-gray-700"
                                required
                            >
                                <option value="">Select an option</option>
                                <option value="5">Very Low</option>
                                <option value="4">Low</option>
                                <option value="3">Moderate</option>
                                <option value="2">High</option>
                                <option value="1">Very High</option>
                            </select>
                        </div>

                        {/* Sleep Quality */}
                        <div>
                            <label className="block text-lg font-medium text-gray-700 mb-4">
                                How would you rate your sleep quality?
                            </label>
                            <select
                                name="sleepQuality"
                                value={formData.sleepQuality}
                                onChange={handleChange}
                                className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none text-gray-700"
                                required
                            >
                                <option value="">Select an option</option>
                                <option value="1">Very Poor</option>
                                <option value="2">Poor</option>
                                <option value="3">Average</option>
                                <option value="4">Good</option>
                                <option value="5">Excellent</option>
                            </select>
                        </div>

                        {/* Mood */}
                        <div>
                            <label className="block text-lg font-medium text-gray-700 mb-4">
                                How would you describe your current mood?
                            </label>
                            <select
                                name="mood"
                                value={formData.mood}
                                onChange={handleChange}
                                className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none text-gray-700"
                                required
                            >
                                <option value="">Select an option</option>
                                <option value="1">Very Negative</option>
                                <option value="2">Negative</option>
                                <option value="3">Neutral</option>
                                <option value="4">Positive</option>
                                <option value="5">Very Positive</option>
                            </select>
                        </div>

                        {/* Social Interaction */}
                        <div>
                            <label className="block text-lg font-medium text-gray-700 mb-4">
                                How comfortable are you with social interactions?
                            </label>
                            <select
                                name="socialInteraction"
                                value={formData.socialInteraction}
                                onChange={handleChange}
                                className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none text-gray-700"
                                required
                            >
                                <option value="">Select an option</option>
                                <option value="1">Very Uncomfortable</option>
                                <option value="2">Uncomfortable</option>
                                <option value="3">Neutral</option>
                                <option value="4">Comfortable</option>
                                <option value="5">Very Comfortable</option>
                            </select>
                        </div>

                        {/* Academic Pressure */}
                        <div>
                            <label className="block text-lg font-medium text-gray-700 mb-4">
                                How do you feel about your academic workload?
                            </label>
                            <select
                                name="academicPressure"
                                value={formData.academicPressure}
                                onChange={handleChange}
                                className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none text-gray-700"
                                required
                            >
                                <option value="">Select an option</option>
                                <option value="1">Overwhelming</option>
                                <option value="2">Heavy</option>
                                <option value="3">Manageable</option>
                                <option value="4">Light</option>
                                <option value="5">Very Light</option>
                            </select>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={!isFormValid() || loading}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Analyzing...
                                    </>
                                ) : (
                                    'Submit Assessment'
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-400 text-sm">
                            Your responses are confidential and will be used to provide personalized recommendations.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Assessment;
