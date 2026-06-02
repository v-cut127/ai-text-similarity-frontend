export async function compareTexts(
  text1: string,
  text2: string
) {
  const response = await fetch(
    "http://localhost:5000/api/compare",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text1,
        text2,
      }),
    }
  );

  return response.json();
}