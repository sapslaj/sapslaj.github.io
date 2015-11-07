$(function() {
  var $parent = $('.collapsable');
  $parent.find('.collapsable-header').click(function(e) {
    $parent.find('.collapsable-content').slideToggle('slow');
  });
});
