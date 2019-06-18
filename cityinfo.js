
const secondsHand = document.querySelector('.second-hand');
const minutesHand = document.querySelector('.min-hand');
const hoursHand = document.querySelector('.hour-hand');
const digitalClock = document.querySelector('.digital');
const fecha = document.querySelector('.date');

// add a search bar to search by country and change the time to it || search bar for wiki-link or more info about the city + weather 
    // plan out the UI ---> location of the search bar, the clock, info-window.


    // change time based on the location of the map
        // api that shows time or timezone based off of current location on map?
        // have api that shows time or timezone chosen based off of searchbox input?
        // use new Date or api?

    // display further information about city 
      // through wiki?

    
    //display weather for area
      // use openweather api based off of searchbox input 


function setTime() {

    const dateNow = new Date();
    const second = dateNow.getSeconds();
    const minute = dateNow.getMinutes();
    const hour = dateNow.getHours(); 

    const secondDegrees = ((second / 60) * 360) + 90;
    secondsHand.style.transform = `rotate(${secondDegrees}deg)`;
    
    const minuteDegrees = ((minute / 60) * 360) + 90;
    minutesHand.style.transform = `rotate(${minuteDegrees}deg)`;

    const hourDegrees = ((hour / 12) * 360) + 90; 
    hoursHand.style.transform = `rotate(${hourDegrees}deg)`;

    digitalClock.innerHTML = (`${hour}:${minute}:${second}`);

}

function addDate() {
  const dateNow = new Date();
  const year = dateNow.getFullYear();
  const month = dateNow.getMonth();
  const day = dateNow.getDate();

  fecha.innerHTML = (`${year}-${month + 1}-${day}`);
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
  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  let markers = [];

  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();
    if (places.length == 0) {
        return;
      }
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

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

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
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

setInterval(setTime, 1000);
addDate();

const googleMapsScript = document.createElement('script');
googleMapsScript.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDQ6gsqh3Z5Y6vwZBO0iqKFE4lMtJTY2pk&libraries=places&callback=initialize"
document.head.appendChild(googleMapsScript);