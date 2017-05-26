var currentRouter = 'Dashboard';
var parent = 'weather';

function selectRouter() {
  // var select = $('.container').filter(parent + '-' + currentRouter);
  // select.hide();
  // $('.weather-Dashboard').hide();
  // $("div:regex(class, weather-Dashboard)").hide();
  $('.container > div').filter(function() {})
  var e = $('div[class ~= "weather"');
  e.val('xxx')
  console.log(e);
}

function changeNavSelection(e) {
  console.log('change nav selection ', e);
  currentRouter = e;
  selectRouter();
}