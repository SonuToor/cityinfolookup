var map;
let description;
let temperature;

// format the content for the infowindow and return it
function createContent(info) {

  description = description.charAt(0).toUpperCase() + description.slice(1);

  return `<h1>${info.title}</h1>
  <p>Current Time: ${getTime(info)}</p>
  <p>Current Date: ${getDate(info)}</p>
  <p>Current Weather: ${description}, ${temperature}°C.`
}


// an asychronous function that returns the weather based on the selected city from openweather api
async function getWeather(info) {
  
  let city = info.title;
  let currentWeather = `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=954165525dad5eb35e297e0de45ca3fc`

  let response = await fetch(currentWeather)
  let data = await response.json();

  return data; 
}

// gets the local time from the selected city
function getTime(info) {

  let dateNow = new Date();

  let utc = dateNow.getTime() + (dateNow.getTimezoneOffset() * 60000);
  let utcOffset = info.placeResult.utc_offset; 
  let localDate = new Date(utc + (60000 * utcOffset));

  let timeString = (localDate.toTimeString()).slice(0, 5);

  return `${timeString}`

}

// gets the local date for the selected city 
function getDate(info) {

  let dateNow = new Date();

  utc = dateNow.getTime() + (dateNow.getTimezoneOffset() * 60000);
  let utcOffset = info.placeResult.utc_offset; 

  localDate = new Date(utc + (60000 * utcOffset));
  formattedDate = localDate.toDateString()
  
  return `${formattedDate}`
}

// the initializer function, the script uses this asyncronously as the callback.
function initialize() {
  initMap();
}

// instantiates the map
function initMap() {
  let pos;
  if (navigator.geolocation) {
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
  else {
    handleLocationError(false, map.getCenter());
  }
}

// creates the search input, adds the listener to it, then creates the marker and infowindow for the city selection 
function initAutocomplete(map) {

  // create searchbox
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];

  // add a listener which adjusts the viewport and begins the process of placing a marker 
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
            
      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } 
      else {
        bounds.extend(place.geometry.location);
      }
      
      // getting the weather is done here to avoid receiving the promise unresolved 
      let weather = getWeather(markers[count]);
      weather.then(function(data) {
        description = data.weather[0].description;
        temperature = (Number(data.main.temp) - 273.15).toFixed(0);     
      });

      // create an infowindow and when the marker is clicked the infowindow opens with corresponding information
      var infowindow = new google.maps.InfoWindow();
      google.maps.event.addListener(markers[count], 'click', function() {
        
        infowindow.setContent(createContent(this));
        infowindow.open(map, this);
      });

      count++;
      
    });

    map.fitBounds(bounds);
  
    });
}

// error handling if the initial geolocation doesn't work 
function handleLocationError(browserHasGeolocation, pos) {
  infoWindow = new google.maps.InfoWindow;
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}

const googleMapsScript = document.createElement('script');
googleMapsScript.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDQ6gsqh3Z5Y6vwZBO0iqKFE4lMtJTY2pk&libraries=places&callback=initialize"
document.head.appendChild(googleMapsScript);