// Danya Littlefield, Phoebe Holtzman, Emily Long
// js for pa housing need
// THIS IS OUR SETUP
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

var svg = d3.select("#mapRpov").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

var svg2 = d3.select("#mapHpov").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

var color = d3.scaleThreshold()
    .domain([10, 20, 30, 40, 50])
    .range(['#feedde','#fdbe85','#fd8d3c','#e6550d', '#a63603']);

var colorh = d3.scaleThreshold()
    .domain([0, 5, 10, 15, 20])
    .range(['#eff3ff','#bdd7e7','#6baed6','#3182bd', '#08519c']);

// INITIAL QUEUE //
// Queue up datasets using d3 Queue. Prevents errors from loading
d3.queue()
    .defer(d3.json, "pumas_pa16.json") // Load US PUMAs geography data
    .defer(d3.json, "counties16.json")
    .defer(d3.csv, "data/r15_poverty.csv")
    .defer(d3.csv, "data/h15_poverty.csv")
    .await(update2015); 

// UPDATE DATA FUNCTIONS //
      // Run 'ready' when JSONs are loaded
        // Update Function, runs when data is loaded
function update2015(error, pumas_pa16, counties16, r15_poverty, h15_poverty) {
    if (error) throw error;

    var percentpovr = {}; // Create empty object for holding dataset
    r15_poverty.forEach(function(d) {
    percentpovr[d.id] = +d.PCTpov; 
    });

    var percentpovh = {};
    h15_poverty.forEach(function(d) {
    percentpovh[d.id] = +d.PCTpov; 
    });

    d3.select("#mapRpov")
      .append("svg")
        .attr("class", "pumas")
        .selectAll("path")
            .data(topojson.feature(pumas_pa16, pumas_pa16.objects.pumas_pa_only).features) // Bind TopoJSON data elements
        .enter().append("path")
            .attr("d", path)
        .style("fill", function(d) { 
            if (percentpovr[d.properties.id] > 0) {
            return color(percentpovr[d.properties.id]);
            } else {
            return "Green";
          }  
        })
      .on("mouseover", function(d){
        return tooltipR.style("visibility", "visible").text("PUMA ID: " + d.properties.id + "\n"+ "% Below Poverty:" + Math.round(percentpovr[d.properties.id]) +"%");
      })
      .on("mousemove", function(d){
        return tooltipR.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px").text("PUMA ID: " + d.properties.id + "\n" + "% Below Poverty: " + Math.round(percentpovr[d.properties.id]) + "%");
      })
      .on("mouseout", function(d){
        return tooltipR.style("visibility", "hidden");
      });

    d3.select("#mapHpov")
        .append("svg")
        .attr("class", "pumas")
        .selectAll("path")
            .data(topojson.feature(pumas_pa16, pumas_pa16.objects.pumas_pa_only).features) // Bind TopoJSON data elements
        .enter().append("path")
            .attr("d", path)
        .style("fill", function(d) { 
            if (percentpovh[d.properties.id] > 0) {
            return colorh(percentpovh[d.properties.id]);
            } else {
            return "FFF";
            } 
        })
      .on("mouseover", function(d){
        return tooltipH.style("visibility", "visible").text("PUMA ID: " + d.properties.id + "\n"+ "% Below Poverty:" + Math.round(percentpovh[d.properties.id]) +"%");
      })
      .on("mousemove", function(d){
        return tooltipH.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px").text("PUMA ID: " + d.properties.id + "\n" + "% Below Poverty: " + Math.round(percentpovh[d.properties.id]) + "%");
      })
      .on("mouseout", function(d){
        return tooltipH.style("visibility", "hidden");
      });


    // // create county outlines
    //     svg2.append("path")
    //         .attr("class", "counties")
    //         .datum(topojson.mesh(counties16, counties16.objects.counties, function(a, b) { return a.id !== b.id; }))
    //         .attr("d", path);

    // create county outlines
    d3.select("#mapRpov").append("svg")
            .attr("class", "counties")
            .selectAll("path")
              .data(topojson.feature(counties16, counties16.objects.counties).features)
            .enter().append("path")
            .attr("d", path);

} 

//end of update function

// TOOLTIP CREATION //

var tooltipR = d3.select("#mapRpov")
  .style("background-color", "White")
  .style("padding", "5px")
  .style("width", "100px")
  .style("position", "absolute")
  .style("border-radius", "8px")
  .style("font-family", "'Open Sans', sans-serif")
  .style("font-size", "12px")
  .style("z-index", "10")
  .style("visibility", "hidden");  

var tooltipH = d3.select("#mapHpov")
  .style("background-color", "White")
  .style("padding", "5px")
  .style("width", "100px")
  .style("position", "absolute")
  .style("border-radius", "8px")
  .style("font-family", "'Open Sans', sans-serif")
  .style("font-size", "12px")
  .style("z-index", "10")
  .style("visibility", "hidden"); 