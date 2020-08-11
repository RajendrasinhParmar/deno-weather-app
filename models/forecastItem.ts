export interface forecastItem {
    dt: string;
    main: { temp: number; }
    weather: { description: string; }[];
}