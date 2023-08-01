//sets initial search location and eventually radius -CF
let defaultLocation = '95616';

//code for response from Zip -CF
const mapApiKey = 'AIzaSyCdCvKcnQ665AVlVXI_6FRnSup7eCuGhqA';

// this is the function to actually kicks off the start of the search -CF 
// I decided to prioritize ZIP Code because it is usually more accurate, however, if there is no ZIP Code, it will default to city=CF
function runSearch(){
  const userCity = document.querySelector('#city-form-input').value;
  console.log(userCity)
  
  const userZip = document.querySelector('#zip-form-input').value;
  
  if (userZip !== "") {
    runWithUserInput(userZip)
    console.log(userZip)
  } else if (userCity !== ""){
    runWithUserInput(userCity)
    console.log(userCity)
  }
}
// console.log(userCity)

// function for running research with user input-CF 
function runWithUserInput (userInput){
  fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${userInput}&key=${mapApiKey}`)
  .then(response => response.json())
  .then(data => {
    // geo-data from the response -CF
    const city = data.results[0].address_components[1].long_name;
    const state = data.results[0].address_components[2].short_name;
    var latitude = data.results[0].geometry.location.lat;
    var longitude = data.results[0].geometry.location.lng;
    
    
    console.log(`City: ${city}`);
    console.log(`State: ${state}`);
    console.log(`Latitude: ${latitude}`);
    console.log(`Longitude: ${longitude}`);
    
    lati = latitude
    longi = longitude
    
    let outputBox = document.querySelector("#search-details");
    outputBox.innerHTML = "";
    fetchWeatherData(latitude, longitude);
    initMap(latitude, longitude)
  })
  .catch(error => {
    console.error('Error:', error);
  });
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Google code for getting a map.
"use strict";

function initMap() {
  let myLatLng = {
    lat: parseFloat(lati),
    lng: parseFloat(longi)
  };
  console.log(myLatLng)
  let map = new google.maps.Map(document.getElementById("gmp-map"), {
    zoom: 16,
    center: myLatLng,
    zoomControl: true,
    streetViewControl: true,
    mapTypeControl: true,
    fullscreenControl: false,
    //changes position of map view controls -CF
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
      position: google.maps.ControlPosition.TOP_RIGHT,
    },
  });
  
  //search for places in a radius -CF
  var service = new google.maps.places.PlacesService(map);
  var request = {
    location: myLatLng,
    // to convert miles to meters, multiply by 1609.34
    radius: 1000, //  meters NEED TO MAKE THIS A CHANGABLE VARIABLE BASED ON USER INPUT
    keyword: 'parks'
    //type: ['park'] // search term "park" "hike" MAYBE NEED TO RUN MULTIPLE TIMES WITH MULTIPLE KEYWORDS
  };
  
  service.nearbySearch(request, callback);
  
  function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      console.log("results length: " + results.length)
      for (var i = 0; i < results.length; i++) {
        var place = results[i];
        console.log(results.length);
        console.log(place);
        //Making object to feed into giveTitleDetails
      var latitude = place.geometry.location.lat();
      var longitude = place.geometry.location.lng();

      console.log("Latitude: " + latitude);
      console.log("Longitude: " + longitude);
      let userLatLng = {
        lat: parseFloat(latitude),
        lng: parseFloat(longitude)
      };
  makeYourMark(userLatLng, map)
        let request = {
          placeId: place.place_id,
          fields: ['name','reviews','opening_hours','rating']
        };
        giveTitleDetails(request); 
      }
    }
  }
  
  //Code for getting details
  function giveTitleDetails(request) {
    service.getDetails(request,function(details, status){
      if (status === google.maps.places.PlacesServiceStatus.OK)
      console.log(details);
      console.log(details.reviews[0].text);
      let parkContents = document.createElement("div");
      parkContents.innerHTML = `<div class="output">
      <div class="mini-box-justforxample side-by-side align-spaced">
      <p class="location-title">${details.name}</p>
      <p class="distance">7.5mi</p>
      </div>
      <div class="expanded-box more-location-info">
      <p class="more-info" id="description">${details.reviews[0].text}</p>
      <p class="more-info" id="hours">9am-5pm</p>
      <div class="side-by-side">
      <p class="more-info">Website:</p>
      <p class="more-info" id="website">something.com</p>
      </div>
      <p class="more-info" id="go-to">open in google maps</p>
      </div>
      </div>`;
      let outputBox = document.querySelector("#search-details");
      outputBox.appendChild(parkContents);
    });
  }

  //adds custom marker icon -CF

}

runWithUserInput(defaultLocation);

function makeYourMark(userLatLng, map){
new google.maps.Marker({
  position: userLatLng,
  icon: {
    url: './assets/images/parkIcon.svg',
    
  },
  title: "My location",
  map: map
});}