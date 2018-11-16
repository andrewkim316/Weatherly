//var address = $('#location').val();
var loc_key = "AIzaSyDpwMVJ17sATb5xIvGn1Yx5xnXzkBoKVok";

var loc_api;
var temp;
function get_location(){
    loc_api = "https://maps.googleapis.com/maps/api/geocode/json?${address}&key=${loc_key}";
    temp = "https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyDpwMVJ17sATb5xIvGn1Yx5xnXzkBoKVok";
    //"https://maps.googleapis.com/maps/api/geocode/json?" + $.param(loc_insert);
    fetch(temp)
    .then((resp) => resp.json())
    .then(function(data){
        let loc = data.results;
        let lat = loc.geometry.location.lat;
        let lng = loc.geometry.location.lng;
        //window.alert(lat,lng);
        return lat;
    })
    .catch(function(error){
        window.alert(error);
    });
}

function get_location_2(){
    fetch("https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyDpwMVJ17sATb5xIvGn1Yx5xnXzkBoKVok")
    .then((resp) => resp.json())
    .then(function(data){
        let lo = data.results.formatted_address;
        //let lng = loc.geometry.location.lng;
        return lo;
    })
    .catch(function(error){
        window.alert(error);
    });
}


var weather_key = "9d4a8a0a8a93353a50b4ee741386d97b";

var weather_api = "https://api.darksky.net/forecast/";
