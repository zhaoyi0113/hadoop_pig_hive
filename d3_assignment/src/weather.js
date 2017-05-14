var selectedDistrict;
var grading = "MONTH";
$.ajax({
  url: "http://localhost:8000/districts"
}).done(function(data) {
  var districts = JSON.parse(data[0]);
  selectedDistrict = districts[0];
  districts.map(function(d) {
    $(".districts-dropdown").append(
      '<li><a href="#" class="districts-dropdown-' + d + '">' + d + "</a></li>"
    );
    $(".districts-dropdown-" + d).click(function(e) {
      e.preventDefault();
      $(".districts-label").text(d);
      $(".districts-label").append('<span class="caret"></span>');
    });
  });
});

function draw(data) {
  var svg = d3.select(".data-chart"),
    margin = { top: 20, right: 20, bottom: 30, left: 50 },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  var x = d3.scaleTime().rangeRound([0, width]);

  var y = d3.scaleLinear().rangeRound([height, 0]);

  var line = d3
    .line()
    .x(function(d) {
      return x(d.date);
    })
    .y(function(d) {
      return y(d.value);
    });
  x.domain(
    d3.extent(data, function(d) {
      return d.date;
    })
  );
  y.domain(
    d3.extent(data, function(d) {
      return d.value;
    })
  );
  g
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .select(".domain")
    .remove();

  g
    .append("g")
    .call(d3.axisLeft(y))
    .append("text")
    .attr("fill", "#000")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    .text("Price ($)");
  g
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.5)
    .attr("d", line);
}

$.ajax({
  url: "http://localhost:8000/data/year?kpi=AQI&category=DAY"
}).done(function(data) {
  var json = JSON.parse(data);
  console.log("get aqi data", json);
  var date = json["Date"];

  var charData = [];
  var parseTime = d3.timeParse("%Y-%m-%d");
  for (var i = 0; i < date.length; i++) {
    // charData[date[i]] = json[selectedDistrict][i];
    charData.push({
      date: parseTime(date[i]),
      value: json[selectedDistrict][i]
    });
  }
  console.log("draw data", charData);
  draw(charData);
});

// var parseTime = d3.timeParse("%d-%b-%y");

// d3.tsv('public/data.tsv'
// , function(d) {
//     console.log(d)
//   d.date = parseTime(d.date);
//   d.close = +d.close;
//   return d;
// },
// function(d){
//     console.log('xxx:',d)
// })
