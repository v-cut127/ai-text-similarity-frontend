export async function compareTexts(
  text1: string,
  text2: string,
  model: string = "minilm"
) {
  const res = await fetch(
    "https://ai-text-similarity-backend.onrender.com/api/compare",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text1, text2, model }),
    }
  );

  return res.json();
}
