import React, { useState } from "react";
import { Plus, Mic, X } from "lucide-react";
import axios from "axios";
import type { Product, User } from "../types/index.ts";
import { Dialog } from "@headlessui/react";

interface ArtistDashboardProps {
  currentUser: User | null;
  products: Product[];
  onAddProduct: (
    product: Omit<Product, "id" | "artistId" | "createdAt">
  ) => void;
}

const API_BASE = "http://127.0.0.1:5000";

export function ArtistDashboard({
  currentUser,
  products,
  onAddProduct,
}: ArtistDashboardProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    tags: "",
    language: "en",
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [loading, setLoading] = useState(false);

  // Detail modal state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Toggle recording
  const toggleRecording = async () => {
    if (recording) {
      mediaRecorder?.stop();
      setRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);
        const chunks: BlobPart[] = [];

        recorder.ondataavailable = (e) => chunks.push(e.data);

        recorder.onstop = async () => {
          const audioBlob = new Blob(chunks, { type: "audio/wav" });
          setAudioURL(URL.createObjectURL(audioBlob));
          await uploadAudio(audioBlob);
        };

        recorder.start();
        setRecording(true);
      } catch (error) {
        alert("Microphone access denied.");
      }
    }
  };

  // Upload audio to backend and update description
  const uploadAudio = async (audioBlob: Blob) => {
    try {
      setLoading(true);
      const formDataUpload = new FormData();
      formDataUpload.append("file", audioBlob, "recorded_audio.wav");
      formDataUpload.append("language", formData.language);
      formDataUpload.append("mode", "description");

      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to generate content.");
        return;
      }

      const res = await axios.post(
        `${API_BASE}/content/voice-generate`,
        formDataUpload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      // Auto-fill description field
      setFormData((prev) => ({
        ...prev,
        description: res.data.generated_text,
      }));
    } catch (err: any) {
      console.error("Error uploading audio:", err.response?.data || err.message);
      alert("Failed to generate description from voice. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImages(Array.from(e.target.files));
    }
  };

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Omit<Product, "id" | "artistId" | "createdAt"> = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      images: selectedImages.map((file) => URL.createObjectURL(file)),
      audio: audioURL || null,
      category: formData.category,
      tags: formData.tags.split(",").map((tag) => tag.trim()),
      aiGenerated: false,
      likes: 0,
      views: 0,
    };
    onAddProduct(newProduct);
    // Reset form
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      tags: "",
      language: "en",
    });
    setSelectedImages([]);
    setAudioURL(null);
    setShowAddForm(false);
  };

  if (!currentUser?.isArtist) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
        <p className="text-gray-600">
          You need to be registered as an artist to access the dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Artist Dashboard</h1>
          <p className="text-gray-600">Manage your artwork and track performance</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" /> Add Artwork
        </button>
      </div>

      {/* Add Artwork Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Add New Artwork</h3>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price ($)
              </label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, price: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Voice Recording */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Record Your Voice
              </label>
              <button
                type="button"
                onClick={toggleRecording}
                className={`flex items-center px-4 py-2 rounded-md ${
                  recording ? "bg-red-500" : "bg-purple-600"
                } text-white`}
              >
                <Mic className="h-4 w-4 mr-2" />
                {recording ? "Stop Recording" : "Start Recording"}
              </button>
              {audioURL && (
                <audio controls src={audioURL} className="mt-2 w-full"></audio>
              )}
              {loading && (
                <p className="text-sm text-gray-500 mt-2">
                  Processing voice input...
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Language Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Language
              </label>
              <select
                value={formData.language}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    language: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select category</option>
                <option value="Digital Art">Digital Art</option>
                <option value="Oil Painting">Oil Painting</option>
                <option value="Mixed Media">Mixed Media</option>
                <option value="Abstract">Abstract</option>
                <option value="Photography">Photography</option>
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                required
                value={formData.tags}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, tags: e.target.value }))
                }
                placeholder="abstract, modern, colorful"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose Photo
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full"
              />
              {selectedImages.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {selectedImages.length} file(s) selected
                </p>
              )}
            </div>

            <div className="md:col-span-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors"
              >
                Add Artwork
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => setSelectedProduct(product)}
            className="cursor-pointer bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
          >
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {product.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedProduct && (
        <Dialog
          open={true}
          onClose={() => setSelectedProduct(null)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="mx-auto max-w-lg bg-white rounded-lg shadow-xl p-6 relative">
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              >
                <X className="h-5 w-5" />
              </button>

              <Dialog.Title className="text-xl font-bold mb-4">
                {selectedProduct.name}
              </Dialog.Title>

              <img
                src={selectedProduct.images[0]}
                alt={selectedProduct.name}
                className="w-full h-64 object-cover rounded-md mb-4"
              />

              <p className="text-gray-700 mb-2">
                <strong>Description:</strong> {selectedProduct.description}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Category:</strong> {selectedProduct.category}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Price:</strong> ${selectedProduct.price}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Tags:</strong> {selectedProduct.tags.join(", ")}
              </p>

           
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </div>
  );
}
