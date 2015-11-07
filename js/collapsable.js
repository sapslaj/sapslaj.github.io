$(function() {
  var $parent = $('.collapsable');
  var $child = $('.collapsable-content');

  $parent.find('.collapsable-header').click(function(e) {
    $child.slideToggle('slow');
  });

  $(window).resize(function () {
    if ($(window).width() >= 1024) {
      $child.attr('style', '');
    }
  });
});
