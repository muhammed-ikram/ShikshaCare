const Step2Academic = ({ formData, setFormData }) => {
    const handleChange = (e) => {
        setFormData({
            ...formData,
            academicBaseline: { ...formData.academicBaseline, [e.target.name]: e.target.value }
        });
    };

    const handleArrayChange = (e, field) => {
        // Simple comma separated handler for prototype
        const values = e.target.value.split(',').map(item => item.trim());
        setFormData({
            ...formData,
            academicBaseline: { ...formData.academicBaseline, [field]: values }
        });
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Academic Baseline</h2>
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Recent Grades / GPA</label>
                    <input
                        type="text" name="recentGrades"
                        value={formData.academicBaseline.recentGrades} onChange={handleChange}
                        className="w-full p-3 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                        placeholder="e.g. 85%, A Grade, 3.8 GPA"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Favorite Subjects (comma separated)</label>
                    <input
                        type="text"
                        value={formData.academicBaseline.favoriteSubjects?.join(', ')}
                        onChange={(e) => handleArrayChange(e, 'favoriteSubjects')}
                        className="w-full p-3 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                        placeholder="Math, Physics, History"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Difficult Subjects (comma separated)</label>
                    <input
                        type="text"
                        value={formData.academicBaseline.difficultSubjects?.join(', ')}
                        onChange={(e) => handleArrayChange(e, 'difficultSubjects')}
                        className="w-full p-3 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                        placeholder="Chemistry, Biology"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Study Hours Per Day</label>
                    <input
                        type="number" name="studyHoursPerDay"
                        value={formData.academicBaseline.studyHoursPerDay} onChange={handleChange}
                        className="w-full p-3 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                        placeholder="e.g. 2, 4"
                    />
                </div>
            </div>
        </div>
    );
};

export default Step2Academic;
