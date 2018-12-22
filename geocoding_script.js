var lat;
var lng;

function initMap() {
    let loc_key = "AIzaSyDpwMVJ17sATb5xIvGn1Yx5xnXzkBoKVok";
    var map = new google.maps.Map(document.getElementById('map'));
    var card = document.getElementById('pac-card');
    var input = document.getElementById('pac-input');

    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);

    var autocomplete = new google.maps.places.Autocomplete(input);

    // Bind the map's bounds (viewport) property to the autocomplete object,
    // so that the autocomplete requests use the current map bounds for the
    // bounds option in the request.
    autocomplete.bindTo('bounds', map);

    // Set the data fields to return when the user selects a place.
    autocomplete.setFields(
        ['address_components', 'geometry', 'icon', 'name']);

    var infowindow = new google.maps.InfoWindow();
    var infowindowContent = document.getElementById('infowindow-content');
    infowindow.setContent(infowindowContent);

    autocomplete.addListener('place_changed', function() {
        infowindow.close();
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + place.name + "'");
            return;
        }
        else {
            lat = place.geometry.location.lat();
            lng = place.geometry.location.lng();
        }
        var address = '';
        if (place.address_components) {
            address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }

        infowindowContent.children['place-icon'].src = place.icon;
        infowindowContent.children['place-name'].textContent = place.name;
        infowindowContent.children['place-address'].textContent = address;
        get_weather_DS();
        get_weather_OWM();
        get_weather_AX();
        write_to_page();
    });
}

var current_weather = [,,];
var dayForecast_DS = ["DS"];
var hourForecast_DS = [];
var dayForecastSymbol_DS = [];
var hourForecastSymbol_DS = ["DS"];

var high_low;
var forecastDay_len = 5;
var forecastHour_len = 6;

function get_weather_DS(){
    let weather_key = "***REMOVED***";
    let weather_api = `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${weather_key}/${lat},${lng}`;
    fetch(weather_api)
    .then(resp => resp.json())
    .then(function(data){
        for(i=0;i<forecastDay_len;i++){
            high_low = [data.daily.data[i].temperatureHigh,data.daily.data[i].temperatureLow]; 
            dayForecast_DS.push(high_low);
            dayForecastSymbol_DS.push(data.daily.data[i].icon);
        }

        for(j=0;j<forecastHour_len;j++){
            hourForecast_DS.push(data.hourly.data[j].temperature);
            hourForecastSymbol_DS.push(data.hourly.data[j].icon);
        }
        current_weather[0] = data.currently.temperature;
        window.alert(hourForecastSymbol_DS.toString());
    })
    .catch(function(error){
        window.alert(error);
    });
}

var dayForecast_OWM = ["OWM"];
var hourForecast_OWM = [];
var dayForecastSymbol_OWM = [];
var hourForecastSymbol_OWM = ["OWM"];

function get_weather_OWM(){
    let weather_key = "***REMOVED***";
    let weather_api = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&APPID=${weather_key}`
    fetch(weather_api)
    .then(resp => resp.json())
    .then(function(data){
        for(i=0;i<forecastDay_len;i++){
            high_low = [FtoC((data.list[i*8].main.temp_max)-273,false),FtoC((data.list[i*8].main.temp_min)-273,false)];
            dayForecast_OWM.push(high_low);
            dayForecastSymbol_OWM.push(data.list[i*8].weather[0].main);
        }
        for(j=0;j<(forecastHour_len/3);j++){
            hourForecast_OWM.push(FtoC((data.list[j].main.temp)-273,false));
            hourForecastSymbol_OWM.push(data.list[j].weather[0].main);
        }
        current_weather[1] = FtoC((data.list[0].main.temp)-273,false);
        window.alert(hourForecastSymbol_OWM.toString());
    })
    .catch(function(error){
        window.alert(error);
    });
}

var dayForecast_AX = ["AX"];
//var hourForecast_AX = [];
var dayForecastSymbol_AX = [];
//var hourForecastSymbol_AX = ["AX"];

function get_weather_AX(){
    let weather_key = "***REMOVED***";
    let weather_api = `http://api.apixu.com/v1/forecast.json?key=${weather_key}&q=${lat},${lng}&days=${forecastDay_len}`;
    fetch(weather_api)
    .then(resp => resp.json())
    .then(function(data){
        for(i=0;i<forecastDay_len;i++){
            high_low = [data.forecast.forecastday[i].day.maxtemp_f,data.forecast.forecastday[i].day.mintemp_f];
            dayForecast_AX.push(high_low);
            dayForecastSymbol_AX.push(data.forecast.forecastday[i].day.condition.text);
        }
        window.alert(dayForecastSymbol_AX.toString());
    })
    .catch(function(error){
        window.alert(error);
    });
}

function FtoC(t,b){
    if(b) return (t-32) * (5/9);
    return (t * (9/5)) + 32;
}

function write_to_page(){
    
}

function iconHandler(arr,src){
    if(src=="DS"){
        
    }
}