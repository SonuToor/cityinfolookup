// add a search bar to search by country and change the time and date to it || search bar for wiki-link or more info about the city + weather 

    // change time based on the location of the map
        // api that shows time or timezone based off of current location on map?
        // have api that shows time or timezone chosen based off of searchbox input?
        // use new Date or api?`

    // display further information about city 
      // through wiki?

    //display weather for area
      // use openweather api based off of searchbox input 

let localWeather = []; 

function createContent(info) {
  let desc, temp = getWeather(info);

  console.log(desc, temp);

  description = localWeather[0];
  temperature = localWeather[1];


  console.log(description, temperature, localWeather)

  return `<h1>${info.title}</h1>
          <p>Current Time: ${getTime(info)}</p>
          <p>Current Date: ${getDate(info)}</p>
          <p>Current Weather: ${description} and the temperature is ${temperature}`
}

function getWeather(info) {

  localWeather = [];

  city = info.title;

  currentWeather = `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=954165525dad5eb35e297e0de45ca3fc`

  fetch(currentWeather)
  .then((resp) => resp.json())
  .then(function(data) {
    let description = data.weather[0].description;
    let temperature = (Number(data.main.temp) - 273.15).toFixed(0); 

    console.log(description, temperature)

    localWeather.push(description, temperature);

    return description, temperature; 

  });
}

function getTime(info) {

      // (2) It is static so time is not refreshing, ideally we want the time to be constantly refreshing.
          // call showInfoWindow with setTime?

  let dateNow = new Date();

  let utc = dateNow.getTime() + (dateNow.getTimezoneOffset() * 60000);
  
  let utcOffset = info.placeResult.utc_offset; 

  let localDate = new Date(utc + (60000 * utcOffset));

  let timeString = (localDate.toTimeString()).slice(0, 5);

  return `${timeString}`

}

function getDate(info) {

  let dateNow = new Date();

  utc = dateNow.getTime() + (dateNow.getTimezoneOffset() * 60000);
  
  let utcOffset = info.placeResult.utc_offset; 

  localDate = new Date(utc + (60000 * utcOffset));

  formattedDate = localDate.toDateString()
  
  return `${formattedDate}`
}

var map;

function initialize() {
  initMap();
}

function initMap() {
  let pos;
  navigator.geolocation.getCurrentPosition(function(position) {
    pos = {
      lat : position.coords.latitude,
      lng : position.coords.longitude };
    map = new google.maps.Map(document.getElementById('map'), {
        center: pos,
        zoom: 13,
        mapTypeID: 'terrain'
      });
    initAutocomplete(map)
  });
}

function initAutocomplete(map) {

  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  map.addListener('bounds_changed', function() {

    searchBox.setBounds(map.getBounds());
  });

  var markers = [];

  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();
    if (places.length == 0) {
        return;
      }
    markers.forEach(function(marker) {
      marker.setMap(null);
    });

    markers = [];
    var count = 0; 
    var bounds = new google.maps.LatLngBounds();

    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      markers[count].placeResult = place;

      google.maps.event.addListener(markers[count], 'click', showInfoWindow);

      if (place.geometry.viewport) {

        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }

      count++; 

      });

    map.fitBounds(bounds);

    });
}

function showInfoWindow() {
  var marker = this;
  var infowindow = new google.maps.InfoWindow({
    content: createContent(marker)
  });
  marker.addListener('click', function() {
    infowindow.open(map, marker);
  });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}

const googleMapsScript = document.createElement('script');
googleMapsScript.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDQ6gsqh3Z5Y6vwZBO0iqKFE4lMtJTY2pk&libraries=places&callback=initialize"
document.head.appendChild(googleMapsScript);