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

    var svg = d3
    .select(containerId)
    .append('svg')
    .attr('height', height)
    .attr('width', width);

    d3.json('./data/age_data.json', function(error, data) {
        // handle read errors
        if (error) {
            console.error('failed to read data');
            return;
        }

        console.log('data', data);

        svg.selectAll("mycircles")
        .data(data)
        .enter()
        .append("circle")
            .attr("cy", 20)
            .attr("cx", 10)
            .attr("r", 7)
            .attr("id", function(d){return d.demo_indicator})
            .style("fill", function(d){return d.color})

        svg.selectAll("circle")
            .data(data)
            .transition()
            .duration(function(d) {return d.millisec_per_death/100})
            .attr("cx", function(d) {return d.log_one_in_x*50})
            .attr("cy", innerHeight)
            .style("fill", "grey")
    });
}

buildViz('#viz');
