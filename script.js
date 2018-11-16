function get_location(){
    let address =  format($('#location').val());
    let loc_key = "AIzaSyDpwMVJ17sATb5xIvGn1Yx5xnXzkBoKVok";
    let loc_api = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${loc_key}`;
    window.alert(loc_api);
    fetch(loc_api)
    .then(resp => resp.json())
    .then(function(data){
        let lo = data.results
        lo.map(function(lo){
            window.alert(lo.geometry.location.lat);
        });
    })
    .catch(function(error){
        window.alert(error);
    });
}

function format(str){
    return str.trim().replace(/ /g,"+");
}

function get_location_2(){
    address = format($('#location').val());
    window.alert(`hi, just wanted to say ${address}`);
}


var weather_key = "9d4a8a0a8a93353a50b4ee741386d97b";

var weather_api = "https://api.darksky.net/forecast/";
