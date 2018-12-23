/*
    Global Variables
*/
var lat;
var lng;
var weather_icons = {
    "clear-day": "https://s3.amazonaws.com/weatherly-images/039-sun.png",
    "clear-night": "https://s3.amazonaws.com/weatherly-images/024-night-4.png",
    "rain": "https://s3.amazonaws.com/weatherly-images/003-rainy.png",
    "snow": "https://s3.amazonaws.com/weatherly-images/006-snowy.png",
    "sleet": "https://s3.amazonaws.com/weatherly-images/012-snowy-1.png",
    "wind": "https://s3.amazonaws.com/weatherly-images/010-windy.png",
    "fog": "https://s3.amazonaws.com/weatherly-images/017-foog.png",
    "cloudy": "https://s3.amazonaws.com/weatherly-images/011-cloudy.png",
    "partly-cloudy-day": "https://s3.amazonaws.com/weatherly-images/038-cloudy-3.png",
    "partly-cloudy-night": "https://s3.amazonaws.com/weatherly-images/007-night.png"
}

/*
    Implements the Google autofill mechanism
*/
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
            fill_container("datapage");
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
        get_weather();
    });
}

/* Variables for all three API accessor functions */
var forecast = {
    "DS":{
        "day":{
            "weather":[],
            "symbol": [],
        },
        "hour":{
            "weather":[],
            "symbol":[],
        }
    },
    "OWM":{
        "day":{
            "weather":[],
            "symbol": [],
        },
        "hour":{
            "weather":[],
        }
    },
    "AX":{
        "day":{
            "weather": [],
            "symbol": [],
        },
    },
}
var high_low;
var agg_forecast = {
    "day":{
        "len": 5,
        "weather": [],
        "symbol": [],
    },
    "hour":{
        "len": 6,
        "weather": [],
        "symbol": [],
    },
    "current":[,,],
}
var weather_key_DS = "ff6d13b6d6cee611e239f461eb2736ae";
var weather_key_OWM = "5fbbd0cd9f2f29b404271d70b5214dc9";
var weather_key_AX = "818262a4594b42b4b6775243182011";

/* Convert Fahrenheit variable t to Celsius if b == true, vice versa if b == false */
function FtoC(t,b){
    if(b) return (t-32) * (5/9);
    return (t * (9/5)) + 32;
}

function write_to_page(){
    for(i = 0; i < agg_forecast.hour.len; i++){
        let hourlyTemp = document.getElementById("hourly_temp"+i.toString());
        hourlyTemp.innerHTML = hourForecast[i].toString() + "&#x2109";
    }
}

/* Determines the weather icon needed from Apixu and Open Weather Map */
function iconTranslatorAX(code){
    switch(code){
        case 1000:
            return "clear";
        case 1003:
            return "partly-cloudy";
        case 1006:
        case 1009:
            return "cloudy";
        case 1030:
        case 1135:
        case 1147:
            return "fog";
        case 1063:
        case 1072:
        case 1087:
        case 1150:
        case 1153:
        case 1168:
        case 1171:
        case 1180:
        case 1183:
        case 1186:
        case 1189:
        case 1192:
        case 1195:
        case 1198:
        case 1201:
        case 1240:
        case 1243:
        case 1246:
        case 1273:
        case 1276:
        case 1279:
        case 1282:
            return "rain";
        case 1066:
        case 1114:
        case 1117:
        case 1210:
        case 1213:
        case 1216:
        case 1219:
        case 1222:
        case 1225:
        case 1237:
        case 1255:
        case 1258:
        case 1261:
        case 1264:
            return "snow";
        case 1069:
        case 1204:
        case 1207:
        case 1249:
        case 1252:
            return "sleet";
        default:
            return "wind";
    }
}
function iconTranslatorOWM(code){
    switch(code){
        case "01d":
            return "clear";
        case "02d":
            return "partly-cloudy";
        case "03d":
        case "04d":
            return "cloudy";
        case "09d":
        case "10d":
        case "11d":
            return "rain";
        case "13d":
            return "snow";
        case "50d":
            return "fog";
    }
}

function iconHandler(arrDS,arrOWM,arrAX,daily){
    var final_icon = [];
    var icon_DS;
    var icon_OWM;
    var icon_AX;
    if(!daily){
        for(i = 0; i < agg_forecast.hour.len; i++){
            final_icon.push(arrDS[i]);
        }
    }
    else if(daily){
        for(i = 0; i < agg_forecast.day.len; i++){
            icon_DS = arrDS[i];
            if(icon_DS == "clear-day" || icon_DS == "clear-night"){
                icon_DS = icon_DS.substring(0,5);
            }
            else if(icon_DS == "partly-cloudy-day" || icon_DS == "partly-cloudy-night"){
                icon_DS = icon_DS.substring(0,13);
            }
            icon_OWM = iconTranslatorOWM(arrOWM[i]);
            icon_AX = iconTranslatorAX(arrAX[i]);
            if(icon_DS == icon_OWM || icon_DS == icon_AX) final_icon.push(arrDS[i]);
            else if(icon_DS != icon_OWM && icon_DS != icon_AX) final_icon.push(arrDS[i]);
            else final_icon.push(icon_OWM);
        }
    }
    return final_icon;
}

function weatherHandler(arrDS,arrOWM,arrAX,daily){
    var final_temp = [];
    if(!daily){
        for(i = 0; i < agg_forecast.hour.len; i++){
            let temp = parseInt(arrDS[i]);
            if(i % 3 == 0) {
                temp += parseInt(arrOWM[i%3]);
                final_temp.push((temp/2.0).toFixed(1));
            }
            else final_temp.push(temp.toFixed(1));
        }
    }
    else if(daily){
        for(i = 0; i < agg_forecast.day.len; i++){
            final_temp.push(((parseInt(arrDS[i])+parseInt(arrOWM[i])+parseInt(arrAX[i]))/3.0).toFixed(1));
        }
    }
    return final_temp;
}

/* Fills the empty containers */
function fill_container(container_name){
    var title = document.getElementById("title");
    var datapage = document.getElementById("datapage");
    if(container_name == "title"){
        title.innerHTML = document.getElementById("title_script").innerHTML;
        $("#datapage").empty();
    }
    else if(container_name == "datapage"){
        datapage.innerHTML = document.getElementById("datapage_script").innerHTML;
        $("#title").empty();
    }
}

function get_weather(){
    let weather_apis = [
        `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${weather_key_DS}/${lat},${lng}`,
        `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&APPID=${weather_key_OWM}`,
        `http://api.apixu.com/v1/forecast.json?key=${weather_key_AX}&q=${lat},${lng}&days=${agg_forecast.day.len}`
    ];
    Promise.all(weather_apis.map(api => fetch(api)))
    .then(responses => Promise.all(responses.map(resp => resp.json())))
    .then(data => {
        for(i = 0; i < agg_forecast.day.len; i++){
            high_low = [data[0].daily.data[i].temperatureHigh,data[0].daily.data[i].temperatureLow]; 
            forecast.DS.day.weather.push(high_low);
            forecast.DS.day.symbol.push(data[0].daily.data[i].icon);

            high_low = [FtoC((data[1].list[i*8].main.temp_max)-273,false),FtoC((data[1].list[i*8].main.temp_min)-273,false)];
            forecast.OWM.day.weather.push(high_low);
            forecast.OWM.day.symbol.push(data[1].list[i*8].weather[0].icon);

            high_low = [data[2].forecast.forecastday[i].day.maxtemp_f,data[2].forecast.forecastday[i].day.mintemp_f];
            forecast.AX.day.weather.push(high_low);
            forecast.AX.day.symbol.push(data[2].forecast.forecastday[i].day.condition.icon);
        }
        for(j = 0; j < agg_forecast.hour.len; j++){
            forecast.DS.hour.weather.push(data[0].hourly.data[j].temperature);
            forecast.DS.hour.symbol.push(data[0].hourly.data[j].icon);

            if(j % 3 == 0){
                forecast.OWM.hour.weather.push(FtoC((data[1].list[j].main.temp)-273,false));
            }
        }
        agg_forecast.current[0] = data[0].currently.temperature;
        agg_forecast.current[1] = FtoC((data[1].list[0].main.temp)-273,false);
        
        agg_forecast.day.symbol = iconHandler(forecast.DS.day.symbol, forecast.OWM.day.symbol, forecast.AX.day.symbol, true);
        agg_forecast.hour.symbol = iconHandler(forecast.DS.hour.symbol,[],[],false);
        agg_forecast.day.weather = weatherHandler(forecast.DS.day.weather,forecast.OWM.day.weather,forecast.AX.day.weather,true);
        agg_forecast.hour.weather = weatherHandler(forecast.DS.hour.weather,forecast.OWM.hour.weather,[],false);
    })
    .catch(err => {
        window.alert(err);
    })
}