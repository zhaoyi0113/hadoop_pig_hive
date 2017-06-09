var getUrlParameter = function getUrlParameter(sParam) {
  var sPageURL = decodeURIComponent(window.location.search.substring(1)),
    sURLVariables = sPageURL.split("&"),
    sParameterName,
    i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split("=");

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? true : sParameterName[1];
    }
  }
};

var selectedMapKpi = "Select";
var kpiNameArray = ["AQI", "SO2", "CO", "O3", "PM2.5", "PM10"];
var kpiNames = {
  aqi: kpiNameArray[0],
  so2: kpiNameArray[1],
  co: kpiNameArray[2],
  o3: kpiNameArray[3],
  pm25: kpiNameArray[4],
  pm10: kpiNameArray[5],
};