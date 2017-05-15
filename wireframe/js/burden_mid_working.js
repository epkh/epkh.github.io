// Danya Littlefield, Phoebe Holtzman, Emily Long
// js for pa housing need
// THIS IS OUR SETUP
var margin = {top: 0, right: 0, bottom: 0, left: 0},
    width = 450 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var projection = d3.geoAlbers()
    .scale(5500)
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

// var color = d3.scaleLinear()
//     .range(["#ffd27f", "#FFA500"])
//     .interpolate(d3.interpolateLab);

// INITIAL QUEUE //
// Queue up datasets using d3 Queue. Prevents errors from loading
d3.queue()
    .defer(d3.json, "pa_pumas_05_mid.json") // Load US PUMAs geography data
    .defer(d3.json, "counties16.json")
    .await(loadpage); 

    
// UPDATE DATA FUNCTIONS //
// Run 'ready' when JSONs are loaded
// Update Function, runs when data is loaded 
function loadpage(error, pa_pumas_05_mid, counties16) {
    if (error) throw error;

    d3.selectAll("path").remove();

    var Rmapcontainer = d3.select("#mapRbur")

    var Rmymap = Rmapcontainer.append("svg")
          .attr("width", width)
          .attr("height", height)
          .selectAll("path")
            .data(topojson.feature(pa_pumas_05_mid, pa_pumas_05_mid.objects.pa_pumas_05_mid).features) // Bind TopoJSON data elements
        .enter().append("path")
            .attr("d", path)
        .attr("class", "renters2005")
        .style("fill", function(d) { 
            console.log("fill" + d.properties.r05_30);
            if (d.properties.r05_30 > 0) {
              return d3.interpolateOrRd(d.properties.r05_30/100);
            //return color(d.properties.r05_30);
            } else {
            return "white";
          };
        })
        .on("mouseover", function(d){
          console.log("mouseover"+ d.properties.r05_30);
        return Rtooltip.style("visibility", "visible").text("% Burdened at 30%:" + Math.round(d.properties.r05_30) +"%");
        })
        .on("mousemove", function(d){
          console.log("mousemove");
        return Rtooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px").text(Math.round(d.properties.r05_30) +"%");
        })
        .on("mouseout", function(d){
          return Rtooltip.style("visibility", "hidden");
        });
    
    var Hmapcontainer = d3.select("#mapHbur")

    var Hmymap = Hmapcontainer.append("svg")
          .attr("width", width)
          .attr("height", height)
        .selectAll("path")
          .data(topojson.feature(pa_pumas_05_mid, pa_pumas_05_mid.objects.pa_pumas_05_mid).features) // Bind TopoJSON data elements
      .enter().append("path")
          .attr("d", path)
      .attr("class", "owners2005")
      .style("fill", function(d) { 
          if (d.properties.h05_30 > 0) {
          return d3.interpolateGnBu((d.properties.h05_30/100)*2);
          } else {
          return "white";
          };
      }) 
        .on("mouseover", function(d){
        return Htooltip.style("visibility", "visible").text("% Burdened at 30%:" + Math.round(d.properties.h05_30) +"%");
        })
        .on("mousemove", function(d){
        return Htooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px").text(Math.round(d.properties.h05_30) +"%");
        })
        .on("mouseout", function(d){
          return Htooltip.style("visibility", "hidden");
      });

    var Rtooltip = Rmapcontainer.append("div")
        .attr('class', 'tooltip')

    var Htooltip = Hmapcontainer.append("div")
        .attr('class', 'tooltip')

    // create county outlines
    drawCounties(counties16)

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
    .defer(d3.json, "pa_pumas_16_mid_clip.json") // Load US PUMAs geography data
    .defer(d3.json, "counties16.json")
    .await(update2015); 
    //update2015();
    console.log(value);
  } else if (value == "2010") {
    d3.queue()
    .defer(d3.json, "pa_pumas_05_mid.json")  // Load US PUMAs geography data
    .defer(d3.json, "counties16.json")
    .await(update2010); 
    //update2010();
    console.log(value);
  } else {
    d3.queue()
    .defer(d3.json, "pa_pumas_05_mid.json") // Load US PUMAs geography data
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

function update2010(error, pa_pumas_05_mid, counties16) { // initial creation
    if (error) throw error;
    //clear paths
    d3.selectAll("path").remove();

    var Rmapcontainer = d3.select("#mapRbur")

    var Rmymap = Rmapcontainer.select("svg")
        .selectAll("path")
            .data(topojson.feature(pa_pumas_05_mid, pa_pumas_05_mid.objects.pa_pumas_05_mid).features) // Bind TopoJSON data elements
        .enter().append("path")
            .attr("d", path)
        .attr("class", "renters2010")
        .style("fill", function(d) { 
            if (d.properties.r10_30 > 0) {
            return d3.interpolateOrRd(d.properties.r10_30/100);
            } else {
            return "#FFF";
            }; 
        })
        .on("mouseover", function(d){
          console.log("mouseover"+ d.properties.r10_30);
        return Rtooltip.style("visibility", "visible").text("% Burdened at 30%:" + Math.round(d.properties.r10_30) +"%");
        })
        .on("mousemove", function(d){
          console.log("mousemove");
        return Rtooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px").text(Math.round(d.properties.r10_30) +"%");
        })
        .on("mouseout", function(d){
          return Rtooltip.style("visibility", "hidden");
        });

    var Hmapcontainer = d3.select("#mapHbur")

    var Hmymap = Hmapcontainer.select("svg")
      .selectAll("path")
          .data(topojson.feature(pa_pumas_05_mid, pa_pumas_05_mid.objects.pa_pumas_05_mid).features) // Bind TopoJSON data elements
      .enter().append("path")
          .attr("d", path)
      .attr("class", "owners2010")
      .style("fill", function(d) { 
          if (d.properties.h10_30 > 0) {
          return d3.interpolateGnBu((d.properties.h10_30/100)*2);
          } else {
          return "#FFF";
          };
      })
      .on("mouseover", function(d){
        console.log("mouseover"+ d.properties.h10_30);
        return Rtooltip.style("visibility", "visible").text("% Burdened at 30%:" + Math.round(d.properties.h10_30) +"%");
        })
      .on("mousemove", function(d){
        console.log("mousemove");
        return Rtooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px").text(Math.round(d.properties.h10_30) +"%");
        })
      .on("mouseout", function(d){
        return Rtooltip.style("visibility", "hidden");
        });

    // create tooltip
    var Rtooltip = Rmapcontainer.append("div")
        .attr('class', 'tooltip')

    var Htooltip = Hmapcontainer.append("div")
        .attr('class', 'tooltip')

    // create county outlines
    drawCounties(counties16);

};

function update2005(error, pa_pumas_05_mid, counties16) { // initial creation
    if (error) throw error;
    
    d3.selectAll("path").remove();

    console.log("update 2005 running");

    var Rmapcontainer = d3.select("#mapRbur")

    d3.select("#mapRbur").select("svg")
        .selectAll("path")
            .data(topojson.feature(pa_pumas_05_mid, pa_pumas_05_mid.objects.pa_pumas_05_mid).features) // Bind TopoJSON data elements
        .enter().append("path")
            .attr("d", path)
        .attr("class", "renters2005")
        .style("fill", function(d) { 
            if (d.properties.r05_30 > 0) {
            return d3.interpolateOrRd(d.properties.r05_30/100);
            } else {
            return "#FFF";
          };  
        })
        .on("mouseover", function(d){
          console.log("mouseover"+ d.properties.r05_30);
        return Rtooltip.style("visibility", "visible").text("% Burdened at 30%:" + Math.round(d.properties.r05_30) +"%");
        })
        .on("mousemove", function(d){
          console.log("mousemove");
        return Rtooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px").text(Math.round(d.properties.r05_30) +"%");
        })
        .on("mouseout", function(d){
          return Rtooltip.style("visibility", "hidden");
        });

    var Hmapcontainer = d3.select("#mapHbur")
    
    d3.select("#mapHbur").select("svg")
      .selectAll("path")
          .data(topojson.feature(pa_pumas_05_mid, pa_pumas_05_mid.objects.pa_pumas_05_mid).features) // Bind TopoJSON data elements
      .enter().append("path")
          .attr("d", path)
      .attr("class","owners2015")
      .style("fill", function(d) { 
          if (d.properties.h05_30 > 0) {
          return d3.interpolateGnBu((d.properties.h05_30/100)*2);
          } else {
          return "#FFF";
          }; 
      })
      .on("mouseover", function(d){
        console.log("mouseover"+ d.properties.h05_30);
        return Rtooltip.style("visibility", "visible").text("% Burdened at 30%:" + Math.round(d.properties.h05_30) +"%");
        })
      .on("mousemove", function(d){
        console.log("mousemove");
        return Rtooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px").text(Math.round(d.properties.h05_30) +"%");
        })
      .on("mouseout", function(d){
        return Rtooltip.style("visibility", "hidden");
      });

    // create county outlines
    drawCounties(counties16)
    // create tooltip
    var Rtooltip = Rmapcontainer.append("div")
        .attr('class', 'tooltip')

    var Htooltip = Hmapcontainer.append("div")
        .attr('class', 'tooltip')
};

function update2015(error, pa_pumas_16_mid_clip, counties16) { // initial creation
    if (error) throw error;
    
    d3.selectAll("path").remove();

    console.log("update 2015 running");

    var Rmapcontainer = d3.select("#mapRbur")

    d3.select("#mapRbur").select("svg")
        .selectAll("path")
            .data(topojson.feature(pa_pumas_16_mid_clip, pa_pumas_16_mid_clip.objects.pa_pumas_16_mid_clip).features) // Bind TopoJSON data elements
        .enter().append("path")
            .attr("d", path)
        .attr("class", "renters2015")
        .style("fill", function(d) { 
            if (d.properties.r15_30 > 0) {
            return d3.interpolateOrRd(d.properties.r15_30/100);
            } else {
            return "#FFF";
          };  
        })
        .on("mouseover", function(d){
          console.log("mouseover"+ d.properties.r15_30);
        return Rtooltip.style("visibility", "visible").text("% Burdened at 30%:" + Math.round(d.properties.r15_30) +"%");
        })
        .on("mousemove", function(d){
          console.log("mousemove");
        return Rtooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px").text(Math.round(d.properties.r15_30) +"%");
        })
        .on("mouseout", function(d){
        return Rtooltip.style("visibility", "hidden");
        });

    var Hmapcontainer = d3.select("#mapHbur")
    
    d3.select("#mapHbur").select("svg")
      .selectAll("path")
          .data(topojson.feature(pa_pumas_16_mid_clip, pa_pumas_16_mid_clip.objects.pa_pumas_16_mid_clip).features) // Bind TopoJSON data elements
      .enter().append("path")
          .attr("d", path)
      .attr("class","owners2015")
      .style("fill", function(d) { 
          if (d.properties.h15_30 > 0) {
          return d3.interpolateGnBu((d.properties.h15_30/100)*2);
          } else {
          return "#FFF";
          }; 
      })
      .on("mouseover", function(d){
        console.log("mouseover"+ d.properties.h15_30);
        return Rtooltip.style("visibility", "visible").text("% Burdened at 30%:" + Math.round(d.properties.h15_30) +"%");
        })
      .on("mousemove", function(d){
        console.log("mousemove");
        return Rtooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px").text(Math.round(d.properties.h15_30) +"%");
        })
      .on("mouseout", function(d){
        return Rtooltip.style("visibility", "hidden");
        });
    // create county outlines
    drawCounties(counties16)

        // create tooltip
    var Rtooltip = Rmapcontainer.append("div")
        .attr('class', 'tooltip')

    var Htooltip = Hmapcontainer.append("div")
        .attr('class', 'tooltip')
};

    var div = d3.select("body").append("div") 
      .attr("class", "tooltip")
      .style("opacity", 0);

// creating the legend!! 
      var w = 350, h = 50;

      var key = d3.select("#legend1")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

      var legend = key.append("defs")
        .append("svg:linearGradient")
        .attr("id", "gradient")
        .attr("x1", "0%")
        .attr("y1", "100%")
        .attr("x2", "100%")
        .attr("y2", "100%")
        .attr("spreadMethod", "pad");

      legend.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#fef0d9")
        .attr("stop-opacity", 1);

      legend.append("stop")
        .attr("offset", "33%")
        .attr("stop-color", "#fdcc8a")
        .attr("stop-opacity", 1);

      legend.append("stop")
        .attr("offset", "66%")
        .attr("stop-color", "#fc8d59")
        .attr("stop-opacity", 1);

      legend.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#d7301f")
        .attr("stop-opacity", 1);

      key.append("rect")
        .attr("width", w - 75)
        .attr("height", h - 30)
        .style("fill", "url(#gradient)")
        .attr("transform", "translate(10,10)");

      var y = d3.scaleLinear()
        .range([275, 0])
        .domain([80, 20]);

      var yAxis = d3.axisBottom()
        .scale(y)
        .ticks(4);

      key.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(10,30)")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("axis title");
         
    // legend for homeowners
      var key2 = d3.select("#legend2")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

      var legend = key2.append("defs")
        .append("svg:linearGradient")
        .attr("id", "gradient")
        .attr("x1", "0%")
        .attr("y1", "100%")
        .attr("x2", "100%")
        .attr("y2", "100%")
        .attr("spreadMethod", "pad");

      legend.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#f7fcf0")
        .attr("stop-opacity", 1);

      legend.append("stop")
        .attr("offset", "33%")
        .attr("stop-color", "#bae4bc")
        .attr("stop-opacity", 1);

      legend.append("stop")
        .attr("offset", "66%")
        .attr("stop-color", "#7bccc4")
        .attr("stop-opacity", 1);

      legend.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#084081")
        .attr("stop-opacity", 1);

      key2.append("rect")
        .attr("width", w - 75)
        .attr("height", h - 30)
        .style("fill", "url(#gradient)")
        .attr("transform", "translate(10,10)");

      var y = d3.scaleLinear()
        .range([275, 0])
        .domain([50, 10]);

      var yAxis = d3.axisBottom()
        .scale(y)
        .ticks(4);

      key2.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(10,30)")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("axis title");
