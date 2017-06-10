var kpisMeanData;
var kpisData;

function drawKpiSummaries() {
  $('.kpi-summary:nth-child(1)>.header>.value').text(kpisMeanData[kpiNames.aqi])
  $('.kpi-summary:nth-child(2)>.header>.value').text(kpisMeanData[kpiNames.so2])
  $('.kpi-summary:nth-child(3)>.header>.value').text(kpisMeanData[kpiNames.co])
  $('.kpi-summary:nth-child(4)>.header>.value').text(kpisMeanData[kpiNames.o3])
  $('.kpi-summary:nth-child(5)>.header>.value').text(kpisMeanData[kpiNames.pm25])
  $('.kpi-summary:nth-child(6)>.header>.value').text(kpisMeanData[kpiNames.pm10])
  $('.kpi-summary:nth-child(1)>.footer').click(function(e) {
    clickViewDetail(kpiNames.aqi, e);
  });
  $('.kpi-summary:nth-child(2)>.footer').click(function(e) {
    clickViewDetail(kpiNames.so2, e);
  });
  $('.kpi-summary:nth-child(3)>.footer').click(function(e) {
    clickViewDetail(kpiNames.co, e);
  });
  $('.kpi-summary:nth-child(4)>.footer').click(function(e) {
    clickViewDetail(kpiNames.o3, e);
  });
  $('.kpi-summary:nth-child(5)>.footer').click(function(e) {
    clickViewDetail(kpiNames.pm25, e);
  });
  $('.kpi-summary:nth-child(6)>.footer').click(function(e) {
    clickViewDetail(kpiNames.pm10, e);
  });
}

function clickViewDetail(kpi, e) {
  e.preventDefault();
  selectedMapKpi = kpi;
  selectMapKpi(selectedMapKpi, e);
  changeNavSelection('map');
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

function drawKpiHistogramChart() {
  var svg = d3
    .select(".kpi-histogram-chart-svg");
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

function drawKpisLineChart() {
  var margin = { top: 20, right: 20, bottom: 30, left: 50 };
  var svg = d3
    .select(".kpi-line-chart-svg"),
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom;
  var kpis = getAllKpis();
  var x = d3.scaleTime().rangeRound([0, width]);
  var y = d3.scaleLinear().rangeRound([height, 0]);
  kpis.forEach(function(k, i) {
    var kpi = kpisData[k];
    var data = [];
    var beginDate = new Date('2016-01-01');
    kpi.forEach(function(k, i) {
      var date = new Date();
      date.setTime(beginDate.getTime());
      if (i == 12) {
        date.setFullYear(beginDate.getFullYear() + 1);
      } else {
        date.setMonth(beginDate.getMonth() + i);
      }
      data.push({ value: k, date: date });
    });
    var xAxis = d3.scaleOrdinal().range([new Date('2016-01-01'), new Date('2016-12-31')]).domain(kpi);
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain(d3.extent(data, function(d) { return d.value; }));
    var line = d3
      .line()
      .x(function(d) {
        return x(d.date);
      })
      .y(function(d) {
        return y(d.value);
      });
    var g = svg.append('g').attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    g
      .append("path")
      .datum(data)
      .attr("stroke", getKpiDashboardColor(i))
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line);
    if (i === 0) {
      svg
        .append("g")
        .attr("margin-left", "20px")
        .attr("transform", "translate(0," + (height + 30) + ")")
        .call(d3.axisBottom(x));
      svg
        .append("g")
        .attr("transform", "translate(20,30)")
        .call(d3.axisLeft(y));
    }
  });
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
  drawKpiSummaries();
  // drawKpiHistogramChart();
});

// $.ajax({ url: "http://localhost:8000/data/kpi/monthly" })
//   .done(function(data) {
//     kpisData = JSON.parse(data);
//     drawKpisLineChart();
//   });

function drawKpiMonthlyData(monthlyData, month) {
  var margin = { top: 20, right: 20, bottom: 30, left: 50 };
  var childIndex = parseInt(month % 3) + 1;
  var rowIndex = parseInt(month / 3) + 1;
  var svg = d3
    .select(".kpi-monthly-chart-container>.kpi-line-chart-row:nth-child(" + rowIndex + ") .kpi-line-chart-cell:nth-child(" + childIndex + ")"),
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom;
  var kpis = getAllKpis();
  var x = d3.scaleTime().rangeRound([0, width]);
  var y = d3.scaleLinear().rangeRound([height, 0]);
  var startDate = new Date(2016, (month), 1);
  var endDate = new Date(2016, month, 0);
  kpis.forEach(function(kpi, i) {
    if (monthlyData.hasOwnProperty(kpi)) {
      var data = [];
      monthlyData[kpi].forEach(function(d) {
        data.push({ date: new Date(d.Date), value: parseFloat(d.Value) });
      });
      x.domain(d3.extent(data, function(d) { return d.date; }));
      y.domain([0, d3.max(data, function(d) { return d.value; })]);
      var line = d3
        .line()
        .x(function(d) {
          return x(d.date);
        })
        .y(function(d) {
          return y(d.value);
        });
      var g = svg.append('g').attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      g
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", getKpiDashboardColor(i))
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line);
      if (i === 0) {
        svg.append('g')
          .attr("transform", "translate(" + margin.left + "," + 0 + ")")
          .call(d3.axisLeft(y));
        var axisX = d3.scaleTime().rangeRound([0, width]);
        var dates = [];
        data.forEach(function(d, i) {
          if (i % 10 === 0) {
            dates.push(d.date);
          }
        });
        axisX.domain(d3.extent(dates));
        svg.append('g')
          .attr("transform", "translate(" + margin.left + "," + (height + 10) + ")")
          .call(d3.axisBottom(axisX).tickFormat(d3.timeFormat('%m-%d')))
          .selectAll("text")
          .attr('dy', '.15em')
          .attr('dx', '-2.5em')
          .attr("transform", "rotate(-65)");
        svg.append("text")
          .attr("transform",
            "translate(" + (width / 2) + " ," +
            (margin.top / 2) + ")")
          .style("text-anchor", "middle")
          .text((startDate.getMonth() + 1) + '-' + startDate.getFullYear());
      }
    }
  });
}

// load monthly kpi data
var monthlyKpiData = [];
for (var i = 1; i <= 12; i++) {
  $.ajax({ url: "http://localhost:8000/data/sites/allkpis/monthly/data?month=" + i })
    .done(function(data) {
      // console.log('kpi monthly data ', JSON.parse(data));
      var monthlyData = JSON.parse(data);
      monthlyKpiData.push(monthlyData);
      if (monthlyKpiData.length === 12) {
        monthlyKpiData.map(function(data, j) {
          drawKpiMonthlyData(data, j);
        })
      }
    });
};

function getAllKpis() {
  return ["AQI", "SO2", "CO", "O3", "PM2.5", "PM10"];
}