/**
 * @license MIT
 * @copyright codewithsadee 2023 All rights reserved
 * @author codewithsadee <mohammadsadee24@gmail.com>
 */

"use strict";

import { fetchData, url } from "./api.js";
import * as module from "./module.js";

/**
 * Add event listener on multiple elements
 * @param {NodeList} elems Elements node array
 * @param {String} eventType Event Type e.g: "click", "mouseover"
 * @param {Function} callback callback function
 */
const addEvernOnElements = (elems, type, callback) => {
  for (const elem of elems) {
    elem.addEventListener(type, callback);
  }
};

/**
 * Toggle search in mobile devices
 */

const searchView = document.querySelector("[data-search-view]");
const searchTogglers = document.querySelectorAll("[data-search-toggler]");
const toggleSearch = () => searchView.classList.toggle("active");
addEvernOnElements(searchTogglers, "click", toggleSearch);

/**
 * Search function
 */
const searchField = document.querySelector("[data-search-field]");
const searchResult = document.querySelector("[data-search-result]");

let searchTimeout = null;
const searchTimeoutDuration = 500;
searchField.addEventListener("input", (e) => {
  searchTimeout ?? clearTimeout(searchTimeout);
  if (!searchField.value.trim()) {
    searchResult.classList.remove("active");
    searchResult.innerHTML = "";
    searchField.classList.remove("searching");
    return;
  }
  searchField.classList.add("searching");
  if (searchField.value.trim()) {
    searchTimeout = setTimeout(() => {
      fetchData(url.geo(searchField.value), function (locations) {
        console.log("🚀 ~ locations:", locations);
        searchField.classList.remove("searching");
        searchResult.classList.add("active");
        searchResult.innerHTML = `
                <ul class="view-list" data-search-list> </ul>
                `;
        const /** {NodeList} | [] */ items = [];
        if (!locations) return;
        const { geocodes } = locations;
        geocodes.forEach((item) => {
          const searchItem = document.createElement("li");
          searchItem.classList.add("view-item");
          searchItem.innerHTML = `
                    <span class="m-icon">location_on</span>
                    <div>
                        <p class="item-title">${item.city}</p>
                        <p class="label-2 item-subtitle">${
                          item.province || ""
                        }</p>
                    </div>
                    <a href="#/weather?lat=${item.location.split(",")[1]}&lon=${
            item.location.split(",")[0]
          }" aria-label="${
            item.city
          } weather" class="item-link has-state" data-search-toggler></a>
                    `;
          searchResult
            .querySelector("[data-search-list]")
            .appendChild(searchItem);
          items.push(searchItem.querySelector("[data-search-toggler]"));
          addEvernOnElements(items, "click", function () {
            toggleSearch();
            searchResult.classList.remove("active");
          });
        });
        // for (const { lat, lon, name, state, country } of locations) {
        //     const searchItem = document.createElement("li");
        //     searchItem.classList.add("view-item");
        //     searchItem.innerHTML = `
        //     <span class="m-icon">location_on</span>
        //     <div>
        //         <p class="item-title">${name}</p>
        //         <p class="label-2 item-subtitle">${state || ""} ${country}</p>
        //     </div>
        //     <a href="#/weather?lat=${lat}&lon=${lon}" aria-label="${name} weather" class="item-link has-state" data-search-toggler></a>
        //     `
        //     searchResult.querySelector("[data-search-list]").appendChild(searchItem);
        //     items.push(searchItem.querySelector("[data-search-toggler]"));
        //     addEvernOnElements(items, "click", function () {
        //         toggleSearch();
        //         searchResult.classList.remove("active");
        //     });
        // }
      });
    }, searchTimeoutDuration);
  }
});

const container = document.querySelector("[data-container]");
const loding = document.querySelector("[data-loading]");
const currentLocationBtn = document.querySelector(
  "[data-current-location-btn]"
);
const errorContent = document.querySelector("[data-error-content]");

/**
 * Render weather data in HTML
 * @param {number} lat Latitude
 * @param {number} lon Longitude
 */
export const updateWeather = (lat, lon) => {
  loding.style.display = "grid";
  container.style.overflowY = "hidden";
  container.classList.remove("fade-in");
  errorContent.style.display = "none";
  const currnetWeatherSection = document.querySelector(
    "[data-current-weather]"
  );
  const highlightSection = document.querySelector("[data-highlights]");
  const hourlySection = document.querySelector("[data-hourly-forecast]");
  const forecastSection = document.querySelector("[data-5-day-forecast]");
  currnetWeatherSection.innerHTML = "";
  highlightSection.innerHTML = "";
  hourlySection.innerHTML = "";
  forecastSection.innerHTML = "";
  if (window.location.hash === "#/current-location") {
    currentLocationBtn.setAttribute("disabled", "");
  } else {
    currentLocationBtn.removeAttribute("disabled");
  }

  /**
   * Current Weather Section
   */
  fetchData(url.currentWeather(lat, lon), function (currentWeather) {
    const {
      weather,
      dt: dateUnix,
      sys: { sunrise: sunriseUnixUTC, sunset: sunsetUnixUTC },
      main: { temp, feels_like, pressure, humidity },
      visibility,
      timezone,
    } = currentWeather;
    const { description, icon } = weather[0];
    const card = document.createElement("div");
    card.classList.add("card", "card-lg", "current-weather-card");
    card.innerHTML = `
        <h2 class="title-2 card-title">Now</h2>
        <div class="weapper">
            <p class="heading">${parseInt(temp)}&deg;<sup>c</sup></p>
            <img src="./assets/images/weather_icons/${icon}.png" width="64" height="64" alt="${description}" class="weather-icon">
        </div>
        <p class="body-3">${description}</p>
        <ul class="meta-list">
            <li class="meta-item">
                <span class="m-icon">calendar_today</span>
                <p class="title-3 meta-text">${module.getDate(
                  dateUnix,
                  timezone
                )}</p>
            </li>
            <li class="meta-item">
                <span class="m-icon">location_on</span>
                <p class="title-3 meta-text" data-location>London, GB</p>
            </li>
        </ul>
        `;
    fetchData(
      url.reverseGeo(lat.split("=")[1], lon.split("=")[1]),
      function (result) {
        const { regeocode: {addressComponent} } = result;
        const { province, city } = addressComponent;
        card.querySelector(
          "[data-location]"
        ).textContent = `${province}, ${city}`;
      }
    );
    currnetWeatherSection.appendChild(card);

    /**
     * Highlights Section
     */

    fetchData(url.airPollution(lat, lon), function (airPollution) {
      const [
        {
          main: { aqi },
          components: { no2, o3, so2, pm2_5 },
        },
      ] = airPollution.list;

      const card = document.createElement("div");
      card.classList.add("card", "card-lg");
      card.innerHTML = `
            <h2 class="title-2" id="highlights-label">Todays Highlights</h2>
            <div class="highlight-list">
              <div class="card card-sm highlight-card one">
                <h3 class="title-3">Air Quality Index</h3>
                <div class="wrapper">
                  <span class="m-icon">air</span>
                  <ul class="card-list">
                    <li class="card-item">
                      <p class="title-1">${Number(pm2_5).toFixed(2)}</p>
                      <p class="label-1">PM <sub>2.5</sub></p>
                    </li>
                    <li class="card-item">
                      <p class="title-1">${Number(so2).toFixed(2)}</p>
                      <p class="label-1">SO <sub>2</sub></p>
                    </li>
                    <li class="card-item">
                      <p class="title-1">${Number(no2).toFixed(2)}</p>
                      <p class="label-1">NO <sub>2</sub></p>
                    </li>
                    <li class="card-item">
                      <p class="title-1">${Number(o3).toFixed(2)}</p>
                      <p class="label-1">O <sub>3</sub></p>
                    </li>
                  </ul>
                </div>
                <span class="badge aqi-${aqi} label-${aqi}" title="${
        module.aqiText[aqi].message
      }"
                  >${module.aqiText[aqi].level}</span
                >
              </div>

              <div class="card card-sm highlight-card two">
                <h3 class="title-3">Sunrise & Sunset</h3>
                <div class="card-list">
                  <div class="card-item">
                    <span class="m-icon">clear_day</span>
                    <div><p class="label-1">Sunrise</p></div>
                    <div><p class="label-1">${module.getTime(
                      sunriseUnixUTC,
                      timezone
                    )}</p></div>
                  </div>
                  <div class="card-item">
                    <span class="m-icon">clear_night</span>
                    <div><p class="label-1">Sunset</p></div>
                    <div><p class="label-1">${module.getTime(
                      sunsetUnixUTC,
                      timezone
                    )}</p></div>
                  </div>
                </div>
              </div>
              <div class="card card-sm highlight-card">
                <h3 class="title-3">Humidity</h3>
                <div class="wrapper">
                  <span class="m-icon">humidity_percentage</span>
                  <p class="title-1">${humidity} <sup>%</sup></p>
                </div>
              </div>
              <div class="card card-sm highlight-card">
                <h3 class="title-3">Pressure</h3>
                <div class="wrapper">
                  <span class="m-icon">airwave</span>
                  <p class="title-1">${pressure} <sup>hPa</sup></p>
                </div>
              </div>
              <div class="card card-sm highlight-card">
                <h3 class="title-3">Visibility</h3>
                <div class="wrapper">
                  <span class="m-icon">visibility</span>
                  <p class="title-1">${visibility / 1000} <sup>km</sup></p>
                </div>
              </div>
              <div class="card card-sm highlight-card">
                <h3 class="title-3">Feels Like</h3>
                <div class="wrapper">
                  <span class="m-icon">thermostat</span>
                  <p class="title-1">${parseInt(
                    feels_like
                  )}&deg;<sup>c</sup></p>
                </div>
              </div>
            </div>
          </div>
            `;
      highlightSection.appendChild(card);
    });

    fetchData(url.forecast(lat, lon), function (forecast) {
      const {
        list: forecastList,
        city: { timezone },
      } = forecast;

      hourlySection.innerHTML = `
            <h2 class="title-2">Today at</h2>
            <div class="slider-container">
              <ul class="slider-list" data-temp></ul>

              <ul class="slider-list" data-wind>

              </ul>
            </div>
            `;

      for (const [index, data] of forecastList.entries()) {
        if (index > 7) {
          break;
        }
        const {
          dt_txt: dataTimeUnix,
          main: { temp },
          weather,
          wind: { deg: windDirection, speed: windSpeed },
        } = data;
        const { icon, description } = weather[0];
        const tempLi = document.createElement("li");
        tempLi.classList.add("slider-item");
        tempLi.innerHTML = `
                <div class="card card-sm slider-card">
                    <p class="body-3">${module.getHours(
                      dataTimeUnix,
                      timezone
                    )}</p>
                    <img
                    src="./assets/images/weather_icons/${icon}.png"
                    class="weather-icon"
                    width="48"
                    height="48"
                    loading="lazy"
                    alt="${description}"
                    title="${description}"
                    />
                    <p class="body-3">${parseInt(temp)}&deg;</p>
                </div>`;

        hourlySection.querySelector("[data-temp]").appendChild(tempLi);
        const windLi = document.createElement("li");
        windLi.classList.add("slider-item");
        windLi.innerHTML = `
                <div class="card card-sm slider-card">
                    <p class="body-3">${module.getHours(
                      dataTimeUnix,
                      timezone
                    )}</p>
                    <img
                    src="./assets/images/weather_icons/direction.png"
                    class="weather-icon"
                    width="48"
                    height="48"
                    loading="lazy"
                    style="transform: rotate(${windDirection - 180}deg)"
                    alt="wind direction"
                    title="wind direction"
                    />
                    <p class="body-3">${parseInt(
                      module.mps_to_kmh(windSpeed)
                    )} km/h</p>
                </div>    
                `;
        hourlySection.querySelector("[data-wind]").appendChild(windLi);
      }

      forecastSection.innerHTML = `
            <h2 class="title-2" id="forecast-label">5 Days Forecast</h2>
            <div class="card card-lg forecast-card">
              <ul data-forecast-list>

              </ul>
            </div>
            `;
      for (let i = 7, len = forecastList.length; i < len; i += 8) {
        const {
          main: { temp_max },
          dt_txt,
          weather,
        } = forecastList[i];
        const [{ icon, description }] = weather;
        const date = new Date(dt_txt);
        const li = document.createElement("li");
        li.classList.add("card-item");
        li.innerHTML = `
                <div class="icon-wrapper">
                  <img
                    src="./assets/images/weather_icons/${icon}.png"
                    alt="${description}"
                    width="36"
                    height="36"
                    class="weather-icon"
                    title="${description}"
                  />
                  <span class="span">
                    <p class="title-2">${parseInt(temp_max)}&deg;</p>
                  </span>
                </div>
                <p class="label-1">${date.getDate()} ${
          module.monthNames[date.getMonth()]
        }</p>
                <p class="label-1">${module.weekDayNames[date.getDay()]}</p>
                `;
        forecastSection.querySelector("[data-forecast-list]").appendChild(li);
      }

      loding.style.display = "none";
      container.style.overflowY = "auto";
      container.classList.add("fade-in");
    });
  });
};

export const error404 = () => {
  errorContent.style.display = "flex";
};
