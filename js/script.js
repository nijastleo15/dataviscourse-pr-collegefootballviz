// Reads the data

let mapChart = null;
let yearSlider = null;
let defaultYear = 2003;

d3.csv("data/Project_Data.csv").then(school_data => {
    d3.csv("data/Coordinates.csv").then(coordinates => {
        mapChart = new Map(school_data, coordinates, defaultYear);
        yearSlider = new YearSlider(defaultYear);
    })
});

d3.json("https://d3js.org/us-10m.v1.json").then(mapData => {
    mapChart.drawMap(mapData);
    mapChart.updateMap();
});