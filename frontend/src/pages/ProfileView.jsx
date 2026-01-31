import { useEffect, useState } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";
import { User, BookOpen, Brain, Activity, Award } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';


const ProfileView = () => {
    const [profile, setProfile] = useState(null);
    const [quizStats, setQuizStats] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const [profileRes, statsRes] = await Promise.all([
                    api.get("/api/student/profile"),
                    api.get("/api/quiz/stats")
                ]);
                setProfile(profileRes.data);
                setQuizStats(statsRes.data.stats);
            } catch (error) {
                console.error("Error fetching data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();

    }, []);

    if (loading) return <div className="h-screen flex items-center justify-center">Loading Profile...</div>;

    if (!profile) {
        return (
            <div className="h-screen flex flex-col items-center justify-center p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">No Profile Found</h2>
                <p className="text-gray-500 mb-6">You haven't set up your Digital Twin yet.</p>
                <Link to="/student-profile" className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-accent transition">
                    Create Profile
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">My Digital Twin</h1>
                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate("/student-profile")}
                            className="text-primary border border-primary px-4 py-2 rounded-lg hover:bg-primary/5 font-medium"
                        >
                            Edit Profile
                        </button>
                        <Link to="/home" className="text-gray-500 hover:text-gray-700 flex items-center">Back to Dashboard</Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Personal Info Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/20">
                                <img
                                    src={profile.user?.profilepic ? `http://localhost:3000/${profile.user.profilepic}` : "https://via.placeholder.com/150"}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Personal Info</h2>
                                <p className="text-sm text-gray-500">{profile.user?.username}</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-500">College</span>
                                <span className="font-medium text-right">{profile.personalInfo.collegeName || "N/A"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Degree/Branch</span>
                                <span className="font-medium text-right">{profile.personalInfo.degree} - {profile.personalInfo.branch}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Year</span>
                                <span className="font-medium text-right">{profile.personalInfo.year}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Age</span>
                                <span className="font-medium">{profile.personalInfo.age}</span>
                            </div>
                        </div>
                    </div>

                    {/* Learning Style Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-4 text-secondary">
                            <Brain className="w-6 h-6" />
                            <h2 className="text-xl font-bold text-gray-800">Learning DNA</h2>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Primary Style</span>
                                <p className="text-lg font-bold text-primary">{profile.learningStyle?.primaryStyle}</p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Attention Span</span>
                                <p className="font-medium">{profile.learningStyle?.attentionSpan}</p>
                            </div>
                        </div>
                    </div>

                    {/* Digital Twin Attributes */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-4 text-emerald-600">
                            <Activity className="w-6 h-6" />
                            <h2 className="text-xl font-bold text-gray-800">Traits</h2>
                        </div>
                        <div className="space-y-4">
                            {['curiosityLevel', 'adaptability', 'stressLevel'].map((trait) => (
                                <div key={trait}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="capitalize text-gray-600">{trait.replace(/([A-Z])/g, ' $1')}</span>
                                        <span className="font-bold text-emerald-600">{profile.digitalTwinAttributes?.[trait]}/10</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div
                                            className="bg-emerald-500 h-2 rounded-full"
                                            style={{ width: `${(profile.digitalTwinAttributes?.[trait] / 10) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Academic Baseline */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 md:col-span-2">
                        <div className="flex items-center gap-3 mb-4 text-orange-600">
                            <BookOpen className="w-6 h-6" />
                            <h2 className="text-xl font-bold text-gray-800">Tech & Interests</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="font-semibold text-gray-700 mb-2">Programming Languages</h3>
                                <div className="flex flex-wrap gap-2">
                                    {profile.academicBaseline.programmingLanguages?.map(sub => (
                                        <span key={sub} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-100">{sub}</span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-700 mb-2">Areas of Interest</h3>
                                <div className="flex flex-wrap gap-2">
                                    {profile.academicBaseline.techInterests?.map(sub => (
                                        <span key={sub} className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium border border-secondary/20">{sub}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quiz Stats Chart */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 md:col-span-1">
                        <div className="flex items-center gap-3 mb-4 text-primary">
                            <Award className="w-6 h-6" />
                            <h2 className="text-xl font-bold text-gray-800">Mastery</h2>
                        </div>
                        <div className="h-64">
                            {quizStats.length > 2 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={quizStats}>
                                        <PolarGrid stroke="#e2e8f0" />
                                        <PolarAngleAxis dataKey="topic" tick={{ fill: '#64748b', fontSize: 10 }} />
                                        <Radar
                                            name="Strength"
                                            dataKey="strength"
                                            stroke="#6366f1"
                                            fill="#6366f1"
                                            fillOpacity={0.6}
                                        />
                                        <Tooltip />
                                    </RadarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                                    <div className="bg-gray-50 p-4 rounded-full mb-3">
                                        <Activity className="text-gray-300" size={32} />
                                    </div>
                                    <p className="text-sm text-gray-400">Complete at least 3 quizzes to see your technical radar.</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProfileView;
