var currentRouter = 'Dashboard';
var parent = 'weather';

function selectRouter() {
  var e = $('.container > div');
  // $(`.container div[class = "weather-${currentRouter}"`).show();
  e.each(function() {
    if ($(this).attr('class') != `${parent}-${currentRouter}`) {
      $(this).hide();
    } else {
      $(this).show();
    }
  });
}

function changeNavSelection(e) {
  currentRouter = e;
  selectRouter();
}

$(document).ready(function() {
  $('.container > div').hide();
  $('.container > .weather-Dashboard').show();
});