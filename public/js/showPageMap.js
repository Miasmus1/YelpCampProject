mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/satellite-v9', // style URL
center: campground.geometry.coordinates, // starting position [lng, lat] / Getting data from singleCamp.ejs
zoom: 12 // starting zoom
});

// Default Marker
new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 25})
        .setHTML(
            `<h5>${campground.title}<h5><sub>${campground.location}<sub>` // Getting data from singleCamp.ejs
        )
    )
    .addTo(map);


map.addControl(new mapboxgl.NavigationControl());