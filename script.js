const currentTime = moment().format("MMMM Do YYYY, HH:mm");
var searchBtn = document.querySelector("#search-btn");
var searchList = document.querySelector(".search-results");
var currentWeather = document.querySelector("#current-weather");
// API KEY
//https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
// 26889146a0a820aa216ba000852bd2c5

//key = city array
var cityArray = JSON.parse(localStorage.getItem("cityArrayLocalStorage")) || [];

// get coordinates
var getCoordinates = function (searchValue) {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${searchValue}&limit=5&appid=26889146a0a820aa216ba000852bd2c5`).then(function (response) {
        response.json().then(function (data) {
            cityArray.push(searchValue);
            localStorage.setItem("cityArrayLocalStorage", JSON.stringify(cityArray));
            console.log(data);
            getCityInfo(data[0].lat, data[0].lon);
        });
    });
}
// when the search city is clicked run this again

var getCityInfo = function (lat, lon) {
    //format url
    // make a request to the url
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly&units=metric&appid=26889146a0a820aa216ba000852bd2c5`).then(function (response) {
        response.json().then(function (data) {
            console.log(data);
            // Current Day info
            var currentDay = document.createElement("h3");
            //currentDay.setAttribute("value", searchValue);
            //currentDay.textContent = searchValue + currentTime;

            var currentTemp = document.createElement("h2");
            currentTemp.textContent = "Temperature: " + data.current.temp + " celcius";

            var currentWind = document.createElement("h2");
            currentWind.textContent = "Wind Speed: " + data.current.wind_speed + "KM/H";

            var currentHumidity = document.createElement("h2");
            currentHumidity.textContent = "Humidity: " + data.current.humidity + "%";

            var currentUvi = document.createElement("h2");
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
            currentWeather.append(currentTemp);
            currentWeather.append(currentWind);
            currentWeather.append(currentHumidity);
            currentWeather.append(currentUvi);
            //for loop to make the cards generate thru the daily array var i = 1 where i.daily.length -2
        });
    });
};

var createSearchList = function (searchValue) {

    var cityBtn = document.createElement("button");
    cityBtn.className = "city-btn";
    cityBtn.setAttribute("type", "submit");
    cityBtn.setAttribute("value", searchValue);
    //event listener

    cityBtn.textContent = searchValue + currentTime;
    searchList.appendChild(cityBtn);
};



//for loop for each
//for page refresh, a mirror function of create search list tht checks cityArrayLocalStorage
// adn then for each city in the array does create search list button

// display cards function


//when search button is clicked
// the city is saved in local storage
// the city appears in saved spot
// the city appears undere the search bar and can be clicked
//the current day is displayed in top right container

// 5 day forecase is displayed in bottom right container

searchBtn.addEventListener('click', function (event) {
    event.preventDefault();
    console.log("ive been clicked");
    var searchValue = document.querySelector("#city-search").value;
    console.log(searchValue);
    getCoordinates(searchValue);
    createSearchList(searchValue);


});