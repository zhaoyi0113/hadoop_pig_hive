var location;
location["DongSi"] = { longitude: 116.421543, latitude: 39.929411 };
var color = d3
  .scaleLinear()
  .domain([1, 20])
  .clamp(true)
  .range(["#0000", "#409A99"]);

function selectMapKpi(name, e) {
  e.preventDefault();
  $(".map-districts-label").text(name);
  selectedMapDistrict = name;
  $(".map-districts-label").append('<span class="caret"></span>');
  drawKpiOnMap('#beijing-map', kpiDataBySites[name]);
}

function loadInitialData() {
  // $(".map-districts-dropdown").append(
  //   '<li><a href="#" class="map-districts-dropdown-all">All</a></li>'
  // );
  // $(".map-districts-dropdown-all").click(function(e) {
  //   selectMapKpi('All', e);
  // });

  Object.keys(kpiNames).forEach(function(key) {
    var value = kpiNames[key];
    $(".map-districts-dropdown").append(
      '<li><a href="#" class="map-districts-dropdown-' + key + '">' + value + "</a></li>"
    );
    if (selectedMapKpi) {
      $(".map-districts-label").text(selectedMapKpi);
      $(".map-districts-label").append('<span class="caret"></span>');
    }
    $(".map-districts-dropdown-" + key).click(function(e) {
      selectMapKpi(value, e);
    });
  });

  $.ajax({
    url: "http://localhost:8000/data/sites/kpis"
  }).done(function(data) {
    kpiDataBySites = JSON.parse(data);
    // console.log('kpi data by site', kpiDataBySites);
  });
}
// Get province name
function nameFn(d) {
  return d && d.properties ? d.properties.NAME : null;
}
// Get province name length
function nameLength(d) {
  var n = nameFn(d);
  return n ? n.length : 0;
}

// Get province color
function fillFn(d) {
  return color(nameLength(d));
}

function drawMap(selector, jsonFile) {
  var svg = d3.select(selector);
  var width = 960;
  var height = 600;
  d3.json(jsonFile, function(error, json) {
    if (error) throw error;
    // console.log("json:", json);
    projection = d3.geoMercator().fitSize([width, height], json);
    var path = d3.geoPath().projection(projection);

    function mouseover(d) {
      // Highlight hovered province
      d3.select(this).style("fill", "orange");

      // Draw effects
      // textArt(nameFn(d));
    }

    function mouseout(d) {
      // Reset province color
      svg.selectAll("path").style("fill", function(d) {
        return fillFn(d);
      });

      // Remove effect text
      // effectLayer.selectAll("text").transition().style("opacity", 0).remove();

      // Clear province name
      // bigText.text("");
    }

    svg
      .selectAll("path")
      .data(json.features)
      .enter()
      .append("path")
      .attr("d", path)
      .style("stroke", "red")
      .style("stroke-width", "1")
      .style("fill", fillFn)
      .on("mouseover", mouseover)
      .on("mouseout", mouseout);

    drawKpiOnMap("#beijing-map");
  });
}

function drawKpiOnMap(selector, siteData) {
  var svg = d3.select(selector);
  d3.selectAll(selector + "  .site-container").remove();
  d3.selectAll(selector + "  .site-container-text").remove();
  svg
    .selectAll("rect")
    .data(Object.keys(districtLocation))
    .enter()
    .append("rect")
    .attr("class", "site-container map-site-rect")
    .attr("x", function(d) {
      const t = projection([
        districtLocation[d].longitude,
        districtLocation[d].latitude
      ]);
      return t[0];
    })
    .attr("y", function(d) {
      const t = projection([
        districtLocation[d].longitude,
        districtLocation[d].latitude
      ]);
      return t[1];
    })
    .attr("height", "20px")
    .attr("width", "80px")
    .attr("fill", "yellow");

  svg
    .selectAll("text")
    .data(Object.keys(districtLocation))
    .enter()
    .append("text")
    .attr("class", "site-container-text")
    .attr("dx", function(d) {
      const t = projection([
        districtLocation[d].longitude,
        districtLocation[d].latitude
      ]);
      return t[0] + 3;
    })
    .attr("dy", function(d) {
      const t = projection([
        districtLocation[d].longitude,
        districtLocation[d].latitude
      ]);
      return t[1] + 12;
    })
    .attr("font-size", "8px")
    .text(function(d) {
      if (siteData && siteData[d]) {
        var v = parseFloat(Math.round(siteData[d] * 100) / 100).toFixed(2);
        return d + ': ' + v;
      }
      return d;
    });
};


drawMap("#beijing-map", "public/geojson/beijing.geojson");

loadInitialData();