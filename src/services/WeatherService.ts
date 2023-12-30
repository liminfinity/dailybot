import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();

export class WeatherService {
    private weather_api: string
    constructor() {
        this.weather_api = process.env["WEATHER_KEY"] || ''
    }
    public async getWeather(latitude: number = 0, longitude: number = 0): Promise<string> {
      try {
          const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${this.weather_api}`);
          const data = response.data
          let result: string = '';
          const current_day = new Date()
          result += `Погода на ${current_day.getDate()}.${current_day.getMonth()}.${current_day.getFullYear()} в городе ${data.name}`
          result += `\n\tТемпература: ${data.main.temp}`;
          result += `\n\tСкорость ветра: ${data.wind.speed} м/c`;
          result += `\n\tОписание: ${data.weather[0].description}`;
          return result;
        } catch (error) {
          return "Запрос отклонен";
        }
    }
}