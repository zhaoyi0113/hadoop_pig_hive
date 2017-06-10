$(function() {
  $('#datetimepicker12').datetimepicker({
    inline: true,
    sideBySide: true
  });
  $("#datetimepicker12").on("dp.change", function(e) {
    var date = e.date.format('YYYYmmDD');
    var time = parseInt(e.date.format('HH'));

  });

});