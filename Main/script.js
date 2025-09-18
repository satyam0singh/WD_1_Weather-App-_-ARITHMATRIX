
const API_KEY = "a688188da453e2e47e82080db01207b8";

// Elements
const form = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const feedback = document.getElementById("feedback");

const weatherCard = document.getElementById("weatherCard");
const cityNameEl = document.getElementById("cityName");
const countryEl = document.getElementById("country");
const lastUpdatedTime = document.getElementById("lastUpdatedTime");
const weatherIcon = document.getElementById("weatherIcon");
const temperatureEl = document.getElementById("temperature");
const conditionEl = document.getElementById("condition");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const visibilityEl = document.getElementById("visibility");

// Helpers
function showFeedback(msg, isError = false) {
  if (!msg) {
    feedback.hidden = true;
    feedback.textContent = "";
    return;
  }
  feedback.hidden = false;
  feedback.textContent = msg;
  feedback.style.color = isError ? "#b91c1c" : "#064e3b";
}

function formatLocalTimestamp(dtUtcSec, tzOffsetSec = 0) {
  // dtUtcSec = UTC timestamp (seconds), tzOffsetSec = seconds shift from UTC for location
  const ms = (dtUtcSec + (tzOffsetSec || 0)) * 1000;
  const d = new Date(ms);
  return d.toLocaleString(undefined, {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
}

function isLatLonInput(text) {
  // supports: "lat,lon" with optional spaces and decimals and +/- signs
  const re = /^\s*([-+]?\d+(\.\d+)?)[,\s]+([-+]?\d+(\.\d+)?)\s*$/;
  const m = text.match(re);
  if (!m) return null;
  return { lat: parseFloat(m[1]), lon: parseFloat(m[3]) };
}

// Fetch functions
async function fetchGeocode(city) {
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    const txt = await res.text().catch(()=>res.statusText);
    throw new Error(`Geocoding error: ${res.status} ${txt}`);
  }
  const arr = await res.json();
  if (!Array.isArray(arr) || arr.length === 0) {
    throw new Error("City not found (geocoding returned no results).");
  }
  return arr[0]; // { name, lat, lon, country, state? }
}

async function fetchWeatherByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    const txt = await res.text().catch(()=>res.statusText);
    throw new Error(`Weather error: ${res.status} ${txt}`);
  }
  const data = await res.json();
  return data;
}

// Main flow
async function searchCityOrCoords(raw) {
  try {
    showFeedback("🔄 Looking up...");

    // detect coordinate input first
    const coords = isLatLonInput(raw);
    let lat, lon, displayName;

    if (coords) {
      lat = coords.lat;
      lon = coords.lon;
      displayName = `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    } else {
      // geocode city -> coordinates
      const geo = await fetchGeocode(raw);
      lat = geo.lat;
      lon = geo.lon;
      displayName = geo.name + (geo.state ? `, ${geo.state}` : '');
      if (geo.country) displayName += `, ${geo.country}`;
    }

    showFeedback("🔄 Fetching weather...");
    const weather = await fetchWeatherByCoords(lat, lon);
    renderWeather(weather, displayName);
    showFeedback(null);
  } catch (err) {
    console.error(err);
    showFeedback((err && err.message) ? `❌ ${err.message}` : "❌ Unexpected error", true);
    weatherCard.hidden = true;
  }
}

function renderWeather(data, displayName) {
  // defensive checks
  if (!data || !data.weather || !data.main) {
    throw new Error("Invalid weather response");
  }

  const temp = Math.round(data.main.temp);
  const hum = data.main.humidity;
  const wind = data.wind && data.wind.speed ? data.wind.speed : 0;
  const vis = data.visibility !== undefined ? (data.visibility / 1000) : null; // km
  const weatherObj = data.weather[0];
  const icon = weatherObj.icon;
  const desc = weatherObj.description;

  cityNameEl.textContent = displayName || (data.name || "—");
  countryEl.textContent = (data.sys && data.sys.country) ? data.sys.country : "—";
  temperatureEl.textContent = `${temp}°C`;
  conditionEl.textContent = desc ? desc.charAt(0).toUpperCase() + desc.slice(1) : "—";
  humidityEl.textContent = `${hum}%`;
  windEl.textContent = `${wind} m/s`;
  visibilityEl.textContent = vis !== null ? `${vis} km` : "—";

  // local timestamp using timezone offset returned by API
  const dt = data.dt; // UTC seconds
  const tz = data.timezone || 0; // seconds offset from UTC
  lastUpdatedTime.textContent = `Last update: ${formatLocalTimestamp(dt, tz)}`;
  lastUpdatedTime.setAttribute("datetime", new Date((dt + tz) * 1000).toISOString());

  // icon
  weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  weatherIcon.alt = desc || "Weather icon";

  weatherCard.hidden = false;
}

// Wire UI
form.addEventListener("submit", (ev) => {
  ev.preventDefault();
  const q = cityInput.value.trim();
  if (!q) {
    showFeedback("⚠️ Please enter a city name or coordinates.", true);
    return;
  }
  // clear previous UI
  weatherCard.hidden = true;
  searchCityOrCoords(q);
});

// Optional: allow quick Enter handling (form submit handles it)
// Optional: small UX: prefill example placeholder on first load?
cityInput.placeholder = "e.g. London or 51.5074,-0.1278";
cityInput.focus();
