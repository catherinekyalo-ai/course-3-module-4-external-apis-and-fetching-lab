// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

// Your code here!
const form = document.getElementById("weather-form");
const stateInput = document.getElementById("state-input");
const results = document.getElementById("results");

function showMessage(message) {
  results.innerHTML = `<p>${message}</p>`;
}

function displayAlerts(alerts) {
  if (!alerts || alerts.length === 0) {
    showMessage("No active weather alerts for this state.");
    return;
  }

  results.innerHTML = "";

  alerts.forEach((alert) => {
    const alertCard = document.createElement("div");
    alertCard.className = "alert-card";

    alertCard.innerHTML = `
      <h3>${alert.properties.headline || "No headline available"}</h3>
      <p><strong>Severity:</strong> ${alert.properties.severity || "N/A"}</p>
      <p><strong>Area:</strong> ${alert.properties.areaDesc || "N/A"}</p>
      <p>${alert.properties.description || "No description available."}</p>
    `;

    results.appendChild(alertCard);
  });
}

async function getWeatherAlerts(state) {
  try {
    showMessage("Loading alerts...");

    const response = await fetch(`https://api.weather.gov/alerts/active/area/${state}`);

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    displayAlerts(data.features);
  } catch (error) {
    showMessage(`Error: ${error.message}`);
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const state = stateInput.value.trim().toUpperCase();

  if (!/^[A-Z]{2}$/.test(state)) {
    showMessage("Please enter a valid 2-letter U.S. state abbreviation.");
    return;
  }

  getWeatherAlerts(state);
});