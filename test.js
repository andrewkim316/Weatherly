var p1;
var p2;
var temp1;
var temp2;
var apis = [
    `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/ff6d13b6d6cee611e239f461eb2736ae/37.8267,-122.4233`,
    `http://api.openweathermap.org/data/2.5/forecast?lat=37.8267&lon=-122.4233&APPID=5fbbd0cd9f2f29b404271d70b5214dc9`
]
Promise.all(apis.map(api_address => fetch(api_address)))
.then(responses => Promise.all(responses.map(resp => resp.json())))
.then(data => {
    window.alert(data[0].daily.summary);
    window.alert(data[1].list[0].main.temp_max);
})
.catch(err => {
    window.alert(err);
});