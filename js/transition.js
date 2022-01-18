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
    var width = height*2;

    var margin = {
        top: 25,
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

    var dims = dimensions(height = window.innerHeight*.75);

    const margin = {left: 10, right: 10, top: 10, bottom: 10};

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

        var xEnd = dims.innerWidth - 15;

        var x2 = d3.scaleLinear()
                .domain([
                    0,
                    d3.max(data, function(d) {
                        return d.id;
                    })
                ])
                .range([xEnd, 100]);

        var yStart = margin.top;
        var y2 = d3
            .scaleBand()
            .domain(data.map(function(d) {
                return d.demo_indicator;
            }))
            .range([dims.innerHeight, yStart]);

        var legenddata = [{"demo_indicator": "0-17"}, {"demo_indicator":"18-29"},{"demo_indicator":"30-49"},{"demo_indicator":"50-64"},{"demo_indicator":"65-74"},{"demo_indicator":"75+"}];

        console.log(legenddata);

        var colorScale = d3
            .scaleOrdinal()
            .domain(data.map(function(d) {
                return d.demo_indicator;
            }))
            .range(color);

        var colorScalelegend = d3
            .scaleOrdinal()
            .domain(legenddata.map(function(d) {
                return d.demo_indicator;
            }))
            .range(color);

        g.selectAll("mycircles")
        .data(data)
        .enter()
        .append("circle")
            .attr("cx", 90)
            .attr("cy", function(d) {return y2(d.demo_indicator) + 15})
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
            .attr("cx", function(d) {return x2(d.id)})
            .attr("cy", function(d) {return y2(d.demo_indicator) + 15})
            .style("fill", "grey");

        g.selectAll("names")
            .data(data)
            .enter()
            .append("text")
            .style("fill", function(d) {return colorScale(d.demo_indicator)})
            .style('opacity', 0)
            .style('font-size', 20) 
            .transition()
            .delay(function(d) {return d.delay2 -4000;})
            .duration(10000)
            .attr("x", dims.innerWidth/3)
            .attr("y", dims.textHeight)
            .text(function(d){return d.name_age;})
            .style('opacity', 1)
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
            .remove();

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
        // .data(legenddata)
        // .enter()
        // .append("circle")
        // .attr("cx", 90)
        // .attr("cy", function(d) {return y2(d.demo_indicator) + 15}) // 100 is where the first dot appears. 25 is the distance between dots
        // .attr("r", 7)
        // .style("fill", function(d) { return colorScalelegend(d.demo_indicator)})
        // .style("stroke", function(d) {
        //     return colorScale(d.demo_indicator);
        // })
        // .style("stroke-opacity", .7);

      //  Add one dot in the legend for each name.
        svg.selectAll("mylabels")
        .data(legenddata)
        .enter()
        .append("text")
        .attr("x", 30)
        .attr("y", function(d){return y2(d.demo_indicator) + 15})
        .style("fill", "white")
        .text(function(d){return d.demo_indicator;})
        .attr("text-anchor", "right")
        .style("alignment-baseline", "middle");

        // g
        // .append("text")
        // .attr("class", "count-title") 
        // .attr("x", dims.innerWidth - 30)
        // .attr("y", 100)
        // .style("fill", "white")
        // .text("# of deaths");

        // g.selectAll("mycount")
        // .data(legenddata)
        // .enter()
        // .append("text")
        //     .attr("class", "count")
        //     .attr("x", dims.innerWidth)
        //     .attr("y", function(d) {return y2(d.demo_indicator) + 20})
        //     .style("fill", "white")
        //     .text("0");

        // g.selectAll(".count")
        //     .data(data)
        //     .transition()
        //     .delay(function(d) {return d.delay2;})
        //     .duration(function(d) {return d.millisec_per_deaths*2})
        //     .text(function(d) {return d.id2})
        //     .style('opacity', 1)
        //     .attr("text-anchor", "left")
        //     .style("alignment-baseline", "middle")
        //     .remove();

        svg
        .append('line')
        .attr("x1", 75)
        .attr("x2", 75)
        .attr("y1", yStart)
        .attr("y2", dims.innerHeight)
        .attr("stroke", "white")
        .attr("stroke-opacity", 1);

        svg
        .append('line')
        .attr("x1", xEnd)
        .attr("x2", xEnd)
        .attr("y1", yStart)
        .attr("y2", dims.innerHeight)
        .attr("stroke", "white")
        .attr("stroke-opacity", 1);
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
