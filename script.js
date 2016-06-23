var weatherGenerator = getAllGenerator();

function displayWeatherData(weatherReq) {
    let respXML = weatherReq.responseXML,
        city = respXML.getElementsByTagName("city")[0].attributes["name"].textContent,
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
        buttonIdCelsius = 'toCelsius',
        buttonIdFahrenheit = 'toFahrenheit',
        temperatureContentC = `Temp: ${temperatureValue} (Min; ${temperatureMin} Max: ${temperatureMax}) °C <button type="button" class="btn btn-success" id="${buttonIdFahrenheit}">To °F</button>`,
        temperatureContentF = `Temp: ${temperatureValueF} (Min; ${temperatureMinF} Max: ${temperatureMaxF}) °C <button type="button" class="btn btn-success" id="${buttonIdCelsius}">To °C</button>`,
        humidityValue = respXML.getElementsByTagName("humidity")[0].attributes["value"].nodeValue,
        humidityUnit = respXML.getElementsByTagName("humidity")[0].attributes["unit"].nodeValue,
        windValue = respXML.getElementsByTagName("speed")[0].attributes["value"].nodeValue,
        windDirection = respXML.getElementsByTagName("direction")[0].attributes["code"].nodeValue,
        windDegrees = respXML.getElementsByTagName("direction")[0].attributes["value"].nodeValue,
        pressureValue = respXML.getElementsByTagName("pressure")[0].attributes["value"].nodeValue,
        pressureUnit = respXML.getElementsByTagName("pressure")[0].attributes["unit"].nodeValue,
        backgroundId = [201, 401, 501, 601, 701, 801],
        backgroundIcon = [
            'thunderstorm'
            , 'sprinkle'
            , 'rain'
            , 'snow'
            , 'fog'
            , 'day-sunny'
            , 'cloudy'
            , ]
        //        , backgroundImg = [
        //            'https://tylermoeller.github.io/local-weather-app/assets/img/thunderstorm.jpg'
        //            , 'https://tylermoeller.github.io/local-weather-app/assets/img/sprinkle.jpg'
        //            , 'https://tylermoeller.github.io/local-weather-app/assets/img/rain.jpg'
        //            , 'https://tylermoeller.github.io/local-weather-app/assets/img/snow.jpg'
        //            , 'https://tylermoeller.github.io/local-weather-app/assets/img/fog.jpg'
        //            , 'https://tylermoeller.github.io/local-weather-app/assets/img/clear.jpg'
        //            , 'https://tylermoeller.github.io/local-weather-app/assets/img/cloudy.jpg'
        //            , ]
        ,
        backgroundImg = [
            'img/thunderstorm.jpg'
            , 'img/sprinkle.jpg'
            , 'img/rain.jpg'
            , 'img/snow.jpg'
            , 'img/fog.jpg'
            , 'img/clear.jpg'
            , 'img/cloudy.jpg'
            , ],
        iconClass, bgIndex, convertTemp = function (element) {
            elementId = element.srcElement.id;
            if (elementId === buttonIdFahrenheit) {
                document.getElementById(elementId).removeEventListener('click', convertTemp);
                document.getElementById('temp').innerHTML = temperatureContentF;
                addClickListener(buttonIdCelsius);
            } else if (elementId === buttonIdCelsius) {
                document.getElementById(elementId).removeEventListener('click', convertTemp);
                document.getElementById('temp').innerHTML = temperatureContentC;
                addClickListener(buttonIdFahrenheit);
            }
        },
        addClickListener = function (elementId = buttonIdFahrenheit) {
            document.getElementById(elementId).addEventListener('click', convertTemp);
        };

    document.getElementById('city').innerHTML = `${city} - ${country}`;
    document.getElementById('weather').innerHTML = weatherDesc;
    document.getElementById('temp').innerHTML = temperatureContentC;
    backgroundId.push(weatherValue);
    bgIndex = backgroundId.sort().indexOf(weatherValue);
    document.body.style.backgroundImage = `url(${backgroundImg[bgIndex]})`;
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'local';
    document.body.style.backgroundPosition = 'center';
    iconClass = backgroundIcon[bgIndex];
    document.getElementById('icon').innerHTML = `<i class="wi wi-${iconClass}"></i><br>`;
    document.getElementById('humidity').innerHTML = `Humidity: ${humidityValue} ${humidityUnit}`;
    document.getElementById('wind').innerHTML = `Wind: ${windValue}  kn - ${windDirection} <i class="wi wi-wind towards-${windDegrees}-deg"></i><br>`;
    document.getElementById('pressure').innerHTML = `Pressure: ${pressureValue} ${pressureUnit}`;
    document.getElementById('temp').innerHTML = temperatureContentC;

    addClickListener();

}

function ifError(error) {
    let errorDiv = document.createElement('DIV'),
        errorSpan = document.createElement('SPAN'),
        errorText = document.createTextNode(`Error: ${error}`),
        styles = {
            color: 'red',
            position: 'relative',
            textAlign: 'center',
            transition: 'all 1s',
            animation: 'fadeInOut 1s linear infinite',
        };
    errorDiv.id = 'ifErrorDiv'
    errorSpan.id = 'ifError';
    errorSpan.appendChild(errorText);
    errorDiv.appendChild(errorSpan);
    document.getElementById('loading').style.display = 'none';
    document.getElementById('titleField').appendChild(errorDiv);
    for (i in styles) document.getElementById('ifError').style[i] = styles[i];
    document.getElementById('ifErrorDiv').style.marginTop = '10%';


}

function getWeather(position) {

    let crd = position.coords,
        lat = crd.latitude,
        lon = crd.longitude,
        location = `lat=${lat}&lon=${lon}`,
        appId = "60d2f49e0004ccad2ad538f264be9564",
        request = `http://api.openweathermap.org/data/2.5/weather?&mode=xml&units=metric&${location}&APPID=${appId}`;

    weatherReq = new XMLHttpRequest();
    weatherReq.onreadystatechange = () => {
        if (weatherReq.readyState == 4) {
            if (weatherReq.status == 200) {
                weatherGenerator.next(weatherReq);
            } else {
                ifError(weatherReq.error);
            }
        }
    }
    weatherReq.open("GET", request, true);
    console.log(request);
    weatherReq.send();

}

function getPosition() {

    return new Promise((resolve, reject) => {

        (navigator.geolocation) ? getGeolocation(): (error) => reject(error);

        function getGeolocation() {

            let options = {
                timeout: 60000,
                enableHighAccuracy: true,
                maximumAge: 18000
            };

            navigator.geolocation.getCurrentPosition(positionOk, positionKo, options);

        }

        function positionOk(position) {
            resolve(position);
        }

        function positionKo(error) {
            reject(error);
        }

    });

}

function* getAllGenerator() {

    let position = yield getPosition().then((position) => {
        weatherGenerator.next(position);
    }).catch((error) => {
        ifError(error);
    });
    let weather = yield getWeather(position);
    console.log(weather);

    yield(() => {
        setTimeout(() => {
            displayWeatherData(weather);
            document.getElementById('loading').style.display = 'none';
            fields = document.getElementsByClassName('textField');
            for (let i in fields) {
                fields[i].style.display = 'block';
            }
        }, 3000);
    })();

}

function main() {

    weatherGenerator.next();

}

document.addEventListener("DOMContentLoaded", main(), false);
