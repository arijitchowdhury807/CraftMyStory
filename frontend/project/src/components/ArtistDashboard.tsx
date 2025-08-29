import React, { useState } from 'react';
import { Plus, Upload, Wand2, Eye, Heart, Mic } from 'lucide-react';
import type { Product, User } from '../types';

interface ArtistDashboardProps {
  currentUser: User | null;
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id' | 'artistId' | 'createdAt'>) => void;
}

export function ArtistDashboard({ currentUser, products, onAddProduct }: ArtistDashboardProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    tags: ''
  });

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  // Toggle Recording
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
        recorder.onstop = () => {
          const audioBlob = new Blob(chunks, { type: 'audio/webm' });
          setAudioURL(URL.createObjectURL(audioBlob));
        };
        recorder.start();
        setRecording(true);
      } catch (error) {
        alert('Microphone access denied.');
      }
    }
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newProduct: Omit<Product, 'id' | 'artistId' | 'createdAt'> = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      images: selectedImages.map(file => URL.createObjectURL(file)), // Preview only, replace with uploaded URLs in real case
      audio: audioURL || null,
      category: formData.category,
      tags: formData.tags.split(',').map(tag => tag.trim()),
      aiGenerated: false,
      likes: 0,
      views: 0
    };

    onAddProduct(newProduct);

    // Reset form
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      tags: ''
    });
    setSelectedImages([]);
    setAudioURL(null);
    setShowAddForm(false);
  };

  const generateAIReel = (productId: string) => {
    alert('AI reel generation started! This would integrate with an AI video service in production.');
  };

  if (!currentUser?.isArtist) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">You need to be registered as an artist to access the dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Artist Dashboard</h1>
          <p className="text-gray-600">Manage your artwork and track performance</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Artwork
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Add New Artwork</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
              <input
                type="text"
                required
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="abstract, modern, colorful"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Choose Photo</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full"
              />
              {selectedImages.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">{selectedImages.length} file(s) selected</p>
              )}
            </div>

            {/* Voice Recording */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Record Your Voice</label>
              <button
                type="button"
                onClick={toggleRecording}
                className={`flex items-center px-4 py-2 rounded-md ${recording ? 'bg-red-500' : 'bg-purple-600'} text-white`}
              >
                <Mic className="h-4 w-4 mr-2" />
                {recording ? 'Stop Recording' : 'Start Recording'}
              </button>
              {audioURL && (
                <audio controls src={audioURL} className="mt-2 w-full"></audio>
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

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-gray-900">${product.price}</span>
                <div className="flex items-center space-x-4 text-gray-500">
                  <div className="flex items-center">
                    <Heart className="h-4 w-4 mr-1" />
                    <span className="text-sm">{product.likes}</span>
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    <span className="text-sm">{product.views}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex flex-wrap gap-1">
                  {product.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {!product.aiGenerated && (
                  <button
                    onClick={() => generateAIReel(product.id)}
                    className="flex items-center px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full hover:from-purple-600 hover:to-pink-600 transition-colors"
                  >
                    <Wand2 className="h-3 w-3 mr-1" />
                    AI Reel
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No artwork yet</h3>
          <p className="text-gray-600 mb-4">Start by adding your first piece of artwork</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Add Your First Artwork
          </button>
        </div>
      )}
    </div>
  );
}
