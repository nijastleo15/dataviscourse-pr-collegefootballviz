/** Data structure for the data associated with an individual school. */
class PlotData
{
	/**
  	* @param school school name
  	* @param xVal value from the data object chosen for x at the active year
  	* @param yVal value from the data object chosen for y at the active year
  	* @param conference conference
  	* @param circleSize value for r from data object chosen for circleSizeIndicator
  	*/
  	constructor (school, xVal, yVal, conference, circleSize)
  	{
    	this.School = school;
    	this.xVal = xVal;
    	this.yVal = yVal;
    	this.conference = conference;
    	this.circleSize = circleSize;
  	}
}

/** Class representing the scatter plot view. */
class GapPlot
{
	/**
  	* Creates a new GapPlot Object
  	* @param updateCountry a callback function used to notify other parts of the program when the selected
  	* school was updated (clicked)
  	* @param updateYear a callback function used to notify other parts of the program when a year was updated
  	* @param activeYear the year for which the data should be drawn initially
  	*/
  	constructor (data, activeYear)
  	{
    	this.margin = { top: 20, right: 0, bottom: 60, left: 80 }; //right 20
    	this.width = 750 - this.margin.left - this.margin.right;
    	this.height = 600 - this.margin.top - this.margin.bottom;

    	this.activeYear = activeYear;
    	this.data = data;
    	this.selectedNode = null;
    	this.selectedSchool = null;

    	this.xIndicator = null;
    	this.yIndicator = null;
    	this.circleSizeIndicator = null;

    	this.drawPlot();
	}

	/**
  	* Sets up the plot, axes, and slider.
  	*/
  	drawPlot()
  	{
    	//Create svg groups, etc.
    	d3.select('#scatter-plot')
          .append('div').attr('id', 'chart-view');

    	d3.select('#chart-view')
          .append('div')
          .attr("class", "tooltip")
          .style("opacity", 0);

    	d3.select('#chart-view')
          .append('svg').classed('plot-svg', true)
          .attr("width", this.width + this.margin.left + this.margin.right)
          .attr("height", this.height + this.margin.top + this.margin.bottom);

    	let svgGroup = d3.select('#chart-view').select('.plot-svg').append('g').classed('wrapper-group', true);

    	svgGroup.append('text').classed('activeYear-background', true)
                .attr('transform', 'translate(100, 100)');

    	svgGroup.append("g")
                .classed("x-axis", true)
                .attr("transform", "translate(0," + this.height + ")");

    	svgGroup.append('text').classed('axis-label-x', true);

    	svgGroup.append("g")
                .attr("class", "y-axis");

    	svgGroup.append('text').classed('axis-label-y', true);

    	/* This is the setup for the dropdown menu. */
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
  	* Helper function added to remove spaces from conference
  	* names when bubbles are being classed.
  	* @param {string} input
  	*/
  	removeSpace(input)
  	{
    	let str = input.replace(/\s/g, '');
    	return str;
  	}

  	/**
  	* Renders the plot for the parameters specified
  	* @param activeYear the year for which to render
  	* @param xIndicator identifies the values to use for the x axis
  	* @param yIndicator identifies the values to use for the y axis
  	* @param circleSizeIndicator identifies the values to use for the circle size
  	*/
  	updatePlot(schoolData, activeYear, selectedSchoolNode, xIndicator, yIndicator, circleSizeIndicator)
  	{
    	//Check to see if null passed in. Keep fields the same if so.
		if (schoolData == null)
		{
			//change to if(schoolData != null) ?
		}
		else
		{
      		this.data = schoolData;
    	}

		if (activeYear == null)
		{

		}
		else
		{
      		this.activeYear = activeYear;
    	}

    	this.xIndicator = xIndicator;
    	this.yIndicator = yIndicator;
    	this.circleSizeIndicator = circleSizeIndicator;

    	//Make sure selectedSchoolNode exists before setting node
		if (selectedSchoolNode != null)
		{
      		this.schoolNode = selectedSchoolNode;
    	}
    	//save the selectedschool name
		if (this.schoolNode != null)
		{
      		this.selectedSchool = this.schoolNode['School'];
    	}

    	/**
    	*  Function to determine the circle radius by circle size
    	* @param d the data value to encode
    	* @returns {number} the radius
    	*/
    	let circleSizer = function(d) {
      		let cScale = d3.scaleSqrt().range([3, 20]).domain([minSize, maxSize]);
      		return d.circleSize ? cScale(d.circleSize) : 3;
    	};

    	let tempData = this.data.filter(d => {
      		return +d.Year == this.activeYear
		});
		
    	let that = this;

    	let plotData = tempData.map(d => {
      		let yValue = d[yIndicator];
      		let xValue = d[xIndicator];
      		let circleSize = d[circleSizeIndicator];

			if (circleSize != -1 && xValue != -1 && yValue != -1)
			{
        		return new PlotData(d.School, xValue, yValue, d.Conference, circleSize);
      		}
    	});

    	plotData = plotData.filter(p => p != null);

    	let tooltip = d3.select('.tooltip');

    	// Need max/mins of data
    	let yDataSport = this.data.map(d => {
      		return +d[yIndicator];
		})
		
    	let xDataSport = this.data.map(d => {
      		return +d[xIndicator];
		})
		
    	let sizeDataSport = this.data.map(d => {
      		return +d[circleSizeIndicator];
    	})

    	//Find the max for the X and Y data
    	let maxX = d3.max(xDataSport);
    	let maxY = d3.max(yDataSport);

    	//Find the min and max size for the circle data
    	let maxSize = d3.max(sizeDataSport);
    	let minSize = d3.min(sizeDataSport);

    	//Set x and y scales
    	let xScale = d3.scaleLinear().range([0, this.width-30]).domain([0, maxX]).nice();
    	let yScale = d3.scaleLinear().range([this.height, 0]).domain([0, maxY]).nice();

    	let group = d3.select('#chart-view').select('.plot-svg').select('.wrapper-group');

    	group.attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    	let yearBg = group.select('.activeYear-background').text(this.activeYear);

    	let axisXLabel = d3.select('.axis-label-x')
        	.style("text-anchor", "middle")
        	.attr('transform', 'translate(' + (this.width / 2) + ', ' + (this.height + 35) + ')');

    	d3.select('.axis-label-y')
          .style("text-anchor", "middle")
          .attr('transform', 'translate(' + -50 + ', ' + (this.height / 2) + ')rotate(-90)');

    	//Add the x and y axis
    	let xAxis = d3.select('.x-axis')
        	.call(d3.axisBottom(xScale));

    	let yAxis = d3.select('.y-axis')
        	.call(d3.axisLeft(yScale));

    	//Add the schools as circles
    	let circles = group.selectAll('circle').data(plotData);
    	circles.exit().remove();

    	let circleEnter = circles
        	.enter().append('circle');

    	circles = circleEnter.merge(circles);

    	//Circle Attributes
    	circles.attr("class", (d) => this.removeSpace(d.conference))
        	.classed('bubble', true)
        	.attr("r", (d) => circleSizer(d))
        	.attr("cx", function(d) {
        		return xScale(+d.xVal);
          	})
        	.attr("cy", function(d) {
        		return yScale(+d.yVal);
        });

        circles.classed('selected', (d) => {
			if (d.School === this.selectedSchool)
			{
            	return true;
            }
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

    	//hover function
    	circles.on("mouseout", function(d) {
      		tooltip.transition()
      			   .duration(500)
                   .style("opacity", 0);
    	});

    	//Click function for circle selection
    	circles.on('click', (d) => {
      		that.selectedSchool = d.School;
      		let temp = d3.selectAll('circle');
      		temp.classed('selected', false);
      		temp.classed('selected', (d) => {
				if (d.School === that.selectedSchool)
				{
          			return true;
        		}
		  });
		  
      	let lineChart = new LineChart(d);
      	lineChart.drawLineChart();
    	});


    	circles.classed('selected', (d) => {
			if (d.School === that.selectedSchool)
		  	{
        		return true;
      		}
    	});

    	this.drawLegend(minSize, maxSize);
    	this.drawDropDown(xIndicator, yIndicator, circleSizeIndicator);
	}

  	/**
  	* Setting up the drop-downs
  	* @param xIndicator identifies the values to use for the x axis
  	* @param yIndicator identifies the values to use for the y axis
  	* @param circleSizeIndicator identifies the values to use for the circle size
  	*/
  	drawDropDown(xIndicator, yIndicator, circleSizeIndicator)
  	{
    	let that = this;
    	let dropDownWrapper = d3.select('.dropdown-wrapper');
    	let dropData = [];
		
		dropData.push({indicator: 'Expenses', indicator_name: 'Expenses'},
    	              {indicator: 'Infractions', indicator_name: 'Infractions'},
    				  {indicator: 'Losses', indicator_name: 'Losses'},
                      {indicator: 'Undergrads', indicator_name: 'Undergrads'},
                      {indicator: 'Revenues', indicator_name: 'Revenues'},
                      {indicator: 'Wins', indicator_name: 'Wins'},
                      {indicator: 'Coach_Salary', indicator_name: 'Coach_Salary'});

  		/* CIRCLE DROPDOWN */
  		let dropC = dropDownWrapper.select('#dropdown_c').select('.dropdown-content').select('select'); //.select('select')??

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
    		that.updatePlot(that.data, that.activeYear, that.selectedSchool,  xValue, yValue, cValue);
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

		dropX.on('change', function(d, i)
		{
			let xValue = this.options[this.selectedIndex].value;
    		let yValue = dropY.node().value;
    		let cValue = dropC.node().value;
    		that.updatePlot(that.data, that.activeYear, that.selectedSchool, xValue, yValue, cValue);
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
    		that.updatePlot(that.data, that.activeYear, that.selectedSchool, xValue, yValue, cValue);
  		});
	}

	/**
	* Draws the legend for the circle sizes
	* @param min minimum value for the sizeData
	* @param max maximum value for the sizeData
	*/
	drawLegend(min, max)
	{
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
	* Returns html that can be used to render the tooltip.
	* @param data
	* @returns {string}
	*/
	tooltipRender(data)
	{
		let text = "<h2>" + data['School'] + "</h2>";
		return text;
	}

}