import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    RadialLinearScale,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    RadialLinearScale
);

const Progress = () => {
    const [stats, setStats] = useState({
        totalAssessments: 0,
        averageScore: 0,
        highestScore: 0,
        trend: 'stable'
    });
    const [chartData, setChartData] = useState(null);
    const [barData, setBarData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPlotData();
    }, []);

    const fetchPlotData = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get('http://localhost:3000/api/assessment/history', config);

            if (data && data.length > 0) {
                // Calculate Stats
                const total = data.length;
                const scores = data.map(d => d.averageScore);
                const avg = scores.reduce((a, b) => a + b, 0) / total;
                const max = Math.max(...scores);

                // Trend (Simple: compare last to previous, or average of last 3 vs prev 3)
                // Data is sorted by createdAt ascending (oldest first) in backend? 
                // Controller: .sort({ createdAt: 1 }) -> Ascending. Last is newest.
                let trend = 'stable';
                if (total >= 2) {
                    const last = scores[total - 1];
                    const prev = scores[total - 2];
                    if (last > prev) trend = 'improving';
                    else if (last < prev) trend = 'declining';
                }

                setStats({
                    totalAssessments: total,
                    averageScore: avg.toFixed(1),
                    highestScore: max.toFixed(1),
                    trend
                });

                // Line Chart Data (Trends)
                const labels = data.map(d => new Date(d.createdAt).toLocaleDateString());
                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Mental Wellness Score',
                            data: scores,
                            borderColor: 'rgb(139, 92, 246)', // Violet/Purple
                            backgroundColor: 'rgba(139, 92, 246, 0.5)',
                            tension: 0.3
                        }
                    ]
                });

                // Bar Chart Data (Stress Level Distribution - assuming we have stressLevel in data)
                // Backend sends 'stressLevel' and 'averageScore'.
                // Let's visualize Stress Level vs Average Score? Or just Stress Level over time?
                // User code had "Mental Health Distribution" (Bar Plot). 
                // Maybe frequency of scores?
                // Let's do a distribution of "Wellness Scores" (rounded).
                const distribution = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };
                scores.forEach(s => {
                    const bucket = Math.round(s);
                    if (bucket >= 1 && bucket <= 5) distribution[bucket]++;
                });

                setBarData({
                    labels: ['1 (Critical)', '2 (Poor)', '3 (Moderate)', '4 (Good)', '5 (Excellent)'],
                    datasets: [
                        {
                            label: 'Frequency of Wellness Scores',
                            data: [distribution[1], distribution[2], distribution[3], distribution[4], distribution[5]],
                            backgroundColor: [
                                'rgba(239, 68, 68, 0.7)', // Red
                                'rgba(249, 115, 22, 0.7)', // Orange
                                'rgba(234, 179, 8, 0.7)', // Yellow
                                'rgba(34, 197, 94, 0.7)', // Green
                                'rgba(59, 130, 246, 0.7)', // Blue
                            ],
                        }
                    ]
                });

            }
        } catch (err) {
            console.error('Error fetching plot data:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 bg-gray-900">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                        Progress
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Analytics</span>
                    </h1>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                        Track your mental health journey with detailed insights and visualizations
                    </p>
                </div>

                {/* Statistics Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Assessments */}
                    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">Total Assessments</p>
                                <p className="text-2xl font-bold text-white">{stats.totalAssessments}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                                <span className="text-blue-400 text-2xl">📝</span>
                            </div>
                        </div>
                    </div>

                    {/* Average Score */}
                    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">Average Score</p>
                                <p className="text-2xl font-bold text-white">{stats.averageScore}/5</p>
                            </div>
                            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                                <span className="text-green-400 text-xl">📊</span>
                            </div>
                        </div>
                    </div>

                    {/* Highest Score */}
                    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">Highest Score</p>
                                <p className="text-2xl font-bold text-white">{stats.highestScore}/5</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                                <span className="text-purple-400 text-xl">🏆</span>
                            </div>
                        </div>
                    </div>

                    {/* Trend */}
                    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">Trend</p>
                                <div className="flex items-center space-x-2">
                                    <span className={`text-sm font-bold capitalize ${stats.trend === 'improving' ? 'text-green-400' : stats.trend === 'declining' ? 'text-red-400' : 'text-yellow-400'}`}>
                                        {stats.trend}
                                    </span>
                                </div>
                            </div>
                            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                                <span className="text-orange-400 text-xl">📈</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Plots Section */}
                <div className="space-y-8">
                    {/* Line Plot */}
                    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 min-h-[400px]">
                        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center justify-center space-x-3">
                            <span>Mental Health Trends</span>
                        </h2>
                        <div className="relative h-80 w-full">
                            {chartData ? <Line options={{ responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, max: 5, grid: { color: 'rgba(255,255,255,0.1)' } }, x: { grid: { color: 'rgba(255,255,255,0.1)' } } }, plugins: { legend: { labels: { color: 'white' } } } }} data={chartData} /> : <div className="text-center text-slate-500 mt-20">No data available</div>}
                        </div>
                    </div>

                    {/* Bar Plot */}
                    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 min-h-[400px]">
                        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center justify-center space-x-3">
                            <span>Mental Health Distribution</span>
                        </h2>
                        <div className="relative h-80 w-full">
                            {barData ? <Bar options={{ responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.1)' } }, x: { grid: { color: 'rgba(255,255,255,0.1)' } } }, plugins: { legend: { labels: { color: 'white' } } } }} data={barData} /> : <div className="text-center text-slate-500 mt-20">No data available</div>}
                        </div>
                    </div>
                </div>

                {/* Home Button */}
                <div className="mt-8 text-center">
                    <a href="/home" className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
                        Back to Dashboard
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Progress;
