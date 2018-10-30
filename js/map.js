/** Class representing the map view. */
class Map
{
    /**
     * Creates a Map Object
     */
    constructor(school_data, latlongs, activeYear)
    {
        this.activeYear = activeYear;
        
        this.projection = d3.geoAlbersUsa().scale([1270]).translate([480, 300]);

        let schools = school_data.filter(d => d.Year == this.activeYear);

        //Filters this by schools participating during active year
        let coordinates = schools.map(d => {
            let coords = latlongs.filter((val) => d.School === val.School);
            return coords;
        });

        this.data = schools;
        for (let i = 0; i < this.data.length; i++)
        {
            this.data[i].Lat = coordinates[i][0].Lat;
            this.data[i].Long = coordinates[i][0].Long;
        }

        // Initialize tooltip
        this.tip = d3.tip().attr('class', 'd3-tip')
        .direction('se')
        .offset(function() {
            return [0,0];
        })
    }

    /**
     * Renders the map, only called once on load
     * @param world the json data with the shape of all countries and a string for the activeYear
     */
    drawMap(theMap)
    {
        let geojson = topojson.feature(theMap, theMap.objects.states);

        //let path = d3.geoPath().projection(this.projection);
        let path = d3.geoPath();

        let map = d3.select("#map-chart").append("svg");

        map.append("g")
           .classed("states", true)
           .selectAll('path')
           .data(geojson.features)
           .enter().append('path')
           .attr('d', path);
        
        d3.select(".states").append("path")
           .classed("state-borders", true)
           .attr("d", path(topojson.mesh(theMap, theMap.objects.states, function(a,b) {
               return a !== b;})));
        // outer border?

        map.append("g").classed("cities", true);
    }

    /**
     * Renders the HTML content for tool tip.
     * @param tooltip_data information that needs to be populated in the tool tip
     * @return text HTML content for tool tip
     */
    tooltip_render(tooltip_data)
    {
        // SchoolName (W-L)
        let text = "<h3>" + tooltip_data.School + "   (" + tooltip_data.W + "-" + tooltip_data.L + ")</h3>";

        text += "<h3>" + this.activeYear + "</h3>";
        
        // Start unordered list
        text += "<ul>"

        // Conference:
        let conf = "";
        if (tooltip_data.Conf == "MW") conf = "Mountain West";
        else if (tooltip_data.Conf == "C-USA") conf = "Conference USA";
        else conf = tooltip_data.Conf;
        text += "<li> Conference: " + conf + "</li>";

        // Public or private
        text += "<li>" + tooltip_data.PubPriv + " university </li>";

        // # of undergrads
        let ug = "";
        if (tooltip_data.UG == -1) ug = "Unknown number of";
        else ug = tooltip_data.UG;
        text += "<li>" + ug + " undergraduates </li>";

        // Revenue
        let rev = "";
        if (tooltip_data.Revenue == -1) rev = "Unknown";
        else rev = "$" + tooltip_data.Revenue;
        text += "<li> Revenue: " + rev + "</li>";

        // Expenses
        let exp = "";
        if (tooltip_data.Expenses == -1) exp = "Unknown";
        else exp = "$" + tooltip_data.Expenses;
        text += "<li> Expenses: " + exp + "</li>";

        // Head coach salary
        let coach_salary = "";
        if (tooltip_data.Coach == -1) coach_salary = "Unknown";
        else coach_salary = "$" + tooltip_data.Coach;
        text += "<li> Head coach salary: " + coach_salary + "</li>";

        // Infractions
        text += "<li> Infractions: " + tooltip_data.Infractions + "</li>";

        // End unordered list
        text += "</ul>"

        return text;
    }

    /*
    * Updates the circles on the map representing the schools when the year changes.
    */
    updateMap()
    {
        let map = d3.select("#map-chart").select("svg");
        
        d3.selectAll(".d3-tip").remove();
        
        this.tip.html((d) => {
            let tooltip_data = {
                "School": d.School,
                "W": d.Wins,
                "L": d.Losses,
                "Conf": d.Conference,
                "PubPriv": d.Public_Private,
                "UG": d.Undergrads,
                "Revenue": d.Revenues,
                "Expenses": d.Expenses,
                "Coach": d.Coach_Salary,
                "Infractions": d.Infractions
            };
            return this.tooltip_render(tooltip_data);});
        
        map.call(this.tip);
        
        let cities = d3.select(".cities");
        cities.selectAll("circle").remove();

        for (let i = 0; i < this.data.length; i++)
        {
            this.data[i].Proj_Long = this.projection([this.data[i].Long, this.data[i].Lat])[0];
            this.data[i].Proj_Lat = this.projection([this.data[i].Long, this.data[i].Lat])[1];
        }
        
        cities.selectAll("circle")
              .data(this.data)
              .enter().append("circle")
              .attr("cx", (d) => d.Proj_Long)
              .attr("cy", (d) => d.Proj_Lat)
              .attr("r", 5)
              .attr("class", (d) => d.School)
              .style("fill", "red")
              .style("opacity", 0.6)
              .on("mouseover", this.tip.show)
              .on("mouseout", this.tip.hide);
              //TODO:
              //.on("click", ...)
    }
}