var minutesLabel = document.getElementById("minutes");
var secondsLabel = document.getElementById("seconds");
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

function buildViz(containerId) {

    var width = 960;
    var height = 450;

    var margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
    };

    // calculate dimensions without margins
    var innerWidth = width - margin.left - margin.right;
    var innerHeight = height - margin.top - margin.bottom;

    var color = ["#78698c", "#5c8184", "#74947d", "#8ba776","#b0bb7e", "#fee085", "#fec172", "#fda572", "#f69479", "#f58566"]

    var svg = d3
        .select(containerId)
        .append('svg')
        .attr('height', height)
        .attr('width', width);

    // create inner group element
    var g = svg
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    d3.json('./data/age_data.json', function(error, data) {
        // handle read errors
        if (error) {
            console.error('failed to read data');
            return;
        }

        console.log('data', data);

        // scales
        var x = d3
            .scaleBand()
            .domain(
                data.map(function(d) {
                    return d.demo_indicator;
                })
            )
            .range([0, innerWidth]);

        var y = d3
            .scaleLinear()
            .domain([innerHeight, 0])
            .range([innerHeight, 0]);

        var colorScale = d3
            .scaleOrdinal()
            .domain(data.map(function(d) {
                return d.demo_indicator;
            }))
            .range(color);

        console.log(y.domain(), y.range());

        g.selectAll("mycircles")
        .data(data)
        .enter()
        .append("circle")
            .attr("cy", 20)
            .attr("cx", 15)
            .attr("r", 10)
            .attr("id", function(d){return d.demo_indicator})
            .style("fill", function(d) {
                return colorScale(d.demo_indicator);
            })
            .style("stroke", function(d) {
                return colorScale(d.demo_indicator);
            })
            .style("stroke-opacity", .7)
            .style("stroke-width", 3);

        g.selectAll("circle")
            .data(data)
            .transition()
            .duration(function(d) {return d.millisec_per_death})
            .attr("cx", function(d) {return x(d.demo_indicator)})
            .attr("cy", innerHeight)
            .style("fill", "grey")
            .remove();

        var yAxis = d3.axisLeft(y).ticks(0);

        g
            .append('g')
            .attr('class', 'y-axis')
            .call(yAxis);

        var xAxis = d3.axisBottom(x);

        g
            .append('g')
            .attr('class', 'x-axis')
            .attr('transform', 'translate(0,' + innerHeight + ')')
            .call(xAxis);

        //glow
        //Container for the gradients
        var defs = svg.append("defs");

        //Filter for the outside glow
        var filter = defs.append("filter")
            .attr("id","glow");
        filter.append("feGaussianBlur")
            .attr("stdDeviation","1")
            .attr("result","coloredBlur");
        var feMerge = filter.append("feMerge");
        feMerge.append("feMergeNode")
            .attr("in","coloredBlur");
        feMerge.append("feMergeNode")
            .attr("in","SourceGraphic");

        //Apply to your element(s)
        d3.selectAll("circle")
        .style("filter", "url(#glow)");

        // Add one dot in the legend for each name.
        svg.selectAll("legend")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", innerWidth - 50)
        .attr("cy", function(d,i){ return 50 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("r", 7)
        .style("fill", function(d){ return colorScale(d.demo_indicator)})
        .style("stroke", function(d) {
            return colorScale(d.demo_indicator);
        })
        .style("stroke-opacity", .7);

        // Add one dot in the legend for each name.
        svg.selectAll("mylabels")
        .data(data)
        .enter()
        .append("text")
        .attr("x", innerWidth - 50 + 20)
        .attr("y", function(d,i){ return 50 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", "white")
        .text(function(d){ return d.demo_indicator})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle");

    });
}

buildViz('#viz');
