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
var kpiNameArray = ["AQI", "PM2.5", "PM10", "PM2.5_24h", "PM10_24h"];
var kpiNames = {
  aqi: kpiNameArray[0],
  pm25: kpiNameArray[1],
  pm10: kpiNameArray[2],
  pm2524: kpiNameArray[3],
  pm1024: kpiNameArray[4]
};