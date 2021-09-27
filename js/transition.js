var position = [50, 100, 150, 200, 250, 300, 350]
var color = ["#909cc2", "#084887", "#f58a07", "#f9ab55", "#f7f5fb", "#75f4f4", "#e2ef70"]

var h = 420;
var w = 500;

var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

svg.selectAll("mycircles")
.data(position)
.enter()
.append("circle")
    .attr("cx", function(d){return d})
    .attr("cy", 40)
    .attr("r", 10)

// Animation: put them down one by one:
// function triggerTransitionDelay(){
d3.selectAll("circle")
    .transition()
    .duration(4000)
    .attr("cy", 300)
    .delay(function(i){return(i*10)})