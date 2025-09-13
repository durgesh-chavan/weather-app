export async function getCoordinates(city) {
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en`
  );
  const data = await res.json();
  if (!data.results || data.results.length === 0) {
    throw new Error("City not found");
  }
  return data.results[0];
}