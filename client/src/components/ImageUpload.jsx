import React, { useState } from 'react';
import axios from 'axios';
import { Upload, CheckCircle } from 'lucide-react';

const ImageUpload = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/upload', formData);
      onUploadSuccess(res.data.imageUrl); // Parent ko image URL bhej dega
      alert("✅ Photo Upload Ho Gayi!");
    } catch (err) {
      alert("❌ Upload Fail!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-4">
      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
        Upload Prescription / Photo (Optional)
      </label>
      <div className="relative border-2 border-dashed border-gray-200 rounded-2xl p-4 hover:border-[#009494] transition-all cursor-pointer bg-gray-50">
        <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
        <div className="flex items-center justify-center space-x-3">
          {preview ? (
            <img src={preview} alt="Preview" className="h-10 w-10 rounded-lg object-cover" />
          ) : (
            <Upload size={20} className="text-gray-400" />
          )}
          <span className="text-sm font-bold text-gray-500">
            {uploading ? "Uploading..." : "Click to select file"}
          </span>
          {preview && !uploading && <CheckCircle size={18} className="text-green-500" />}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;