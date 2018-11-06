/**
 * TODO: Change code to work on college football data. Include dropdown menus for variables.
 */

/** Data structure for the data associated with an individual country. */
class PlotData
{
    /**
     * @param country country name from the x data object
     * @param xVal value from the data object chosen for x at the active year
     * @param yVal value from the data object chosen for y at the active year
     * @param id country id
     * @param region country region
     * @param circleSize value for r from data object chosen for circleSizeIndicator
     */
    constructor(country, xVal, yVal, id, region, circleSize) {
        this.country = country;
        this.xVal = xVal;
        this.yVal = yVal;
        this.id = id;
        this.region = region;
        this.circleSize = circleSize;
    }
}

/** Class representing the scatter plot view. */
class GapPlot {

    /**
     * Creates an new GapPlot Object
     * @param updateCountry a callback function used to notify other parts of the program when the selected
     * country was updated (clicked)
     * @param updateYear a callback function used to notify other parts of the program when a year was updated
     * @param activeYear the year for which the data should be drawn initially
     */
    constructor(data, updateCountry, updateYear, activeYear) {

        // ******* TODO: PART 2 *******
        this.margin = { top: 20, right: 20, bottom: 60, left: 80 };
        this.width = 810 - this.margin.left - this.margin.right;
        this.height = 500 - this.margin.top - this.margin.bottom;
        this.activeYear = activeYear;

        this.data = data;

        this.xIndicator = null;
        this.yIndicator = null;
        this.circleSizeIndicator = null;
        // ++++++++ BEGIN CUT +++++++++++

        this.drawPlot();
        // ++++++++ END CUT +++++++++++


        // ******* TODO: PART 3 *******
        /**
         For part 4 of the homework, you will be using the other 3 parameters.
         * assign the highlightUpdate function as a variable that will be accessible to you in updatePlot()
         * assign the dragUpdate function as a variable that will be accessible to you in updatePlot()
         */

        // ++++++++ BEGIN CUT +++++++++++

        this.updateCountry = updateCountry;
        this.updateYear = updateYear;

        // ++++++++ END CUT +++++++++++

        //
        console.log(this.activeYear);
        console.log(this.data);
        let stuff = this.data.filter(d => {
          // console.log(d.Year);
          // console.log(this.activeYear);
          return +d.Year === this.activeYear
        });
        console.log('stuff', stuff);


    }

    /**
     * Sets up the plot, axes, and slider,
     */

    drawPlot() {

      //Create svg groups etc
        d3.select('#scatter-plot')
            .append('div').attr('id', 'chart-view');

        d3.select('#scatter-plot')
            .append('div').attr('id', 'activeYear-bar');

        d3.select('#chart-view')
            .append('div')
            .attr("class", "tooltip")
            .style("opacity", 0);

        d3.select('#chart-view')
            .append('svg').classed('plot-svg', true)
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom);

        let svgGroup = d3.select('#chart-view').select('.plot-svg').append('g').classed('wrapper-group', true);

        // ++++++++ BEGIN CUT +++++++++++

        svgGroup.append('text').classed('activeYear-background', true)
            .attr('transform', 'translate(100, 100)');

        svgGroup.append("g")
            .classed("x-axis", true)
            .attr("transform", "translate(0," + this.height + ")");

        svgGroup.append('text').classed('axis-label-x', true);

        svgGroup.append("g")
            .attr("class", "y-axis");

        svgGroup.append('text').classed('axis-label-y', true);

        // ++++++++ END CUT +++++++++++

        /* This is the setup for the dropdown menu- no need to change this */
        let dropdownWrap = d3.select('#chart-view').append('div').classed('dropdown-wrapper', true);

        let cWrap = dropdownWrap.append('div').classed('dropdown-panel', true);

        cWrap.append('div').classed('c-label', true)
            .append('text')
            .text('Circle Size');

        cWrap.append('div').attr('id', 'dropdown_c').classed('dropdown', true).append('div').classed('dropdown-content', true)
            .append('select');

        let xWrap = dropdownWrap.append('div').classed('dropdown-panel', true);

        xWrap.append('div').classed('x-label', true)
            .append('text')
            .text('X Axis Data');

        xWrap.append('div').attr('id', 'dropdown_x').classed('dropdown', true).append('div').classed('dropdown-content', true)
            .append('select');

        let yWrap = dropdownWrap.append('div').classed('dropdown-panel', true);

        yWrap.append('div').classed('y-label', true)
            .append('text')
            .text('Y Axis Data');

        yWrap.append('div').attr('id', 'dropdown_y').classed('dropdown', true).append('div').classed('dropdown-content', true)
            .append('select');

        d3.select('#chart-view')
            .append('div')
            .classed('circle-legend', true)
            .append('svg')
            .append('g')
            .attr('transform', 'translate(10, 0)');


    }

    /**
     * Renders the plot for the parameters specified
     *
     * @param activeYear the year for which to render
     * @param xIndicator identifies the values to use for the x axis
     * @param yIndicator identifies the values to use for the y axis
     * @param circleSizeIndicator identifies the values to use for the circle size
     */
    updatePlot(activeYear, xIndicator, yIndicator, circleSizeIndicator) {
        this.xIndicator = xIndicator;
        this.yIndicator = yIndicator;
        this.circleSizeIndicator = circleSizeIndicator;
        // ******* TODO: PART 2 *******

        /*
        You will be updating the scatterplot from the data. hint: use the #chart-view div

        *** Structuring your PlotData objects ***
        You need to start by mapping the data specified by the parameters to the PlotData Object
        Your PlotData object is specified at the top of the file
        You will need get the data specified by the x, y and circle size parameters from the data passed
        to the GapPlot constructor

        *** Setting the scales for your x, y, and circle data ***
        For x and y data, you should get the overall max of the whole data set for that data category,
        not just for the activeYear.

        ***draw circles***
        draw the circles with a scaled area from the circle data, with cx from your x data and cy from y data
        You need to size the circles from your circleSize data, we have provided a function for you to do this
        called circleSizer. Use this when you assign the 'r' attribute.

        ***Tooltip for the bubbles***
        You need to assign a tooltip to appear on mouse-over of a country bubble to show the name of the country.
        We have provided the mouse-over for you, but you have to set it up
        Hint: you will need to call the tooltipRender function for this.

        *** call the drawLegend() and drawDropDown()
        These will draw the legend and the drop down menus in your data
        Pay attention to the parameters needed in each of the functions

        */

        /**
         *  Function to determine the circle radius by circle size
         *  This is the function to size your circles, you don't need to do anything to this
         *  but you will call it and pass the circle data as the parameter.
         *
         * @param d the data value to encode
         * @returns {number} the radius
         */
        let circleSizer = function(d) {
            let cScale = d3.scaleSqrt().range([3, 20]).domain([minSize, maxSize]);
            return d.circleSize ? cScale(d.circleSize) : 3;
        };
        ///////////////////////////////////////////////////////////////////

        // ++++++++ BEGIN CUT +++++++++++
        let populationData = this.data.population;

        ///////my shit code
        console.log(this.data);
        let stuff2 = this.data.filter(d => {
          return +d.Year == activeYear
        });
        console.log('update stuff2 for year', activeYear, stuff2);


        let that = this;
        this.activeYear = activeYear;

        ////    constructor(country, xVal, yVal, id, region, circleSize) {

        let plotData2 = stuff2.map(d => {
          // console.log(d);
          // console.log('y ind', yIndicator)
          // console.log(d[yIndicator]);
          let yValue = d[yIndicator];
          let xValue = d[xIndicator];
          let circleSize = d[circleSizeIndicator];
          // console.log('yval', yValue);
          ////    constructor(country, xVal, yVal, id, region, circleSize) {
          return new PlotData(d.School, xValue, yValue, 7, 8, circleSize);
        });
        plotData2 = plotData2.filter(p => p != null);
        // console.log('pd2', plotData2);
        ///

        let tooltip = d3.select('.tooltip');
        //

        //Need max/mins of data
        let yDataSport = this.data.map(d => {
          return +d[yIndicator];
        })
        let xDataSport = this.data.map(d => {
          return +d[xIndicator];
        })
        let sizeDataSport = this.data.map(d => {
          return +d[circleSizeIndicator];
        })
        console.log(xDataSport);

        let plotData = plotData2;

        /**
         * Finds the max for the specified data
         * @param dataOb
         * @returns {*|number}
         */
        function findMax(dataOb) {
            let totalMax = d3.max(dataOb.map(m => {
                let val = Object.values(m).filter(v => typeof v === 'number');
                let max = d3.max(val);
                return max;
            }));
            return totalMax;
        }
        /**
         * Finds the min for the specified data
         * @param dataOb
         * @returns {number | *}
         */
        function findMin(dataOb) {
            let totalMin = d3.min(dataOb.map(m => {
                let val = Object.values(m).filter(v => typeof v === 'number'); //coming back empty
                let min = d3.min(val);
                return min;
            }));
            return totalMin;
        }

        //Find the max for the X and Y data

        // console.log('xds', xDataSport);
        // console.log('yds', yDataSport);
        let maxX = d3.max(xDataSport);
        let maxY = d3.max(yDataSport);


        // console.log('maxX: ', maxX, ' // maxY: ', maxY);
        //Find the min and max size for the circle data
        let maxSize = d3.max(sizeDataSport);
        let minSize = d3.min(sizeDataSport);

        //Set x and y scales
        let xScale = d3.scaleLinear().range([0, this.width]).domain([0, maxX]).nice();
        let yScale = d3.scaleLinear().range([this.height, 0]).domain([0, maxY]).nice();

        let group = d3.select('#chart-view').select('.plot-svg').select('.wrapper-group');

        group.attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

        let yearBg = group.select('.activeYear-background').text(this.activeYear);

        let axisXLabel = d3.select('.axis-label-x')
            // .text((xData[0].indicator_name.toUpperCase()))
            .style("text-anchor", "middle")
            .attr('transform', 'translate(' + (this.width / 2) + ', ' + (this.height + 35) + ')');

        d3.select('.axis-label-y')
            // .text((yData[0].indicator_name.toUpperCase()))
            .style("text-anchor", "middle")
            .attr('transform', 'translate(' + -50 + ', ' + (this.height / 2) + ')rotate(-90)');

        //Add the x and y axis
        let xAxis = d3.select('.x-axis')
            .call(d3.axisBottom(xScale));

        let yAxis = d3.select('.y-axis')
            .call(d3.axisLeft(yScale));

        //Add the countries as circles
        let circles = group.selectAll('circle').data(plotData);

        circles.exit().remove();

        let circleEnter = circles
            .enter().append('circle');

        circles = circleEnter.merge(circles);

        //Add the country region as class to color
        circles.attr("class", (d) => d.region)
            .classed('bubble', true);

        circles.attr("r", (d) => circleSizer(d))
            .attr("cx", function(d) {
                return xScale(+d.xVal);
            })
            .attr("cy", function(d) {
                return yScale(+d.yVal);
            });

        //Add the tooltip labels on mouseover
        circles.on('mouseover', function(d, i) {
            //show tooltip
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(that.tooltipRender(d) + "<br/>")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");

        });
        //hover function for country selection
        circles.on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

        //Click function for circle selection
        circles.on('click', (d) => {
            event.stopPropagation();
            let countryID = { id: d.id, region: d.region };
            that.clearHighlight();
            that.updateCountry(countryID);
        });

        if (this.activeCountry) {
            that.updateHighlightClick(activeCountry);
        }

        this.drawLegend(minSize, maxSize);
        this.drawDropDown(xIndicator, yIndicator, circleSizeIndicator);

        // ++++++++ END CUT +++++++++++

    }

    /**
     * Setting up the drop-downs
     * @param xIndicator identifies the values to use for the x axis
     * @param yIndicator identifies the values to use for the y axis
     * @param circleSizeIndicator identifies the values to use for the circle size
     */
    drawDropDown(xIndicator, yIndicator, circleSizeIndicator) {

        let that = this;
        let dropDownWrapper = d3.select('.dropdown-wrapper');
        let dropData = [];
        //Hardcoded this since our dataset was much cleaner so that loop below didn't work
            dropData.push({
                indicator: 'Expenses',
                indicator_name: 'Expenses'
            },
            {
              indicator: 'Infractions',
              indicator_name: 'Infractions'
            },
            {
              indicator: 'Losses',
              indicator_name: 'Losses'
            },
            {
              indicator: 'Undergrads',
              indicator_name: 'Undergrads'
            },
            {
              indicator: 'Revenues',
              indicator_name: 'Revenues'
            },
            {
              indicator: 'Wins',
              indicator_name: 'Wins'
            },
            {
              indicator: 'Coach_Salary',
              indicator_name: 'Coach_Salary'
            }
          );

        // }
        // for (let key in this.data) {
        //   console.log('key', key);
        //     dropData.push({
        //         indicator: key,
        //         indicator_name: this.data[key][0].indicator_name
        //     });
        // }

        /* CIRCLE DROPDOWN */
        let dropC = dropDownWrapper.select('#dropdown_c').select('.dropdown-content').select('select');

        let optionsC = dropC.selectAll('option')
            .data(dropData);


        optionsC.exit().remove();

        let optionsCEnter = optionsC.enter()
            .append('option')
            .attr('value', (d, i) => d.indicator);

        optionsCEnter.append('text')
            .text((d, i) => d.indicator_name);

        optionsC = optionsCEnter.merge(optionsC);

        let selectedC = optionsC.filter(d => d.indicator === circleSizeIndicator)
            .attr('selected', true);

        dropC.on('change', function(d, i) {
            let cValue = this.options[this.selectedIndex].value;
            let xValue = dropX.node().value;
            let yValue = dropY.node().value;
            that.updatePlot(that.activeYear, xValue, yValue, cValue);
        });

        /* X DROPDOWN */
        let dropX = dropDownWrapper.select('#dropdown_x').select('.dropdown-content').select('select');

        let optionsX = dropX.selectAll('option')
            .data(dropData);

        optionsX.exit().remove();

        let optionsXEnter = optionsX.enter()
            .append('option')
            .attr('value', (d, i) => d.indicator);

        optionsXEnter.append('text')
            .text((d, i) => d.indicator_name);

        optionsX = optionsXEnter.merge(optionsX);

        let selectedX = optionsX.filter(d => d.indicator === xIndicator)
            .attr('selected', true);

        dropX.on('change', function(d, i) {
            let xValue = this.options[this.selectedIndex].value;
            let yValue = dropY.node().value;
            let cValue = dropC.node().value;
            that.updatePlot(that.activeYear, xValue, yValue, cValue);
        });

        /* Y DROPDOWN */
        let dropY = dropDownWrapper.select('#dropdown_y').select('.dropdown-content').select('select');

        let optionsY = dropY.selectAll('option')
            .data(dropData);

        optionsY.exit().remove();

        let optionsYEnter = optionsY.enter()
            .append('option')
            .attr('value', (d, i) => d.indicator);

        optionsY = optionsYEnter.merge(optionsY);

        optionsYEnter.append('text')
            .text((d, i) => d.indicator_name);

        let selectedY = optionsY.filter(d => d.indicator === yIndicator)
            .attr('selected', true);

        dropY.on('change', function(d, i) {
            let yValue = this.options[this.selectedIndex].value;
            let xValue = dropX.node().value;
            let cValue = dropC.node().value;
            that.updatePlot(that.activeYear, xValue, yValue, cValue);
        });

    }

    /**
     * Draws the year bar and hooks up the events of a year change
     */
    // drawYearBar() {
    //
    //     // ******* TODO: PART 2 *******
    //     //The drop-down boxes are set up for you, but you have to set the slider to updatePlot() on activeYear change
    //
    //     // Create the x scale for the activeYear;
    //     // hint: the domain should be max and min of the years (1800 - 2020); it's OK to set it as numbers
    //     // the plot needs to update on move of the slider
    //
    //     /* ******* TODO: PART 3 *******
    //     You will need to call the updateYear() function passed from script.js in your activeYear slider
    //     */
    //     let that = this;
    //
    //     //Slider to change the activeYear of the data
    //     let yearScale = d3.scaleLinear().domain([1800, 2020]).range([30, 730]);
    //
    //     let yearSlider = d3.select('#activeYear-bar')
    //         .append('div').classed('slider-wrap', true)
    //         .append('input').classed('slider', true)
    //         .attr('type', 'range')
    //         .attr('min', 1800)
    //         .attr('max', 2020)
    //         .attr('value', this.activeYear);
    //
    //     let sliderLabel = d3.select('.slider-wrap')
    //         .append('div').classed('slider-label', true)
    //         .append('svg');
    //
    //     let sliderText = sliderLabel.append('text').text(this.activeYear);
    //
    //     sliderText.attr('x', yearScale(this.activeYear));
    //     sliderText.attr('y', 25);
    //
    //     yearSlider.on('input', function() {
    //         // ++++++++ BEGIN CUT +++++++++++
    //         sliderText.text(this.value);
    //         sliderText.attr('x', yearScale(this.value));
    //         let xValue = d3.select('#dropdown_x').select('select').node().value;
    //         let yValue = d3.select('#dropdown_y').select('select').node().value;
    //         let cValue = d3.select('#dropdown_c').select('select').node().value;
    //         that.updatePlot(String(this.value), xValue, yValue, cValue);
    //         that.updateYear(String(this.value));
    //         // ++++++++ END CUT +++++++++++
    //     });
    // }

    /**
     * Draws the legend for the circle sizes
     *
     * @param min minimum value for the sizeData
     * @param max maximum value for the sizeData
     */
    drawLegend(min, max) {
        // ******* TODO: PART 2*******
        //This has been done for you but you need to call it in updatePlot()!
        //Draws the circle legend to show size based on health data
        let scale = d3.scaleSqrt().range([3, 20]).domain([min, max]);

        let circleData = [min, max];

        let svg = d3.select('.circle-legend').select('svg').select('g');

        let circleGroup = svg.selectAll('g').data(circleData);
        circleGroup.exit().remove();

        let circleEnter = circleGroup.enter().append('g');
        circleEnter.append('circle').classed('neutral', true);
        circleEnter.append('text').classed('circle-size-text', true);

        circleGroup = circleEnter.merge(circleGroup);

        circleGroup.attr('transform', (d, i) => 'translate(' + ((i * (5 * scale(d))) + 20) + ', 25)');

        circleGroup.select('circle').attr('r', (d) => scale(d));
        circleGroup.select('circle').attr('cx', '0');
        circleGroup.select('circle').attr('cy', '0');
        let numText = circleGroup.select('text').text(d => new Intl.NumberFormat().format(d));

        numText.attr('transform', (d) => 'translate(' + ((scale(d)) + 10) + ', 0)');
    }

    /**
     * Reacts to a highlight/click event for a country; draws that country darker
     * and fades countries on other continents out
     * @param activeCountry
     */
    updateHighlightClick(activeCountry) {
        /* ******* TODO: PART 3*******
        //You need to assign selected class to the target country and corresponding region
        // Hint: If you followed our suggestion of using classes to style
        // the colors and markers for countries/regions, you can use
        // d3 selection and .classed to set these classes on here.
        // You will not be calling this directly in the gapPlot class,
        // you will need to call it from the updateHighlight function in script.js
        */
        // ++++++++ BEGIN CUT +++++++++++
        this.clearHighlight();
        //highlight bubbles
        let bubbleRegion = d3.select('#scatter-plot').selectAll('.bubble')
            .filter(b => b.region === activeCountry.region)
            .classed('selected-region', true);
        let hiddenBubbles = d3.select('#scatter-plot').selectAll('.bubble')
            .filter(b => b.region !== activeCountry.region)
            .classed('hidden', true);
        let bubbleCountry = bubbleRegion.filter(b => b.id === activeCountry.id)
            .classed('selected-country', true);
        // ++++++++ END CUT +++++++++++
    }

    /**
     * Clears any highlights
     */
    clearHighlight() {
        // ******* TODO: PART 3*******
        // Clear the map of any colors/markers; You can do this with inline styling or by
        // defining a class style in styles.css

        // Hint: If you followed our suggestion of using classes to style
        // the colors and markers for hosts/teams/winners, you can use
        // d3 selection and .classed to set these classes off here.

        // ++++++++ BEGIN CUT +++++++++++
        d3.select('#chart-view').selectAll('.selected-country')
            .classed('selected-country', false);
        d3.select('#chart-view').selectAll('.selected-region')
            .classed('selected-region', false);
        d3.select('#chart-view').selectAll('.hidden')
            .classed('hidden', false);
        // ++++++++ END CUT +++++++++++
    }

    /**
     * Returns html that can be used to render the tooltip.
     * @param data
     * @returns {string}
     */
    tooltipRender(data) {
        let text = "<h2>" + data['country'] + "</h2>";
        return text;
    }

}
