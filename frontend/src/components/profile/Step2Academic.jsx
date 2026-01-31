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
            <h2 className="text-2xl font-bold text-gray-800">Academic & Tech</h2>
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Current CGPA</label>
                    <input
                        type="text" name="cgpa"
                        value={formData.academicBaseline.cgpa} onChange={handleChange}
                        className="w-full p-3 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                        placeholder="e.g. 8.5"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Programming Languages (comma separated)</label>
                    <input
                        type="text"
                        value={formData.academicBaseline.programmingLanguages?.join(', ')}
                        onChange={(e) => handleArrayChange(e, 'programmingLanguages')}
                        className="w-full p-3 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                        placeholder="Java, C, Python, JavaScript"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Areas of Interest (comma separated)</label>
                    <input
                        type="text"
                        value={formData.academicBaseline.techInterests?.join(', ')}
                        onChange={(e) => handleArrayChange(e, 'techInterests')}
                        className="w-full p-3 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                        placeholder="Web Development, AI, Machine Learning"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Coding Hours Per Day</label>
                    <input
                        type="number" name="codingHoursPerDay"
                        value={formData.academicBaseline.codingHoursPerDay} onChange={handleChange}
                        className="w-full p-3 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                        placeholder="e.g. 2, 4"
                    />
                </div>
            </div>
        </div>
    );
};

export default Step2Academic;
