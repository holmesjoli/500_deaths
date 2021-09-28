// function binDeaths(containerId) {

//     var svg = d3
//     .select(containerId)
//     .append('svg')
//     .attr('height', height)
//     .attr('width', width);


//     var bin1 = d3.bin()
//     var values1 = distribution("Uniform");
//     var buckets1 = bin1(values1);

//     console.log("values", values1);

// };

function buildViz(containerId) {

    var width = 960;
    var height = 500;

    var margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
    };

    // calculate dimensions without margins
    var innerWidth = width - margin.left - margin.right;
    var innerHeight = height - margin.top - margin.bottom;

    var color = ["#03045e", "#0077b6", "#00b4d8", "#90e0ef", "#caf0f8", 
    "#fcecc9", "#fb9da0", "#fa757c", "#f39237", "#aa2422"]

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
            .attr("cx", 10)
            .attr("r", 4)
            .attr("id", function(d){return d.demo_indicator})
            .style("fill", function(d) {
                return colorScale(d.demo_indicator);
            });

        g.selectAll("circle")
            .data(data)
            .transition()
            .duration(function(d) {return d.millisec_per_death})
            .attr("cx", function(d) {return x(d.demo_indicator)})
            .attr("cy", innerHeight)
            .style("fill", "grey");

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
    });
}

buildViz('#viz');
