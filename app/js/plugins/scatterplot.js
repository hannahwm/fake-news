$(document).ready( function() {

  var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  /*
   * value accessor - returns the value to encode for a given data object.
   * scale - maps value to a visual display encoding, such as a pixel position.
   * map function - maps from data value to display value
   * axis - sets up axis
   */


  // setup x
  var xValue = function(d) { return d.Age;}, // data -> value
      xScale = d3.scale.linear().range([0, width]), // value -> display
      xMap = function(d) { return xScale(xValue(d));}, // data -> display
      xAxis = d3.svg.axis().scale(xScale).orient("bottom");

  // setup y
  var yValue = function(d) { return d["Shares"];}, // data -> value
      yScale = d3.scale.linear().range([height, 0]), // value -> display
      yMap = function(d) { return yScale(yValue(d));}, // data -> display
      yAxis = d3.svg.axis().scale(yScale).orient("left");



  // add the graph canvas to the body of the webpage
  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // add the tooltip area to the webpage
  var tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  // symbol generators
  var symbolTypes = {
      "triangleDown": d3.svg.symbol().type("triangle-down"),
      "circle": d3.svg.symbol().type("circle")
  };

  // load data
  d3.csv("../data/cereal.csv", function(error, data) {
    // var totalDots = [];
    //
    // for (var i = 0; i<data.length; i++) {
    //   totalDots.push(data[i].Age);
    // }

    var legendVals = ["Female", "Male", "White", "Non-white", "Conservative", "Liberal"];

    // setup fill color
    var cValue = function(d) { return d["Cereal Name"];};
    // color = "red";
    var color = d3.scale
    .linear()
    .domain([0, 50])
    .range(["#87CEFF", "#0000FF"]);


    // console.log(data);
    // change string (from CSV) into number format
    data.forEach(function(d) {
      d.Age = +d.Age;
      d["Shares"] = +d["Shares"];
     // console.log(d);
    });

    // don't want dots overlapping axis, so add in buffer to data domain
    xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
    yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

    // x-axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Age");

    // y-axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Shares");
        // draw legend
  var circleWrapper = svg.selectAll(".circleWrapper")
      .data(data)
      .enter().append("g")
      .attr("class", "circleWrapper")
      .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html(d["Cereal Name"] + "<br/> (" + xValue(d)
          + ", " + yValue(d) + ")")
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      });
    // draw dots
    circleWrapper.append("circle")
        .attr("class", "dot")
        .attr("r", 4.5)
        // .attr("transform", function(d) {
        //     return "translate(" + xMap(d) + "," + yMap(d) + ")";
        // })
        .attr("cx", xMap)
        .attr("cy", yMap)
        //liberal or conservative
        .style("fill", function(d,i){
            if (d.pol_view !== "liberal"){
                return "red";
            }else{
                return "blue";
            }
        })
        .style("stroke", function(d,i){
            if (d.pol_view !== "liberal"){
                return "red";
            } else {
                return "blue";
            }
        })
        //This will be white or non-white
        .style("stroke-width", 2)
        .style("fill-opacity", function(d,i){
            if (d["Display Shelf"] !== "3"){
                return 1;
            }else{
                return 0;
            }
        });

    //second circle for females
    circleWrapper.append("circle")
        .attr("class", "outer-circle")
        .attr("r", 8.5)
        // .attr("transform", function(d) {
        //     return "translate(" + xMap(d) + "," + yMap(d) + ")";
        // })
        .attr("cx", xMap)
        .attr("cy", yMap)
        .style("fill-opacity", 0)
        .style("stroke", function(d,i){
            if (d.pol_view !== "liberal"){
                return "red";
            } else {
                return "none";
            }
        })
        .style("stroke-width", function(d,i){
            if (d["Serving Size Weight"] !== "1"){
                return 0;
            } else {
                return 2;
            }
        });

    // draw legend
    var legend = svg.selectAll(".legend")
        .data(legendVals)
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    // draw legend colored rectangles
    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    // draw legend text
    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d;})
      });
});
