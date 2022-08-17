mapboxgl.accessToken = mapboxToken;

const map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/light-v10',
	center: [31, 48.5],
	zoom: 5
});

map.scrollZoom.disable();

map.on('load', () => {
	// Add a new source from our GeoJSON data and
	// set the 'cluster' option to true. GL-JS will
	// add the point_count property to your source data.
	map.addSource('campgrounds', {
		type: 'geojson',
		data: campgrounds,
		cluster: true,
		clusterMaxZoom: 14, // Max zoom to cluster points on
		clusterRadius: 50   // Radius of each cluster when clustering points (defaults to 50)
	});

	map.addLayer({
		id: 'clusters',
		type: 'circle',
		source: 'campgrounds',
		filter: ['has', 'point_count'],
		paint: {
			// Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
			// with three steps to implement three types of circles:
			//   * Blue, 20px circles when point count is less than 100
			//   * Yellow, 30px circles when point count is between 100 and 750
			//   * Pink, 40px circles when point count is greater than or equal to 750
			'circle-color': '#DC3545',
			'circle-radius': [
				'step',
				['get', 'point_count'],
				20,
				5,
				25,
				10,
				30
			],
		}
	});

	map.addLayer({
		id: 'cluster-count',
		type: 'symbol',
		source: 'campgrounds',
		filter: ['has', 'point_count'],
		layout: {
			'text-field': '{point_count_abbreviated}',
			'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
			'text-size': 16
		},
		paint: {
			'text-color': '#FFF'
		}
	});

	map.addLayer({
		id: 'unclustered-point',
		type: 'circle',
		source: 'campgrounds',
		filter: ['!', ['has', 'point_count']],
		paint: {
			'circle-color': '#DC3545',
			'circle-radius': 10,
		}
	});

	// inspect a cluster on click
	map.on('click', 'clusters', (c) => {
		const features = map.queryRenderedFeatures(c.point, {
			layers: ['clusters']
		});

		const clusterId = features[0].properties.cluster_id;
		map.getSource('campgrounds').getClusterExpansionZoom(
			clusterId,
			(err, zoom) => {
				if (err) return;

				map.easeTo({
					center: features[0].geometry.coordinates,
					zoom: zoom
				});
			}
		);
	});

	// When a click event occurs on a feature in
	// the unclustered-point layer, open a popup at
	// the location of the feature, with
	// description HTML from its properties.
	map.on('click', 'unclustered-point', (c) => {
		const coordinates = c.features[0].geometry.coordinates.slice();
		const { id, title, rating, reviews, price, cover } = c.features[0].properties;

		new mapboxgl.Popup()
			.setLngLat(coordinates)
			.setHTML(
				`
					<a class="row link-reset h-100 m-0" href="/campgrounds/${id}">
						<div class="col-7 pt-3 ps-3">
							<h5 class="mb-1">${title}</h5>

							<fieldset class="starability-basic mb-1">
								<input disabled type="radio" class="input-no-rate" value=0 ${rating === 0 ? 'checked' : ''}>
								<input disabled type="radio" value="1" ${rating === 1 ? 'checked' : ''}>
								<label title="Terrible">1 star</label>
								<input disabled type="radio" value="2" ${rating === 2 ? 'checked' : ''}>
								<label title="Not good">2 stars</label>
								<input disabled type="radio" value="3" ${rating === 3 ? 'checked' : ''}>
								<label title="Average">3 stars</label>
								<input disabled type="radio" value="4" ${rating === 4 ? 'checked' : ''}>
								<label title="Very good">4 stars</label>
								<input disabled type="radio" value="5" ${rating === 5 ? 'checked' : ''}>
								<label title="Amazing">5 stars</label>
							</fieldset>

							<p class="mb-2">${reviews} Review${(reviews != 1) ? 's' : ''}</p>

							<p class="camp__price"><strong>$${price}</strong> / night</p>
						</div>

						<div class="thumbnail__img-wrapper col-5 h-100 p-0 overflow-hidden">
							<img class="img-cover" src="${cover ? JSON.parse(cover).path : '/img/placeholder.jpg'}">
						</div>
					</a>
				`
			)
			.addTo(map);
	});

	map.on('mouseenter', 'clusters', () => {
		map.getCanvas().style.cursor = 'pointer';
	});

	map.on('mouseleave', 'clusters', () => {
		map.getCanvas().style.cursor = '';
	});

	const nav = new mapboxgl.NavigationControl({
		visualizePitch: true
	});

	map.addControl(nav, 'bottom-right');
});
