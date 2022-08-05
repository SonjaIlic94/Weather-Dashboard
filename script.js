// to search for city
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
            var currentTemp = document.createElement("h2");
            currentTemp.textContent = "temperature: " + data.current.temp;



            currentWeather.append(currentTemp);

            //for loop to make the cards generate thru the daily array var i = 1
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