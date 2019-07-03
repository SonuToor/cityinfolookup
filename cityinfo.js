let description;
let temperature; 

function createContent(info) {

  // there are still issues here 
    // sometimes displays the weather of the previous city selection

  let resp = getWeather(info); 

  resp.then((resp) => resp.json())
  .then(function(data) {
    description = data.weather[0].description;
    temperature = (Number(data.main.temp) - 273.15).toFixed(0); 
  });

  // data.then(function(data) {
    
  //   console.log(description, temperature, "this is after calling .then on the data returned by getWeather")
  //   description = data.weather[0].description;
  //   temperature = (Number(data.main.temp) - 273.15).toFixed(0); 

  // });


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

  // let data = await response.json();

  // console.log(data, "what getWeather returns"); 

  return response; 
  
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
  console.log("first initialize")
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
    console.log("set up the map")
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

      var infowindow = new google.maps.InfoWindow();

      google.maps.event.addListener(markers[count], 'click', function() {
        
        console.log("added the listener to the marker, now about to call create content")
        infowindow.setContent(createContent(this));
        infowindow.open(map, this);
      });

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