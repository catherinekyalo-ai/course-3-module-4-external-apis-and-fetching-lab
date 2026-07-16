// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area=";

const stateInput = document.getElementById("state-input");
const fetchButton = document.getElementById("fetch-alerts");
const alertsDisplay = document.getElementById("alerts-display");
const errorMessage = document.getElementById("error-message");

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
}

function clearError() {
  errorMessage.textContent = "";
  errorMessage.classList.add("hidden");
}

function displayAlerts(data) {
  const alerts = data.features || [];

  // Requirement 2: summary line with title + alert count
  let html = `<p>Current watches, warnings, and advisories for ${data.title}: ${alerts.length}</p>`;

  alerts.forEach((alert) => {
    html += `
      <div class="alert-card">
        <h3>${alert.properties.headline || "No headline available"}</h3>
        <p><strong>Severity:</strong> ${alert.properties.severity || "N/A"}</p>
        <p><strong>Area:</strong> ${alert.properties.areaDesc || "N/A"}</p>
        <p>${alert.properties.description || "No description available."}</p>
      </div>`;
  });

  alertsDisplay.innerHTML = html;
}

async function getWeatherAlerts(state) {
  try {
    const response = await fetch(`${weatherApi}${state}`);

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();

    // Requirement 5: clear/hide any previous error on success
    clearError();
    displayAlerts(data);
  } catch (error) {
    // Requirement 4: show the error message
    showError(error.message);
  }
}

fetchButton.addEventListener("click", () => {
  const state = stateInput.value.trim().toUpperCase();

  // Requirement 3: input clears when the button is clicked
  stateInput.value = "";

  if (!/^[A-Z]{2}$/.test(state)) {
    showError("Please enter a valid 2-letter U.S. state abbreviation.");
    return;
  }

  // Requirement 1: fetch is made using the input state abbreviation
  getWeatherAlerts(state);
});