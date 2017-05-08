function loadData() {
  d3.json("public/data.json", function(error, data) {
    if (error) {
      console.error("failed to load data ", error);
    }
    console.log("load data ", data);
    drawCircle(data);
  });
}

function drawChart() {
  var data = [4, 8, 15, 16, 23, 42];

  var x = d3.scaleLinear().domain([0, d3.max(data)]).range([0, 420]);

  d3
    .select(".chart")
    .selectAll("div")
    .data(data)
    .enter()
    .append("div")
    .style("width", function(d) {
      var i = x(d);
      console.log(d + " => ", i);
      return i + "px";
    })
    .text(function(d) {
      return d;
    });
}

function drawSVGChart() {
  var data = [
    { name: "Locke", value: 4 },
    { name: "Reyes", value: 8 },
    { name: "Ford", value: 15 },
    { name: "Jarrah", value: 16 },
    { name: "Shephard", value: 23 },
    { name: "Kwon", value: 42 }
  ];
  var width = 420, barHeight = 20;

  var x = d3.scaleLinear().domain([0, d3.max(data)]).range([0, width]);

  var chart = d3.select(".svg-chart").attr("width", width);

  x.domain([
    0,
    d3.max(data, function(d) {
      return d.value;
    })
  ]);

  chart.attr("height", barHeight * data.length);

  var bar = chart
    .selectAll("g")
    .data(data)
    .enter()
    .append("g")
    .attr("transform", function(d, i) {
      return "translate(0," + i * barHeight + ")";
    });

  bar
    .append("rect")
    .attr("width", function(d) {
      return x(d.value);
    })
    .attr("height", barHeight - 1);

  bar
    .append("text")
    .attr("x", function(d) {
      return x(d.value) - 3;
    })
    .attr("y", barHeight / 2)
    .attr("dy", ".35em")
    .text(function(d) {
      return d.value;
    });
}

function parseData(data) {}

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
  var circle = svg.selectAll("circle").data(data.nodes);

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
  circleEnter.on('mouseover', function(d){
    console.log('mouse over ', d);
  });
}
loadData();
// drawChart();
// drawSVGChart();
