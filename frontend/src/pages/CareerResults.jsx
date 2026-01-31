import { useState, useEffect } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import { ArrowRight, Trophy, Code, Lightbulb, Users } from "lucide-react";

const CareerResults = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const res = await api.post("/api/career/analyze");
                setResults(res.data.recommendations);
            } catch (err) {
                console.error(err);
                setError("Failed to analyze profile. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <h2 className="text-xl font-medium text-gray-700">Analyzing your digital twin...</h2>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-xl">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">!</div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Analysis Failed</h2>
                <p className="text-gray-500 mb-6">{error}</p>
                <Link to="/student-profile" className="text-primary hover:underline">Return to Profile</Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Career DNA</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Based on your skills, interests, and learning style, we've identified the top paths where you'll thrive.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {results.map((career, index) => (
                        <div key={career._id} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-shadow flex flex-col">
                            <div className={`h-2 ${index === 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-primary'}`}></div>
                            <div className="p-8 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-2xl font-bold text-gray-800">{career.title}</h3>
                                    {index === 0 && (
                                        <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                            <Trophy size={14} /> Top Match
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-500 mb-6 line-clamp-2">{career.description}</p>

                                <div className="space-y-4 mb-8 flex-1">
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0">
                                            <Users size={16} />
                                        </div>
                                        <span>Salary: {career.averageSalary}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <div className="w-8 h-8 rounded-lg bg-green-50 text-green-500 flex items-center justify-center flex-shrink-0">
                                            <Lightbulb size={16} />
                                        </div>
                                        <span>Growth: {career.growthOutlook}</span>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Why this fits you</h4>
                                    <ul className="space-y-2">
                                        {career.matchReasons.map((reason, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></div>
                                                {reason}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <button className="w-full py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 mt-auto">
                                    View Roadmap <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Link to="/home" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
                        Go to Dashboard <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CareerResults;
