var selectedDistrict;
var searchedData;
var selectedRegion = 1; //0: city, 1: suburb
var kpisData = {}; // save mean vaue data for each kpi
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
$(".chart-map-toggle").bootstrapToggle({
  on: "Chart",
  off: "Map"
});

function removeDrawer() {
  d3.selectAll(".data-chart > g").remove();
  d3.selectAll(".data-chart > text").remove();
}

$(".chart-map-toggle").change(function() {
  var chart = $(".chart-map-toggle").prop("checked");
  // removeDrawer();
  if (chart) {
    $(".chart-container").show();
    $(".map-container").hide();
    // drawDataByKPIs();
  } else {
    //map
    $(".chart-container").hide();
    $(".map-container").show();
  }
});
$.ajax({
  url: "http://localhost:8000/districts"
}).done(function(data) {
  var districts = JSON.parse(data[0]);
  districts.sort();
  districts.map(function(d) {
    $(".districts-dropdown").append(
      '<li><a href="#" class="districts-dropdown-' + d + '">' + d + "</a></li>"
    );
    $(".districts-dropdown-" + d).click(function(e) {
      e.preventDefault();
      $(".districts-label").text(d);
      selectedDistrict = d;
      $(".districts-label").append('<span class="caret"></span>');
    });
  });
});

function searchAction() {
  console.log("district ", $(".pm-kpi-checkbox .aqi").is(":checked"));
  if (!selectedDistrict) {
    $("#myModal").modal("show");
  } else {
    var $this = $(".search-button");
    $this.button("loading");
    queryAndDrawBySite(selectedDistrict);
  }
}

function getSelectedKPI() {
  var kpis = [];
  $(".pm-kpi-checkbox .aqi").is(":checked") && kpis.push("AQI");
  $(".pm-kpi-checkbox .pm2_5").is(":checked") && kpis.push("PM2.5");
  $(".pm-kpi-checkbox .pm10").is(":checked") && kpis.push("PM10");
  $(".pm-kpi-checkbox .co").is(":checked") && kpis.push("CO");
  $(".pm-kpi-checkbox .no2").is(":checked") && kpis.push("NO2");
  $(".pm-kpi-checkbox .so2").is(":checked") && kpis.push("SO2");
  return kpis;
}

function getAllKpis() {
  return ["AQI", "PM2.5", "PM10", "CO", "NO2", "SO2"];
}

function selectKpi(e) {
  drawDataByKPIs();
}

function getColor(site) {
  if (site === "AQI") {
    return "rgb(0,153,102)";
  } else if (site == "PM2.5") {
    return "rgb(128,188,77)";
  } else if (site == "PM10") {
    return "rgb(255, 222, 51)";
  } else if (site == "CO") {
    return "rgb(255, 188, 51)";
  } else if (site == "NO2") {
    return "rgb(255, 152, 51)";
  } else if (site == "SO2") {
    return "rgb(102, 0, 153)";
  }
  return "black";
}

function drawLineChart(site, data, drawAxial, kpi) {
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
  if (drawAxial) {
    //draw x axial
    g
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .select(".domain");

    //draw y axial
    g
      .append("g")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Date");
  }
  g
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", getColor(kpi))
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
  circle.attr("stroke", getColor(kpi));
  circle.attr("fill", getColor(kpi));
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
        .html(
          "<div>" + kpi + "<br>" + format(d.date) + "<br>" + d.value + "</div>"
        )
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY - 28 + "px");
    })
    .on("mouseout", function(d) {
      console.log("mouse out");
      div.transition().duration(500).style("opacity", 0);
    });
  // draw kpi label on each line
  svg
    .append("text")
    .attr("dy", y(data[0].value))
    .attr("dx", x(data[0].date) + 10)
    .attr("text-anchor", "start")
    .style("fill", getColor(kpi))
    .text(kpi);
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
    charDatas.map(function(data, i) {
      drawLineChart(data.site, data.data, i === 0);
    });
  });
}

function drawDataByKPIs(site) {
  if (!searchedData) {
    return;
  }
  var kpis = getSelectedKPI();
  console.log("get kpis ", kpis);
  removeDrawer();
  for (var i = 0; i < kpis.length; i++) {
    var charData = [];
    searchedData.map(function(d) {
      var v = parseFloat(d[kpis[i]]) || 0;
      charData.push({ date: parseTime(d["Date"]), value: v });
    });
    drawLineChart(site, charData, i === 0, kpis[i]);
  }
  var allKpis = getAllKpis();
  for (var i = 0; i < allKpis.length; i++) {
    searchedData.map(function(d) {
      var v = parseFloat(d[allKpis[i]]) || 0;
      if (kpisData.hasOwnProperty(allKpis[i])) {
        kpisData[allKpis[i]] += v;
      } else {
        kpisData[allKpis[i]] = v;
      }
    });
  }
  console.log('site data ', kpisData);
}

function queryAndDrawBySite(site) {
  $.ajax({
    url: "http://localhost:8000/data/site?year=2016&site=" +
      site +
      "&category=DAY"
  }).done(function(data) {
    console.log("get data ", data);
    searchedData = data;
    var $this = $(".search-button");
    $this.button("reset");
    drawDataByKPIs(site);
  });
}
$(".map-container").hide();
// queryAndDrawByDate();
// queryAndDrawBySite(selectedDistrict);