import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Award, Activity } from 'lucide-react';

const QuizMasteryChart = ({ quizStats }) => {
    if (!quizStats || quizStats.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <div className="bg-gray-50 p-4 rounded-full mb-3">
                    <Activity className="text-gray-300" size={32} />
                </div>
                <p className="text-sm text-gray-400">Complete at least 3 quizzes to see your technical radar.</p>
            </div>
        );
    }

    return (
        <div className="h-full w-full">
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
        </div>
    );
};

export default QuizMasteryChart;
