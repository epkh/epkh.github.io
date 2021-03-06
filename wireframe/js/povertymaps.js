// Danya Littlefield, Phoebe Holtzman, Emily Long
// js for pa housing need
// THIS IS OUR SETUP
var margin = {top: 30, right: 20, bottom: 30, left: 50},
    width = 350 - margin.left - margin.right,
    height = 220 - margin.top - margin.bottom;

var projection = d3.geoAlbers()
    .scale(3500)
    .rotate( [77.8367,0] )
    .center( [0, 40.8766] )
    .translate([width / 2, height / 2]);

var path = d3.geoPath()
    .projection(projection);

// Slider 

var inputValue = null;

var year = ["2005","2010","2015"];    

// var svg = d3.select("#mapRpov").append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom);

// var svg2 = d3.select("#mapHpov").append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom);

var color = d3.scaleThreshold()
    .domain([10, 20, 30, 40, 55])
    .range(['#ffeee6','#ffb999','#ff854d','#ff621a','#cc4100']);

var colorh = d3.scaleThreshold()
    .domain([5, 10, 15, 20, 30])
    .range(['#eff3ff','#bdd7e7','#6baed6','#3182bd','#08519c']);

// INITIAL QUEUE //
// Queue up datasets using d3 Queue. Prevents errors from loading
d3.queue()
    .defer(d3.json, "pa05_poverty.json") // Load US PUMAs geography data
    .defer(d3.json, "counties16.json")
    .defer(d3.json, "pa_cities.json")
    .await(loadpage); 


// UPDATE DATA FUNCTIONS //
// Run 'ready' when JSONs are loaded
// Update Function, runs when data is loaded
function loadpage(error, pa05_poverty, counties16, pa_cities) { // initial creation
    if (error) throw error;
    console.log("update 2005 running");

    d3.selectAll("path").remove();

    d3.select("#mapRpov").append("svg")
        .selectAll("path")
            .data(topojson.feature(pa05_poverty, pa05_poverty.objects.pumas_pa_only05).features) // Bind TopoJSON data elements
        .enter().append("path")
            .attr("d", path)
        .attr("class", "renters")
        .style("fill", function(d) { 
            if (d.properties.r05_pov > 0) {
            return color(d.properties.r05_pov);
            } else {
            return "#FFF";
          }  
        })
      // .on("mouseover", function(d){
      //   return tooltipR.style("visibility", "visible").text("PUMA ID: " + d.properties.id + "\n"+ "% Below Poverty:" + Math.round(percentpovr[d.properties.id]) +"%");
      // })
      // .on("mousemove", function(d){
      //   return tooltipR.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px").text("PUMA ID: " + d.properties.id + "\n" + "% Below Poverty: " + Math.round(percentpovr[d.properties.id]) + "%");
      // })
      // .on("mouseout", function(d){
      //   return tooltipR.style("visibility", "hidden");
      // })
      ;

    d3.select("#mapHpov").append("svg")
      .selectAll("path")
          .data(topojson.feature(pa05_poverty, pa05_poverty.objects.pumas_pa_only05).features) // Bind TopoJSON data elements
      .enter().append("path")
          .attr("d", path)
      .attr("class", "owners")
      .style("fill", function(d) { 
          if (d.properties.h05_pov > 0) {
          return colorh(d.properties.h05_pov);
          } else {
          return "#FFF";
          } 
      })
      .on("mouseover", function(d){
        return tooltipH.style("visibility", "visible").text("PUMA ID: " + d.properties.id + "\n"+ "% Below Poverty:" + Math.round(d.properties.h05_pov) +"%");
      })
      .on("mousemove", function(d){
        return tooltipH.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px").text("PUMA ID: " + d.properties.id + "\n" + "% Below Poverty: " + Math.round(d.properties.h05_pov) + "%");
      })
      .on("mouseout", function(d){
        return tooltipH.style("visibility", "hidden");
      })
      ;
    console.log(pa05_poverty);
    // create county outlines
    drawCounties(counties16);
    
    drawCities(pa_cities);



    // console.log(pa_cities);
    d3.select("#timeslide").on("input", function() {
      update(this.value);
    });

    function update(value) {
      document.getElementById("range").innerHTML=year[value];
      inputValue = year[value];
      updateYear(inputValue);
    }
};
//end initial load function

function updateYear(value) {
  console.log("Updated to year:");
  if (value == "2015") {
    d3.queue()
    .defer(d3.json, "pa16_poverty.json") // Load US PUMAs geography data
    .defer(d3.json, "counties16.json")
    .await(update2015); 
    console.log(value);
  } else if (value == "2010") {
    d3.queue()
    .defer(d3.json, "pa05_poverty.json") // Load US PUMAs geography data
    .defer(d3.json, "counties16.json")
    .await(update2010); 
    console.log(value);
  } else {
    d3.queue()
    .defer(d3.json, "pa05_poverty.json") // Load US PUMAs geography data
    .defer(d3.json, "counties16.json")
    .await(update2005); 
    console.log(value);
  }
};

function drawCounties(counties16) {
  d3.selectAll("svg")
  .append("path")
  .datum(topojson.mesh(counties16, counties16.objects.counties))
  .attr("d", path)
  .attr("class", "counties");
};

function drawCities(pa_cities){
  d3.selectAll("svg").selectAll("circle")
      .data(topojson.feature(pa_cities, pa_cities.objects.pa_cities).features)
      .enter().append("circle")
      // .attr("d", "circle")
        .attr("cx", function(d){ console.log((d.geometry.coordinates)[0]);
          return projection(d.geometry.coordinates)[0];
        })
        .attr("cy", function(d){ 
          return projection(d.geometry.coordinates)[1]; })
        .attr("r", "2px")
        .attr("fill", "white")
        .style("stroke", "gray")

  d3.selectAll("svg").selectAll(".city-label")
    .data(topojson.feature(pa_cities, pa_cities.objects.pa_cities).features)
    .enter().append("text")
      .attr("class","city-label")
      .attr("transform", function(d) { return "translate("+ projection(d.geometry.coordinates) + ")";})
      .attr("dy", ".15em")
      .text(function(d){ return d.properties.MUNICIPAL1;})
      .style("font-size", "10px")
      .style("fill", "gray")
  };

function update2010(error, pa05_poverty, counties16) { // initial creation
    if (error) throw error;
    console.log("update 2010 running") // ready to go!

    // d3.selectAll("path").remove();
    
    // var svg = d3.select("#mapRpov").select("svg").transition();
    
    // svg.selectAll("path")
    //   .duration(750)
    //   .attr("class", "renters2010")
    //     .style("fill", function(d) { 
    //         if (d.properties.r10_pov > 0) {
    //         return color(d.properties.r10_pov);
    //         } else {
    //         return "#FFF";
    //       }  
    // })

    d3.select("#mapRpov").select("svg")
        .selectAll("path")
            .data(topojson.feature(pa05_poverty, pa05_poverty.objects.pumas_pa_only05).features) // Bind TopoJSON data elements
        .enter().append("path")
            .attr("d", path)
        .attr("class", "renters2010")
        .style("fill", function(d) { 
            if (d.properties.r10_pov > 0) {
            return color(d.properties.r10_pov);
            } else {
            return "#FFF";
          }  
    })

    d3.select("#mapHpov").select("svg")
      .selectAll("path")
          .data(topojson.feature(pa05_poverty, pa05_poverty.objects.pumas_pa_only05).features) // Bind TopoJSON data elements
      .enter().append("path")
          .attr("d", path)
      .attr("class", "owners2010")
      .style("fill", function(d) { 
          if (d.properties.h10_pov > 0) {
          return colorh(d.properties.h10_pov);
          } else {
          return "#FFF";
          } 
      })
    // create county outlines
    drawCounties(counties16);
    drawCities(pa_cities);
};

function update2015(error, pa16_poverty, counties16) { // initial creation
    if (error) throw error;
    
    d3.selectAll("path").remove();

    console.log("update 2015 running")

    d3.select("#mapRpov").select("svg")
        .selectAll("path")
            .data(topojson.feature(pa16_poverty, pa16_poverty.objects.pumas_pa_only).features) // Bind TopoJSON data elements
        .enter().append("path")
            .attr("d", path)
        .attr("class", "renters2015")
        .style("fill", function(d) { 
            if (d.properties.r15_pov > 0) {
            return color(d.properties.r15_pov);
            } else {
            return "#FFF";
          }  
        });
    
    d3.select("#mapHpov").select("svg")
      .selectAll("path")
          .data(topojson.feature(pa16_poverty, pa16_poverty.objects.pumas_pa_only).features) // Bind TopoJSON data elements
      .enter().append("path")
          .attr("d", path)
      .attr("class","owners2015")
      .style("fill", function(d) { 
          if (d.properties.h15_pov > 0) {
          return colorh(d.properties.h15_pov);
          } else {
          return "#FFF";
          } 
      });

    // create county outlines
    drawCounties(counties16);
    drawCities(pa_cities);
};

function update2005(error, pa05_poverty, counties16) { // initial creation
    if (error) throw error;
    console.log("update 2005 running") // ready to go!

    d3.selectAll("path").remove();
    
    d3.select("#mapRpov").select("svg")
        .selectAll("path")
            .data(topojson.feature(pa05_poverty, pa05_poverty.objects.pumas_pa_only05).features) // Bind TopoJSON data elements
        .enter().append("path")
            .attr("d", path)
        .attr("class", "renters2005")
        .style("fill", function(d) { 
            if (d.properties.r05_pov > 0) {
            return color(d.properties.r05_pov);
            } else {
            return "#FFF";
          }  
    })

    d3.select("#mapHpov").select("svg")
      .selectAll("path")
          .data(topojson.feature(pa05_poverty, pa05_poverty.objects.pumas_pa_only05).features) // Bind TopoJSON data elements
      .enter().append("path")
          .attr("d", path)
      .attr("class", "owners2005")
      .style("fill", function(d) { 
          if (d.properties.h05_pov > 0) {
          return colorh(d.properties.h05_pov);
          } else {
          return "#FFF";
          } 
      })
    // create county outlines
    drawCounties(counties16);
    drawCities(pa_cities);
};

// TOOLTIP CREATION //


    var tooltipR = d3.select("svg")
          .append("div")
          .style("background-color", "White")
          .style("padding", "5px")
          .style("width", "100px")
          .style("position", "absolute")
          .style("border-radius", "8px")
          .style("font-family", "'Open Sans', sans-serif")
          .style("font-size", "12px")
          .style("z-index", "10")
          .style("visibility", "hidden");  


    var tooltipH = d3.select("body")
          .append("div")
          .style("background-color", "White")
          .style("padding", "5px")
          .style("width", "100px")
          .style("position", "absolute")
          .style("border-radius", "8px")
          .style("font-family", "'Open Sans', sans-serif")
          .style("font-size", "12px")
          .style("z-index", "10")
          .style("visibility", "hidden");      

// var tooltipR = d3.selectAll(".pumas")
//   .call( d3.tooltip().placement("right"))
//   .style("background-color", "White")
//   .style("padding", "5px")
//   .style("width", "100px")
//   .style("position", "absolute")
//   .style("border-radius", "8px")
//   .style("font-family", "'Open Sans', sans-serif")
//   .style("font-size", "12px")
//   .style("z-index", "10")
//   .style("visibility", "hidden");  

// var tooltipH = d3.select("#mapHpov")
//   .style("background-color", "White")
//   .style("padding", "5px")
//   .style("width", "100px")
//   .style("position", "absolute")
//   .style("border-radius", "8px")
//   .style("font-family", "'Open Sans', sans-serif")
//   .style("font-size", "12px")
//   .style("z-index", "10")
//   .style("visibility", "hidden"); 