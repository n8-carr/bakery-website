
// Add this in weather-time.js to handle location changes
document.querySelectorAll('input[name="city"]').forEach(radio => {
radio.addEventListener("change", updateCityInfo);
});

document.addEventListener("DOMContentLoaded", updateCityInfo);

const weatherApiUrls = {
    city1: "https://api.open-meteo.com/v1/forecast?latitude=45.230157&longitude=-122.755389&current=temperature_2m,weather_code&timezone=auto&forecast_days=1&wind_speed_unit=mph&temperature_unit=fahrenheit",
    city2: "https://api.open-meteo.com/v1/forecast?latitude=34.0522&longitude=-118.2437&current=temperature_2m,weather_code&timezone=America%2FLos_Angeles&forecast_days=1&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch", 
    city3: "https://api.open-meteo.com/v1/forecast?latitude=33.3944&longitude=-104.5249&current=temperature_2m,weather_code&timezone=America%2FDenver&forecast_days=1&temperature_unit=fahrenheit"
}


// Add this to your weather-time.js
function updateCityInfo() {
    // The id of the radio button is the city name
    const selectedCity = document.querySelector('input[name="city"]:checked').id;

    // TODO: Call the function to update the map image and address based on the selected city
    updateMap(selectedCity);

    // TODO: Call the function to update business hours for the selected city
    updateHours(selectedCity);

    // TODO: Fetch and display weather and time information for the selected city
    fetchWeatherAndTime(selectedCity);
}


function updateMap(city) {
    const mapImages = {
        city1: "images/map-aurora.jpg",
        city2: "images/map-la.jpg",
        city3: "images/map-roswell.jpg"
    };

    const mapLinks = {
        city1: "https://www.google.com/maps/d/u/1/edit?mid=1I34Nqd4R-NOOSx4pNmhZNgd1yg1GMpk&usp=sharing",
        city2: "https://www.google.com/maps/d/u/1/edit?mid=1iILkS4cwRXe-B9iX0DWxCGjRtWkqu8k&usp=sharing",
        city3: "https://www.google.com/maps/d/u/1/edit?mid=1GX7zmUccvo3Bcvfz42qiB1D-epR68uE&usp=sharing"
    };

    const addresses = {
        city1: "123 Infinite St, Aurora OR",
        city2: "456 Dont Get Lost St, Los Angeles CA",
        city3: "789 Alien Rd NE, Roswell NM"
    };

    // Update the map image source, alt text, map link, and address label
    document.getElementById("map-image").src = mapImages[city];
    document.getElementById("map-image").alt = `Map of ${city}`;
    document.getElementById("map-link").href = mapLinks[city];
    document.getElementById("map-address").innerText = addresses[city];
}

function updateHours(city) {
    const cityHours = {
        city1: `
            <h3> - Dine-In Hours - </h3>
                <p> Monday -- 8AM to 6PM</p>
                <p> Tuesday -- 8AM to 6PM</p>
                <p> Wednesday -- 10AM to 6PM</p>
                <p> Thursday -- 8AM to 6PM</p>
                <p> Friday -- 8AM to 4PM</p>
                <p> Saturday/Sunday -- CLOSED</p>

                <h3> - Delivery Hours - </h3>
                <p> Monday -- 10 AM to 4 PM </p>
                <p> Tuesday -- 10 AM to 4 PM </p>
                <p> Wednesday -- 12 PM to 4 PM </p>
                <p> Thursday -- 10 AM to 4 PM </p>
                <p> Friday -- 10 AM to 2 PM </p>
                <p> Saturday/Sunday -- CLOSED</p>

                <h3> - Current Conditions - </h3>`,
        city2: `
            <h3> - Dine-In Hours - </h3>
                <p> Monday -- 9AM to 6PM</p>
                <p> Tuesday -- 9AM to 6PM</p>
                <p> Wednesday -- CLOSED </p>
                <p> Thursday -- 9AM to 6PM</p>
                <p> Friday -- 9AM to 4PM</p>
                <p> Saturday/Sunday -- CLOSED</p>

                <h3> - Delivery Hours - </h3>
                <p> Monday -- 11 AM to 4 PM </p>
                <p> Tuesday -- 11 AM to 4 PM </p>
                <p> Wednesday -- CLOSED </p>
                <p> Thursday -- 11 AM to 4 PM </p>
                <p> Friday -- 11 AM to 2 PM </p>
                <p> Saturday/Sunday -- CLOSED</p>
                
                <h3> - Current Conditions - </h3>`,
        city3: `
            <h3> - Dine-In Hours - </h3>
                <p> Monday -- 7AM to 4PM</p>
                <p> Tuesday -- 8AM to 4PM</p>
                <p> Wednesday -- 10AM to 4PM</p>
                <p> Thursday -- 8AM to 4PM</p>
                <p> Friday -- CLOSED </p>
                <p> Saturday/Sunday -- CLOSED</p>

                <h3> - Delivery Hours - </h3>
                <p> Monday -- 9 AM to 3 PM </p>
                <p> Tuesday -- 10 AM to 3 PM </p>
                <p> Wednesday -- 12 PM to 3 PM </p>
                <p> Thursday -- 10 AM to 3 PM </p>
                <p> Friday -- CLOSED </p>
                <p> Saturday/Sunday -- CLOSED</p>
                
                <h3> - Current Conditions - </h3>`
    };
    document.getElementById("hours-display").innerHTML = cityHours[city];
}

// Fetch and Display Weather and Time
function fetchWeatherAndTime(city) {
    const apiUrl = weatherApiUrls[city];
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const current = data.current;
            const temp = Math.round(current.temperature_2m);
            
            const weatherCode = current.weather_code;
            const timeZone = data.timezone;

            const localTime = new Date().toLocaleTimeString('en-US', {
                hour: '2-digit', minute: '2-digit', hour12: true, timeZone: timeZone
            });

            document.getElementById("temperature").innerText = `${temp} °F`;

            showImage(weatherCode, localTime);
            let storeStatus = updateBakeryStatus(localTime, city);
            updatePatioStatus(temp, weatherCode, storeStatus);
            

        });
}

const bakeryHours = {
    city1: {
        Monday: [8, 18],
        Tuesday: [8, 18],
        Wednesday: [10, 18],
        Thursday: [8,18],
        Friday: [8,16],
        Saturday: null,
        Sunday: null
    },
    city2: {
        Monday: [9, 18],
        Tuesday: [9, 18],
        Wednesday: null,
        Thursday: [9,18],
        Friday: [9,16],
        Saturday: null,
        Sunday: null
    },
    city3: {
        Monday: [7, 16],
        Tuesday: [8, 16],
        Wednesday: [10,16],
        Thursday: [8,16],
        Friday: null,
        Saturday: null,
        Sunday: null
    }
}

const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

function updateBakeryStatus(localTime, city) {
    // Get day of week name
    let date = new Date();
    let day = weekday[date.getDay()];

    // Get open status element from document
    const openElement = document.getElementById("open-status");
    // Get hours of selected city for current day
    let open = bakeryHours[city][day];

    // Convert local time (4:00PM) to 24-hour time (16)
    const [time, ampm] = localTime.split(' ');
    const [hourStr] = time.split(':');
    let hour = parseInt(hourStr);  
    // Convert to 24 hours time
    if (ampm === "PM" && hour !== 12) hour += 12;
    if (ampm === "AM" && hour === 12) hour = 0;

    if (!open) {
        openElement.innerText = `${localTime} - Closed`;
        openElement.style.color = "red";
        return false;
    } else if (hour >= open[0] && hour < open[1]) {
        openElement.innerText = `${localTime} - Open`;
        openElement.style.color = "rgb(21, 143, 76)";
        return true;
    } else {
        openElement.innerText = `${localTime} - Closed`;
        openElement.style.color = "red";
        return false;
    }
}

// Determine Patio Status
function updatePatioStatus(temp, weatherCode, storeStatus) {
    const patioElement = document.getElementById("patio-status");
    if (storeStatus === false) {
        patioElement.style.visibility = "hidden";
    } else if  (temp < 55 || temp > 95 || weatherCode >= 55) {
        patioElement.style.visibility = "visible";
        patioElement.textContent = "Patio is CLOSED!";
        patioElement.style.color = 'red';
    } else {
        patioElement.style.visibility = "visible";
        patioElement.textContent = "Patio is OPEN!";
        patioElement.style.color = "#3b9861";
    }
}

// Set Image Source to Correct Weather Icon
function showImage(weatherCode, localTimeStr) {
    const [time, ampm] = localTimeStr.split(' ');
    const [hourStr] = time.split(':');
    let hour = parseInt(hourStr);  
    // Convert to 24 hours time
    if (ampm === "PM" && hour !== 12) hour += 12;
    if (ampm === "AM" && hour === 12) hour = 0;
    const isDayTime = hour >= 6 && hour < 20;

    const weatherImages = getWeatherImage(weatherCode, isDayTime);

    const img = document.getElementById("weather-icon");
    img.src = "images/" + weatherImages; 
}

// Determine Weather Icon to Use
function getWeatherImage(weatherCode, isDayTime) {
    if (isDayTime === false) {
        return "clear-night.svg";
    } else if (weatherCode === 0) {
        return isDayTime ? "clear-day.svg" : "clear-night.svg";
    } else if (weatherCode === 1 || weatherCode === 2) {
        return isDayTime ? "partly-cloudy-day.svg" : "partly-cloudy-night.svg";
    } else if (weatherCode === 3) {
        return "cloudy.svg";
    } else if(weatherCode === 51 || weatherCode === 53 || weatherCode === 55 || weatherCode === 61
        || weatherCode === 63 || weatherCode === 65 || weatherCode === 80 || weatherCode === 81 || weatherCode === 82) {
        return "rain.svg";
    } else {
        return isDayTime ? "clear-day.svg" : "clear-night.svg";
    }
}

