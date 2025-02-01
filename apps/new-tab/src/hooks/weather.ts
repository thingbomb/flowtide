import { createSignal, createEffect } from "solid-js";

// eslint-disable-next-line
let updateWeatherManually = (lat?: number, long?: number) => {};

function useWeather(latitude: number, longitude: number) {
  const [weather, setWeather] = createSignal<WeatherData | null>(null);

  const fetchWeather = async (lat?: number, long?: number) => {
    const cacheKey = `weather-${lat || latitude}-${long || longitude}`;
    const cachedData = localStorage.getItem(cacheKey);
    const cachedTime = localStorage.getItem(`${cacheKey}-time`);

    const currentTime = Date.now();
    const cacheDuration = 60 * 1000 * 15;

    if (
      cachedData &&
      cachedTime &&
      currentTime - Number(cachedTime) < cacheDuration
    ) {
      console.log(`weather-${lat || latitude}-${long || longitude}`);
      setWeather(JSON.parse(cachedData));
      console.log("Using cached weather data");
    } else {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat || latitude}&longitude=${long || longitude}&current=temperature_2m,weathercode`
        );
        const data = await response.json();
        console.log(data);

        const newWeather = {
          temperature: data.current.temperature_2m,
          condition: data.current.weathercode,
        };

        newWeather.temperature = Number(newWeather.temperature);

        localStorage.setItem(cacheKey, JSON.stringify(newWeather));
        localStorage.setItem(`${cacheKey}-time`, currentTime.toString());
        console.log("Fetched new weather data");

        setWeather(newWeather);
      } catch (error) {
        console.error("Error fetching weather:", error);
      }
    }

    updateWeatherManually = (lat, long) => {
      setWeather(null);
      fetchWeather(lat, long);
    };
  };

  createEffect(() => {
    fetchWeather();
    const intervalId = setInterval(() => {
      const cacheKey = `weather-${latitude}-${longitude}`;
      const cachedTime = localStorage.getItem(`${cacheKey}-time`);
      const currentTime = Date.now();
      const cacheDuration = 60 * 1000 * 15;

      if (cachedTime && currentTime - Number(cachedTime) >= cacheDuration) {
        fetchWeather();
      }
    }, 3000);

    return () => clearInterval(intervalId);
  });

  return [weather];
}

interface WeatherData {
  temperature: number;
  condition: string;
}

export { useWeather, updateWeatherManually };
