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
                    <label className="text-sm font-medium text-gray-700">Current CGPA / Grade</label>
                    <input
                        type="text" name="cgpa"
                        value={formData.academicBaseline.cgpa} onChange={handleChange}
                        className="w-full p-3 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                        placeholder="e.g. 8.5 or A"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Key Skills (Tools & Soft Skills)</label>
                    <input
                        type="text"
                        value={formData.academicBaseline.skills?.join(', ')}
                        onChange={(e) => handleArrayChange(e, 'skills')}
                        className="w-full p-3 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                        placeholder="Communication, Python, Research, Design..."
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Areas of Interest</label>
                    <input
                        type="text"
                        value={formData.academicBaseline.interests?.join(', ')}
                        onChange={(e) => handleArrayChange(e, 'interests')}
                        className="w-full p-3 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                        placeholder="Psychology, Artificial Intelligence, History..."
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
