import { useState, useEffect } from "react";
import { X, Send, CheckCircle, Circle, ArrowRight, Loader2, Trophy, AlertCircle } from "lucide-react";
import api from "../api";
import { motion, AnimatePresence } from "framer-motion";

const QuizModal = ({ isOpen, onClose, topic, level, onComplete }) => {
    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState([]);
    const [currentStep, setCurrentStep] = useState(0); // 0: Start, 1: Questions, 2: Results
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [answers, setAnswers] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);

    useEffect(() => {
        if (isOpen && topic) {
            fetchQuiz();
        }
    }, [isOpen, topic]);

    const fetchQuiz = async () => {
        setLoading(true);
        setCurrentStep(0);
        setCurrentQuestionIdx(0);
        setAnswers({});

        try {
            const res = await api.post("/api/quiz/generate", { topic, level });
            setQuestions(res.data.questions);
            setLoading(false);
        } catch (error) {
            console.error("Failed to load quiz", error);
            setLoading(false);
        }
    };

    const handleAnswerSelection = (optionIdx) => {
        setAnswers(prev => ({ ...prev, [currentQuestionIdx]: optionIdx }));
    };

    const nextQuestion = () => {
        if (currentQuestionIdx < questions.length - 1) {
            setCurrentQuestionIdx(prev => prev + 1);
        } else {
            submitQuiz();
        }
    };

    const submitQuiz = async () => {
        setSubmitting(true);
        try {
            const res = await api.post("/api/quiz/submit", {
                topic,
                level,
                questions,
                answers
            });
            setResult(res.data);
            setCurrentStep(2);
            if (onComplete) onComplete(res.data);
        } catch (error) {
            console.error("Failed to submit quiz", error);
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl"
            >
                {/* Header */}
                <div className="bg-primary p-6 text-white flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold">{topic} Quiz</h3>
                        <p className="text-sm opacity-80">{level} Level Mastery Test</p>
                    </div>
                    <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8 min-h-[300px]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full gap-4 py-10">
                            <Loader2 size={48} className="animate-spin text-primary" />
                            <p className="text-gray-500 font-medium">Generating your adaptive quiz...</p>
                        </div>
                    ) : currentStep === 0 ? (
                        <div className="text-center py-6">
                            <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                                <Trophy size={40} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Ready to test your knowledge?</h2>
                            <p className="text-gray-500 mb-8 max-w-sm mx-auto">This quiz covers {topic}. You'll need at least 60% to pass.</p>
                            <button
                                onClick={() => setCurrentStep(1)}
                                className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-accent transition-all shadow-lg hover:shadow-primary/30"
                            >
                                Start Quiz
                            </button>
                        </div>
                    ) : currentStep === 1 ? (
                        <div>
                            {/* Progress bar */}
                            <div className="w-full bg-gray-100 h-2 rounded-full mb-8 overflow-hidden">
                                <motion.div
                                    className="bg-primary h-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${((currentQuestionIdx + 1) / questions.length) * 100}%` }}
                                />
                            </div>

                            <div className="mb-8">
                                <span className="text-xs font-bold text-primary uppercase tracking-widest mb-2 block">Question {currentQuestionIdx + 1} of {questions.length}</span>
                                <h4 className="text-lg font-bold text-gray-800 leading-tight">
                                    {questions[currentQuestionIdx].question}
                                </h4>
                            </div>

                            <div className="grid gap-3">
                                {questions[currentQuestionIdx].options.map((option, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswerSelection(idx)}
                                        className={`p-4 rounded-xl border text-left transition-all flex justify-between items-center group ${answers[currentQuestionIdx] === idx
                                            ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                            : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                                            }`}
                                    >
                                        <span className={`text-sm font-medium ${answers[currentQuestionIdx] === idx ? 'text-primary' : 'text-gray-700'}`}>
                                            {option}
                                        </span>
                                        {answers[currentQuestionIdx] === idx ? <CheckCircle size={20} className="text-primary" /> : <Circle size={20} className="text-gray-300 group-hover:text-primary/30" />}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-10 flex justify-end">
                                <button
                                    onClick={nextQuestion}
                                    disabled={answers[currentQuestionIdx] === undefined || submitting}
                                    className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {submitting ? <Loader2 size={18} className="animate-spin" /> : currentQuestionIdx === questions.length - 1 ? "Submit Quiz" : "Next Question"}
                                    {currentQuestionIdx < questions.length - 1 && <ArrowRight size={18} />}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${result.attempt.isPassed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {result.attempt.isPassed ? <Trophy size={48} /> : <AlertCircle size={48} />}
                            </div>
                            <h2 className="text-3xl font-black mb-1 text-gray-800">{result.percentage}%</h2>
                            <p className={`text-lg font-bold mb-6 ${result.attempt.isPassed ? 'text-green-600' : 'text-red-600'}`}>
                                {result.attempt.isPassed ? "Congratulations! You Passed!" : "Needs Improvement"}
                            </p>

                            <div className="bg-gray-50 p-6 rounded-2xl mb-8 text-left">
                                <h5 className="font-bold text-gray-700 mb-2 text-sm">Review Key Insights:</h5>
                                <p className="text-sm text-gray-600 leading-relaxed italic">
                                    "Your performance in {topic} shows strong understanding of core concepts. Continue practicing implementation to reach the next level."
                                </p>
                            </div>

                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={fetchQuiz}
                                    className="px-6 py-3 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    Retake Quiz
                                </button>
                                <button
                                    onClick={onClose}
                                    className="px-8 py-3 rounded-xl bg-primary text-white font-bold hover:bg-accent transition-all shadow-lg hover:shadow-primary/30"
                                >
                                    Continue Learning
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default QuizModal;
