var $ = jQuery;

$(document).ready( function() {

  //in order to make the dataviz responsive, I am calculating all heights and widths against the container height and width
  var container = $(".dataviz"),
      margin = {top: 0, right: (container.width() / 26.66), bottom: (container.width() / 44.43), left: (container.width() / 33.325)},
      padding = {top: (container.width() / 5.332), right: 0, bottom: 0, left: 0},
      width = container.width() - margin.left - margin.right,
      height = container.height() - margin.top - margin.bottom;

  /*
   * value accessor - returns the value to encode for a given data object.
   * scale - maps value to a visual display encoding, such as a pixel position.
   * map function - maps from data value to display value
   * axis - sets up axis
   */

  // setup x
  var xValue = function(d) { return d.age;}, // data -> value
      xScale = d3.scale.linear().range([0, width]), // value -> display
      xMap = function(d) { return xScale(xValue(d));}, // data -> display
      xAxis = d3.svg.axis().scale(xScale).orient("bottom");


  // setup second x axis
  // var x2Value = function(d) { return d.age;}, // data -> value
  //     x2Scale = d3.scale.linear().range([0, width]), // value -> display
  //     x2Map = function(d) { return x2Scale(x2Value(d));}, // data -> display
  //     x2Axis = d3.svg.axis().scale(x2Scale).orient("bottom").ticks("0");

  // setup y
  var yValue = function(d) { return d.n_share;}, // data -> value
      yScale = d3.scale.log().range([(height - padding.top - margin.top - (container.width() / 33.325)), 0]).base([10]),
      // yScale = d3.scale.linear().range([(height - padding.top - margin.top - 40), 0]), // value -> display
      yMap = function(d) { return yScale(yValue(d));}, // data -> display
      yAxis = d3.svg.axis().scale(yScale).orient("left").tickFormat(function (d) {
        return yScale.tickFormat(10,d3.format(",d"))(d)});

  // add the graph canvas to the body of the webpage
  var svg = d3.select(".dataviz").append("svg")
      // .attr("width", width + margin.left + margin.right)
      // .attr("height", height + margin.top + margin.bottom + padding.top)
      .attr("width", "100%")
      .attr("height", "100%")
      .attr('viewBox','0 0 '+width+' '+(height + (container.width() / 26.66)))
      .attr('preserveAspectRatio','xMinYMin')
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + padding.top + ")");
        // .attr("transform", "translate(" + Math.min(width,height) / 2 + "," + Math.min(width,height) / 2 + ")");

  // add the tooltip area to the webpage
  var tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  // load data
  d3.csv("interactive/2019/01/fake-news/data/fake-news-data.csv", function(error, data) {

    var legendVals = ["Female", "Male", "White", "Non-white", "Republican", "Democrat", "Independent", "No party / unknown"];

    // console.log(data);
    // change string (from CSV) into number format
    data.forEach(function(d) {
      d.age = +d.age;
      d.n_share = +d.n_share;
     // console.log(d);
    });

    // don't want dots overlapping axis, so add in buffer to data domain
    xScale.domain([d3.min(data, xValue)-2, d3.max(data, xValue)+2]);
    // x2Scale.domain([d3.min(data, x2Value)-2, d3.max(data, x2Value)+2]);
    // yScale.domain([d3.min(data, yValue)-10, d3.max(data, yValue)+2]);
    yScale.domain([1, 1000]);

    // x-axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height - padding.top - margin.top - (container.width() / 38.085)) + ")")
        .call(xAxis)
      .append("text")
        .attr("class", "label")
        .attr("x", width/2)
        .attr("y", "5%")
        .style("text-anchor", "end")
        .style("font-size", "16px")
        .text("Age");

    // x2-axis
    // svg.append("g")
    //     .attr("class", "x2 axis")
    //     .attr("transform", "translate(0," + height/3.18 + ")")
    //     .call(x2Axis)
    //   .append("text")
    //     .attr("class", "label")
    //     .attr("x", 10)
    //     .attr("y", -15)
    //     .style("text-anchor", "start")
    //     .text("More than X shares per day");

    // y-axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("class", "label")
        // .attr("transform", "rotate(-90)")
        .attr("x", "10px")
        .attr("y", "-2em")
        .style("text-anchor", "end")
        .style("font-size", "16px")
        .text("Shares");

    svg.append("text")
        .attr("class", "dataviz-title")
        .attr("x", "100%" - width)
        .attr("y", container.height()/14 - padding.top)
        .attr("text-anchor", "start")
        .text("Number of fake news shares based on demographics");

    // draw tooltip
    var circleWrapper = svg.selectAll(".circleWrapper")
      .data(data)
      .enter().append("g")
      .attr("class", "circleWrapper")
      .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", .9)
               .attr("class", "tooltip");
          tooltip.html(d.sex + "<br/>" + d.race_ethnicity + "<br/>"
          + "Age: " + d.age + "<br/>" + d.party + "<br/>"
          + "Shares: " + d.n_share)
               .style("left", (d3.event.pageX + 10) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      })
      .on("touchstart", function(d) {
        tooltip.show();
      });
    // draw dots
    circleWrapper.append("circle")
      .attr("class", "dot")
      // .attr("r", 3.5)
      // .attr("r", function(d,i){
      //     if (d.sex !== "Male"){
      //         return 2.5;
      //     }else{
      //         return 3.5;
      //     }
      // })
      .attr("r", function(d) {
        if (d.sex !== "Male"){
          return (container.width() / 533.2) + (d.n_share / 40)
        }else{
          return (container.width() / 308.857) + (d.n_share / 40)
        }
      })
      .attr("cx", xMap)
      // .attr('cx',function(d,i){
      //  console.log(d.n_share)
      //   return d.n_share
      // })
      .attr("cy", yMap)
      .style("fill", function(d,i){
          if (d.party === "Democrat"){
              return "#3e82ff";
          } else if (d.party === "Republican"){
              return "#ff3333";
          } else if (d.party === "Independent") {
            return "#4ac02f";
          } else {
            return "#cccccc";
          }
      })
      .style("stroke", function(d,i){
        if (d.party === "Democrat"){
            return "#3e82ff";
        } else if (d.party === "Republican"){
            return "#ff3333";
        } else if (d.party === "Independent") {
          return "#4ac02f";
        } else {
          return "#cccccc";
        }
      })
      .style("stroke-opacity", 1)
      //Race
      .style("stroke-width", 1)
      .style("fill-opacity", function(d,i){
          if (d.race_ethnicity !== "Caucasian"){
              return 0;
          }else{
              return 1;
          }
      });

    //second circle for females
    circleWrapper.append("circle")
      .attr("class", "outer-circle")
      .attr("r", function(d) {
        return (container.width() / 266.6) + (d.n_share / 32)
      })
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("fill-opacity", 0)
      .style("stroke", function(d,i){
        if (d.party === "Democrat"){
            return "#3e82ff";
        } else if (d.party === "Republican"){
            return "#ff3333";
        } else if (d.party === "Independent") {
          return "#4ac02f";
        } else {
          return "#cccccc";
        }
      })
      .style("stroke-opacity", 0.5)
      .style("stroke-width", function(d,i){
          if (d.sex !== "Female"){
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
            leftPos = -container.width()/3.5;
          } else if ( (d === "White") || (d === "Non-white") ) {
            leftPos = -container.width()/5;
          } else {
            leftPos = -container.width()/10;
          }
          if ( (d === "Female") || (d === "White") || (d === "Democrat") ) {
            topPos = container.height()/14;
          } else if ( (d === "Male") || (d === "Non-white") || (d === "Republican") ) {
            topPos = container.height()/10.3;
          } else if (d === "Independent") {
            topPos = container.height()/8.2;
          } else {
            topPos = container.height()/6.8;
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
        .attr("cx", "calc(100% - 40px)")
        .style("stroke", function(d) {
          if (d === "Democrat"){
              return "#3e82ff";
          } else if (d === "Republican"){
              return "#ff3333";
          } else if (d === "Independent") {
            return "#4ac02f";
          } else {
            return "#cccccc";
          }
        })
        .style("fill", function(d) {
          if (d === "Democrat"){
              return "#3e82ff";
          } else if (d === "Republican"){
              return "#ff3333";
          } else if (d === "Independent") {
            return "#4ac02f";
          } else {
            return "#cccccc";
          }
        })
        .style("fill-opacity", function(d) {
          if (d !== "Non-white" ){
            return 1;
          } else {
            return 0;
          }
        });

    //second circle for female
    legend.append("circle")
      .attr("r", 5.5)
      .attr("cy",10)
      .attr("cx", "calc(100% - 40px)")
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
      .style("text-anchor", "start")
      .text(function(d) { return d; });
  });
});

1234.2
4936.8
