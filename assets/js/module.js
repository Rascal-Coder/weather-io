/**
 * @license MIT
 * @fileoverview All module functions
 * @copyright codewithsadee 2023 All rights reserved
 * @author codewithsadee <mohammadsadee24@gmail.com>
 */

'use strict';

// export const weekDayNames = [
//     "Sunday",
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     "Saturday"
// ];
export const weekDayNames = [
    "星期天",
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六"
];

// export const monthNames = [
//     "Jan",
//     "Feb",
//     "Mar",
//     "Apr",
//     "May",
//     "Jun",
//     "Jul",
//     "Aug",
//     "Sep",
//     "Oct",
//     "Nov",
//     "Dec"
// ];
// export const monthNames = [
//     "一月",
//     "二月",
//     "三月",
//     "四月",
//     "五月",
//     "六月",
//     "七月",
//     "八月",
//     "九月",
//     "十月",
//     "十一月",
//     "十二月"
// ];
export const monthNames = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12"
];

/**
 * 
 * @param {number} dateUnix Unix date in seconds
 * @param {number} timezone Timezone shift from UTC in seconds
 * @returns {string} Date string. format: "Sunday 10, Jul"
 */
export const getDate = function (dateUnix, timezone) {
    const date = new Date((dateUnix + timezone) * 1000);
    const weekDayName = weekDayNames[date.getUTCDay()];
    const monthName = monthNames[date.getUTCMonth()];

    return `${weekDayName} ${monthName} / ${date.getUTCDate()}`;
}
/**
 * 
 * @param {number} timeUnix Unix date in seconds 
 * @param {number} timezone Timezone shift from UTC in seconds 
 * @returns {string} Time string. format: "HH:MM AM/PM"
 */
export const getTime = function (timeUnix, timezone) {
    const date = new Date((timeUnix + timezone) * 1000);
    console.log("🚀 ~ getTime ~ timeUnix:", timeUnix)
    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const period = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;

    return `${hours}:${minutes} ${period}`;
}

/**
 * 
 * @param {number} timeUnix Unix date in seconds 
 * @param {number} timezone Timezone shift from UTC in seconds 
 * @returns {string} Time string. format: "HH AM/PM"
 */
// export const getHours = function (timeUnix, timezone) {
//     const date = new Date((timeUnix + timezone) * 1000);
//     let hours = date.getUTCHours();
//     const period = hours >= 12 ? "PM" : "AM";
//     // hours = hours % 12 || 12;
//     return `${hours} ${period}`;
// } 
export const getHours = function (timeUnix, timezone) {
    // 将 Unix 时间戳转换为 Date 对象
    const date = new Date(timeUnix);
    const adjustedDate = new Date(date.getTime() + (timezone * 1000));
    let hours = adjustedDate.getHours();
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours} ${period}`;
}
/**
 * 
 * @param {number} mps Meter per second 
 * @returns  {number} Kilometer per hours
 */
export const mps_to_kmh = mps => {
    const mph = mps * 3.6;
    return mph.toFixed(1);
}

export const aqiText = {
    1: {
        level: "Good",
        message: "Air quality is considered satisfactory, and air pollution poses little or no risk."
    },
    2: {
        level: "Fair",
        message: "Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution."
    },
    3: {
        level: "Moderate",
        message: "Members of sensitive groups may experience health effects. The general public is not likely to be affected."
    },
    4: {
        level: "Poor",
        message: "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects."
    },
    5: {
        level: "Very Poor",
        message: "Health warnings of emergency conditions. The entire population is more likelyto be affected."
    }
}