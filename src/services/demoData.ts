import { WeatherData, ForecastData } from '@/types/weather';

export const demoWeatherData: WeatherData = {
  coord: { lon: -0.1257, lat: 51.5085 },
  weather: [
    {
      id: 803,
      main: "Clouds",
      description: "broken clouds",
      icon: "04d"
    }
  ],
  base: "stations",
  main: {
    temp: 17,
    feels_like: 16.2,
    temp_min: 15,
    temp_max: 19,
    pressure: 1013,
    humidity: 75
  },
  visibility: 10000,
  wind: {
    speed: 3.5,
    deg: 240
  },
  clouds: {
    all: 75
  },
  dt: 1703097600,
  sys: {
    country: "GB",
    sunrise: 1703061600,
    sunset: 1703091200
  },
  timezone: 0,
  id: 2643743,
  name: "London",
  cod: 200
};

export const demoForecastData: ForecastData = {
  cod: "200",
  message: 0,
  cnt: 40,
  list: [
    {
      dt: 1703097600,
      main: {
        temp: 17,
        feels_like: 16.2,
        temp_min: 15,
        temp_max: 19,
        pressure: 1013,
        sea_level: 1013,
        grnd_level: 1009,
        humidity: 75,
        temp_kf: 0
      },
      weather: [
        {
          id: 803,
          main: "Clouds",
          description: "broken clouds",
          icon: "04d"
        }
      ],
      clouds: { all: 75 },
      wind: { speed: 3.5, deg: 240, gust: 5.2 },
      visibility: 10000,
      pop: 0.2,
      sys: { pod: "d" },
      dt_txt: "2023-12-20 12:00:00"
    },
    {
      dt: 1703108400,
      main: {
        temp: 16,
        feels_like: 15.1,
        temp_min: 14,
        temp_max: 18,
        pressure: 1014,
        sea_level: 1014,
        grnd_level: 1010,
        humidity: 78,
        temp_kf: 0
      },
      weather: [
        {
          id: 802,
          main: "Clouds",
          description: "scattered clouds",
          icon: "03d"
        }
      ],
      clouds: { all: 40 },
      wind: { speed: 3.2, deg: 235, gust: 4.8 },
      visibility: 10000,
      pop: 0.1,
      sys: { pod: "d" },
      dt_txt: "2023-12-20 15:00:00"
    },
    {
      dt: 1703119200,
      main: {
        temp: 15,
        feels_like: 14.2,
        temp_min: 13,
        temp_max: 17,
        pressure: 1015,
        sea_level: 1015,
        grnd_level: 1011,
        humidity: 80,
        temp_kf: 0
      },
      weather: [
        {
          id: 801,
          main: "Clouds",
          description: "few clouds",
          icon: "02n"
        }
      ],
      clouds: { all: 20 },
      wind: { speed: 2.8, deg: 230, gust: 4.2 },
      visibility: 10000,
      pop: 0.05,
      sys: { pod: "n" },
      dt_txt: "2023-12-20 18:00:00"
    },
    {
      dt: 1703130000,
      main: {
        temp: 14,
        feels_like: 13.1,
        temp_min: 12,
        temp_max: 16,
        pressure: 1016,
        sea_level: 1016,
        grnd_level: 1012,
        humidity: 82,
        temp_kf: 0
      },
      weather: [
        {
          id: 800,
          main: "Clear",
          description: "clear sky",
          icon: "01n"
        }
      ],
      clouds: { all: 5 },
      wind: { speed: 2.5, deg: 225, gust: 3.8 },
      visibility: 10000,
      pop: 0,
      sys: { pod: "n" },
      dt_txt: "2023-12-20 21:00:00"
    },
    {
      dt: 1703140800,
      main: {
        temp: 13,
        feels_like: 12.2,
        temp_min: 11,
        temp_max: 15,
        pressure: 1017,
        sea_level: 1017,
        grnd_level: 1013,
        humidity: 85,
        temp_kf: 0
      },
      weather: [
        {
          id: 800,
          main: "Clear",
          description: "clear sky",
          icon: "01n"
        }
      ],
      clouds: { all: 0 },
      wind: { speed: 2.2, deg: 220, gust: 3.5 },
      visibility: 10000,
      pop: 0,
      sys: { pod: "n" },
      dt_txt: "2023-12-21 00:00:00"
    },
    {
      dt: 1703151600,
      main: {
        temp: 18,
        feels_like: 17.3,
        temp_min: 16,
        temp_max: 20,
        pressure: 1018,
        sea_level: 1018,
        grnd_level: 1014,
        humidity: 70,
        temp_kf: 0
      },
      weather: [
        {
          id: 801,
          main: "Clouds",
          description: "few clouds",
          icon: "02d"
        }
      ],
      clouds: { all: 15 },
      wind: { speed: 3.8, deg: 245, gust: 5.5 },
      visibility: 10000,
      pop: 0.1,
      sys: { pod: "d" },
      dt_txt: "2023-12-21 03:00:00"
    },
    {
      dt: 1703162400,
      main: {
        temp: 21,
        feels_like: 20.4,
        temp_min: 19,
        temp_max: 23,
        pressure: 1019,
        sea_level: 1019,
        grnd_level: 1015,
        humidity: 65,
        temp_kf: 0
      },
      weather: [
        {
          id: 802,
          main: "Clouds",
          description: "scattered clouds",
          icon: "03d"
        }
      ],
      clouds: { all: 35 },
      wind: { speed: 4.2, deg: 250, gust: 6.1 },
      visibility: 10000,
      pop: 0.15,
      sys: { pod: "d" },
      dt_txt: "2023-12-21 06:00:00"
    },
    {
      dt: 1703173200,
      main: {
        temp: 20,
        feels_like: 19.5,
        temp_min: 18,
        temp_max: 22,
        pressure: 1020,
        sea_level: 1020,
        grnd_level: 1016,
        humidity: 68,
        temp_kf: 0
      },
      weather: [
        {
          id: 803,
          main: "Clouds",
          description: "broken clouds",
          icon: "04d"
        }
      ],
      clouds: { all: 60 },
      wind: { speed: 3.9, deg: 255, gust: 5.8 },
      visibility: 10000,
      pop: 0.2,
      sys: { pod: "d" },
      dt_txt: "2023-12-21 09:00:00"
    },
    {
      dt: 1703184000,
      main: {
        temp: 19,
        feels_like: 18.6,
        temp_min: 17,
        temp_max: 21,
        pressure: 1021,
        sea_level: 1021,
        grnd_level: 1017,
        humidity: 72,
        temp_kf: 0
      },
      weather: [
        {
          id: 804,
          main: "Clouds",
          description: "overcast clouds",
          icon: "04d"
        }
      ],
      clouds: { all: 85 },
      wind: { speed: 3.6, deg: 260, gust: 5.4 },
      visibility: 10000,
      pop: 0.25,
      sys: { pod: "d" },
      dt_txt: "2023-12-21 12:00:00"
    },
    {
      dt: 1703194800,
      main: {
        temp: 16,
        feels_like: 15.7,
        temp_min: 14,
        temp_max: 18,
        pressure: 1022,
        sea_level: 1022,
        grnd_level: 1018,
        humidity: 78,
        temp_kf: 0
      },
      weather: [
        {
          id: 500,
          main: "Rain",
          description: "light rain",
          icon: "10n"
        }
      ],
      clouds: { all: 90 },
      wind: { speed: 3.2, deg: 265, gust: 4.9 },
      visibility: 10000,
      pop: 0.4,
      sys: { pod: "n" },
      dt_txt: "2023-12-21 15:00:00"
    },
    {
      dt: 1703205600,
      main: {
        temp: 15,
        feels_like: 14.8,
        temp_min: 13,
        temp_max: 17,
        pressure: 1023,
        sea_level: 1023,
        grnd_level: 1019,
        humidity: 82,
        temp_kf: 0
      },
      weather: [
        {
          id: 501,
          main: "Rain",
          description: "moderate rain",
          icon: "10n"
        }
      ],
      clouds: { all: 95 },
      wind: { speed: 2.8, deg: 270, gust: 4.5 },
      visibility: 8000,
      pop: 0.6,
      sys: { pod: "n" },
      dt_txt: "2023-12-21 18:00:00"
    },
    {
      dt: 1703216400,
      main: {
        temp: 14,
        feels_like: 13.9,
        temp_min: 12,
        temp_max: 16,
        pressure: 1024,
        sea_level: 1024,
        grnd_level: 1020,
        humidity: 85,
        temp_kf: 0
      },
      weather: [
        {
          id: 500,
          main: "Rain",
          description: "light rain",
          icon: "10n"
        }
      ],
      clouds: { all: 80 },
      wind: { speed: 2.5, deg: 275, gust: 4.1 },
      visibility: 9000,
      pop: 0.3,
      sys: { pod: "n" },
      dt_txt: "2023-12-21 21:00:00"
    }
  ],
  city: {
    id: 2643743,
    name: "London",
    coord: { lat: 51.5085, lon: -0.1257 },
    country: "GB",
    population: 1000000,
    timezone: 0,
    sunrise: 1703061600,
    sunset: 1703091200
  }
}; 