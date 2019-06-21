// add a search bar to search by country and change the time and date to it || search bar for wiki-link or more info about the city + weather 

    // change time based on the location of the map
        // api that shows time or timezone based off of current location on map?
        // have api that shows time or timezone chosen based off of searchbox input?
        // use new Date or api?`

    // display further information about city 
      // through wiki?

    //display weather for area
      // use openweather api based off of searchbox input 


function createContent(info) {

  return `<h1>${info.title}</h1>
          <p>Current Time: ${getTime(info)}</p>
          <p>Current Date: ${getDate()}</p>`
}

function getTime(info) {

  // TO DO (1)
    // base the time being returned from this function on the location chosen by user


    // PROBLEMS SO FAR

      // (1) UTC gives you a 24 hour clock
        // so currently imagine if its 23:00 (11:00 PM) and the location has an offset of +3:00 I am currently showing 26:00 instead of 2:00
      // (2) It is static so time is not refreshing, ideally we want the time to be constantly refreshing.

      
    let dateNow = new Date();
    let utcOffset = info.placeResult.utc_offset/60; 
    const hour = dateNow.getUTCHours() + utcOffset; 
    const minute = dateNow.getUTCMinutes();
    const second = dateNow.getUTCSeconds();


    return `${hour}:${minute}:${second}`

}

function getDate() {

  // TO DO (2)
    // base the date on the current date in the chosen location. 

  const dateNow = new Date();
  const year = dateNow.getFullYear();
  const month = dateNow.getMonth();
  const day = dateNow.getDate();
  
  return `${year}-${month + 1}-${day}`
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