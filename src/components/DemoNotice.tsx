export default function DemoNotice() {
  return (
    <div className="glass rounded-2xl p-4 text-white/80 text-center max-w-2xl mx-auto mb-6">
      <div className="flex items-center justify-center mb-2">
        <span className="text-2xl mr-2">🧪</span>
        <h3 className="text-lg font-medium">Demo Mode</h3>
      </div>
      <p className="text-sm text-white/60">
        You're viewing demo weather data. To get real weather information, 
        add your OpenWeather API key to the <code className="bg-white/10 px-1 rounded">.env.local</code> file.
      </p>
      <p className="text-xs text-white/40 mt-2">
        Get your free API key at{' '}
        <a 
          href="https://openweathermap.org/api" 
          target="_blank" 
          rel="noopener noreferrer"
          className="underline hover:text-white/60"
        >
          openweathermap.org
        </a>
      </p>
    </div>
  );
} 