var location;
var mapDate = '20160101',
  mapTime = '1';
var mapSitesData = {};
var mymap = L.map('mapid').setView([39.90236, 116.39053], 9);
var mapMarks = [];

location["DongSi"] = { longitude: 116.421543, latitude: 39.929411 };
var color = d3
  .scaleLinear()
  .domain([1, 20])
  .clamp(true)
  .range(["#0000", "#409A99"]);
selectedMapKpi = kpiNameArray[0];

function selectMapKpi(name, e) {
  e && e.preventDefault();
  $(".map-districts-label").text(name);
  selectedMapDistrict = name;
  $(".map-districts-label").append('<span class="caret"></span>');
  updateMarks();
}

function loadInitialData() {
  Object.keys(kpiNames).forEach(function(key, i) {
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

// drawMap("#beijing-map", "public/geojson/beijing.geojson");
function drawMap() {

  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
      '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.streets'
  }).addTo(mymap);

}

function updateMarks() {
  mapMarks.forEach(function(mark) {
    mymap.removeLayer(mark);
  });
  mapMarks = [];
  var keys = Object.keys(districtLocation);
  keys.forEach(function(key) {
    if (districtLocation.hasOwnProperty(key)) {
      var district = districtLocation[key];
      var marker = L.marker([district.latitude, district.longitude]).addTo(mymap);
      var values = mapSitesData[key];
      var v = 0;
      values.forEach(function(value) {
        if (value.kpi === selectedMapDistrict) {
          v = value.value;
        }
      })
      marker.bindPopup(`<b>${key}:${v}</b>`);
      mapMarks.push(marker);
    }
  });
}

function loadMapData() {
  var keys = Object.keys(districtLocation);
  var times = 0;
  keys.forEach(function(key) {
    if (districtLocation.hasOwnProperty(key)) {
      $.ajax({ url: "http://localhost:8000/data/site/date/hour?site=" + key + '&date=' + mapDate + '&hour=' + mapTime })
        .done(function(data) {
          var hourData = JSON.parse(data);
          hourData.map(function(d) {
            if (d.value !== 'NaN' && d.value !== NaN) {
              d.value = parseFloat(d.value);
            } else {
              d.value = 0;
            }
          });
          mapSitesData[key] = hourData;
          times++;
          if (times >= 34) {
            updateMarks();
          }
        });
    }
  });
}

$('#map-datetimepicker').datetimepicker({
  minDate: new Date('2016-01-01'),
  maxDate: new Date('2016-12-31'),
  defaultDate: new Date('2016-01-01')
});

$("#map-datetimepicker").on("dp.change", function(e) {
  mapDate = e.date.format('YYYYMMDD');
  mapTime = e.date.format('HH');
  console.log('get date ', mapDate, mapTime)
  if (mapTime && mapDate) {
    // searchDate(date, time);
    loadMapData();
  }
});

loadInitialData();
drawMap();
loadMapData();