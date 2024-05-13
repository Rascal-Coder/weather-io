/**
 * @license MIT
 * @fileoverview Menage all routes
 * @copyright codewithsadee 2023 All rights reserved
 * @author codewithsadee <mohammadsadee24@gmail.com>
 */

"use strict";

import { updateWeather, error404 } from "./app.js";
const defaultLocation = "#/weather?lat=30.6598628&lon=104.0633717"; //Chengdu
const currentLocation = function () {
  window.addEventListener("message", function (event) {
    const { latitude, longitude, isIframe } = event.data;
    if (isIframe) {
        updateWeather(`lat=${latitude}`, `lon=${longitude}`);
    } else {
      window.navigator.geolocation.getCurrentPosition(
        (res) => {
          const { latitude, longitude } = res.coords;
          updateWeather(`lat=${latitude}`, `lon=${longitude}`);
        },
        (err) => {
          window.location.hash = defaultLocation;
        }
      );
    }
  });
};
/**
 * @param {string} query Searched query (lat&lon)
 */
const searchLocation = (query) => updateWeather(...query.split("&"));
// updateWeather("lat=30.6598628",lon=104.0633717");

const routes = new Map([
  ["/current-location", currentLocation],
  ["/weather", searchLocation],
]);

const checkHash = function () {
  const hash = window.location.hash.slice(1);

  const [route, query] = hash.includes ? hash.split("?") : [hash];

  routes.get(route) ? routes.get(route)(query) : error404();
};

window.addEventListener("hashchange", checkHash);

window.addEventListener("load", function () {
  if (!window.location.hash) {
    window.location.hash = "#/current-location";
  } else {
    checkHash();
  }
});
