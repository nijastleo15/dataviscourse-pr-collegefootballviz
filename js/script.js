// Reads the data

let mapChart = null;
let yearSlider = null;
// let scatterPlot = null;
//let profileTable = null;
//let lineChart = null;
let defaultYear = 2012;

//
let that = this;
let gapPlot = null;

//Unsure if needed.
function updateYear(year) {
    // ++++++++ BEGIN CUT +++++++++++
    that.activeYear = year;
    if (that.activeCountry !== null) {
        gapPlot.updateHighlightClick(that.activeCountry);
        infoBox.updateTextDescription(that.activeCountry, that.activeYear);
    }
    // ++++++++ END CUT +++++++++++
}
// ******* TODO: PART 3 *******
/**
 * Calls the functions of the views that need to react to a newly selected/highlighted country
 *
 * @param countryID the ID object for the newly selected country
 */
function updateCountry(countryID) {

    that.activeCountry = countryID;
    // ++++++++ BEGIN CUT +++++++++++
    if (countryID === null) {
        gapPlot.clearHighlight();
        worldMap.clearHighlight();
        infoBox.clearHighlight();
        that.activeCountry = null;
    } else {
        that.activeCountry = countryID;
        gapPlot.updateHighlightClick(countryID);
        worldMap.updateHighlightClick(countryID);
        infoBox.updateTextDescription(countryID, that.activeYear);
    }
    // ++++++++ END CUT +++++++++++
}

//
d3.csv("data/Project_Data.csv").then(school_data => {
    d3.csv("data/Coordinates.csv").then(coordinates => {

        mapChart = new Map(school_data, coordinates, defaultYear);
        yearSlider = new YearSlider(defaultYear);
        //d3.select("#map-dropdown").select("select").remove();
        //mapChart.drawDropdown(); //I think this just calls it on the first rendering.



        //scatterPlot = new scatterPlot(school_data);
        //profileTable = new ProfileTable(school_data);
        //lineChart = new LineChart(school_data);

        gapPlot = new GapPlot(school_data, updateCountry, updateYear, defaultYear); //commenting this out removed second year slider
        gapPlot.updatePlot(2012, 'Revenues', 'Undergrads', 'Wins');
        yearSlider = new YearSlider(defaultYear, mapChart, gapPlot);

    })
});

d3.json("https://d3js.org/us-10m.v1.json").then(mapData => {
    // draw projection of map only once, called here:
    mapChart.drawMap(mapData);
    // Initialize circles with default year data:
    mapChart.updateMap(); //updateMap is called every time the yearSlider changes
    // d3.select(".cities").selectAll("circle").remove()//-> Do I need to remove the elements first?
    mapChart.drawDropdown(); //how do I call drawDropdown every time the yearSlider changes?

});
