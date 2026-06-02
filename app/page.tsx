"use client";

import { compareTexts } from "./services/similarity";
import { useEffect, useState } from "react";

export default function Home() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState("minilm");

  const loadHistory = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/history");
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.log("Failed to load history", err);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

const handleCompare = async () => {
  if (!text1.trim() || !text2.trim()) {
    alert("Both texts are required");
    return;
  }

  try {
    setLoading(true);

    const result = await compareTexts(text1, text2, model);

    if (!result || typeof result.similarity !== "number") {
      throw new Error("Invalid response from server");
    }

    setScore(result.similarity);

    await loadHistory();

    setText1("");
    setText2("");

  } catch (err) {
    console.error("Compare failed:", err);

    alert("Failed to compare texts. Try again.");

  } finally {
    setLoading(false);
  }
};

  return (
    <main className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[700px]">

        <h1 className="text-3xl font-bold mb-6 text-black">
          AI Text Similarity
        </h1>

        <textarea
          placeholder="Enter first text..."
          value={text1}
          onChange={(e) => setText1(e.target.value)}
          className="w-full border p-3 rounded mb-4 text-black"
          rows={5}
        />

        <textarea
          placeholder="Enter second text..."
          value={text2}
          onChange={(e) => setText2(e.target.value)}
          className="w-full border p-3 rounded mb-4 text-black"
          rows={5}
        />
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="border p-2 rounded mb-4 text-black w-full"
        >
          <option value="minilm">MiniLM (Fast)</option>
          <option value="mpnet">MPNet (Accurate)</option>
        </select>
        <button
          onClick={handleCompare}
          disabled={loading}
          className="bg-pink-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Comparing..." : "Compare"}
        </button>

        {score !== null && (
          <div className="text-green-600 mt-6 text-xl">
            Similarity Score: {score.toFixed(3)}
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-3 text-black">
            History
          </h2>

          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {history.map((item) => (
              <div
                key={item._id}
                className="border p-3 rounded text-black"
              >
                <p>
                  <b>Text 1:</b> {item.text1}
                </p>
                <p>
                  <b>Text 2:</b> {item.text2}
                </p>
                <p>
                  <b>Similarity:</b>{" "}
                  {item.similarity.toFixed(3)}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
