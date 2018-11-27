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
    });
}
var weather_DS = ["DS"];
function get_weather_DS(){
    let weather_key = "ff6d13b6d6cee611e239f461eb2736ae";
    let weather_api = `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${weather_key}/${lat},${lng}`;
    fetch(weather_api)
    .then(resp => resp.json())
    .then(function(data){
        weather_DS.push(data.currently.temperature);
        weather_DS.push(data.currently.summary);
        window.alert(weather_DS.toString());
    })
    .catch(function(error){
        window.alert(error);
    });
}

var weather_OWM = ["OWM"];
function get_weather_OWM(){
    let weather_key = "5fbbd0cd9f2f29b404271d70b5214dc9";
    let weather_api = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&APPID=${weather_key}`
    fetch(weather_api)
    .then(resp => resp.json())
    .then(function(data){
        weather_OWM.push(FtoC((data.main.temp)-273));
        weather_OWM.push(data.weather[0].main);
        window.alert(weather_OWM.toString());
    })
    .catch(function(error){
        window.alert(error);
    });
}

var weather_AX = ["AX"];
function get_weather_AX(){
    let weather_key = "818262a4594b42b4b6775243182011";
    let weather_api = `http://api.apixu.com/v1/current.json?key=${weather_key}&q=${lat},${lng}`;
    fetch(weather_api)
    .then(resp => resp.json())
    .then(function(data){
        weather_AX.push(data.current.temp_f);
        weather_AX.push(data.current.condition.text);
        window.alert(weather_AX.toString());
    })
    .catch(function(error){
        window.alert(error);
    });
}

function FtoC(t,b){
    if(b) return (t-32) * (5/9);
    return (t * (9/5)) + 32;
}