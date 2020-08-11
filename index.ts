import { parse } from "https://deno.land/std@0.64.0/flags/mod.ts";
import { config } from "https://deno.land/x/dotenv@v0.5.0/mod.ts";
import { fromUnixTime,format } from "https://deno.land/x/date_fns@v2.15.0/index.js";
import AsciiTable from "https://deno.land/x/ascii_table@v0.1.0/mod.ts";

import { forecastItem } from "./models/forecastItem.ts";

const args = parse(Deno.args);

const env = config({
    path: './config/.env',
    // using safe option will ignore the defaults file configuration
    // if it's present in example environment.
    safe: true,
    allowEmptyValues: true,
    example: './config/.env.example',
    defaults: './config/.env.defaults'
});

if (args.city === undefined) {
    console.error("No city supplied");
    console.info("Usage:");
    console.info("\t deno run --allow-net index.ts --city <City_Name>");
    Deno.exit();
}

const getWeatherResponse = async (cityName: string): Promise<any> => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${env.OPEN_WEATHER_MAP_API_KEY}`,{
        method: 'GET',
        headers: {
            "Content-type": "application/json"
        }
    });

    return response.json();
}

const weatherData = await getWeatherResponse(args.city);

console.log(weatherData);

const forecast = weatherData.list.slice(0,8).map((item: forecastItem) => [
    format(fromUnixTime(item.dt),"do LLL, k:mm",{}),
    `${item.main.temp.toFixed(1)}C`,
    item.weather[0].description
])

const table = AsciiTable.fromJSON({
    title: `${weatherData.city.name} Weather Forecast`,
    heading: ['Time','Temp','Weather'],
    rows: forecast
});