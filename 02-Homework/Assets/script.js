

//this is the click button
var library = [];
if (localStorage.getItem("library")) {
  library = JSON.parse(localStorage.getItem("library"));
  for (var i = 0; i < library.length; i++) {
    var newbutton = $("<button>");
    newbutton.attr("class", "col-md-12 previousSearch");
    newbutton.text(library[i]);
    $("#searchForm").append(newbutton);
  }
}
$('#theWeather').hide()
$("#searchButton").click(function (event) {
  //prevent the button from doing what it is supposed to do
  event.preventDefault();
  $("#theWeather").show()
  //these are my variables for the city input and the url to get the weather from each respective city
  var city = $("input").val();

  ajaxFunction(city);
  //if local storage already has this value dont save again,
  if (!library.includes(city)) {
    library.push(city.toLowerCase());
    localStorage.setItem("library", JSON.stringify(library));
    var previousSearch = $("<button>");
    previousSearch.attr("class", "col-12 previousSearch");
    previousSearch.text(city);
    $("#searchForm").append(previousSearch);
  }
});
//control the click on my elemtns from local storage
$(".previousSearch").click(function (event) {
  event.preventDefault();
  $("#theWeather").show()
  ajaxFunction(event.target.textContent)
});
function ajaxFunction(cityInput) {
  var queryURL =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
    cityInput +
    "&appid=e5f561d692ee5b0d5bfef99cb764f31d";
  console.log(cityInput);
  //here i will make an array to store my previous search
  //this is where i start my ajax method and get all of the information from the weather api

  $.get(queryURL).then(function (response) {
    console.log(response);
    //here i make sure the main container is empty the moment the user loads the screen
    $("mainContainer").empty();

    var iconHandler = response.weather[0].icon;
    console.log(iconHandler);

    var cityDate = response.name;
    $("#cityDate").text(
      "City: " + cityDate + " " + "(" + moment().format("MMMM Do YYYY") + ")"
    );

    var weatherIcon = $("#iconMain");
    weatherIcon.attr(
      "src",
      "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png"
    );

    var temperature = response.main.temp;
    temperature = (temperature - 273.15) * 1.8 + 32;
    temperature = Math.round(temperature);
    temperature = JSON.stringify(temperature);
    $("#temperature").text("Temperature: " + temperature + "F");

    var humidity = JSON.stringify(response.main.humidity);
    $("#humidity").text("Humidity: " + humidity + "%");
    //this is are my variables for the UV index
    var latitud = response.coord.lat;
    var longitud = response.coord.lon;
    //this is the url for the UV index
    var uv =
      "http://api.openweathermap.org/data/2.5/uvi?appid=e5f561d692ee5b0d5bfef99cb764f31d&lat=" +
      latitud +
      "&lon=" +
      longitud;
    $.get(uv).then(function (uvIndex) {
    
      $("#uv").text("UV: " + uvIndex.value);
    });

    var theWeekHandler =
      "http://api.openweathermap.org/data/2.5/forecast?q=" +
      response.name +
      "&appid=e5f561d692ee5b0d5bfef99cb764f31d";
    $.get(theWeekHandler).then(function (week) {
      console.log(week);
      //this will empty the week container everytime the function runs
      $(".week").empty();
      //this is the value inside of the first week object
      var nextday = 0;
      function myWeeks(weekIndex, elementTarget) {
        var week1 = week.list[weekIndex];
        console.log(week1);

        var week1Temperature = week1.main.temp;
        week1Temperature = Math.floor(
          Math.round((week1Temperature - 273.15) * 1.8 + 32)
        );
        var week1header = $("<h1>");
        nextday++;
        week1header.text(
          moment().add(nextday, "days").format("M/D/YYYY") +
            " Temp: " +
            week1Temperature +
            "F"
        );
        $(elementTarget).append(week1header);

        var forecastIcon = $("<img>");
        forecastIcon.attr(
          "src",
          "https://openweathermap.org/img/w/" +
            week.list[weekIndex].weather[0].icon +
            ".png"
        );
        $(elementTarget).append(forecastIcon);

        var week1Humidity = week1.main.humidity;
        var week1HumidityEl = $("<h1>");
        week1HumidityEl.text("Humidity: " + week1Humidity + "%");
        $(elementTarget).append(week1HumidityEl);
      }

      myWeeks(0, ".week1");
      myWeeks(8, ".week2");
      myWeeks(16, ".week3");
      myWeeks(24, ".week4");
      myWeeks(32, ".week5");
    });
  });
}
