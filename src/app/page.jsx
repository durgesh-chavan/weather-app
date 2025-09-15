"use client";

import { useState, useEffect } from "react";
import SearchBar from "@/components/SearchBar";
import WeatherCard from "@/components/WeatherCard";
import ErrorMessage from "@/components/ErrorMessage";
import RecentlySearched from "@/components/RecentlySearched";
import { getCoordinates } from "@/lib/weatherService";
import WeatherCardSkeleton from "@/components/WeatherCardSkeleton";

export default function Home() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [cityInput, setCityInput] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (cityInput.length >= 2) {
        fetchSuggestions(cityInput);
      } else {
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [cityInput]);

  async function fetchSuggestions(city) {
    try {
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=5&language=en`
      );
      const data = await res.json();
      setSuggestions(data.results || []);
    } catch (err) {
      console.error("Suggestions fetch error:", err);
      setSuggestions([]);
    }
  }

  async function handleSearch(searchInput) {
  try {
    setLoading(true);
    setError("");
    
    let latitude, longitude, name, country;

    if (typeof searchInput === "string") {
      const coords = await getCoordinates(searchInput);
      latitude = coords.latitude;
      longitude = coords.longitude;
      name = coords.name || searchInput;
      country = coords.country || "Unknown";
    } else {
      // From suggestion or recent search
      latitude = searchInput.latitude || searchInput.coords?.latitude;
      longitude = searchInput.longitude || searchInput.coords?.longitude;
      name = searchInput.name || "Unknown City";
      country = searchInput.country || "Unknown";
    }

    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weathercode,pressure_msl,windspeed_10m,winddirection_10m,is_day&hourly=temperature_2m,precipitation_probability&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,precipitation_sum,precipitation_probability_max,weathercode,uv_index_max,sunrise,sunset&forecast_days=7&timezone=auto`
    );
    const response = await res.json();

    if (!response.current) throw new Error("Invalid weather data received");

    const current = response.current;

    const weatherData = {
      ...current,
      city: name,
      country,
      sunrise: response.daily?.sunrise?.[0] || null,
      sunset: response.daily?.sunset?.[0] || null,
    };

    setWeather(weatherData);
    setForecast(response);

    // Save recent searches (only if it was from suggestion, not plain string)
    if (typeof searchInput !== "string") {
      const newSearch = { name, country, coords: { latitude, longitude } };
      const updatedRecent = [newSearch, ...recentSearches.filter((r) => r.name !== name)].slice(0, 5);
      setRecentSearches(updatedRecent);
      localStorage.setItem("recentSearches", JSON.stringify(updatedRecent));
    }

    setCityInput("");
  } catch (err) {
    setError(err.message || "Failed to fetch weather data");
    setWeather(null);
    setForecast(null);
  } finally {
    setLoading(false);
  }
}


  const handleRecentSearch = (search) => {
    handleSearch(search); // Pass full search object
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 px-4 sm:px-0">
      <SearchBar
        onSearch={handleSearch}
        suggestions={suggestions}
        onSuggestionSelect={handleSearch}
        city={cityInput}
        setCity={setCityInput}
      />
      
      {recentSearches.length > 0 && (
        <RecentlySearched 
          searches={recentSearches} 
          onSearch={handleRecentSearch}
          onClear={clearRecentSearches}
        />
      )}
      
      {loading && <WeatherCardSkeleton />}
      
      {error && <ErrorMessage message={error} />}
      
      {weather && <WeatherCard data={weather} forecast={forecast} />}
    </div>
  );
}