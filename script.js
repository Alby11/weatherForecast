(function() {

  getTheWeather();
    
  $("body").css("transition", "background-color 1s ease");

  $("body").css("background-color", "#000");

}());

function displayWeatherData(weatherReq) {
  respXML = weatherReq.responseXML;
  console.log(respXML);

  var city = respXML.getElementsByTagName("city")[0].attributes["name"].textContent,
    country = respXML.getElementsByTagName("country")[0].textContent,
    weatherDesc = respXML.getElementsByTagName("weather")[0].attributes["value"].nodeValue,
    weatherValue = respXML.getElementsByTagName("weather")[0].attributes["number"].nodeValue,
    temperatureValue = Math.floor(respXML.getElementsByTagName("temperature")[0].attributes["value"].textContent),
    temperatureMin = Math.floor(respXML.getElementsByTagName("temperature")[0].attributes["min"].nodeValue),
    temperatureMax = Math.floor(respXML.getElementsByTagName("temperature")[0].attributes["max"].nodeValue),
    temperatureUnit = respXML.getElementsByTagName("temperature")[0].attributes["unit"].nodeValue,
    temperatureValueF = Math.floor(temperatureValue * (9 / 5) + 32),
    temperatureMinF = Math.floor(temperatureMin * (9 / 5) + 32),
    temperatureMaxF = Math.floor(temperatureMax * (9 / 5) + 32),
    temperatureContentC = "Temp: " + temperatureValue + " (Min: " + temperatureMin + " Max: " + temperatureMax + ")" + " °C" + "  " + '<button type="button" class="btn btn-success" id="toFahrenheit">To °F</button>',
    temperatureContentF = "Temp: " + temperatureValueF + " (Min: " + temperatureMinF + " Max: " + temperatureMaxF + ")" + " °F" + "  " + '<button type="button" class="btn btn-success" id="toCelsius">To °C</button>',
    humidityValue = respXML.getElementsByTagName("humidity")[0].attributes["value"].nodeValue,
    humidityUnit = respXML.getElementsByTagName("humidity")[0].attributes["unit"].nodeValue,
    windValue = respXML.getElementsByTagName("speed")[0].attributes["value"].nodeValue,
    windDirection = respXML.getElementsByTagName("direction")[0].attributes["code"].nodeValue,
    windDegrees = respXML.getElementsByTagName("direction")[0].attributes["value"].nodeValue,
    pressureValue = respXML.getElementsByTagName("pressure")[0].attributes["value"].nodeValue,
    pressureUnit = respXML.getElementsByTagName("pressure")[0].attributes["unit"].nodeValue,
    backgroundId = [201, 401, 501, 601, 701, 801],
    backgroundIcon = ['thunderstorm',
      'sprinkle',
      'rain',
      'snow',
      'fog',
      'day-sunny',
      'cloudy',
    ],
    backgroundImg = [
      'http://tylermoeller.github.io/local-weather-app/assets/img/thunderstorm.jpg',
      'https://tylermoeller.github.io/local-weather-app/assets/img/sprinkle.jpg',
      'https://tylermoeller.github.io/local-weather-app/assets/img/rain.jpg',
      'https://tylermoeller.github.io/local-weather-app/assets/img/snow.jpg',
      'https://tylermoeller.github.io/local-weather-app/assets/img/fog.jpg',
      'https://tylermoeller.github.io/local-weather-app/assets/img/clear.jpg',
      'https://tylermoeller.github.io/local-weather-app/assets/img/cloudy.jpg',
    ],
    iconClass,
    bgIndex;

  $("#theTitle").html("Free C<i class='wi wi-day-sunny'></i>de Camp");
  $("#theSubtitle").html("Weather App");
  var mql = window.matchMedia("screen and (max-width: 410px)");
  if (mql.matches) { // if media query matches
    $("#theTitle").css({
      "font-family": "Montserrat, Verdana",
      "font-size": "34px"
    });

    $("#theSubtitle").css({
      "font-family": "Quattrocento, Verdana",
      "font-size": "26px"
    });
  } else {
    // do something else
    $("#theTitle").css({
      "font-family": "Montserrat, Verdana",
      "font-size": "84px"
    });
    $("#theSubtitle").css({
      "font-family": "Quattrocento, Verdana",
      "font-size": "58px"
    });
  }
  
  $("#city").append(city + " - " + country);
  $("#weather").append(weatherDesc);

  $("#temp").append(temperatureContentC);

  backgroundId.push(weatherValue);
  bgIndex = backgroundId.sort().indexOf(weatherValue);
  $('body').css({
    'background-image': 'url(' + backgroundImg[bgIndex] + ')',
    'background-repeat': 'no-repeat',
    'background-attachment': 'fixed',
    'background-position': 'center'
  });
  iconClass = backgroundIcon[bgIndex];
  $('#icon').html('<i class="wi wi-' + iconClass + '"></i><br>');

  $("#humidity").append("Humidity: " + humidityValue + " " + humidityUnit);
  $("#wind").append("Wind: " + windValue + " kn " + " - " + windDirection + " " + '<i class="wi wi-wind towards-' + windDegrees + '-deg"></i><br>');
  $("#pressure").append("Pressure: " + pressureValue + " " + pressureUnit);

  (function convert() {
    $("#toFahrenheit").click(function() {
      $("#temp").html(temperatureContentF);
      $("#toCelsius").click(function() {
        $("#temp").html(temperatureContentC);
        convert();
        return false;
      });
      return false;
    }); 
  }());
    
}
// Start of geolocation block

function getTheWeather() {
  if (navigator.geolocation) {
    // timeout at 60000 milliseconds (60 seconds)
    var options = {
      timeout: 60000,
      enableHighAccuracy: true,
      maximumAge: 18000
    };
    navigator.geolocation.getCurrentPosition(callback, errorHandler, options);

  } else {
    alert('W3C Geolocation API is not available');
  }
}

function callback(position) {
  
  var crd = position.coords;
  var lat = crd.latitude;
  var lon = crd.longitude;
  var location = "lat=" + lat + "&" + "lon=" + lon;
  var appId = "60d2f49e0004ccad2ad538f264be9564"
  var request = "http://api.openweathermap.org/data/2.5/weather?&mode=xml&units=metric&" + location + "&APPID=" + appId;
  weatherReq = new XMLHttpRequest();
  weatherReq.open("GET", request, false);
  console.log(request);
  weatherReq.send();
  if (weatherReq.status === 200) {
    //$(document).ready(displayWeatherData(weatherReq));
    displayWeatherData(weatherReq);

  } else {
    alert("Some error occurred during the request");

  }
}

function errorHandler(err) {
  if (err.code == 1) {
    alert("Error: Access is denied!");
  } else if (err.code == 2) {
    alert("Error: Position is unavailable!");
  }
}

// End of geolocation block