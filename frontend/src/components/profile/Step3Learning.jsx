import { motion } from "framer-motion";

const Step3Learning = ({ formData, setFormData }) => {
    const handleChange = (e) => {
        setFormData({
            ...formData,
            learningStyle: { ...formData.learningStyle, [e.target.name]: e.target.value }
        });
    };

    const handleSliderChange = (e) => {
        setFormData({
            ...formData,
            digitalTwinAttributes: { ...formData.digitalTwinAttributes, [e.target.name]: parseInt(e.target.value) }
        });
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Learning Style</h2>
                <div className="mt-4 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">How do you learn best?</label>
                        <div className="grid grid-cols-2 gap-3">
                            {['Visual', 'Auditory', 'Kinesthetic', 'Reading/Writing'].map((style) => (
                                <button
                                    key={style}
                                    onClick={() => setFormData({ ...formData, learningStyle: { ...formData.learningStyle, primaryStyle: style } })}
                                    className={`p-3 rounded-xl border text-sm font-medium transition-all ${formData.learningStyle.primaryStyle === style
                                            ? "border-accent bg-accent/10 text-accent ring-1 ring-accent"
                                            : "border-gray-200 text-gray-600 hover:bg-gray-50"
                                        }`}
                                >
                                    {style}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Attention Span</label>
                        <select
                            name="attentionSpan"
                            value={formData.learningStyle.attentionSpan} onChange={handleChange}
                            className="w-full p-3 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                        >
                            <option value="">Select duration</option>
                            <option value="Short (< 20 mins)">Short (&lt; 20 mins)</option>
                            <option value="Medium (20-45 mins)">Medium (20-45 mins)</option>
                            <option value="Long (> 45 mins)">Long (&gt; 45 mins)</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Digital Twin Setup</h2>
                <p className="text-sm text-gray-500 mb-6">Rate yourself on these traits to help us simulate your learning persona.</p>

                <div className="space-y-6">
                    {['curiosityLevel', 'adaptability', 'stressLevel'].map((trait) => (
                        <div key={trait} className="space-y-2">
                            <div className="flex justify-between text-sm font-medium text-gray-700 capitalize">
                                <span>{trait.replace(/([A-Z])/g, ' $1').trim()}</span>
                                <span className="text-accent">{formData.digitalTwinAttributes[trait]}/10</span>
                            </div>
                            <input
                                type="range"
                                name={trait}
                                min="1" max="10"
                                value={formData.digitalTwinAttributes[trait]}
                                onChange={handleSliderChange}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-accent"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Step3Learning;
