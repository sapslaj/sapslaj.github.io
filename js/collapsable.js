$(function() {
  var $parent = $('.collapsable');
  $parent.find('.collapsable-header').click(function(e) {
    var $child = $('.collapsable-content');
    if (!$child.data('original-display')) {
      $child.data('original-display', $child.css('display'));
    }
    $child.slideToggle('slow');
  });

  $(window).resize(function() {
    var $content = $('.collapsable-content');
    var original_display;

    console.log($content.data('original-display'));
    if (original_display = $content.data('original-display')) {
      $content.css('display', original_display);
    }
  });
});
