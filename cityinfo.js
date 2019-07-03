let description;
let temperature; 

// Can't make createContent async or it will also return a promise not the desired content
function createContent(info) {

  // there are still issues here 
    // sometimes displays the weather of the previous city selection

  data = getWeather(info); 

  data.then(function(data) {

    description = data.weather[0].description;
    temperature = (Number(data.main.temp) - 273.15).toFixed(0); 

  });


  console.log(info.title, description, temperature);

  return `<h1>${info.title}</h1>
  <p>Current Time: ${getTime(info)}</p>
  <p>Current Date: ${getDate(info)}</p>
  <p>Current Weather:${description}, ${temperature}°C`
}

async function getWeather(info) {
  
  let city = info.title;
  let currentWeather = `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=954165525dad5eb35e297e0de45ca3fc`

  let response = await fetch(currentWeather)

  let data = await response.json();

  return data; 
  
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

// want to prevent mulitiple windows from opening up?
  // how to get the window to constantly refresh?
function showInfoWindow() {
  var marker = this;

  var infowindow = new google.maps.InfoWindow();
  infowindow.setContent(createContent(marker));
  infowindow.open(map, marker);
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