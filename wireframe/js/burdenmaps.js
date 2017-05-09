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

// Slider 

var inputValue = null;
var year = ["2005","2010","2015"];    

// var svg = d3.select("#mapRbur").append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)

// var svg2 = d3.select("#mapHbur").append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom);

var color = d3.scaleThreshold()
    .domain([25, 40, 55, 80, 100])
    .range(['#feedde','#fdbe85','#fd8d3c','#e6550d', '#a63603']);

var colorh = d3.scaleThreshold()
    .domain([25, 40, 55, 80, 100])
    .range(['#eff3ff','#bdd7e7','#6baed6','#3182bd', '#08519c']);


// INITIAL QUEUE //
// Queue up datasets using d3 Queue. Prevents errors from loading
d3.queue()
    .defer(d3.json, "pa05_burden.json") // Load US PUMAs geography data
    .defer(d3.json, "counties16.json")
    .await(loadpage); 


// UPDATE DATA FUNCTIONS //
// Run 'ready' when JSONs are loaded
// Update Function, runs when data is loaded 
function loadpage(error, pa05_burden, counties16) {
    if (error) throw error;

    d3.selectAll("path").remove();

    d3.select("#mapRbur").append("svg")
        .selectAll("path")
            .data(topojson.feature(pa05_burden, pa05_burden.objects.pumas_pa_only05).features) // Bind TopoJSON data elements
        .enter().append("path")
            .attr("d", path)
        .attr("class", "renters2005")
        .style("fill", function(d) { 
            if (d.properties.r05_50 > 0) {
            return color(d.properties.r05_50);
            } else {
            return "Green";
          }
            console.log(d.properties.r05_50);  
        })
      .on("mouseover", function(d){
        return tooltipR.style("visibility", "visible").text("PUMA ID: " + d.properties.id + "\n"+ "% Burdened at 50%:" + Math.round(d.properties.r05_50) +"%");
      })
      .on("mousemove", function(d){
        return tooltipR.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px").text("PUMA ID: " + d.properties.id + "\n" + "% Burdened at 50%: " + Math.round(d.properties.r05_50) + "%");
      })
      .on("mouseout", function(d){
        return tooltipR.style("visibility", "hidden");
      });
    
    d3.select("#mapHbur").append("svg")
      .selectAll("path")
          .data(topojson.feature(pa05_burden, pa05_burden.objects.pumas_pa_only05).features) // Bind TopoJSON data elements
      .enter().append("path")
          .attr("d", path)
      .attr("class", "owners2005")
      .style("fill", function(d) { 
          if (d.properties.h05_50 > 0) {
          return colorh(d.properties.h05_50);
          } else {
          return "SteelBlue";
          } 
      })
      .on("mouseover", function(d){
        return tooltipH.style("visibility", "visible").text("PUMA ID: " + d.properties.id + "\n"+ "% Burdened at 50%:" + Math.round(d.properties.h05_50) +"%");
      })
      .on("mousemove", function(d){
        return tooltipH.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px").text("PUMA ID: " + d.properties.id + "\n" + "% Burdened at 50%: " + Math.round(d.properties.h05_50) + "%");
      })
      .on("mouseout", function(d){
        return tooltipH.style("visibility", "hidden");
      });

    // create county outlines
    d3.selectAll("svg")
      .append("path")
      .datum(topojson.mesh(counties16, counties16.objects.counties))
      .attr("d", path)
      .attr("class", "counties");

    d3.select("#timeslide").on("input", function() {
      update(this.value);
    });

    function update(value) {
      document.getElementById("range").innerHTML=year[value];
      inputValue = year[value];
      updateYear(inputValue);
    };
}
//end of update function

function updateYear(value) {
  console.log("Updated to year:");
  if (value == "2015") {
    d3.queue()
    .defer(d3.json, "pa16_burden.json") // Load US PUMAs geography data
    .defer(d3.json, "counties16.json")
    .await(update2015); 
    //update2015();
    console.log(value);
  } else if (value == "2010") {
    d3.queue()
    .defer(d3.json, "pa05_burden.json")  // Load US PUMAs geography data
    .defer(d3.json, "counties16.json")
    .await(update2010); 
    //update2010();
    console.log(value);
  } else {
    d3.queue()
    .defer(d3.json, "pa05_burden.json") // Load US PUMAs geography data
    .defer(d3.json, "counties16.json")
    .await(update2005); 
    //loadpage();
    console.log(value);
  }
}

function drawCounties(counties16) {
  d3.selectAll("svg")
  .append("path")
  .datum(topojson.mesh(counties16, counties16.objects.counties))
  .attr("d", path)
  .attr("class", "counties");
}

function update2010(error, pa05_burden, counties16) { // initial creation
    if (error) throw error;
    //clear paths
    d3.selectAll("path").remove();

    d3.select("#mapRbur").select("svg")
        .selectAll("path")
            .data(topojson.feature(pa05_burden, pa05_burden.objects.pumas_pa_only05).features) // Bind TopoJSON data elements
        .enter().append("path")
            .attr("d", path)
        .attr("class", "renters2010")
        .style("fill", function(d) { 
            if (d.properties.r10_50 > 0) {
            return color(d.properties.r10_50);
            } else {
            return "#FFF";
          }; 
    })

    d3.select("#mapHbur").select("svg")
      .selectAll("path")
          .data(topojson.feature(pa05_burden, pa05_burden.objects.pumas_pa_only05).features) // Bind TopoJSON data elements
      .enter().append("path")
          .attr("d", path)
      .attr("class", "owners2010")
      .style("fill", function(d) { 
          if (d.properties.h10_50 > 0) {
          return colorh(d.properties.h10_50);
          } else {
          return "#FFF";
          };
    })

    // create county outlines
    drawCounties(counties16);

};

function update2005(error, pa05_burden, counties16) { // initial creation
    if (error) throw error;
    
    d3.selectAll("path").remove();

    console.log("update 2005 running");

    d3.select("#mapRbur").select("svg")
        .selectAll("path")
            .data(topojson.feature(pa05_burden, pa05_burden.objects.pumas_pa_only05).features) // Bind TopoJSON data elements
        .enter().append("path")
            .attr("d", path)
        .attr("class", "renters2005")
        .style("fill", function(d) { 
            if (d.properties.r05_50 > 0) {
            return color(d.properties.r05_50);
            } else {
            return "#FFF";
          }  
        });
    
    d3.select("#mapHbur").select("svg")
      .selectAll("path")
          .data(topojson.feature(pa05_burden, pa05_burden.objects.pumas_pa_only05).features) // Bind TopoJSON data elements
      .enter().append("path")
          .attr("d", path)
      .attr("class","owners2015")
      .style("fill", function(d) { 
          if (d.properties.h05_50 > 0) {
          return colorh(d.properties.h05_50);
          } else {
          return "#FFF";
          } 
      });

    // create county outlines
    drawCounties(counties16);
};

function update2015(error, pa16_burden, counties16) { // initial creation
    if (error) throw error;
    
    d3.selectAll("path").remove();

    console.log("update 2015 running");

    d3.select("#mapRbur").select("svg")
        .selectAll("path")
            .data(topojson.feature(pa16_burden, pa16_burden.objects.pumas_pa_only).features) // Bind TopoJSON data elements
        .enter().append("path")
            .attr("d", path)
        .attr("class", "renters2015")
        .style("fill", function(d) { 
            if (d.properties.r15_50 > 0) {
            return color(d.properties.r15_50);
            } else {
            return "#FFF";
          }  
        });
    
    d3.select("#mapHbur").select("svg")
      .selectAll("path")
          .data(topojson.feature(pa16_burden, pa16_burden.objects.pumas_pa_only).features) // Bind TopoJSON data elements
      .enter().append("path")
          .attr("d", path)
      .attr("class","owners2015")
      .style("fill", function(d) { 
          if (d.properties.h15_50 > 0) {
          return colorh(d.properties.h15_50);
          } else {
          return "#FFF";
          } 
      });

    // create county outlines
    drawCounties(counties16);
};

// d3.json("counties16.json", function(error, data) {
//   d3.selectAll("svg").append("path")
//     .data(topojson.mesh(data, data.objects.counties))
//     .attr("d", path)
//     .attr("class", "counties");
//   });
// TOOLTIP CREATION //

var tooltipR = d3.select("#mapRbur").select("svg")
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


var tooltipH = d3.select("#mapHbur").select("svg")
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