class YearSlider
{
    constructor(year)
    {
        this.activeYear = year;
        this.drawYearBar();
    }

    drawYearBar()
    {
        //let that = this;

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
                    console.log(document.body.scrollHeight);
                })
            });
            //let xValue = d3.select('#dropdown_x').select('select').node().value;
            //let yValue = d3.select('#dropdown_y').select('select').node().value;
            //let cValue = d3.select('#dropdown_c').select('select').node().value;
            //that.updatePlot(String(this.value), xValue, yValue, cValue);
            //that.updateYear(String(this.value));
        }); 
    }
}