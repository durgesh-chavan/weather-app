import "./globals.css";

export const metadata = {
  title: "Weather Now",
  description: "Real-time weather updates powered by Open-Meteo API",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900 font-sans min-h-screen flex flex-col antialiased">
        <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 text-white p-4 sm:p-6 shadow-lg">
          <div className="max-w-6xl mx-auto flex items-center justify-center gap-3">
            <div className="text-4xl">☀️</div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Weather Now</h1>
            <div className="text-sm text-blue-200 hidden sm:block">Live Updates</div>
          </div>
        </header>
        <main className="flex-1 flex justify-center items-start p-4 sm:p-6 lg:p-8">
          {children}
        </main>
        <footer className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 text-white text-center p-4 text-sm mt-auto">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>© {new Date().getFullYear()} Weather Now • Powered by <a href="https://open-meteo.com"  className="underline hover:text-blue-200 transition-colors">Open-Meteo</a> • Developed by <a href="https://www.linkedin.com/in/durgesh-chavan/"  className="underline hover:text-blue-200 transition-colors">Durgesh chavan</a></p>
            <div className="text-xs text-blue-200">Stay updated with real-time weather</div>
          </div>
        </footer>
      </body>
    </html>
  );
}