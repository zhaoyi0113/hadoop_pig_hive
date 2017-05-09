// var map = d3.geomap().geofile("public/topojson/world/countries.json");
// d3.select("#map").call(map.draw, map);

function drawUS(selector, jsonFile) {
  var svg = d3.select(selector);
  var path = d3.geo.path();
  d3.json(jsonFile, function(error, json) {
    if (error) throw error;
    console.log("json:", json);
    svg
      .selectAll("path")
      .data(json.features)
      .enter()
      .append("path")
      .attr("d", path)
      .style("stroke", "#fff")
      .style("stroke-width", "1")
      .style("fill", function(d) {
        // console.log(d);
        return "blue";
      });
  });
}

drawUS(".us-state", "public/topojson/us-states.json");
// drawUS(".china", "public/china.json");
