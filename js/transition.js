var position = [50, 100, 150, 200, 250, 300, 350]
var color = ["#909cc2", "#084887", "#f58a07", "#f9ab55", "#f7f5fb", "#75f4f4", "#e2ef70"]

var datapoints = [{"demo_indicator":"1-4 years","n":57,"pop_est":19767670,"one_in_x":346801,"log_one_in_x":12.7565,"color":"#03045e"},{"demo_indicator":"5-14 years","n":148,"pop_est":41084755,"one_in_x":277600,"log_one_in_x":12.5339,"color":"#0077b6"},{"demo_indicator":"15-24 years","n":1372,"pop_est":43223294,"one_in_x":31504,"log_one_in_x":10.3579,"color":"#00b4d8"},{"demo_indicator":"25-34 years","n":6054,"pop_est":45030415,"one_in_x":7438,"log_one_in_x":8.9144,"color":"#90e0ef"},{"demo_indicator":"35-44 years","n":15209,"pop_est":40978831,"one_in_x":2694,"log_one_in_x":7.8988,"color":"#caf0f8"},{"demo_indicator":"45-54 years","n":39077,"pop_est":42072620,"one_in_x":1077,"log_one_in_x":6.9819,"color":"#fcecc9"},{"demo_indicator":"55-64 years","n":90527,"pop_est":41756414,"one_in_x":461,"log_one_in_x":6.1334,"color":"#fb9da0"},{"demo_indicator":"65-74 years","n":150792,"pop_est":29542266,"one_in_x":196,"log_one_in_x":5.2781,"color":"#fa757c"},{"demo_indicator":"75-84 years","n":179399,"pop_est":14972513,"one_in_x":83,"log_one_in_x":4.4188,"color":"#f39237"},{"demo_indicator":"85 years and over","n":189273,"pop_est":6269017,"one_in_x":33,"log_one_in_x":3.4965,"color":"#aa2422"}]

var delay = "";

var h = 420;
var hmargin = h - 10;
var w = 1000;

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
    .attr("cx", function(d) {return d.log_one_in_x*50})
    .attr("cy", hmargin)
    .style("fill", "grey")
    
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