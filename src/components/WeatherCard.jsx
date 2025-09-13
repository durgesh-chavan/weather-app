import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, Tooltip, CartesianGrid } from "recharts";
import { Sun, Cloud, CloudRain, Wind, Droplets, Eye, Thermometer, Gauge, Calendar, Clock, TrendingUp, Activity } from "lucide-react";

const weatherIcons = {
  0: Sun,
  1: Sun,
  2: Cloud,
  3: Cloud,
  45: Cloud,
  48: Cloud,
  51: CloudRain,
  53: CloudRain,
  55: CloudRain,
  61: CloudRain,
  63: CloudRain,
  65: CloudRain,
  80: CloudRain,
  95: CloudRain,
};

const weatherDescriptions = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  80: "Rain showers",
  95: "Thunderstorm",
};

const getWeatherGradient = (weatherCode) => {
  if ([0, 1].includes(weatherCode)) return "from-yellow-400 via-orange-400 to-red-400";
  if ([2, 3].includes(weatherCode)) return "from-gray-400 via-gray-500 to-gray-600";
  if ([51, 53, 55, 61, 63, 65, 80].includes(weatherCode)) return "from-blue-400 via-blue-500 to-indigo-600";
  if ([95].includes(weatherCode)) return "from-purple-400 via-purple-500 to-indigo-600";
  return "from-blue-400 via-blue-500 to-blue-600";
};

export default function WeatherCard({ data, forecast }) {
  const [activeTab, setActiveTab] = useState("overview");
  
  if (!data || !forecast) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading weather data...</p>
      </div>
    );
  }

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } catch {
      return timeString;
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const WeatherIcon = weatherIcons[data.weathercode] || Cloud;
  
  // Prepare chart data
  const temperatureChartData = forecast.daily.time.slice(0, 7).map((date, index) => ({
    day: getDayName(date),
    max: forecast.daily.temperature_2m_max[index],
    min: forecast.daily.temperature_2m_min[index],
  }));

  const precipitationData = forecast.daily.time.slice(0, 7).map((date, index) => ({
    day: getDayName(date),
    precipitation: forecast.daily.precipitation_probability_max[index],
  }));

  const windData = forecast.daily.time.slice(0, 7).map((date, index) => ({
    day: getDayName(date),
    wind: forecast.daily.windspeed_10m_max ? forecast.daily.windspeed_10m_max[index] : 0,
  }));

  const comfortData = [
    { name: "Comfort", value: 85, color: "#10B981" },
    { name: "Discomfort", value: 15, color: "#EF4444" },
  ];

  const uvIndexData = [
    { time: "6 AM", uv: 0 },
    { time: "9 AM", uv: 2 },
    { time: "12 PM", uv: 8 },
    { time: "3 PM", uv: 9 },
    { time: "6 PM", uv: 3 },
    { time: "9 PM", uv: 0 },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Hero Section */}
      <div className={`bg-gradient-to-br ${getWeatherGradient(data.weathercode)} p-6 text-white`}>
        <div className="flex flex-col md:flex-row items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{data.city}, {data.country}</h1>
            <p className="text-white/80 text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {formatDate(new Date())}
            </p>
          </div>
          <div className="text-right mt-4 md:mt-0">
            <div className="flex items-center gap-4 justify-end">
              <WeatherIcon className="w-12 h-12" />
              <div>
                <div className="text-5xl font-light">{Math.round(data.temperature_2m)}°</div>
                <div className="text-lg opacity-80">Feels like {Math.round(data.apparent_temperature)}°</div>
              </div>
            </div>
            <p className="text-lg mt-2 opacity-90">
              {weatherDescriptions[data.weathercode] || "Unknown"}
            </p>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 flex items-center gap-2">
            <Droplets className="w-6 h-6" />
            <div>
              <p className="text-xs opacity-80">Humidity</p>
              <p className="text-xl font-semibold">{data.relative_humidity_2m}%</p>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 flex items-center gap-2">
            <Wind className="w-6 h-6" />
            <div>
              <p className="text-xs opacity-80">Wind</p>
              <p className="text-xl font-semibold">{data.windspeed_10m} km/h</p>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 flex items-center gap-2">
            <Sun className="w-6 h-6" />
            <div>
              <p className="text-xs opacity-80">Sunrise</p>
              <p className="text-lg font-semibold">{formatTime(data.sunrise)}</p>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 flex items-center gap-2">
            <Cloud className="w-6 h-6" />
            <div>
              <p className="text-xs opacity-80">Sunset</p>
              <p className="text-lg font-semibold">{formatTime(data.sunset)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto gap-1 p-4 bg-gray-50">
        {[
          { id: "overview", label: "Overview", icon: Activity },
          { id: "forecast", label: "7-Day Forecast", icon: Calendar },
          { id: "charts", label: "Analytics", icon: TrendingUp },
          { id: "details", label: "Details", icon: Eye }
        ].map((tab) => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-blue-500 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              <TabIcon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Temperature Trend */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-blue-500" />
                Temperature Trend
              </h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={temperatureChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="max" stroke="#F59E0B" fill="#FEF3C7" />
                    <Line type="monotone" dataKey="min" stroke="#3B82F6" strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Comfort Index */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Comfort Index</h3>
              <div className="flex items-center justify-center">
                <div className="relative w-40 h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={comfortData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        dataKey="value"
                      >
                        {comfortData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">85%</div>
                      <div className="text-xs text-gray-600">Comfortable</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "forecast" && (
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">7-Day Forecast</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2">
              {forecast.daily.time.slice(0, 7).map((date, index) => {
                const isToday = index === 0;
                const DayWeatherIcon = weatherIcons[forecast.daily.weathercode[index]] || Cloud;
                return (
                  <div key={date} className={`rounded-xl p-3 text-center ${
                    isToday ? 'bg-blue-500 text-white' : 'bg-white'
                  }`}>
                    <div className={`font-medium text-sm mb-1 ${isToday ? 'text-white' : 'text-gray-700'}`}>
                      {isToday ? 'Today' : getDayName(date)}
                    </div>
                    <div className="mb-2">
                      <DayWeatherIcon className={`w-8 h-8 mx-auto ${isToday ? 'text-white' : 'text-blue-500'}`} />
                    </div>
                    <div className={`text-xl font-bold ${isToday ? 'text-white' : 'text-gray-800'}`}>
                      {Math.round(forecast.daily.temperature_2m_max[index])}°
                    </div>
                    <div className={`text-xs ${isToday ? 'text-white/80' : 'text-gray-600'}`}>
                      {Math.round(forecast.daily.temperature_2m_min[index])}°
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "charts" && (
          <div className="grid grid-cols-1 gap-4">
            {/* Precipitation Chart */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <CloudRain className="w-5 h-5 text-blue-500" />
                Precipitation Probability
              </h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={precipitationData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="precipitation" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Temperature Chart */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-orange-500" />
                Temperature Forecast
              </h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={temperatureChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="max" stroke="#F59E0B" strokeWidth={2} />
                    <Line type="monotone" dataKey="min" stroke="#3B82F6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === "details" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: Gauge, label: "Pressure", value: `${data.pressure_msl} hPa`, color: "text-purple-500" },
              { icon: Droplets, label: "Precipitation", value: `${data.precipitation} mm`, color: "text-blue-500" },
              { icon: Wind, label: "Wind Speed", value: `${data.windspeed_10m} km/h`, color: "text-green-500" },
              { icon: Eye, label: "Humidity", value: `${data.relative_humidity_2m}%`, color: "text-teal-500" },
            ].map((item, index) => {
              const ItemIcon = item.icon;
              return (
                <div key={index} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <ItemIcon className={`w-6 h-6 ${item.color}`} />
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-800">{item.value}</p>
                      <p className="text-sm text-gray-600">{item.label}</p>
                    </div>
                  </div>    
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}