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
      let coords;
      let name, country;
      
      if (typeof searchInput === "string") {
        coords = await getCoordinates(searchInput);
        name = coords.name;
        country = coords.country;
      } else if (searchInput && searchInput.coords) {
        // For recent searches: full object with coords, name, country
        coords = searchInput.coords;
        name = searchInput.name;
        country = searchInput.country;
      } else {
        // Direct coords object
        coords = searchInput;
        // For direct coords, we might need to fetch name/country, but assuming it's provided or skip
        name = "Unknown City";
        country = "Unknown";
      }
      
      const { latitude, longitude } = coords;
      
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weathercode,pressure_msl,windspeed_10m,winddirection_10m,is_day&hourly=temperature_2m,precipitation_probability&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,precipitation_sum,precipitation_probability_max,weathercode,uv_index_max,sunrise,sunset&forecast_days=7&timezone=auto`
      );
      
      const response = await res.json();
      
      if (!response.current) {
        throw new Error("Invalid weather data received");
      }
      
      const current = response.current;
      
      // Defensive: check for daily and sunrise/sunset arrays
      const hasSunrise = response.daily && Array.isArray(response.daily.sunrise) && response.daily.sunrise.length > 0;
      const hasSunset = response.daily && Array.isArray(response.daily.sunset) && response.daily.sunset.length > 0;
      
      const weatherData = {
        ...current,
        city: name,
        country,
        sunrise: hasSunrise ? response.daily.sunrise[0] : null,
        sunset: hasSunset ? response.daily.sunset[0] : null
      };
      
      setWeather(weatherData);
      setForecast(response);
      
      if (typeof searchInput !== "string" && searchInput && searchInput.name) {
        // Update recent searches only for new searches, not recent ones
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