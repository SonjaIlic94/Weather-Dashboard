// moment.js for current day
const currentTime = moment().format("MMMM Do YYYY");

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
// API KEY
//https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
// 26889146a0a820aa216ba000852bd2c5

//key = city array. LocalStorage
var cityArray = JSON.parse(localStorage.getItem("cityArrayLocalStorage")) || [];

// get coordinates
var getCoordinates = function (searchValue) {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${searchValue}&limit=5&appid=26889146a0a820aa216ba000852bd2c5`).then(function (response) {
        response.json().then(function (data) {
            cityArray.push(searchValue);
            localStorage.setItem("cityArrayLocalStorage", JSON.stringify(cityArray));
            console.log(data);
            getCityInfo(data[0].name, data[0].lat, data[0].lon);
        });
    });
}

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
                currentUvi.style.backgroundColor = 'green';
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

            // Generate Cards
            for (let i = 1; i < data.daily.length - 2; i++) {

                forecastIcon.src = "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png";
                console.log(data.daily[i], i)

                const forecastDate = new Date(data.daily[i].dt * 1000);
                forecastDay.textContent = forecastDate.getDate() + "/" + (forecastDate.getMonth() + 1) + "/" + forecastDate.getFullYear();
                forecastTemp.textContent = "Temp: " + data.daily[i].temp.day;
                forecastWind.textContent = "Wind: " + data.daily[i].wind_speed;
                forecastHumidity.textContent = "Humidity: " + data.daily[i].humidity;
                console.log(forecastIcon);

                var cardHolder = document.createElement('div');
                cardHolder.setAttribute('class', 'post block bc2');
                cardHolder.setAttribute('id', 'card-holder');
                cardHolder.innerHTML = `
            <h1 class="forecast-title">5 Day Forecast</h1>
            <div class="card" style="width: 18rem;">
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
};

var createSearchList = function (searchValue) {
    var cityBtn = document.createElement("button");
    cityBtn.className = "city-btn";
    cityBtn.setAttribute("type", "submit");
    cityBtn.setAttribute("value", searchValue);
    //event listener
    cityBtn.textContent = searchValue;
    searchList.appendChild(cityBtn);
};

// var createSearchList = function (searchValue) {
//     i += 1
//     var cityBtn = document.createElement("button");
//     cityBtn.className = "city-btn";
//     cityBtn.setAttribute("type", "submit");
//     cityBtn.setAttribute("value", searchValue);
//     cityBtn.setAttribute("id", "btnid" + i);
//     cityBtn.textContent = searchValue;
//     searchList.appendChild(cityBtn);
// document.getElementById("btnid" + i).addEventListener("click", )
// };


searchBtn.addEventListener('click', function (event) {
    if (currentWeather.firstChild, weatherForecast.firstChild) {
        const element = document.querySelector("#current-weather")
        const card = document.getElementById("#card-holder");
        event.preventDefault();
        console.log("ive been clicked");
        var searchValue = document.querySelector("#city-search").value;
        console.log(searchValue);
        getCoordinates(searchValue);
        createSearchList(searchValue);
        currentWeather.removeChild(currentDay, currentTemp, currentWind, currentHumidity, currentUvi);
        weatherForecast.removeChild(card);
    }
});