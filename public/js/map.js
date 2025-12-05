// public/js/map.js

// 1. Define default coordinates (NYC)
const defaultCoordinates = [-74.0060, 40.7128];

// 2. Check if listing.geometry exists and has coordinates
// Note: 'listing' variable comes from show.ejs (we will define it there next)
const coordinates = (listing.geometry && listing.geometry.coordinates && listing.geometry.coordinates.length > 0) 
    ? listing.geometry.coordinates 
    : defaultCoordinates;

// 3. Create the Map
const map = new maplibregl.Map({
    container: 'map',
    style: {
        version: 8,
        sources: {
            'osm-tiles': {
                type: 'raster',
                tiles: [
                    'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'
                ],
                tileSize: 256,
                attribution: '&copy; OpenStreetMap Contributors'
            }
        },
        layers: [
            {
                id: 'simple-tiles',
                type: 'raster',
                source: 'osm-tiles',
                minzoom: 0,
                maxzoom: 22
            }
        ]
    },
    center: coordinates,
    zoom: 9
});

// 4. Add the Marker
new maplibregl.Marker({ color: 'red' })
    .setLngLat(coordinates)
    .setPopup(
        new maplibregl.Popup({ offset: 25 })
        // Safe check for location name in case listing.location is missing
        .setHTML(`<h4>${listing.location || "Location"}</h4><p>Exact location provided after booking</p>`)
    )
    .addTo(map);

// 5. Add Zoom Controls
map.addControl(new maplibregl.NavigationControl());