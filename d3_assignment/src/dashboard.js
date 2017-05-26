var kpisMeanData;

function drawKpiSummaries() {
  $('.kpi-summary:nth-child(1)>.header>.value').text(kpisMeanData['AQI'])
  $('.kpi-summary:nth-child(2)>.header>.value').text(kpisMeanData['PM2.5'])
  $('.kpi-summary:nth-child(3)>.header>.value').text(kpisMeanData['PM10'])
  $('.kpi-summary:nth-child(4)>.header>.value').text(kpisMeanData['CO'])
  $('.kpi-summary:nth-child(5)>.header>.value').text(kpisMeanData['NO2'])
  $('.kpi-summary:nth-child(6)>.header>.value').text(kpisMeanData['SO2'])
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
  console.log('kpi mean ', kpisMeanData)
  drawKpiSummaries();
});


function getAllKpis() {
  return ["AQI", "PM2.5", "PM10", "CO", "NO2", "SO2"];
}