
      var map;
      var heatmap;
      var mode = 0;
      var markers;
      var currentOpenInfoWindow;
      var directionsDisplay;
      var lat;
      var long;


      function initMap() {

        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 15,
          center: {lat: 34.022352, lng: -118.285117},
          mapTypeId: 'terrain',
          styles: [
            {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#263c3f'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#6b9a76'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#38414e'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#212a37'}]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#9ca5b3'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#746855'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{color: '#1f2835'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: '#f3d19c'}]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{color: '#2f3948'}]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#17263c'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#515c6d'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#17263c'}]
            }
          ]
        });

        // Create a <script> tag and set the USGS URL as the source.
        var script = document.createElement('script');

        // This example uses a local copy of the GeoJSON stored at
        // http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojsonp
        script.src = 'https://developers.google.com/maps/documentation/javascript/examples/json/earthquake_GeoJSONP.js';
       // document.getElementsByTagName('head')[0].appendChild(script);
        map.data.setStyle(function(feature) {
          var magnitude = feature.getProperty('mag');
          return {
            icon: getCircle(magnitude)
          };
        });
        populateMap()
                navigator.geolocation.getCurrentPosition(showPosition);

      }

function smoothZoom (map, max, cnt) {
    if (cnt >= max) {
        return;
    }
    else {
        z = google.maps.event.addListener(map, 'zoom_changed', function(event){
            google.maps.event.removeListener(z);
            smoothZoom(map, max, cnt + 1);
        });
        setTimeout(function(){map.setZoom(cnt)}, 80); // 80ms is what I found to work well on my system -- it might not work well on all systems
    }
}  


      var array = []
      var sample = [[34.028362, -118.273139, "Lorenzo", 5.0, "Theft"],
          [34.029608, -118.287812, "Orchard", 2.0, "Robbery"],
          [34.022352, -118.285117, "GFS", 5.0, "Murder"],
          [34.021800, -118.282830, "Leavy", 5.1, "Chain snatching"],
          [34.028143, -118.279848, "Portland", 3.5, "Drugs"],
          [34.029536, -118.280985, "Severence", 4.7, "Thugs"],
          [34.016944, -118.282486, "Chipotle", 6.1, "Abduction"],
          [34.031845, -118.290793, "ralphs", 3.9, "Kidnapping"],
          [34.025425, -118.285187, "village", 1.7, "shouting"],
          [34.024405, -118.288428, "Lyon", 2.0, "Heavy Party"]]
      function populateMap(){

          

            
            for (var i = 0; i < sample.length; i++) {
              
                var weightedLoc = {
                location: new google.maps.LatLng(sample[i][0], sample[i][1]),
                weight: Math.pow(2, sample[i][3])
              }
              
              array.push(weightedLoc)
            }
            if(mode == 1){
              var marker = new google.maps.Marker({
                  position: new google.maps.LatLng(sample[i][0], sample[i][1]),
                  map: map
              });
            }
        
       heatmap = new google.maps.visualization.HeatmapLayer({
          data: array,
          dissipating: false,
          map: map
        });
       document.getElementById("button2").disabled = true;
       $('#button1').css('background','whitesmoke');
       $('#button1').css('color','black');
       $('#button2').css('background','darkgreen');
       $('#button2').css('color','aliceblue');



      }
       function removeHeatmap() {
        heatmap.setMap(null);
      }

      function addHeatmap(){
        heatmap.setMap(map);
      }
      function addMarkers(){
       

        markers = []
        for (var i = 0; i < sample.length; i++) {
                var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';

        var marker = new google.maps.Marker({
                  position: new google.maps.LatLng(sample[i][0], sample[i][1]),
                  map: map,
                  icon: image
              });
        // marker.setAnimation(google.maps.Animation.BOUNCE);
                var infowindow = new google.maps.InfoWindow()
        content = "<b> Location : </b>" + sample[i][2] + " - <b> Type : </b>" + sample[i][4]
       google.maps.event.addListener(marker,'click', (function(marker,content,infowindow){ 
          return function() {
            infowindow.setContent(content);
            infowindow.open(map,marker);
            if(currentOpenInfoWindow != null){
              currentOpenInfoWindow.close()
            }
            currentOpenInfoWindow = infowindow;
        };
})(marker,content,infowindow));  
        markers.push(marker);

          }
      }

      function removeMarkers(){
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
        }
      }

      function toggleMode(){
        if(mode == 0){
            removeHeatmap();
            addMarkers()
            mode = 1;
             $('#button1').css('background','darkgreen');
       $('#button1').css('color','aliceblue');
       $('#button2').css('background','whitesmoke');
       $('#button2').css('color','black');
            document.getElementById("button2").disabled = false;
            document.getElementById("button1").disabled = true;


        }
        else if(mode == 1){
            removeMarkers()
            addHeatmap()
            mode = 0;
             $('#button1').css('background','whitesmoke');
       $('#button1').css('color','black');
       $('#button2').css('background','darkgreen');
       $('#button2').css('color','aliceblue');
            document.getElementById("button2").disabled = true;
            document.getElementById("button1").disabled = false;
        }
      }
      function showPosition(pos){
          lat = pos.coords.latitude;
          long = pos.coords.longitude;
          var center = new google.maps.LatLng(lat, long);
    // using global variable:
          map.setCenter(center);
          //smoothZoom(map,17,map.getZoom())
          map.setZoom(17)
      }
    function plotRoute(){

      var destination = $('#destinationInput').val()

      var directionsService = new google.maps.DirectionsService();
      directionsDisplay = new google.maps.DirectionsRenderer();
            directionsDisplay.setMap(map);
            var request = {
                origin: new google.maps.LatLng(lat,long),
                destination: destination,
                travelMode: 'WALKING'
      };
      directionsService.route(request, function(result, status) {
       if (status == 'OK') {
          directionsDisplay.setDirections(result);
        }
      });
    }
    
    