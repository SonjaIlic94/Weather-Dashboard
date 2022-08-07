// moment.js for current day
const currentTime = moment().format("MMMM Do YYYY");

//buttons
var cityBtn = document.createElement("button");

// html div retreival
var searchBtn = document.querySelector("#search-btn");
var searchList = document.querySelector(".search-results");
var currentWeather = document.querySelector("#current-weather");
var weatherForecast = document.querySelector("#weather-forecast");

// what will be appended
var currentDay = document.createElement("h3");
var icon = document.createElement("img");
var currentTemp = document.createElement("h4");
var currentWind = document.createElement("h4");
var currentHumidity = document.createElement("h4");
var currentUvi = document.createElement("h4");
var forecastDay = document.createElement("h4");
var forecastIcon = document.createElement("img");
var forecastWind = document.createElement("h4");
var forecastTemp = document.createElement("h4");
var forecastHumidity = document.createElement("h4");
var forecastTitle = document.createElement("h1");
forecastTitle.textContent = "5 Day Forecast";

// API KEY
// 26889146a0a820aa216ba000852bd2c5

//key = city array. LocalStorage
var cityArray = JSON.parse(localStorage.getItem("cityArrayLocalStorage")) || [];

// get coordinates
var getCoordinates = function (searchValue) {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${searchValue}&limit=5&appid=26889146a0a820aa216ba000852bd2c5`).then(function (response) {
        response.json().then(function (data) {
            cityArray.push(searchValue);
            localStorage.setItem("cityArrayLocalStorage", JSON.stringify(cityArray));
            getCityInfo(data[0].name, data[0].lat, data[0].lon);
        });
    });
}

// Display Current & Future Weather
var getCityInfo = function (name, lat, lon) {
    // make a request to the url
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly&units=metric&appid=26889146a0a820aa216ba000852bd2c5`).then(function (response) {
        response.json().then(function (data) {
            // Current Day info
            icon.src = "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png";
            currentDay.textContent = name + " (" + currentTime + ")";
            currentTemp.textContent = "Temperature: " + data.current.temp + " celcius";
            currentWind.textContent = "Wind Speed: " + data.current.wind_speed + "KM/H";
            currentHumidity.textContent = "Humidity: " + data.current.humidity + "%";
            currentUvi.setAttribute("id", "uvi-color");
            currentUvi.textContent = "UV Index: " + data.current.uvi;

            let uviColour = data.current.uvi;
            if (uviColour <= 1) {
                currentUvi.style.backgroundColor = "rgb(47, 195, 69)";
            } else if (uviColour <= 2 && uviColour > 1) {
                currentUvi.style.backgroundColor = 'yellow';
            }
            else {
                currentUvi.style.backgroundColor = 'red';
            }

            currentWeather.append(currentDay);
            currentWeather.append(icon);
            currentWeather.append(currentTemp);
            currentWeather.append(currentWind);
            currentWeather.append(currentHumidity);
            currentWeather.append(currentUvi);
            weatherForecast.innerHTML = "";

            currentWeather.append(forecastTitle);

            // Generate Cards
            for (let i = 1; i < data.daily.length - 2; i++) {

                forecastIcon.src = "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png";

                const forecastDate = new Date(data.daily[i].dt * 1000);
                forecastDay.textContent = forecastDate.getDate() + "/" + (forecastDate.getMonth() + 1) + "/" + forecastDate.getFullYear();
                forecastTemp.textContent = "Temp: " + data.daily[i].temp.day;
                forecastWind.textContent = "Wind: " + data.daily[i].wind_speed;
                forecastHumidity.textContent = "Humidity: " + data.daily[i].humidity;

                var cardHolder = document.createElement('div');
                cardHolder.setAttribute('class', 'post block bc2');
                cardHolder.setAttribute('id', 'card-holder');

                cardHolder.innerHTML = `
            
            <div class="card" style="width: 10rem;">
                <div class="card-body">         
                    <h5 class="card-title">${forecastDay.textContent}</h5>
                     <img src="${"http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png"}"/>              
                    <p class="card-text">
                    <ul>
                    <li> ${forecastTemp.textContent} </li>
                    <li> ${currentWind.textContent}</li>
                    <li> ${currentHumidity.textContent} </li>
                    </p>
                </div>
        </div>
            `;
                weatherForecast.append(cardHolder);
            }
        });
    });
    while (searchList.firstChild) {
        searchList.removeChild(searchList.firstChild);
    }
    loadBtns();
};

// Create search list buttons
var createSearchList = function (searchValue) {
    var cityBtn = document.createElement("button");
    cityBtn.className = "city-btn";
    cityBtn.setAttribute("type", "submit");
    cityBtn.setAttribute("value", searchValue);
    cityBtn.textContent = searchValue;

    var retrievedCities = localStorage.getItem("cityArrayLocalStorage")
    let cityCheck = JSON.parse(retrievedCities);
    for (let i = 0; i < cityArray.length; i++) {
        if (cityCheck[i] == cityBtn.textContent) {
            cityBtn.setAttribute("id", "already-exists");
            fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${searchValue}&limit=5&appid=26889146a0a820aa216ba000852bd2c5`).then(function (response) {
                response.json().then(function (data) {
                    getCityInfo(data[0].name, data[0].lat, data[0].lon);
                });
            });
        }
    }
    if (!(cityBtn.id == "already-exists")) {
        searchList.appendChild(cityBtn);
        getCoordinates(searchValue);
    }
};

// Loaded buttons use local storage and make dynamic page
var loadBtns = function () {
    var retrievedCities = localStorage.getItem("cityArrayLocalStorage")
    var cityCheck = JSON.parse(retrievedCities);
    for (let i = 0; i < cityArray.length; i++) {
        var cityBtn = document.createElement("button");
        cityBtn.className = "city-btn";
        cityBtn.setAttribute("type", "submit");
        cityBtn.setAttribute("value", cityCheck[i]);
        cityBtn.setAttribute("id", "city" + i)
        cityBtn.textContent = cityCheck[i];
        searchList.appendChild(cityBtn);

        cityBtn.addEventListener('click', function (event) {
            event.preventDefault();
            fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${(document.getElementById("city" + i).value)}&limit=5&appid=26889146a0a820aa216ba000852bd2c5`).then(function (response) {
                response.json().then(function (data) {
                    getCityInfo(data[0].name, data[0].lat, data[0].lon);
                });
            });
        });
    };
};

searchBtn.addEventListener('click', function (event) {
    if (currentWeather.firstChild, weatherForecast.firstChild) {
        const element = document.querySelector("#current-weather")
        event.preventDefault();
        var searchValue = document.querySelector("#city-search").value;
        if (!(searchValue.trim().length == 0)) {
            while (currentWeather.firstChild) {
                currentWeather.removeChild(currentWeather.firstChild);
            }
            //currentWeather.removeChild(currentDay, currentTemp, currentWind, currentHumidity, currentUvi, forecastTitle);
            createSearchList(searchValue);
        }
    }
});

loadBtns();