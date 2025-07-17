maptilersdk.config.apiKey = mapToken;
    const map = new maptilersdk.Map({
    container: 'map', // container's id or the HTML element to render the map
    style: maptilersdk.MapStyle.STREETS,
    center: [73.7898, 20.0059],
    zoom: 12 
 });