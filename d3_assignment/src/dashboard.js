var kpisMeanData;
var kpisData;

function drawKpiSummaries() {
  $('.kpi-summary:nth-child(1)>.header>.value').text(kpisMeanData['AQI'])
  $('.kpi-summary:nth-child(2)>.header>.value').text(kpisMeanData['PM2.5'])
  $('.kpi-summary:nth-child(3)>.header>.value').text(kpisMeanData['PM2.5_24h'])
  $('.kpi-summary:nth-child(4)>.header>.value').text(kpisMeanData['PM10'])
  $('.kpi-summary:nth-child(5)>.header>.value').text(kpisMeanData['PM10_24h'])
}

function getKpiDashboardColor(i) {
  switch (i) {
    case 0:
      return 'rgb(51, 122, 183)';
    case 1:
      return 'rgb(92, 184, 92)';
    case 2:
      return 'rgb(240, 173, 78)';
    case 3:
      return 'rgb(217, 83, 79)';
    case 4:
      return 'rgb(229, 165, 165)';
  }
}

function drawKpiLineChart() {
  var svg = d3
    .select(".kpi-line-chart-svg");
  var margin = { top: 20, right: 20, bottom: 30, left: 50 },
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom,
    g = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  var keys = Object.keys(kpisMeanData);
  var drawData = [];
  for (var i = 0; i < getAllKpis().length; i++) {
    if (kpisMeanData.hasOwnProperty(getAllKpis()[i])) {
      drawData.push(parseFloat(kpisMeanData[getAllKpis()[i]]));
    }
  }
  var values = drawData;
  console.log('values = ', values);
  var xDomain = [];
  values.forEach(function(v, i) {
    xDomain.push(i * (width / values.length));
  });
  var x = d3.scaleOrdinal().domain(getAllKpis()).range(xDomain);
  var y = d3.scaleLinear()
    .domain([0, d3.max(values)])
    .range([height, 0]);
  svg.selectAll("rect")
    .data(values)
    .enter()
    .append("rect")
    .attr("x", function(d, i) {
      return i * (width / values.length);
    })
    .attr("y", function(d) {
      return y(d);
    })
    .attr("width", 40)
    .attr("height", function(d) {
      return height - y(d);
    }).attr("fill", function(d, i) {
      return getKpiDashboardColor(i);
    });

  svg
    .append("g")
    .attr("margin-left", "20px")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));
  svg
    .append("g")
    .attr("transform", "translate(0,0)")
    .call(d3.axisLeft(y));
}

$.ajax({
  url: "http://localhost:8000/data/kpi/mean"
}).done(function(data) {
  kpisMeanData = JSON.parse(data);
  var keys = Object.keys(kpisMeanData);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (kpisMeanData.hasOwnProperty(key)) {
      kpisMeanData[key] = parseFloat(Math.round(kpisMeanData[key][0] * 100) / 100).toFixed(2);
    }
  }
  console.log('kpisMeanData=', kpisMeanData);
  drawKpiSummaries();
});

$.ajax({ url: "http://localhost:8000/data/kpis" })
  .done(function(data) {
    kpisData = JSON.parse(data);
    drawKpiLineChart(kpisData);
  });

function getAllKpis() {
  return ["AQI", "PM2.5", "PM2.5_24h", "PM10", "PM10_24h"];
}