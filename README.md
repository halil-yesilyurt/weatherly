# 🌤️ Weatherly - Beautiful Weather App

A modern, responsive weather application built with Next.js, TypeScript, and Tailwind CSS. Get real-time weather data and forecasts with a beautiful, intuitive interface.

![Weatherly Preview](https://via.placeholder.com/800x400/1e1b4b/ffffff?text=Weatherly+Weather+App)

## ✨ Features

- 🌍 **Geolocation Support** - Automatically detects your location
- 🔍 **City Search** - Search weather for any city worldwide
- 📊 **Detailed Weather Info** - Temperature, humidity, wind speed, visibility
- ⏰ **Hourly Forecast** - 12-hour weather predictions
- 📅 **7-Day Forecast** - Weekly weather outlook
- 🎨 **Beautiful UI** - Modern glass-morphism design
- 📱 **Responsive Design** - Works perfectly on all devices
- ⚡ **Fast Performance** - Built with Next.js 15 and React 19
- 🌙 **Dark Theme** - Elegant dark interface

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Heroicons + Emojis
- **API**: OpenWeatherMap API
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenWeatherMap API key (free)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/weatherly.git
   cd weatherly
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Get your OpenWeatherMap API key**
   - Visit [OpenWeatherMap](https://openweathermap.org/api)
   - Sign up for a free account
   - Generate your API key

4. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add your environment variable in Vercel dashboard
4. Deploy!

### Deploy to Netlify

1. Build the project: `npm run build`
2. Upload the `out` folder to Netlify
3. Set environment variables in Netlify dashboard

## 📁 Project Structure

```
weatherly/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ErrorMessage.tsx
│   │   ├── HourlyForecast.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── SearchBar.tsx
│   │   └── WeatherCard.tsx
│   ├── services/
│   │   └── weatherService.ts
│   └── types/
│       └── weather.ts
├── public/
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## 🎯 Usage

1. **Automatic Location**: Allow location access for automatic weather detection
2. **Search Cities**: Use the search bar to find weather for any city
3. **View Details**: Explore detailed weather information and forecasts
4. **Responsive**: Use on any device - mobile, tablet, or desktop

## 🔧 Configuration

### API Configuration
The app uses OpenWeatherMap API with the following endpoints:
- Current Weather: `/weather`
- 5-day Forecast: `/forecast`

### Customization
- Modify colors in `tailwind.config.ts`
- Update glass effects in `globals.css`
- Add new weather metrics in components

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for weather data
- [Heroicons](https://heroicons.com/) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Next.js](https://nextjs.org/) for the framework

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the [documentation](https://github.com/yourusername/weatherly/wiki)
- Contact the maintainers

---

Made with ❤️ by [Your Name](https://github.com/yourusername)
