var selectedDistrict;
var selectedRegion = 1; //0: city, 1: suburb
var city = [
  "DongSi",
  "HuaiRou"
  //   "NongZhanGuan",
  //   "ZhiWuYuan",
  //   "FengTaiHuaYuan",
  //   "BeibuXinqu"
];
var suburb = [
  "FangShan",
  "DaXing",
  "YiZhuang",
  "TongZhou",
  "ShunYi",
  "ChangPing",
  "MenTouGou",
  "HuaiRou",
  "PingGu",
  "MiYun",
  "YanQing"
];
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

function getColor(site) {
  if (site === "DongSi") {
    return "steelblue";
  } else if (site == "BeibuXinqu") {
    return "steelyellow";
  } else if (site == "ZhiWuYuan") {
    return "lightgreen";
  } else if (site == "FengTaiHuaYuan") {
    return "lightred";
  } else if (site == "NongZhanGuan") {
    return "orange";
  }
  return "black";
}

function drawLineChart(site, data) {
  console.log("draw data", data);
  var svg = d3
    .select(".data-chart")
    .attr("width", Math.max(10 * data.length, 960)),
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
    .select(".domain");

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
    .attr("stroke", getColor(site))
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.5)
    .attr("d", line);

  var circle = g.selectAll("circle").data(data).enter().append("circle");
  circle.attr("stroke", getColor(site));
  circle.attr("cy", function(d) {
    return y(d.value);
  });
  circle.attr("cx", function(d, i) {
    return x(d.date);
  });
  circle.attr("r", 5);
}

function parseData(json) {
  var date = json["Date"];
  var charDatas = [];
  var parseTime = d3.timeParse("%Y-%m-%d");
  var showDistricts = selectedRegion === 0 ? city : suburb;
  showDistricts.map(function(dist) {
    console.log("parse dist ", dist);
    var charData = [];
    for (var i = 0; i < date.length; i++) {
      charData.push({
        date: parseTime(date[i]),
        value: json[dist][i]
      });
    }
    charDatas.push({ site: dist, data: charData });
  });
  return charDatas;
}

function queryAndDrawByDate() {
  $.ajax({
    url: "http://localhost:8000/data/year?kpi=AQI&category=DAY"
  }).done(function(data) {
    var json = JSON.parse(data);
    console.log("parse data ", json);
    var charDatas = parseData(json);
    charDatas.map(function(data) {
      drawLineChart(data.site, data.data);
    });
  });
}

queryAndDrawByDate()