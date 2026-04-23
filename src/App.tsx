import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Data awal (source)
const sourceData = [
  [1, 2],
  [1, 2],
  [2, 1],
  [1, 3],
];

// Helper untuk membuat state awal dengan ID unik.
const initializeData = () =>
  sourceData.map((arr) => ({
    id: Math.random().toString(36).substr(2, 9), // Generate random ID
    top: arr[0],
    bottom: arr[1],
  }));

export default function App() {
  const [dominoes, setDominoes] = useState(initializeData());
  const [removeInput, setRemoveInput] = useState("");
  const [flipDegree, setFlipDegree] = useState(0);

  // Menghitung jumlah kartu double
  const doubleCount = dominoes.filter(
    (card) => card.top === card.bottom,
  ).length;

  // Fitur: Sort Ascending
  const handleSortAsc = () => {
    const sorted = [...dominoes].sort((a, b) => {
      const sumA = a.top + a.bottom;
      const sumB = b.top + b.bottom;

      if (sumA === sumB) {
        // Jika total sama, bandingkan angka terkecil dari masing-masing kartu.
        // Yang angka terkecilnya lebih kecil, taruh di depan.
        const minA = Math.min(a.top, a.bottom);
        const minB = Math.min(b.top, b.bottom);
        if (minA === minB) {
          return Math.max(a.top, a.bottom) - Math.max(b.top, b.bottom);
        }
        return minA - minB;
      }
      return sumA - sumB;
    });
    setDominoes(sorted);
  };

  // Fitur: Sort Descending
  const handleSortDesc = () => {
    const sorted = [...dominoes].sort((a, b) => {
      const sumA = a.top + a.bottom;
      const sumB = b.top + b.bottom;

      if (sumA === sumB) {
        // Kebalikan dari Ascending: jika total sama, bandingkan angka terkecilnya.
        // Yang angka terkecilnya LEBIH BESAR, taruh di depan.
        const minA = Math.min(a.top, a.bottom);
        const minB = Math.min(b.top, b.bottom);
        if (minA === minB) {
          return Math.max(b.top, b.bottom) - Math.max(a.top, a.bottom);
        }
        return minB - minA; // Dibalik (b - a) untuk descending
      }
      return sumB - sumA;
    });
    setDominoes(sorted);
  };

  // Fitur: Flip Cards (Memutar kartu)
  const handleFlip = () => {
    // Putar 180 derajat
    setFlipDegree((prev) => prev + 180);

    // Tukar angka atas dan bawah di tengah-tengah animasi agar terlihat natural
    setTimeout(() => {
      setDominoes((prev) =>
        prev.map((card) => ({ ...card, top: card.bottom, bottom: card.top })),
      );
    }, 150);
  };

  // Fitur: Remove Duplicates
  const handleRemoveDuplicates = () => {
    const counts: Record<string, number> = {};

    dominoes.forEach((card) => {
      const key = [card.top, card.bottom].sort((a, b) => a - b).join(",");
      counts[key] = (counts[key] || 0) + 1;
    });

    const uniqueDominoes = dominoes.filter((card) => {
      const key = [card.top, card.bottom].sort((a, b) => a - b).join(",");
      return counts[key] === 1;
    });

    setDominoes(uniqueDominoes);
  };

  // Fitur: Remove by Total
  const handleRemoveByTotal = () => {
    if (!removeInput) return;
    const target = parseInt(removeInput, 10);
    const filtered = dominoes.filter(
      (card) => card.top + card.bottom !== target,
    );
    setDominoes(filtered);
    setRemoveInput("");
  };

  // Fitur: Reset Data
  const handleReset = () => {
    setDominoes(initializeData());
    setRemoveInput("");
    setFlipDegree(0);
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 p-8 font-sans flex justify-center">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Dominoes</h1>

        {/* Source Section */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Source
          </label>
          <div className="border border-gray-300 rounded p-3 bg-gray-50 font-mono text-sm">
            {JSON.stringify(sourceData)}
          </div>
        </div>

        {/* Double Numbers Section */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Double Numbers
          </label>
          <div className="border border-gray-300 rounded p-3 bg-gray-50 font-mono text-sm">
            {doubleCount}
          </div>
        </div>

        {/* Cards Display Section */}
        <div className="mb-8 min-h-[120px] flex items-center">
          <motion.div layout className="flex flex-row flex-wrap gap-3">
            <AnimatePresence mode="popLayout">
              {dominoes.map((card) => (
                <motion.div
                  layout // Ini yang membuat animasi geser (sort) jadi mulus
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1, rotateX: flipDegree }}
                  exit={{ opacity: 0, scale: 0.5, y: -30 }} // Animasi saat dihapus
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                    rotateX: { duration: 0.3 },
                  }}
                  key={card.id}
                  className="flex flex-col items-center justify-between w-12 h-24 bg-white border border-gray-400 rounded shadow-sm overflow-hidden"
                >
                  <div className="flex-1 w-full flex items-center justify-center font-bold text-lg border-b border-gray-400 bg-white z-10">
                    {/* Counter-rotate text agar tidak terbalik saat rotasi card genap/ganjil */}
                    <span
                      style={{
                        transform: `rotateX(${flipDegree % 360 !== 0 ? 180 : 0}deg)`,
                      }}
                    >
                      {card.top}
                    </span>
                  </div>
                  <div className="flex-1 w-full flex items-center justify-center font-bold text-lg bg-white z-10">
                    <span
                      style={{
                        transform: `rotateX(${flipDegree % 360 !== 0 ? 180 : 0}deg)`,
                      }}
                    >
                      {card.bottom}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          {dominoes.length === 0 && (
            <p className="text-gray-400 italic">No cards left.</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={handleSortAsc}
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-2 px-4 rounded transition-colors"
          >
            Sort (ASC)
          </button>
          <button
            onClick={handleSortDesc}
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-2 px-4 rounded transition-colors"
          >
            Sort (DESC)
          </button>
          <button
            onClick={handleFlip}
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-2 px-4 rounded transition-colors"
          >
            Flip
          </button>
          <button
            onClick={handleRemoveDuplicates}
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-2 px-4 rounded transition-colors"
          >
            Remove Dup
          </button>
          <button
            onClick={handleReset}
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-2 px-4 rounded transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Remove By Total Form */}
        <div className="flex flex-col gap-2 max-w-xs">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Input Number
          </label>
          <input
            type="number"
            value={removeInput}
            onChange={(e) => setRemoveInput(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleRemoveByTotal}
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-2 px-4 rounded transition-colors w-max"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
