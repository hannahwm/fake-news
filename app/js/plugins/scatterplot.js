var $ = jQuery;

$(document).ready( function() {

  var container = $(".dataviz"),
      margin = {top: 0, right: 50, bottom: 30, left: 40},
      padding = {top: 80, right: 0, bottom: 0, left: 0},
      width = container.width() - margin.left - margin.right,
      height = container.height() - margin.top - margin.bottom;

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


  // setup second x axis
  var x2Value = function(d) { return d.Age;}, // data -> value
      x2Scale = d3.scale.linear().range([0, width]), // value -> display
      x2Map = function(d) { return x2Scale(x2Value(d));}, // data -> display
      x2Axis = d3.svg.axis().scale(x2Scale).orient("bottom").ticks("0");

  // setup y
  var yValue = function(d) { return d.Shares;}, // data -> value
      yScale = d3.scale.linear().range([(height - padding.top - margin.top - 40), 0]), // value -> display
      yMap = function(d) { return yScale(yValue(d));}, // data -> display
      yAxis = d3.svg.axis().scale(yScale).orient("left");

  // add the graph canvas to the body of the webpage
  var svg = d3.select(".dataviz").append("svg")
      // .attr("width", width + margin.left + margin.right)
      // .attr("height", height + margin.top + margin.bottom + padding.top)
      .attr("width", "100%")
      .attr("height", "100%")
      .attr('viewBox','0 0 '+width+' '+height)
      .attr('preserveAspectRatio','xMinYMin')
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + padding.top + ")");
        // .attr("transform", "translate(" + Math.min(width,height) / 2 + "," + Math.min(width,height) / 2 + ")");

  // add the tooltip area to the webpage
  var tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  // load data
  d3.csv("interactive/2019/01/fake-news/data/cereal.csv", function(error, data) {

    var legendVals = ["Female", "Male", "White", "Non-white", "Conservative", "Liberal"];

    // console.log(data);
    // change string (from CSV) into number format
    data.forEach(function(d) {
      d.Age = +d.Age;
      d.Shares = +d.Shares;
     // console.log(d);
    });

    // don't want dots overlapping axis, so add in buffer to data domain
    xScale.domain([d3.min(data, xValue)-2, d3.max(data, xValue)+2]);
    x2Scale.domain([d3.min(data, x2Value)-2, d3.max(data, x2Value)+2]);
    yScale.domain([d3.min(data, yValue)-2, d3.max(data, yValue)+2]);

    // x-axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height - padding.top - margin.top - 40) + ")")
        .call(xAxis)
      .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", "-1%")
        .style("text-anchor", "end")
        .text("Age");

    // x2-axis
    svg.append("g")
        .attr("class", "x2 axis")
        .attr("transform", "translate(0," + height/3.18 + ")")
        .call(x2Axis)
      .append("text")
        .attr("class", "label")
        .attr("x", 10)
        .attr("y", -15)
        .style("text-anchor", "start")
        .text("More than X shares per day");

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
               .style("opacity", .9)
               .attr("class", "tooltip");
          tooltip.html(d.Gender + "<br/>" + d.Race + "<br/>"
          + "Age: " + d.Age + "<br/>" + d.pol_view + "<br/>"
          + "Shares: " + d.Shares)
               .style("left", (d3.event.pageX + 10) + "px")
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
        // .attr("r", 3.5)
        .attr("r", function(d,i){
            if (d.Gender !== "male"){
                return 2.5;
            }else{
                return 3.5;
            }
        })
        // .attr("transform", function(d) {
        //     return "translate(" + xMap(d) + "," + yMap(d) + ")";
        // })
        .attr("cx", xMap)
        .attr("cy", yMap)
        //liberal or conservative
        .style("fill", function(d,i){
            if (d.pol_view !== "liberal"){
                return "#ff3333";
            }else{
                return "#3e82ff";
            }
        })
        .style("stroke", function(d,i){
            if (d.pol_view !== "liberal"){
                return "#ff3333";
            } else {
                return "#3e82ff";
            }
        })
        //Race
        .style("stroke-width", 1)
        .style("fill-opacity", function(d,i){
            if (d.Race !== "white"){
                return 1;
            }else{
                return 0;
            }
        });

    //second circle for females
    circleWrapper.append("circle")
        .attr("class", "outer-circle")
        .attr("r", 5)
        // .attr("transform", function(d) {
        //     return "translate(" + xMap(d) + "," + yMap(d) + ")";
        // })
        .attr("cx", xMap)
        .attr("cy", yMap)
        .style("fill-opacity", 0)
        .style("stroke", function(d,i){
            if (d.pol_view !== "liberal"){
                return "#ff3333";
            } else {
                return "#3e82ff";
            }
        })
        .style("stroke-width", function(d,i){
            if (d.Gender !== "female"){
                return 0;
            } else {
                return 1;
            }
        });

    // draw legend
    var topPos,
        leftPos;
    var legend = svg.selectAll(".legend")
        .data(legendVals)
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) {
          if ( (d === "Female") || (d === "Male") ) {
            leftPos = -(container.width()/4);
          } else if ( (d === "Non-white") || (d === "White") ) {
            leftPos = -((container.width()) - (container.width()/2));
          } else {
            leftPos = -container.width()/30;
          }
          if ( (d === "Female") || (d === "White") || (d === "Conservative") ) {
            topPos = container.height()/22;
          } else {
            topPos = container.height()/14;
          }
          return "translate(" + leftPos + "," + ( topPos - padding.top ) + ")";
        });

    // draw legend
    legend.append("circle")
        .attr("r", function(d) {
          if (d === "Female"){
              return 2.5;
          } else {
            return 4.5;
          }
        })
        .attr("cy",10)
        .attr("cx", "calc(100% - 70px)")
        .style("stroke", function(d) {
          if (d === "Liberal"){
              return "#3e82ff";
          } else if (d === "Conservative") {
            return "#ff3333";
          } else {
            return "#cccccc";
          }
        })
        .style("fill", function(d) {
          if (d === "Liberal"){
              return "#3e82ff";
          } else if (d === "Conservative") {
            return "#ff3333";
          } else {
            return "#cccccc";
          }
        })
        .style("fill-opacity", function(d) {
          if (d === "White" || d === "Female" || d === "Male"){
            return 0;
          } else {
            return 1;
          }
        });

    //second circle for female
    legend.append("circle")
        .attr("r", 5.5)
        .attr("cy",10)
        .attr("cx", "calc(100% - 70px)")
        .style("stroke", "#cccccc")
        .style("stroke-width", function(d) {
          if (d === "Female"){
            return 1;
          } else {
            return 0;
          }
        })
        .style("fill-opacity", 0);

    // draw legend text
    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d;})
      });
});
