$.ajax({
  url: "http://localhost:8000/districts"
}).done(function(data) {
  var districts = JSON.parse(data[0]);
  districts.map(function(d) {
    $(".districts-dropdown").append(
      '<li><a href="#" class="districts-dropdown-' + d + '">' + d + "</a></li>"
    );
    $(".districts-dropdown-" + d).click(function(e) {
      e.preventDefault();
      $('.districts-label').text(d)
      $('.districts-label').append('<span class="caret"></span>')
    });
  });
});
