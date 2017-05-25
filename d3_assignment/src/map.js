// var map = d3.geomap().geofile("public/topojson/world/countries.json");
// d3.select("#map").call(map.draw, map);
var location;
location["DongSi"] = { longitude: 116.421543, latitude: 39.929411 };
var color = d3
  .scaleLinear()
  .domain([1, 20])
  .clamp(true)
  .range(["#0000", "#409A99"]);

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
  var width = 1200;
  var height = 600;
  d3.json(jsonFile, function(error, json) {
    if (error) throw error;
    console.log("json:", json);
    var projection = d3.geoMercator().fitSize([width, height], json);
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

    svg
      .selectAll("rect")
      .data(Object.keys(districtLocation))
      .enter()
      .append("rect")
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
      .attr("height", "40px")
      .attr("width", "40px")
      .attr("fill", "red");

    svg
      .selectAll("text")
      .data(Object.keys(districtLocation))
      .enter()
      .append("text")
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
        return d;
      });
  });
}

// drawMap(".us-state", "public/topojson/us-states.json");
// drawMap(".china", "public/china.json");
drawMap("#map", "public/geojson/beijing.geojson");