import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const LearningChart = ({ roadmap }) => {
    if (!roadmap || !roadmap.steps) {
        return (
            <div className="h-32 flex items-center justify-center text-gray-400 text-sm">
                No roadmap data available
            </div>
        );
    }

    // Process data: Group steps by level
    const data = ['Beginner', 'Intermediate', 'Advanced'].map(level => {
        const steps = roadmap.steps.filter(s => s.level === level);
        const total = steps.length;
        const completed = steps.filter(s => s.isCompleted).length;
        // Avoid division by zero
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

        return {
            name: level,
            progress: progress,
            total,
            completed
        };
    });

    const colors = ['#1b5e5f', '#2d7a7b', '#e89e45']; // Primary, Accent, Secondary

    return (
        <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                    />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip
                        cursor={{ fill: 'transparent' }}
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                const d = payload[0].payload;
                                return (
                                    <div className="bg-white p-2 border border-gray-100 shadow-lg rounded-lg text-xs">
                                        <p className="font-bold text-gray-800">{d.name}</p>
                                        <p className="text-primary">{d.completed}/{d.total} Steps</p>
                                        <p className="text-gray-500">{d.progress}% Completed</p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Bar dataKey="progress" radius={[4, 4, 0, 0]} barSize={40}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default LearningChart;
