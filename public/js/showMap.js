mapboxgl.accessToken = mapboxToken;
const lng = camp.geometry.coordinates[0];
const lat = camp.geometry.coordinates[1];

const map = new mapboxgl.Map({
	container: 'map', // container ID
	style: 'mapbox://styles/mapbox/streets-v11', // style URL
	center: [lng, lat], // starting position [lng, lat]
	zoom: 12, // starting zoom
	projection: 'globe' // display the map as a 3D globe
});

const marker = new mapboxgl.Marker({
	color: '#DC3545'
})
	.setLngLat([lng, lat])
	.setPopup(
		new mapboxgl.Popup({ offset: 25 })
			.setHTML(
				`<strong style="padding:0 .5rem">${camp.title}</strong>`
		)
	)
	.addTo(map);

map.on('style.load', () => {
	map.setFog({}); // Set the default atmosphere style
});

const nav = new mapboxgl.NavigationControl({
	visualizePitch: true
});

map.addControl(nav, 'bottom-right');

map.scrollZoom.disable();
