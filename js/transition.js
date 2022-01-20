function buildTimer() {
    var totalSeconds = 0;
    
    function pad(val) {
        var valString = val + "";
        if (valString.length < 2) {
            return "0" + valString;
        } else {
            return valString;
        }
    };
    
    function setTime() {
        ++totalSeconds;
        document.getElementById('seconds').innerHTML = pad(totalSeconds % 60);
        document.getElementById('minutes').innerHTML = pad(parseInt(totalSeconds / 60));
    };
    
    setInterval(setTime, 1000);
};

function dimensions (height = 440) {
    var height = height;
    var width = height*1.70;

    var margin = {
        top: 10,
        right: 50,
        bottom: 5,
        left: 0
    };

    // calculate dimensions without margins
    var innerWidth = width - margin.left - margin.right;
    var innerHeight = height - margin.top - margin.bottom;
    var vizHeight = innerHeight*(2/3);
    var textHeight = innerHeight*(1/6);

    return {
        width: width,
        height: height,
        innerWidth: innerWidth,
        innerHeight: innerHeight,
        vizHeight: vizHeight,
        textHeight: textHeight,
        margin: margin};
}

//Title Unique Array
//Description the unique value of a variable from the data
//Return array
function unique_array(data, variable) {

    const u = [];

    data.forEach(function(d) {
        if (u.indexOf(d[variable]) === -1) {
            u.push(d[variable]);
        }
    });

    return u;
};

function animData(containerId, color) {

    var dims = dimensions(height = window.innerHeight*.70);

    const margin = {left: 10, right: 35, top: 30, bottom: 10};

    var svg = d3
        .select(containerId)
        .append('svg')
        .attr('height', dims.height)
        .attr('width', dims.width);

    // create inner group element
    var g = svg
        .append('g');

    d3.json('data/age_deaths_not_summarized.json', function(error, data) {
        if (error) {
            console.error('failed to read data');
            return;
        }

        console.log('data', data);

        var xEnd = dims.innerWidth - margin.right;

        var xScale = d3.scaleLinear()
                .domain([
                    0,
                    d3.max(data, function(d) {
                        return d.id;
                    })
                ])
                .range([xEnd, 100]);

        var yStart = dims.margin.top + 10;

        var yScale = d3
            .scaleBand()
            .domain(data.map(function(d) {
                return d.demo_indicator;
            }))
            .range([dims.innerHeight, yStart]);

        var legendData = [{"demo_indicator": "0-17"}, {"demo_indicator":"18-29"},{"demo_indicator":"30-49"},{"demo_indicator":"50-64"},{"demo_indicator":"65-74"},{"demo_indicator":"75+"}];

        console.log(legendData);

        var colorScale = d3
            .scaleOrdinal()
            .domain(data.map(function(d) {
                return d.demo_indicator;
            }))
            .range(color);

        var colorScalelegend = d3
            .scaleOrdinal()
            .domain(legendData.map(function(d) {
                return d.demo_indicator;
            }))
            .range(color);

        g.selectAll("mycircles")
        .data(data)
        .enter()
        .append("circle")
            .attr("cx", 90)
            .attr("cy", function(d) {return yScale(d.demo_indicator) + 15})
            .attr("r", 10)
            .attr("id", function(d) {return d.demo_indicator})
            .style("fill", function(d) {return colorScalelegend(d.demo_indicator)})
            .style("stroke", function(d) {
                return colorScale(d.demo_indicator)
            })
            .style("stroke-opacity", .7)
            .style("stroke-width", 3);

        g.selectAll("circle")
            .data(data)
            .transition()
            .delay(function(d) {return d.delay;})
            .duration(function(d) {return d.millisec_per_death})
            .attr("cx", function(d) {return xScale(d.id)})
            .attr("cy", function(d) {return yScale(d.demo_indicator) + 15})
            .style("fill", "grey");

        // //glow
        // //Container for the gradients
        // var defs = svg.append("defs");

        //Filter for the outside glow
        // var filter = defs.append("filter")
        //     .attr("id","glow");
        // filter.append("feGaussianBlur")
        //     .attr("stdDeviation",".5")
        //     .attr("result","coloredBlur");
        // var feMerge = filter.append("feMerge");
        // feMerge.append("feMergeNode")
        //     .attr("in","coloredBlur");
        // feMerge.append("feMergeNode")
        //     .attr("in","SourceGraphic");

        // //Apply to your element(s)
        // d3.selectAll("circle")
        // .style("filter", "url(#glow)");

        // Add one dot in the legend for each name.
        // svg.selectAll("legend")
        // .data(legendData)
        // .enter()
        // .append("circle")
        // .attr("cx", 90)
        // .attr("cy", function(d) {return yScale(d.demo_indicator) + 15}) // 100 is where the first dot appears. 25 is the distance between dots
        // .attr("r", 7)
        // .style("fill", function(d) { return colorScalelegend(d.demo_indicator)})
        // .style("stroke", function(d) {
        //     return colorScale(d.demo_indicator);
        // })
        // .style("stroke-opacity", .7);

        // Labels
        svg.selectAll("mylabels")
            .data(legendData)
            .enter()
            .append("text")
            .attr("x", 20)
            .attr("y", function(d){return yScale(d.demo_indicator) + 15;})
            .style("fill", "white")
            .text(function(d){return d.demo_indicator;})
            .attr("text-anchor", "right")
            .style("alignment-baseline", "middle");

        svg
            .append('line')
            .attr("x1", 70)
            .attr("x2", 70)
            .attr("y1", yStart - 10)
            .attr("y2", dims.innerHeight - 25)
            .attr("stroke", "white")
            .attr("stroke-opacity", 1);

        svg
            .append('line')
            .attr("x1", xEnd)
            .attr("x2", xEnd)
            .attr("y1", yStart - 10)
            .attr("y2", dims.innerHeight - 25)
            .attr("stroke", "white")
            .attr("stroke-opacity", 1);

        // Hourly tally
        // g
        //     .append("text")
        //     .attr("class", "count-title") 
        //     .attr("x", dims.innerWidth - 30)
        //     .attr("y", dims.margin.top)
        //     .style("fill", "white")
        //     .attr("text-anchor", "center")
        //     .style("alignment-baseline", "middle")
        //     .text("# of deaths");

        // g.selectAll("mycount")
        //     .data(legendData)
        //     .enter()
        //     .append("text")
        //         .attr("class", "count")
        //         .attr("x", dims.innerWidth + 5)
        //         .attr("y", function(d) {return yScale(d.demo_indicator) + 20})
        //         .style("fill", "white")
        //         .text("0");

        // g.selectAll("mycount")
        //     .data(data)
        //     .attr("opacity", 1)
        //     .transition()
        //     // .transition()
        //     // .delay(function(d) {return d.delay;})
        //     .duration(function(d) {return d.millisec_per_death + d.delay;})
        //     .attr("opacity", 0)
        //     .remove()
        //     // .transition()
        //     // .style("opacity", 1)
        //     // .text(function(d) {return d.id2})
        //     ;

        // g.selectAll(".count")
        //     .data(data)
        //     .transition()
        //     .delay(1000)
        //     .duration(function(d) {return d.millisec_per_death})
        //     .style('opacity', 1)
        //     .attr("text-anchor", "left")
        //     .style("alignment-baseline", "middle")
        //     .text(function(d) {return d.id2});
    });
}

function buildViz(containerId) {

    //https://coolors.co/978ba7-6cb2ab-9dab5f-fdd55d-f48b01-f37653
    var color = ["#978ba7", "#6cb2ab", "#9dab5f", "#fdd55d", "#f48b01", "#f37653"];

    animData(containerId, color);
}

// Set the delay to 7 seconds + the animation-delay of the last text transition. Right now that is 29. Then convert to milliseconds.

var delay = 32000;
// var delay = 0;

setTimeout(function() {
    buildTimer();
    buildViz("#viz");
}, delay);
