
let mapChart = null;
let yearSlider = null;
let defaultYear = 2012;

let that = this;
let gapPlot = null;


d3.csv("data/Project_Data.csv").then(school_data => {
    d3.csv("data/Coordinates.csv").then(coordinates => {
        mapChart = new Map(school_data, coordinates, defaultYear);
        gapPlot = new GapPlot(school_data, defaultYear); //commenting this out removed second year slider
        gapPlot.updatePlot(school_data, 2012, null, 'Revenues', 'Undergrads', 'Wins');
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

/**
<<<<Storage>>>>
//Unsure if needed.
function updateYear(year) {
    // ++++++++ BEGIN CUT +++++++++++
    that.activeYear = year;
    if (that.activeCountry !== null) {
        gapPlot.updateHighlightClick(that.activeCountry);
        infoBox.updateTextDescription(that.activeCountry, that.activeYear);
    }
    // ++++++++ END CUT +++++++++++
//Unsure if needed.
function updateYear(year) {
    // ++++++++ BEGIN CUT +++++++++++
    that.activeYear = year;
    if (that.activeCountry !== null) {
        gapPlot.updateHighlightClick(that.activeCountry);
        infoBox.updateTextDescription(that.activeCountry, that.activeYear);
    }
    /**
     * Calls the functions of the views that need to react to a newly selected/highlighted country
     *
     * @param countryID the ID object for the newly selected country

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
*/
