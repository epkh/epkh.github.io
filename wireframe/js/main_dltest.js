// Danya Littlefield, Phoebe Holtzman, Emily Long
// js for pa housing need
// Our D3 code will go here.
var margin = {top: 30, right: 20, bottom: 30, left: 50},
    width = 400 - margin.left - margin.right,
    height = 220 - margin.top - margin.bottom;

var projection = d3.geoAlbers()
    .scale(3500)
    .rotate( [77.8367,0] )
    .center( [0, 40.8766] )
    .translate([width / 2, height / 2]);

var path = d3.geoPath()
    .projection(projection);

var svg = d3.select("#map1").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("float", "center");

var svg2 = d3.select("#map2").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("float", "center");

var color = d3.scaleThreshold()
    .domain([10, 20, 30, 40, 50])
    .range(['#feedde','#fdbe85','#fd8d3c','#e6550d', '#a63603']);

var colorh = d3.scaleThreshold()
    .domain([0, 5, 10, 15, 20])
    .range(['#eff3ff','#bdd7e7','#6baed6','#3182bd', '#08519c']);

// Queue up datasets using d3 Queue. prevents errors from loading
d3.queue()
    .defer(d3.json, "pumas_pa16.json") // Load US PUMAs geography data
    .defer(d3.json, "counties16.json")
    .defer(d3.csv, "data/r15_poverty.csv")
    .defer(d3.csv, "data/h15_poverty.csv")
    .await(ready); 

      // Run 'ready' when JSONs are loaded
        // Ready Function, runs when data is loaded
function ready(error, pumas_pa16, counties16, r15_poverty, h15_poverty) {
    if (error) throw error;

    var percentpovr = {}; // Create empty object for holding dataset
    r15_poverty.forEach(function(d) {
    percentpovr[d.id] = +d.PCTpov; 
    });

    var percentpovh = {};
    h15_poverty.forEach(function(d) {
    percentpovh[d.id] = +d.PCTpov; 
    });

    var povmaprenters = d3.select("#map1")
        .append("svg")
        .attr("class", "pumas")
        .selectAll("path")
            .data(topojson.feature(pumas_pa16, pumas_pa16.objects.pumas_pa_only).features) // Bind TopoJSON data elements
        .enter().append("path")
            .attr("d", path)
          .style("fill", function(d) { 
            if (percentpovr[d.properties.id] > 0) {
                return color(percentpovr[d.properties.id]);
                }   else {
                return "#FFF";
                } 
            })
          .on("mouseover", function(d){
            return tooltip.style("visibility", "visible").text("PUMA ID: " + d.properties.id + "\n"+ "% Below Poverty:" + Math.round(percentpovr[d.properties.id]) +"%");
          })
          .on("mousemove", function(d){
            return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px").text("PUMA ID: " + d.properties.id + "\n" + "% Below Poverty: " + Math.round(percentpovr[d.properties.id]) + "%");
          })
          .on("mouseout", function(d){
            return tooltip.style("visibility", "hidden");
    });

    var povmapowners = d3.select("#map2")
        .append("svg")
        .attr("class", "pumas")
        .selectAll("path")
            .data(topojson.feature(pumas_pa16, pumas_pa16.objects.pumas_pa_only).features) // Bind TopoJSON data elements
        .enter().append("path")
            .attr("d", path)
          .style("fill", function(d) { 
            if (percentpovh[d.properties.id] > 0) {
                return colorh(percentpovh[d.properties.id]);
                }   else {
                return "#FFF";
                } 
            })
          .on("mouseover", function(d){
            return tooltip.style("visibility", "visible").text("PUMA ID: " + d.properties.id + "\n"+ "% Below Poverty:" + Math.round(percentpovh[d.properties.id]) +"%");
          })
          .on("mousemove", function(d){
            return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px").text("PUMA ID: " + d.properties.id + "\n" + "% Below Poverty: " + Math.round(percentpovh[d.properties.id]) + "%");
          })
          .on("mouseout", function(d){
            return tooltip.style("visibility", "hidden");
    });

      // create county outlines
     var countylines = d3.select("#map2")
     	svg.append("path")
            .datum(topojson.mesh(counties16, counties16.objects.counties, function(a, b) { return a.id !== b.id; }))
            .attr("class", "counties")
            .attr("d", path);
    
    } //end of ready function

var tooltip = d3.select("#map1").append("div")
    .style("background-color", "White")
    .style("padding", "5px")
    .style("width", "100px")
    .style("position", "absolute")
    .style("border-radius", "8px")
    .style("font-family", "'Open Sans', sans-serif")
    .style("font-size", "12px")
    .style("z-index", "10")
    .style("visibility", "hidden");