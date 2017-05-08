function loadData(file, svgSelector) {
  d3.json(file, function(error, data) {
    if (error) {
      console.error("failed to load data ", error);
    }
    console.log("load data ", data);
    drawCircle(data, svgSelector);
  });
}

function drawCircle(data, svgSelector) {
  console.log("ndoes=", data["nodes"].length);
  var svg = d3
    .select(svgSelector)
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
    return "<strong>Site:</strong> <span style='color:red'>" + d.id + "</span>";
  });
  var circle = svg.selectAll("circle").data(data.nodes);
  svg.call(tip);
  var circleEnter = circle.enter().append("circle");
  circleEnter.attr("cy", function(d) {
    console.log("cy=", d);
    return d.y;
  });
  circleEnter.attr("cx", function(d, i) {
    return d.x;
  });
  circleEnter.attr("r", function(d) {
    return Math.sqrt(50);
  });
  circleEnter.on("mouseover", tip.show).on("mouseout", tip.hide);

  drawLine(svg, data);
}

function drawLine(svg, data) {
  var links = data["links"].map(function(link) {
    var node1 = data["nodes"].filter(function(node) {
      return node.id == link.node01;
    })[0];
    var node2 = data["nodes"].filter(function(node) {
      return node.id == link.node02;
    })[0];
    return {
      x1: node1.x,
      x2: node2.x,
      y1: node1.y,
      y2: node2.y,
      amount: link.amount,
      n1: link.node01,
      n2: link.node02
    };
  });
  var tip = d3.tip().attr("class", "d3-tip").offset([-10, 0]).html(function(d) {
    console.log("show tip ", d);
    return (
      "<div style='color:red'><strong>Site1:</strong><span>" +
      d.n1 +
      "</span><br><strong>Site2:</strong><span>" +
      d.n2 +
      "</span>"+"<br><strong>Amount:</strong><span>"+d.amount+ "</span></div>"
    );
  });
  svg.call(tip);
  svg
    .selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("x1", function(d) {
      return d.x1;
    })
    .attr("y1", function(d) {
      return d.y1;
    })
    .attr("x2", function(d) {
      return d.x2;
    })
    .attr("y2", function(d) {
      return d.y2;
    })
    .attr("stroke-width", 1)
    .attr("stroke", "black")
    .on("mouseover", tip.show)
    .on("mouseout", tip.hide);
}

loadData('public/data.json', '.svg-circle');
loadData('public/data-02.json', '.svg-circle2');
