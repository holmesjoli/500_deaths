var position = [50, 100, 150, 200, 250, 300, 350]
var color = ["#909cc2", "#084887", "#f58a07", "#f9ab55", "#f7f5fb", "#75f4f4", "#e2ef70"]

var jobj = d3.json("./data/test.json", function(data) {
    console.log(data);
});

var datapoints = [{"demo_indicator":"1-4 years","n":57,"pop_est":19767670,"one_in_x":346801,"demographic":"age","death_per_millisec":1.1454e-09,"millisec_per_death":873094736.8421,"death_per_sec":1.1454e-06,"sec_per_death":873094.7368,"death_per_min":0.0001,"min_per_death":14551.5789,"death_per_hour":0.0041,"hour_per_death":242.5263,"death_per_day":0.099,"day_per_death":10.1053,"color":"#03045e","log_one_in_x":12.7565},{"demo_indicator":"5-14 years","n":148,"pop_est":41084755,"one_in_x":277600,"demographic":"age","death_per_millisec":2.9739e-09,"millisec_per_death":336259459.4595,"death_per_sec":2.9739e-06,"sec_per_death":336259.4595,"death_per_min":0.0002,"min_per_death":5604.3243,"death_per_hour":0.0107,"hour_per_death":93.4054,"death_per_day":0.2569,"day_per_death":3.8919,"color":"#0077b6","log_one_in_x":12.5339},{"demo_indicator":"15-24 years","n":1372,"pop_est":43223294,"one_in_x":31504,"demographic":"age","death_per_millisec":2.7569e-08,"millisec_per_death":36272886.2974,"death_per_sec":0,"sec_per_death":36272.8863,"death_per_min":0.0017,"min_per_death":604.5481,"death_per_hour":0.0992,"hour_per_death":10.0758,"death_per_day":2.3819,"day_per_death":0.4198,"color":"#00b4d8","log_one_in_x":10.3579},{"demo_indicator":"25-34 years","n":6054,"pop_est":45030415,"one_in_x":7438,"demographic":"age","death_per_millisec":1.2165e-07,"millisec_per_death":8220416.2537,"death_per_sec":0.0001,"sec_per_death":8220.4163,"death_per_min":0.0073,"min_per_death":137.0069,"death_per_hour":0.4379,"hour_per_death":2.2834,"death_per_day":10.5104,"day_per_death":0.0951,"color":"#90e0ef","log_one_in_x":8.9144},{"demo_indicator":"35-44 years","n":15209,"pop_est":40978831,"one_in_x":2694,"demographic":"age","death_per_millisec":3.0561e-07,"millisec_per_death":3272167.7954,"death_per_sec":0.0003,"sec_per_death":3272.1678,"death_per_min":0.0183,"min_per_death":54.5361,"death_per_hour":1.1002,"hour_per_death":0.9089,"death_per_day":26.4045,"day_per_death":0.0379,"color":"#caf0f8","log_one_in_x":7.8988},{"demo_indicator":"45-54 years","n":39077,"pop_est":42072620,"one_in_x":1077,"demographic":"age","death_per_millisec":7.8521e-07,"millisec_per_death":1273547.0993,"death_per_sec":0.0008,"sec_per_death":1273.5471,"death_per_min":0.0471,"min_per_death":21.2258,"death_per_hour":2.8268,"hour_per_death":0.3538,"death_per_day":67.842,"day_per_death":0.0147,"color":"#fcecc9","log_one_in_x":6.9819},{"demo_indicator":"55-64 years","n":90527,"pop_est":41756414,"one_in_x":461,"demographic":"age","death_per_millisec":1.819e-06,"millisec_per_death":549740.9613,"death_per_sec":0.0018,"sec_per_death":549.741,"death_per_min":0.1091,"min_per_death":9.1623,"death_per_hour":6.5485,"hour_per_death":0.1527,"death_per_day":157.1649,"day_per_death":0.0064,"color":"#fb9da0","log_one_in_x":6.1334},{"demo_indicator":"65-74 years","n":150792,"pop_est":29542266,"one_in_x":196,"demographic":"age","death_per_millisec":3.03e-06,"millisec_per_death":330033.4235,"death_per_sec":0.003,"sec_per_death":330.0334,"death_per_min":0.1818,"min_per_death":5.5006,"death_per_hour":10.908,"hour_per_death":0.0917,"death_per_day":261.7917,"day_per_death":0.0038,"color":"#fa757c","log_one_in_x":5.2781},{"demo_indicator":"75-84 years","n":179399,"pop_est":14972513,"one_in_x":83,"demographic":"age","death_per_millisec":3.6048e-06,"millisec_per_death":277406.2286,"death_per_sec":0.0036,"sec_per_death":277.4062,"death_per_min":0.2163,"min_per_death":4.6234,"death_per_hour":12.9774,"hour_per_death":0.0771,"death_per_day":311.4566,"day_per_death":0.0032,"color":"#f39237","log_one_in_x":4.4188},{"demo_indicator":"85 years and over","n":189273,"pop_est":6269017,"one_in_x":33,"demographic":"age","death_per_millisec":3.8032e-06,"millisec_per_death":262934.4914,"death_per_sec":0.0038,"sec_per_death":262.9345,"death_per_min":0.2282,"min_per_death":4.3822,"death_per_hour":13.6916,"hour_per_death":0.073,"death_per_day":328.599,"day_per_death":0.003,"color":"#aa2422","log_one_in_x":3.4965}]


var delay = "";

var h = 420;
var hmargin = h - 10;
var w = 1000;

var margin = {
    top: 25,
    right: 50,
    bottom: 40,
    left: 50
};

var svg = d3.select("body")
                .append("svg")
                .attr("width", w + margin.left + margin.right)
                .attr("height", h + margin.top + margin.bottom);

    svg.selectAll("mycircles")
    .data(datapoints)
    .enter()
    .append("circle")
        .attr("cy", 40)
        .attr("cx", 50)
        .attr("r", 5)
        .attr("id", function(d){return d.demo_indicator})
        .style("fill", function(d){return d.color})

function anim() {

    svg.selectAll("circle")
        .data(datapoints)
        .transition()
        .duration(function(d) {return d.sec_per_death})
        .attr("cx", function(d) {return d.log_one_in_x*50})
        .attr("cy", hmargin)
        .style("fill", "grey")
}

anim();
