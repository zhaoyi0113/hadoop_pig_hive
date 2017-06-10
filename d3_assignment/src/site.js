var site1Selection, site2Selection;
var date = new moment('2016-01-01').format('YYYYMMDD'),
  time;

function drawHourData(siteIndex, data) {
  // set the dimensions and margins of the graph
  var svg = d3.select(`.hourly-data-chart-svg-site${siteIndex+1}`);
  svg.selectAll('.bar').remove();
  svg.selectAll('text').remove();
  svg.selectAll('line').remove();
  var width = svg.attr('width');
  var height = svg.attr('height');
  var margin = { top: 10, right: 30, bottom: 30, left: 40 },
    width = width - margin.left - margin.right,
    height = height - margin.top - margin.bottom;

  // parse the date / time
  var parseDate = d3.timeParse("%d-%m-%Y");

  // set the ranges
  var x = d3.scaleBand().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);
  svg.attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  // Scale the range of the data in the y domain
  y.domain([0, d3.max(data, function(d) { return d.value; })]);
  x.domain(data.map(function(d) { return d.kpi }));

  // append the bar rectangles to the svg element
  svg.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("transform", `translate(${margin.left},0)`)
    .attr("x", function(d) { return x(d.kpi) })
    .attr("y", function(d) { return y(d.value) })
    .attr("width", width / data.length)
    .attr("height", function(d) { return height - y(d.value); })
    .attr("fill", function(d, i) {
      return getKpiDashboardColor(i);
    });
  svg
    .append("g")
    .attr("margin-left", "20px")
    .attr("transform", "translate(40," + (height + 10) + ")")
    .call(d3.axisBottom(x));
  svg
    .append("g")
    .attr("transform", "translate(20,0)")
    .call(d3.axisLeft(y));
}

function searchDate(date, hour) {
  [site1Selection, site2Selection].map(function(site, i) {
    site && $.ajax({ url: "http://localhost:8000/data/site/date/hour?site=" + site + '&date=' + date + '&hour=' + hour })
      .done(function(data) {
        var hourData = JSON.parse(data);
        hourData.map(function(d) {
          if (d.value !== 'NaN' && d.value !== NaN) {
            d.value = parseFloat(d.value);
          } else {
            d.value = 0;
          }
        })
        hourData = hourData.filter(function(d) { return kpiNameArray.includes(d.kpi) });
        drawHourData(i, hourData);
      })
  })
}

$(function() {
  $('#datetimepicker12').datetimepicker({
    inline: true,
    sideBySide: true,
    minDate: new Date('2016-01-01'),
    maxDate: new Date('2016-12-31'),
    defaultDate: new Date('2016-01-01')
  });
  $("#datetimepicker12").on("dp.change", function(e) {
    date = e.date.format('YYYYMMDD');
    if (time && date) {
      searchDate(date, time);
    }
  });
  $('#datetimepicker3').datetimepicker({
    format: 'LT'
  });
  $("#datetimepicker3").on("dp.change", function(e) {
    time = parseInt(e.date.format('HH'));
    if (time && date) {
      searchDate(date, time);
    }
  });
});


$.ajax({
  url: "http://localhost:8000/districts"
}).done(function(data) {
  var districts = JSON.parse(data[0]);
  districts.sort();
  site1Selection = districts[0];
  site2Selection = districts[1];
  $(".site1-button-label").text(site1Selection);
  $(".site2-button-label").text(site2Selection);
  $(".site1-button-label").append('<span class="caret"></span>');
  $(".site2-button-label").append('<span class="caret"></span>');
  districts.map(function(d) {
    ['site1', 'site2'].map(function(site) {
      $(`.${site}-dropdown`).append(
        '<li><a href="#" class="' + site + '-dropdown-' + d + '">' + d + "</a></li>"
      );
      $("." + site + "-dropdown-" + d).click(function(e) {
        e.preventDefault();
        $(`.${site}-button-label`).text(d);
        if (site === 'site1') {
          site1Selection = d;
        } else {
          site2Selection = d;
        }
        $(`.${site}-button-label`).append('<span class="caret"></span>');
        if (date && time) {
          searchDate(date, time);
        }
      });
    });
  });
});