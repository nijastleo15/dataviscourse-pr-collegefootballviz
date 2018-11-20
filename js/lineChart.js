// TODO:

// Code for line chart
// Hidden on load
// Shows on click of school on map
// Includes dropdowns for y-axis variables.

class LineChart
{
    //http://bl.ocks.org/d3noob/e34791a32a54e015f57d

    constructor(schoolNode)
    {
        //TODO:
        let margin = {top: 30, right: 40, bottom: 30, left: 40};
        this.width = 900 - margin.left - margin.right;
        this.height = 800 - margin.top - margin.bottom;

        this.schoolNode = schoolNode;

        this.selectedSchool = schoolNode['School'];

    }

    async drawLineChart() {

        d3.select("#line-chart").select("svg").remove();

        d3.select("#line-chart").select(".dropDownWrapper").remove();

        d3.select("#line-chart").append("svg")
            .attr("width", 900)
            .attr("height", 800);

        let schoolCSV = await d3.csv("data/Project_Data.csv");

        //I need to get all the data for the selected school
        let allSchoolData = [];

        schoolCSV.forEach(d => {
            if (d.School === this.selectedSchool){
                allSchoolData.push(d);
            }
        });

        let yearArray = allSchoolData.map(d => {
            return +d['Year']
        });


        let yearMin = Math.min(...yearArray);

        let yearMax = Math.max(...yearArray);

        let revenuesArray = allSchoolData.map(d => {
            return +d['Revenues']
        });

        let revenuesMin = Math.min(...revenuesArray);

        let revenuesMax = Math.max(...revenuesArray);

        let expensesArray = allSchoolData.map(d => {
            return +d['Expenses']
        });

        let expensesMin = Math.min(...expensesArray);

        let expensesMax = Math.max(...expensesArray);

        let xScale = d3.scaleLinear()
            .domain([yearMin, yearMax])
            .range([0, this.width - 75]);

        let y1Scale = d3.scaleLinear()
            .domain([0, revenuesMax])
            .range([this.height, 100]);

        let y2Scale = d3.scaleLinear()
            .domain([0, expensesMax])
            .range([this.height, 100]);


        //Create the axes
        let xAxis = d3.axisBottom(xScale).ticks(yearArray.length).tickFormat(d3.format("d"));

        let yAxisLeft = d3.axisLeft(y1Scale).ticks(revenuesArray.length);

        let yAxisRight = d3.axisRight(y2Scale).ticks(expensesArray.length);



        let line1Data = [];

        //create objects with "x" and "y" attributes to use in d3.line function, append objects to line1Data array
        yearArray.forEach(d => {
            revenuesArray.forEach(e => {
                if (yearArray.indexOf(d) === revenuesArray.indexOf(e)){
                    line1Data.push(
                        {"x": d,
                            "y": e}
                    )
                }
            })
        });

        let line2Data = [];
        yearArray.forEach(d => {
            expensesArray.forEach(e => {
                if (yearArray.indexOf(d) === expensesArray.indexOf(e)){
                    line2Data.push(
                        {"x": d,
                            "y": e}
                    )
                }
            })
        });

        let valueLine1 = d3.line()
            .x(function(d){return xScale(d.x)})
            .y(function(d){return y1Scale(d.y)});

        let valueLine2 = d3.line()
            .x(function(d){return xScale(d.x)})
            .y(function(d){return y2Scale(d.y)});



        d3.select("#line-chart").selectAll("g").remove();


        let lineSVG = d3.select("#line-chart").select("svg");

        d3.select("#line-chart").selectAll("path").remove();

        //append line for y1 axis
        lineSVG.append("path")
            .attr("d", valueLine1(line1Data))
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2)
            .attr("fill", "none")
            .attr("transform", "translate(" + 75 + "," + 25 + ")")
            .classed("leftLine", true);

        //append line for y2 axis
        lineSVG.append("path")
            .attr("d", valueLine2(line2Data))
            .attr("stroke", "red")
            .attr("stroke-width", 2)
            .attr("fill", "none")
            .attr("transform", "translate(" + 75 + "," + 25 + ")")
            .classed("rightLine", true);


        lineSVG.append("g").call(xAxis)
            .attr("transform", "translate(" + 75 + "," + 765 + ")");


        //need to append text element to give axis title
        lineSVG.append("text")
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + 445 + "," + 800 + ")")
            .text("Year");


        //classed y-axisLeft so I can select the axis later and delete it
        lineSVG.append("g").call(yAxisLeft).classed("y-axisLeft", true)
            .attr("transform", "translate(" + 75 + "," + 25 + ")");

        lineSVG.append("g").call(yAxisRight).classed("y-axisRight", true)
            .attr("transform", "translate(" + 820 +"," + 25 + ")");

        lineSVG.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 12)
            .attr("x", -425)
            .classed("leftAxisLabel", true)
            .text("Revenues");

        lineSVG.append("text")
            .attr("transform", "rotate(-270)")
            .attr("y", -887)
            .attr("x", 370)
            .classed("rightAxisLabel", true)
            .text("Expenses");


        lineSVG.append("text")
            .attr("x", 100)
            .attr("y", 150)
            .style("font-size", 24)
            .style("fill", "grey")
            .text(this.selectedSchool);

        let dropdownWrap = d3.select('#line-chart').append('div').classed("dropDownWrapper", true);

        let yLeftWrap = dropdownWrap.append('div').classed("yLeftWrap", true);

        yLeftWrap.append('div').classed('yLeft-label', true)
            .append('text')
            .text('Left Axis');

        let yLeftDropDown = yLeftWrap.append('div').attr('id', 'yLeft-axis').classed('dropdown', true).append('select');

        let yLeftOptions = d3.select("#yLeft-axis").select("select").selectAll("option").data(['Revenues', 'Expenses', 'Undergraduates', "Coach's Salary", 'Wins']).enter().append("option");

        yLeftOptions
            .text(d => d)
            .attr("value", d => d);

        let that = this;
        yLeftDropDown
            .on("change", function() {

                d3.select('.y-axisLeft').remove();

                d3.selectAll(".leftAxisLabel").remove();

                //select the new data and create an array

                let selectedDataset = d3.event.target.value;

                let newData;
                if (selectedDataset === "Revenues") {
                    newData = allSchoolData.map(d => {
                        return +d['Revenues']
                    })
                }
                else if (selectedDataset === "Expenses") {
                    newData = allSchoolData.map(d => {
                        return +d['Expenses'];
                    })
                }
                else if (selectedDataset === "Undergraduates") {
                    newData = allSchoolData.map(d => {
                        return +d['Undergrads'];
                    })
                }
                else if (selectedDataset === "Coach's Salary") {
                    newData = allSchoolData.map(d => {
                        return +d['Coach_Salary'];
                    })
                }
                else if (selectedDataset === "Wins") {
                    newData = allSchoolData.map(d => {
                        return +d['Wins'];
                    })
                }

                //now that I have the data, I need to update the left axis

                let newDataMax = Math.max(...newData);


                let newDataScale = d3.scaleLinear()
                    .domain([0, newDataMax])
                    .range([that.height, 100]);

                yAxisLeft = d3.axisLeft(newDataScale).ticks(newData.length);

                lineSVG.append("g").call(yAxisLeft).classed("y-axisLeft", true)
                    .attr("transform", "translate(" + 75 + "," + 25 + ")");


                //now I need to update the line graph

                let newLineData = [];

                let i = 0;

                while (i<yearArray.length) {
                    let dataPoint = {
                        "x": yearArray[i],
                        "y": newData[i]
                    };
                    newLineData.push(dataPoint);
                    i += 1
                }

                let newLeftAxis = d3.line()
                    .x(function(d){return xScale(d.x)})
                    .y(function(d){return newDataScale(d.y)});

                //d3.select("#line-chart").selectAll("g").remove();

                //let newlineSVG = d3.select("#line-chart").select("svg");

                d3.select(".leftLine").remove();

                //append line for y1 axis. Make sure the translation is the same as yAxisLeft
                lineSVG.append("path")
                    .attr("d", newLeftAxis(newLineData))
                    .attr("stroke", "steelblue")
                    .attr("stroke-width", 2)
                    .attr("fill", "none")
                    .attr("transform", "translate(" + 75 + "," + 25 + ")")
                    .classed("leftLine", true);


                lineSVG.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 12)
                    .attr("x", -430)
                    .classed("leftAxisLabel", true)
                    .text(selectedDataset);

            });

        let yRightWrap = dropdownWrap.append('div').classed("yRightWrap", true);

        yRightWrap.append('div').classed('yRight-label', true)
            .append('text')
            .text('Right Axis');

        let yRightDropDown = yRightWrap.append('div').attr('id', 'yRight-axis').classed('dropdown', true).append('select');


        let yRightOptions = d3.select("#yRight-axis").select("select").selectAll("option")
            .data(['Expenses', 'Revenues', 'Undergraduates', "Coach's Salary", 'Wins'])
            .enter()
            .append("option");

        yRightOptions
            .text(d => d)
            .attr("value", d => d);

        yRightDropDown
            .on("change", function() {

                d3.select('.y-axisRight').remove();

                d3.selectAll(".rightAxisLabel").remove();

                //select the new data and create an array

                let selectedDataset = d3.event.target.value;

                let newData;
                if (selectedDataset === "Revenues") {
                    newData = allSchoolData.map(d => {
                        return +d['Revenues']
                    })
                }
                else if (selectedDataset === "Expenses") {
                    newData = allSchoolData.map(d => {
                        return +d['Expenses'];
                    })
                }
                else if (selectedDataset === "Undergraduates") {
                    newData = allSchoolData.map(d => {
                        return +d['Undergrads'];
                    })
                }
                else if (selectedDataset === "Coach's Salary") {
                    newData = allSchoolData.map(d => {
                        return +d['Coach_Salary'];
                    })
                }
                else if (selectedDataset === "Wins") {
                    newData = allSchoolData.map(d => {
                        return +d['Wins'];
                    })
                }

                //now that I have the data, I need to update the right axis

                let newDataMax = Math.max(...newData);


                let newDataScale = d3.scaleLinear()
                    .domain([0, newDataMax])
                    .range([that.height, 100]);

                yAxisRight = d3.axisRight(newDataScale).ticks(newData.length);

                lineSVG.append("g").call(yAxisRight).classed("y-axisRight", true)
                    .attr("transform", "translate(" + 820 + "," + 25 + ")");


                //now I need to update the line graph

                let newLineData = [];

                let i = 0;

                while (i<yearArray.length) {
                    let dataPoint = {
                        "x": yearArray[i],
                        "y": newData[i]
                    };
                    newLineData.push(dataPoint);
                    i += 1
                }

                let newRightAxis = d3.line()
                    .x(function(d){return xScale(d.x)})
                    .y(function(d){return newDataScale(d.y)});


                d3.select(".rightLine").remove();

                //append line for y1 axis. Make sure the translation is the same as yAxisLeft
                lineSVG.append("path")
                    .attr("d", newRightAxis(newLineData))
                    .attr("stroke", "red")
                    .attr("stroke-width", 2)
                    .attr("fill", "none")
                    .attr("transform", "translate(" + 75 + "," + 25 + ")")
                    .classed("rightLine", true);


                lineSVG.append("text")
                    .attr("transform", "rotate(-270)")
                    .attr("y", -887)
                    .attr("x", 385)
                    .classed("rightAxisLabel", true)
                    .text(selectedDataset);

            });











    }

    // functions...

}