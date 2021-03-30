
let map;
let service;
let infowindow;
let btnCopy;

function initMap() {
  // Chapel Hill coords: 35.898800, -79.041267
  // Durham coords: 35.996948, -78.899017
  // Raleigh coords: 35.779591, -78.638176
  var location = new google.maps.LatLng(35.996948, -78.899017);
  
  map = new google.maps.Map(document.getElementById('map'), {
      center: location,
      zoom: 13
    });

  var request = {
    location: location,
    radius: '250',
    query: 'dog park'
  };


  let createMarker = (place) => {
    if (!place.geometry || !place.geometry.location) return;
    
    const marker = new google.maps.Marker({
      map,
      position: place.geometry.location,
    });

    // name
    // address
    // Google maps link
    const contentString = `<div id='${place.name}'><b>${place.name}</b>    ${place.rating}/5</div>` + 
        `<div id='${place.formatted_address}'> ${place.formatted_address}</div>` +
        `<a href="https://google.com/maps/place/?q=${place.name} + ${place.formatted_address}" target="_blank" rel="noopener noreferrer">Open in Google Maps</a>`;

    
        
    google.maps.event.addListener(marker, "click", () => {
      if (infowindow) {
        infowindow.close();
      }
      infowindow = new google.maps.InfoWindow({
          content: contentString,
      });
      infowindow.open(map, marker);
    });
  }


  service = new google.maps.places.PlacesService(map);
  service.textSearch(request, (results, status) => {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        var place = results[i];
        createMarker(results[i]);
      }
    }
  });

  
  /*
    Adds a geolocation button to pan to current address
  */
  infoWindow = new google.maps.InfoWindow();
  const locationButton = document.createElement("button");
  locationButton.textContent = "Pan to Current Location";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  locationButton.addEventListener("click", () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          
          infoWindow.setPosition(pos);
          infoWindow.setContent('You are here')
          infoWindow.open(map);
          
          map.setCenter(pos);
          map.setZoom(13);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });
}

// For geolocation
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
      browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
  }

 