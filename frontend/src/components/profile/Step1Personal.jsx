import { useState } from "react";
import api from "../../api";

const Step1Personal = ({ formData, setFormData }) => {
    const [uploading, setUploading] = useState(false);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const data = new FormData();
        data.append('profileImage', file);

        setUploading(true);
        try {
            const res = await api.post('/api/user/upload-profile-pic', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            // Assuming successful upload returns filePath
            // We might want to refresh user context or just show success for now
            // But we actually need to show the image.
            // In a real app, we should probably update the AuthContext user
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
                    {/* We can't easily show the image here without the URL from backend updating the context immediately.
                         For now, let's just use the upload input. Ideal: Context update. 
                         Let's just show an icon or preview if we had the URL. */}
                    <span className="text-xs text-center text-gray-500">Upload Photo</span>
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
                        placeholder="e.g. 15"
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
                    <label className="text-sm font-medium text-gray-700">School Name</label>
                    <input
                        type="text" name="school"
                        value={formData.personalInfo.school} onChange={handleChange}
                        className="w-full p-3 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="Enter your school name"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Class/Standard</label>
                    <input
                        type="text" name="classStandard"
                        value={formData.personalInfo.classStandard} onChange={handleChange}
                        className="w-full p-3 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="e.g. 10th Grade"
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
