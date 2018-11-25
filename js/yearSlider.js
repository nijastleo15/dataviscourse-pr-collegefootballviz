class YearSlider
{
    //constructor(year)
    constructor(year, map, scatterplot)
    {
        this.activeYear = year;
        this.drawYearBar();
        //Added in
        this.map = map;
        // console.log(this.map);
        this.scatterplot = scatterplot;

    }

    drawYearBar()
    {
        //added
        let that = this;

        let yearScale = d3.scaleLinear().domain([2003, 2016]).range([40, 500]);

        let yearSlider = d3.select('#year-slider')
            .append('div').classed('slider-wrap', true)
            .append('input').classed('slider', true)
            .attr('type', 'range')
            .attr('min', 2003)
            .attr('max', 2016)
            .attr('value', this.activeYear);

        let sliderLabel = d3.select('.slider-wrap')
            .append('div').classed('slider-label', true)
            .append('svg');

        let sliderText = sliderLabel.append('text').text(this.activeYear);

        sliderText.attr('x', yearScale(this.activeYear));
        sliderText.attr('y', 25);

        yearSlider.on('input', function()
        {
            sliderText.text(this.value);
            sliderText.attr('x', yearScale(this.value));
            d3.csv("data/Project_Data.csv").then(school_data => {
                d3.csv("data/Coordinates.csv").then(coordinates => {
                    let map = new Map(school_data, coordinates, this.value);
                    map.updateMap();
                    map.drawDropdown();
                    //let scatter = new ScatterPlot();
                    // console.log('scatter x ind ', that.scatterplot.xIndicator);
                    // that.scatterplot.updatePlot(this.value, that.scatterplot.xIndicator, that.scatterplot.yIndicator, that.scatterplot.circleSizeIndicator);
                    that.scatterplot.updatePlot(school_data, this.value, that.scatterplot.xIndicator, that.scatterplot.yIndicator, that.scatterplot.circleSizeIndicator);

                    d3.select("#line-chart").select("svg").remove();
                    d3.select("#line-chart").select(".dropDownWrapper").remove();
                })
            });
        });
    }
}
