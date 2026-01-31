import { motion } from "framer-motion";

const Step4Career = ({ formData, setFormData }) => {
    const handleChange = (e) => {
        setFormData({
            ...formData,
            careerAspirations: { ...formData.careerAspirations, [e.target.name]: e.target.value }
        });
    };

    const handleInterestChange = (e) => {
        const val = e.target.value;
        const currentInterests = formData.careerAspirations.interests || [];
        if (currentInterests.includes(val)) return;

        setFormData({
            ...formData,
            careerAspirations: {
                ...formData.careerAspirations,
                interests: [...currentInterests, val]
            }
        });
    };

    const removeInterest = (interest) => {
        setFormData({
            ...formData,
            careerAspirations: {
                ...formData.careerAspirations,
                interests: formData.careerAspirations.interests.filter(i => i !== interest)
            }
        });
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Career Aspirations</h2>
            <p className="text-gray-500">Tell us where you want to go, and we'll help you get there.</p>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Add Areas of Interest</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="e.g. Web Development, AI, Blockchain"
                            className="flex-1 p-3 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-primary/20 outline-none"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleInterestChange({ target: { value: e.target.value } });
                                    e.target.value = '';
                                }
                            }}
                        />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {formData.careerAspirations.interests?.map((interest, idx) => (
                            <span key={idx} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-1">
                                {interest}
                                <button onClick={() => removeInterest(interest)} className="hover:text-red-500">&times;</button>
                            </span>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Preferred Work Environment</label>
                    <select
                        name="preferredWorkEnvironment"
                        value={formData.careerAspirations.preferredWorkEnvironment}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-primary/20 outline-none"
                    >
                        <option value="">Select Preference</option>
                        <option value="Remote">Remote</option>
                        <option value="On-site">On-site</option>
                        <option value="Hybrid">Hybrid</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Expected Salary Range (LPA)</label>
                    <input
                        type="text"
                        name="expectedSalaryRange"
                        value={formData.careerAspirations.expectedSalaryRange}
                        onChange={handleChange}
                        placeholder="e.g. 6-10"
                        className="w-full p-3 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                </div>
            </div>
        </div>
    );
};

export default Step4Career;
