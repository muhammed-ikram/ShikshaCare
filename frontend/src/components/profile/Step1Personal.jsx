import { useState } from "react";
import api from "../../api";

const Step1Personal = ({ formData, setFormData }) => {
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Create local preview immediately
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        const data = new FormData();
        data.append('profileImage', file);

        setUploading(true);
        try {
            const res = await api.post('/api/user/upload-profile-pic', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("Profile picture uploaded!");
        } catch (error) {
            console.error("Upload error", error);
            alert("Failed to upload image");
        } finally {
            setUploading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            personalInfo: { ...formData.personalInfo, [e.target.name]: e.target.value }
        });
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Personal Details</h2>

            {/* Image Upload Section */}
            <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative">
                    {previewUrl ? (
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-xs text-center text-gray-500">Upload Photo</span>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    />
                    {uploading && <p className="text-xs text-primary mt-1">Uploading...</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Age</label>
                    <input
                        type="number" name="age"
                        value={formData.personalInfo.age} onChange={handleChange}
                        className="w-full p-3 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="e.g. 20"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Gender</label>
                    <select
                        name="gender"
                        value={formData.personalInfo.gender} onChange={handleChange}
                        className="w-full p-3 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">College Name</label>
                    <input
                        type="text" name="collegeName"
                        value={formData.personalInfo.collegeName} onChange={handleChange}
                        className="w-full p-3 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="e.g. IIT Bombay"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Degree</label>
                    <input
                        type="text" name="degree"
                        value={formData.personalInfo.degree} onChange={handleChange}
                        className="w-full p-3 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="e.g. B.Tech"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Branch</label>
                    <input
                        type="text" name="branch"
                        value={formData.personalInfo.branch} onChange={handleChange}
                        className="w-full p-3 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="e.g. CSE"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Year</label>
                    <input
                        type="text" name="year"
                        value={formData.personalInfo.year} onChange={handleChange}
                        className="w-full p-3 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="e.g. 2nd Year"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">City</label>
                    <input
                        type="text" name="city"
                        value={formData.personalInfo.city} onChange={handleChange}
                        className="w-full p-3 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="Your City"
                    />
                </div>
            </div>
        </div>
    );
};

export default Step1Personal;
