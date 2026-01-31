import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Activity, Smile, Frown, Meh, AlertCircle } from 'lucide-react';

const StressCheck = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const [scores, setScores] = useState([0, 0, 0]);
    const [isCompleted, setIsCompleted] = useState(false);

    const questions = [
        "Over the last 2 weeks, how often have you felt nervous, anxious, or on edge?",
        "How often have you not been able to stop or control worrying?",
        "How often have you had trouble relaxing?"
    ];

    const options = [
        { label: "Not at all", value: 0, icon: <Smile className="w-6 h-6 text-green-500" /> },
        { label: "Several days", value: 1, icon: <Meh className="w-6 h-6 text-yellow-500" /> },
        { label: "Over half the days", value: 2, icon: <Frown className="w-6 h-6 text-orange-500" /> },
        { label: "Nearly every day", value: 3, icon: <AlertCircle className="w-6 h-6 text-red-500" /> }
    ];

    const handleSelect = (value) => {
        const newScores = [...scores];
        newScores[step] = value;
        setScores(newScores);

        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            const totalScore = newScores.reduce((a, b) => a + b, 0);
            // Normalize score to 0-100 for "Stress Index" (Max raw is 9)
            const stressIndex = Math.round((totalScore / 9) * 100);
            setIsCompleted(true);
            if (onComplete) onComplete(stressIndex);
        }
    };

    if (isCompleted) {
        return (
            <div className="text-center p-8 bg-green-50 rounded-xl border border-green-100">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Check-in Complete</h3>
                <p className="text-gray-600">Your results have been updated.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 bg-rose-50 border-b border-rose-100 flex items-center gap-2 text-rose-700">
                <Activity className="w-5 h-5" />
                <span className="font-semibold">Daily Stress Check</span>
            </div>

            <div className="p-6">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                >
                    <h4 className="text-lg font-medium text-gray-800 mb-6">{questions[step]}</h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {options.map((opt, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSelect(opt.value)}
                                className="flex items-center gap-3 p-4 border rounded-xl hover:bg-gray-50 hover:border-indigo-300 transition-all text-left group"
                            >
                                <div className="group-hover:scale-110 transition-transform">{opt.icon}</div>
                                <span className="font-medium text-gray-700">{opt.label}</span>
                            </button>
                        ))}
                    </div>
                </motion.div>

                <div className="mt-6 flex justify-between items-center text-sm text-gray-400">
                    <span>Question {step + 1} of 3</span>
                    <div className="flex gap-1">
                        {[0, 1, 2].map(i => (
                            <div key={i} className={`w-2 h-2 rounded-full ${i <= step ? 'bg-rose-400' : 'bg-gray-200'}`}></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
import { CheckCircle } from 'lucide-react';

export default StressCheck;
