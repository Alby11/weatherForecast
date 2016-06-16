function displayWeatherData(weatherReq) {
    let respXML = weatherReq.responseXML
        , city = respXML.getElementsByTagName("city")[0].attributes["name"].textContent
        , country = respXML.getElementsByTagName("country")[0].textContent
        , weatherDesc = respXML.getElementsByTagName("weather")[0].attributes["value"].nodeValue
        , weatherValue = respXML.getElementsByTagName("weather")[0].attributes["number"].nodeValue
        , temperatureValue = Math.floor(respXML.getElementsByTagName("temperature")[0].attributes["value"].textContent)
        , temperatureMin = Math.floor(respXML.getElementsByTagName("temperature")[0].attributes["min"].nodeValue)
        , temperatureMax = Math.floor(respXML.getElementsByTagName("temperature")[0].attributes["max"].nodeValue)
        , temperatureUnit = respXML.getElementsByTagName("temperature")[0].attributes["unit"].nodeValue
        , temperatureValueF = Math.floor(temperatureValue * (9 / 5) + 32)
        , temperatureMinF = Math.floor(temperatureMin * (9 / 5) + 32)
        , temperatureMaxF = Math.floor(temperatureMax * (9 / 5) + 32)
        , buttonIdCelsius = 'toCelsius'
        , buttonIdFahrenheit = 'toFahrenheit'
        , temperatureContentC = `Temp: ${temperatureValue} (Min; ${temperatureMin} Max: ${temperatureMax}) °C <button type="button" class="btn btn-success" id="${buttonIdFahrenheit}">To °F</button>`
        , temperatureContentF = `Temp: ${temperatureValueF} (Min; ${temperatureMinF} Max: ${temperatureMaxF}) °C <button type="button" class="btn btn-success" id="${buttonIdCelsius}">To °C</button>`
        , humidityValue = respXML.getElementsByTagName("humidity")[0].attributes["value"].nodeValue
        , humidityUnit = respXML.getElementsByTagName("humidity")[0].attributes["unit"].nodeValue
        , windValue = respXML.getElementsByTagName("speed")[0].attributes["value"].nodeValue
        , windDirection = respXML.getElementsByTagName("direction")[0].attributes["code"].nodeValue
        , windDegrees = respXML.getElementsByTagName("direction")[0].attributes["value"].nodeValue
        , pressureValue = respXML.getElementsByTagName("pressure")[0].attributes["value"].nodeValue
        , pressureUnit = respXML.getElementsByTagName("pressure")[0].attributes["unit"].nodeValue
        , backgroundId = [201, 401, 501, 601, 701, 801]
        , backgroundIcon = [
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
        , backgroundImg = [
            'img/thunderstorm.jpg'
            , 'img/sprinkle.jpg'
            , 'img/rain.jpg'
            , 'img/snow.jpg'
            , 'img/fog.jpg'
            , 'img/clear.jpg'
            , 'img/cloudy.jpg'
            , ]
        , iconClass
        , bgIndex;
    
    document.getElementById('city').innerHTML = `${city} - ${country}`;
    document.getElementById('weather').innerHTML = weatherDesc;
    document.getElementById('temp').innerHTML = temperatureContentC;
    backgroundId.push(weatherValue);
    bgIndex = backgroundId.sort().indexOf(weatherValue);
    document.body.style.backgroundImage = `url(${backgroundImg[bgIndex]})`;
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.backgroundPosition = 'center';
    iconClass = backgroundIcon[bgIndex];
    document.getElementById('icon').innerHTML = `<i class="wi wi-${iconClass}"></i><br>`;
    document.getElementById('humidity').innerHTML = `Humidity: ${humidityValue} ${humidityUnit}`;
    document.getElementById('wind').innerHTML = `Wind: ${windValue}  kn - ${windDirection} <i class="wi wi-wind towards-${windDegrees}-deg"></i><br>`;
    document.getElementById('pressure').innerHTML = `Pressure: ${pressureValue} ${pressureUnit}`;
    document.getElementById('temp').innerHTML = temperatureContentC;
    
    function addClickListener(elementId = buttonIdFahrenheit) {
        document.getElementById(elementId).addEventListener('click', convertTemp);
    };
    addClickListener();
    
    function convertTemp(element) {
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
    }

}

function getPosition() {
    
    return new Promise ((resolve, reject) => {
            
        if (navigator.geolocation) { getGeolocation(); } else { reject( error => { reject(error); }); }

        function getGeolocation() {

            let options = {
            timeout: 60000
            , enableHighAccuracy: true
            , maximumAge: 18000
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

function getWeather(position) {
    
    return new Promise ((resolve, reject) => {
        
        let crd = position.coords
                    , lat = crd.latitude
                    , lon = crd.longitude
                    , location = `lat=${lat}&lon=${lon}`
                    , appId = "60d2f49e0004ccad2ad538f264be9564"
                    , request = `http://api.openweathermap.org/data/2.5/weather?&mode=xml&units=metric&${location}&APPID=${appId}`;

        weatherReq = new XMLHttpRequest();
        weatherReq.open("GET", request, false);
        console.log(request);
        weatherReq.send();
        
        if (weatherReq.status === 200) {
            resolve(weatherReq);
        } else {
            reject("Some error occurred during the HTTP request");
        }
        
    });
    
}

function main() {
    
    getPosition().then(
        position => {
            getWeather(position).then(
            weatherReq => {
                displayWeatherData(weatherReq);
            }
            ).catch(
                error => {
                    alert(error);
                }
            )
        }
    ).catch(
        error => {
            alert(error);
        }
    );
    
}

document.addEventListener("DOMContentLoaded", main(), false);
