document.addEventListener('DOMContentLoaded', function() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const { latitude, longitude } = position.coords;
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            fetchWeatherData(latitude, longitude, timezone);
            updateLocationInfo(latitude, longitude, timezone);
        }, function(error) {
            console.error("Geolocation is not supported by this browser.");
        });
    } else {
        console.log("Geolocation is not available.");
    }
});

function fetchWeatherData(latitude, longitude, timezone) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,relative_humidity_2m_max,relative_humidity_2m_min&timezone=${encodeURIComponent(timezone)}`;

    fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log('Weather data:', data);
        displayWeatherData(data);
    })
    .catch(error => {
        console.error('Fetch operation error:', error);
        document.getElementById('current-weather').innerHTML = `<p>Error fetching weather data.</p>`;
    });
}

function updateLocationInfo(latitude, longitude, timezone) {
    const locationInfoEl = document.getElementById('location-info');
    locationInfoEl.innerHTML = `<h2>Your Location</h2>
                                <p>Latitude: ${latitude.toFixed(2)}</p>
                                <p>Longitude: ${longitude.toFixed(2)}</p>
                                <p>Timezone: ${timezone}</p>`;
}

function displayWeatherData(data) {
    const forecastEl = document.getElementsByClassName('forecast')[0];
    let content = `<h2>7-Day Weather Forecast</h2>`;

    data.daily.time.forEach((date, index) => {
        content += `<div class="day-forecast">
                        <h3>Date: ${date}</h3>
                        <p>Max Temperature: ${data.daily.temperature_2m_max[index]}°C</p>
                        <p>Min Temperature: ${data.daily.temperature_2m_min[index]}°C</p>
                        <p>Total Precipitation: ${data.daily.precipitation_sum[index]} mm</p>
                        <p>Max Humidity: ${data.daily.relative_humidity_2m_max[index]}%</p>
                        <p>Min Humidity: ${data.daily.relative_humidity_2m_min[index]}%</p>
                    </div>`;
    });

    forecastEl.innerHTML = content;
}









