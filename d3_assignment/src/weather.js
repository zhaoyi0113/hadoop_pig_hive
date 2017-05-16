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
      selectedDistrict = d;
      queryAndDrawBySite(selectedDistrict);
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
  console.log("draw data", data, "for site ", site);
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

  var tip = d3.tip().attr("class", "d3-tip").offset([-10, 0]).html(function(d) {
    console.log("show tip ", d);
    return (
      "<strong>Site:</strong> <span style='color:red'>" + d.date + "</span>"
    );
  });
  g.call(tip);

  var div = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  var circle = g.selectAll("dot").data(data).enter().append("circle");
  //   circle.attr("stroke", getColor(site));
  circle.attr("fill", "steelblue");
  circle.attr("cy", function(d) {
    return y(d.value);
  });
  circle.attr("cx", function(d, i) {
    return x(d.date);
  });
  circle.attr("r", 5);
  circle
    .on("mouseover", function(d) {
      console.log("mouse over ", d);
      var format = d3.timeFormat("%d-%m-%Y");
      console.log("parse time ", format(d.date));
      div.transition().duration(200).style("opacity", 0.9);
      div
        .html(format(d.date))
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY - 28 + "px");
    })
    .on("mouseout", function(d) {
      console.log("mouse out");
      div.transition().duration(500).style("opacity", 0);
    });
}

var parseTime = d3.timeParse("%Y-%m-%d");
function parseData(json) {
  var date = json["Date"];
  var charDatas = [];
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
    url: "http://localhost:8000/data/year?kpi=AQI&category=MONTH"
  }).done(function(data) {
    var json = JSON.parse(data);
    console.log("parse data ", json);
    var charDatas = parseData(json);
    charDatas.map(function(data) {
      drawLineChart(data.site, data.data);
    });
  });
}

function queryAndDrawBySite(site) {
  $.ajax({
    url: "http://localhost:8000/data/site?year=2016&site=" +
      site +
      "&category=MONTH"
  }).done(function(data) {
    console.log("get data ", data);
    var length = Object.keys(data[0]).length;
    var keys = Object.keys(data[0]);
    for (var i = 1; i < length; i++) {
      var charData = [];
      data.map(function(d) {
        charData.push({ date: parseTime(d["Date"]), value: d[keys[i]] });
      });
      drawLineChart("DongSi", charData);
    }
  });
}

// queryAndDrawByDate();
// queryAndDrawBySite(selectedDistrict);
