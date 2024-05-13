'use strict'
const api_key = '612fe0c2c22681284f5bdf0b1f77bd17'
const BAIDU_KEY = '26711937b3cbee60212cdf3af91b0ed8'
export const fetchData = (URL, callback) => {
    fetch(`${URL}`)
        .then(res => res.json())
        .then(data => callback(data))
}
export const url = {
    currentWeather(lat, lon) {
        return `https://api.openweathermap.org/data/2.5/weather?${lat}&${lon}&units=metric&lang=zh_cn&appid=${api_key}`
    },
    forecast(lat, lon) {
        return `https://api.openweathermap.org/data/2.5/forecast?${lat}&${lon}&units=metric&lang=zh_cn&appid=${api_key}`
    },
    airPollution(lat, lon) {
        return `https://api.openweathermap.org/data/2.5/air_pollution?${lat}&${lon}&appid=${api_key}`
    },
    reverseGeo(lat, lon) {
        return `https://restapi.amap.com/v3/geocode/regeo?output=json&location=${lon},${lat}&key=${BAIDU_KEY}`
    },
    /**
     * 
     * @param {string} query Search query e.g. : "成都" | "成都市武侯区..."
     * @returns 
     */
    geo(query) {
        return `https://restapi.amap.com/v3/geocode/geo?&output=json&key=${BAIDU_KEY}&address=${query}`
    }
}