import React from "react";
import { Thermometer, CloudRain, Calendar, Activity, TrendingUp, Eye } from "lucide-react";

const SkeletonLine = ({ className = "" }) => (
  <div className={`bg-gray-200 rounded-full animate-pulse ${className}`}></div>
);

export default function WeatherCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Hero Section Skeleton */}
      <div className="bg-gradient-to-br from-blue-400 to-indigo-600 p-6 text-white animate-pulse">
        <div className="flex flex-col md:flex-row items-start justify-between mb-6 space-y-2 md:space-y-0">
          <div className="space-y-2">
            <SkeletonLine className="h-8 w-48" />
            <SkeletonLine className="h-4 w-32" />
          </div>
          <div className="flex items-center gap-4 justify-end">
            <div className="w-12 h-12 bg-white/20 rounded-full"></div>
            <div className="space-y-2">
              <SkeletonLine className="h-12 w-20" />
              <SkeletonLine className="h-4 w-24" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white/20 backdrop-blur-sm rounded-xl p-3 space-y-1">
              <div className="w-6 h-6 bg-white/30 rounded-full mx-auto"></div>
              <SkeletonLine className="h-3 w-16 mx-auto" />
              <SkeletonLine className="h-4 w-12 mx-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Tabs Skeleton */}
      <div className="flex overflow-x-auto gap-1 p-4 bg-gray-50">
        {[
          { icon: Activity },
          { icon: Calendar },
          { icon: TrendingUp },
          { icon: Eye }
        ].map((tab, i) => {
          const TabIcon = tab.icon;
          return (
            <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 animate-pulse whitespace-nowrap">
              <TabIcon className="w-4 h-4 bg-white rounded" />
              <SkeletonLine className="h-3 w-16" />
            </div>
          );
        })}
      </div>

      {/* Tab Content Skeleton */}
      <div className="p-4 space-y-4">
        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Thermometer className="w-5 h-5 bg-gray-300 rounded-full animate-pulse" />
            <SkeletonLine className="h-5 w-32" />
          </div>
          <div className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
          <SkeletonLine className="h-5 w-24" />
          <div className="flex items-center justify-center">
            <div className="relative w-40 h-40 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <CloudRain className="w-5 h-5 bg-gray-300 rounded-full animate-pulse" />
            <SkeletonLine className="h-5 w-32" />
          </div>
          <div className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-4 space-y-2 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                <div className="space-y-1">
                  <SkeletonLine className="h-5 w-20" />
                  <SkeletonLine className="h-3 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}