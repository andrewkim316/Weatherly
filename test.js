fetch(`https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/***REMOVED***/37.8267,-122.4233`)
.then(resp => resp.json())
.then(function(data){
    window.alert(data.daily.summary);
})
.catch(function(error){
    window.alert(error);
});