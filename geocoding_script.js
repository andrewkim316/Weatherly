var lat_lng;
var loc_key = "AIzaSyDpwMVJ17sATb5xIvGn1Yx5xnXzkBoKVok";
var weather_key = "9d4a8a0a8a93353a50b4ee741386d97b";

function initMap() {
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
            lat_lng = place.geometry.location.toUrlValue([4]);
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
        get_location();
    });
}

function get_location(){
    var weather_api = `https://api.darksky.net/forecast/${weather_key}/${lat_lng}`;
    fetch(weather_api)
    .then((resp) => resp.json())
    .then(function(data){
    })
    .catch(function(error){
        window.alert(error);
    })
    ;
}