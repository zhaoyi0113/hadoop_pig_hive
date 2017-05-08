function loadData() {
  d3.json("public/data.json", function(error, data) {
    if (error) {
      console.error("failed to load data ", error);
    }
    console.log("load data ", data);
    drawCircle(data);
  });
}

function drawCircle(data) {
  console.log("ndoes=", data["nodes"].length);
  var svg = d3
    .select(".svg-circle")
    .attr(
      "height",
      d3.max(data["nodes"], function(d) {
        return d.y + 50;
      })
    )
    .attr(
      "width",
      d3.max(data["nodes"], function(d) {
        return d.x + 50;
      })
    );
  var tip = d3.tip().attr("class", "d3-tip").offset([-10, 0]).html(function(d) {
    console.log("show tip ", d);
    return (
      "<strong>Frequency:</strong> <span style='color:red'>" + d.id + "</span>"
    );
  });
  var circle = svg.selectAll("circle").data(data.nodes);
  svg.call(tip);
  var circleEnter = circle.enter().append("circle");
  circleEnter.attr("cy", function(d) {
    console.log("cy=", d);
    return d.y;
  });
  circleEnter.attr("cx", function(d, i) {
    return i * 100 + 30;
  });
  circleEnter.attr("r", function(d) {
    return Math.sqrt(20);
  });
  circleEnter.on("mouseover", tip.show);

  drawLine(svg,data);
}

function drawLine(svg, data) {
    d3.select(".svg-circle").data(data.nodes)
    .append("line")
    .attr("x1", function(d){console.log('dare:',d);return d.x;})
    .attr("y1", function(d){return d.y;})
    .attr("x2", function(d){return d.x+50;})
    .attr("y2", function(d){return d.y+50;})
    .attr("stroke-width", 2)
    .attr("stroke", "black");
}

loadData();
// drawChart();
// drawSVGChart();
