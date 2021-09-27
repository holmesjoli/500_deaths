var position = [50, 100, 150, 200, 250, 300, 350]
var color = ["#909cc2", "#084887", "#f58a07", "#f9ab55", "#f7f5fb", "#75f4f4", "#e2ef70"]

var datapoints = [
            {"x":50, "color":"#909cc2"},
            {"x":100, "color":"#084887"},
            {"x":150, "color":"#f58a07"},
            {"x":200, "color":"#f9ab55"},
            {"x":250, "color":"#f7f5fb"},
            {"x":300, "color":"#75f4f4"},
            {"x":350, "color":"#e2ef70"}];

var data = d3.json("./data/age_data.json");

var delay = "";

var h = 420;
var hmargin = h - 10;
var w = 500;

var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

svg.selectAll("mycircles")
.data(datapoints)
.enter()
.append("circle")
    .attr("cy", 40)
    .attr("cx", 50)
    .attr("r", 10)
    .style("fill", function(d){return d.color})

svg.selectAll("circle")
    .data(datapoints)
    .transition()
    .delay(500)
    .duration(2500)
    .attr("cx", function(d) {
        return d.x})
    .attr("cy", hmargin)
    // .attr("height", function(d) {
    // return c1bh - yScale(d.cases);

    
// Animation: put them down one by one:
// function triggerTransitionDelay(){
d3.selectAll("circle")
    .data(datapoints)
    .enter()
    .transition()
    .duration(2000)
    .attr("cy", function(d){return d.position})
    .attr("cx", function(d){return d})
    .delay(function(i){return(i*10)})
    .transition() // First fade to green.
    .style("fill", "grey")
//   .transition() // Then red.
//     .style("fill", "red")
//   .transition() // Wait one second. Then brown, and remove.
//     .delay(1000)
//     .style("fill", "brown")
//     .remove();