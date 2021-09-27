var position = [50, 100, 150, 200, 250, 300, 350]
var color = ["#909cc2", "#084887", "#f58a07", "#f9ab55", "#f7f5fb", "#75f4f4", "#e2ef70"]

var datapoints = [{"demo_indicator":"1-4 years","n":57,"pop_est":19767670,"one_in_x":346801,"demographic":"age","death_per_min":0.0001,"death_per_hour":0.0041,"death_per_day":0.099,"min_per_death":14551.5789,"hour_per_death":242.5263,"day_per_death":10.1053,"color":"#03045e","log_one_in_x":12.7565},{"demo_indicator":"5-14 years","n":148,"pop_est":41084755,"one_in_x":277600,"demographic":"age","death_per_min":0.0002,"death_per_hour":0.0107,"death_per_day":0.2569,"min_per_death":5604.3243,"hour_per_death":93.4054,"day_per_death":3.8919,"color":"#0077b6","log_one_in_x":12.5339},{"demo_indicator":"15-24 years","n":1372,"pop_est":43223294,"one_in_x":31504,"demographic":"age","death_per_min":0.0017,"death_per_hour":0.0992,"death_per_day":2.3819,"min_per_death":604.5481,"hour_per_death":10.0758,"day_per_death":0.4198,"color":"#00b4d8","log_one_in_x":10.3579},{"demo_indicator":"25-34 years","n":6054,"pop_est":45030415,"one_in_x":7438,"demographic":"age","death_per_min":0.0073,"death_per_hour":0.4379,"death_per_day":10.5104,"min_per_death":137.0069,"hour_per_death":2.2834,"day_per_death":0.0951,"color":"#90e0ef","log_one_in_x":8.9144},{"demo_indicator":"35-44 years","n":15209,"pop_est":40978831,"one_in_x":2694,"demographic":"age","death_per_min":0.0183,"death_per_hour":1.1002,"death_per_day":26.4045,"min_per_death":54.5361,"hour_per_death":0.9089,"day_per_death":0.0379,"color":"#caf0f8","log_one_in_x":7.8988},{"demo_indicator":"45-54 years","n":39077,"pop_est":42072620,"one_in_x":1077,"demographic":"age","death_per_min":0.0471,"death_per_hour":2.8268,"death_per_day":67.842,"min_per_death":21.2258,"hour_per_death":0.3538,"day_per_death":0.0147,"color":"#fcecc9","log_one_in_x":6.9819},{"demo_indicator":"55-64 years","n":90527,"pop_est":41756414,"one_in_x":461,"demographic":"age","death_per_min":0.1091,"death_per_hour":6.5485,"death_per_day":157.1649,"min_per_death":9.1623,"hour_per_death":0.1527,"day_per_death":0.0064,"color":"#fb9da0","log_one_in_x":6.1334},{"demo_indicator":"65-74 years","n":150792,"pop_est":29542266,"one_in_x":196,"demographic":"age","death_per_min":0.1818,"death_per_hour":10.908,"death_per_day":261.7917,"min_per_death":5.5006,"hour_per_death":0.0917,"day_per_death":0.0038,"color":"#fa757c","log_one_in_x":5.2781},{"demo_indicator":"75-84 years","n":179399,"pop_est":14972513,"one_in_x":83,"demographic":"age","death_per_min":0.2163,"death_per_hour":12.9774,"death_per_day":311.4566,"min_per_death":4.6234,"hour_per_death":0.0771,"day_per_death":0.0032,"color":"#f39237","log_one_in_x":4.4188},{"demo_indicator":"85 years and over","n":189273,"pop_est":6269017,"one_in_x":33,"demographic":"age","death_per_min":0.2282,"death_per_hour":13.6916,"death_per_day":328.599,"min_per_death":4.3822,"hour_per_death":0.073,"day_per_death":0.003,"color":"#aa2422","log_one_in_x":3.4965}]

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
        .delay(500)
        .duration(function(d) {return d.death_per_day*1000})
        .attr("cx", function(d) {return d.log_one_in_x*50})
        .attr("cy", hmargin)
        .style("fill", "grey")
        // .remove();
}

anim();
