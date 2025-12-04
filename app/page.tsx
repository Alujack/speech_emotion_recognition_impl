'use client';

import { useState } from 'react';

interface EmotionScore {
  emotion: string;
  label: string;
  score: number;
  color: string;
  emoji: string;
}

interface AnalysisResult {
  success: boolean;
  filename: string;
  timestamp: string;
  dominant_emotion: string;
  confidence: number;
  emotion_scores: EmotionScore[];
  audio_features: {
    duration: number;
    sample_rate: number;
    pitch_mean: number;
    pitch_std: number;
    energy_mean: number;
    energy_std: number;
    tempo: number;
    spectral_centroid: number;
  };
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setResult(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('audio/')) {
      setFile(droppedFile);
      setError(null);
      setResult(null);
    } else {
      setError('Please drop an audio file');
    }
  };

  const analyzeAudio = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Analysis failed');
      }

      const data: AnalysisResult = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const tryDemo = async () => {
    setLoading(true);
    setError(null);
    setFile(null);

    try {
      const response = await fetch(`${API_URL}/api/analyze/demo`);
      if (!response.ok) {
        throw new Error('Demo failed');
      }
      const data: AnalysisResult = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Demo failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            🎤 Speech Emotion Recognition
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Upload an audio file and let AI analyze the emotional tone
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <div
            className={`border-3 border-dashed rounded-xl p-12 text-center transition-all ${
              isDragging
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-purple-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              <div className="text-6xl">🎵</div>
              <div>
                <label
                  htmlFor="audio-upload"
                  className="cursor-pointer text-purple-600 dark:text-purple-400 font-semibold hover:text-purple-700"
                >
                  Choose an audio file
                </label>
                <span className="text-gray-500 dark:text-gray-400"> or drag and drop</span>
              </div>
              <input
                id="audio-upload"
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {file && (
                <div className="text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg p-3 inline-block">
                  📁 {file.name}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 mt-6 justify-center">
            <button
              onClick={analyzeAudio}
              disabled={!file || loading}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg"
            >
              {loading ? 'Analyzing...' : 'Analyze Emotion'}
            </button>
            <button
              onClick={tryDemo}
              disabled={loading}
              className="px-8 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 transition-all"
            >
              Try Demo
            </button>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-6">
            {/* Dominant Emotion Card */}
            <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl shadow-xl p-8 text-white">
              <div className="text-center">
                <div className="text-7xl mb-4">
                  {result.emotion_scores[0].emoji}
                </div>
                <h2 className="text-3xl font-bold mb-2">
                  {result.emotion_scores[0].label}
                </h2>
                <p className="text-xl opacity-90">
                  {result.confidence.toFixed(1)}% Confidence
                </p>
                <p className="text-sm opacity-75 mt-2">
                  Analyzed: {result.filename}
                </p>
              </div>
            </div>

            {/* Emotion Scores */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
                Emotion Breakdown
              </h3>
              <div className="space-y-4">
                {result.emotion_scores.map((emotion) => (
                  <div key={emotion.emotion}>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        {emotion.emoji} {emotion.label}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {emotion.score.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${emotion.score}%`,
                          backgroundColor: emotion.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Audio Features */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
                Audio Features
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-xl">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Duration</div>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {result.audio_features.duration}s
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Tempo</div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {result.audio_features.tempo} BPM
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-xl">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Pitch Mean</div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {result.audio_features.pitch_mean.toFixed(0)} Hz
                  </div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-xl">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Energy</div>
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {result.audio_features.energy_mean.toFixed(3)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
