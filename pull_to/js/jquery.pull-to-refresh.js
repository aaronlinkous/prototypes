(function($){
  $.fn.pull_to_refresh = function(options) {

    var defaults = {
      refresh: function(callback){},
      pull_to_refresh_text: 'Pull Down to View Products',
      letgo_text: '...and release!',
      refreshing_text: 'Pull Down to View Products',
      status_indicator_id: 'pull_to_refresh',
      refresh_class: 'refresh',
      visible_class: 'visible',
    };
    var options = $.extend(defaults, options);

    var content,
        status_indicator,
        refreshing,
        contentStartY = 0,
        startY = 0,
        track = false,
        refresh = false;

    var removeTransition = function() {
      content.css('-webkit-transition-duration',0);
      status_indicator.removeClass(options.refresh_class);
      status_indicator.removeClass(options.visible_class)
      status_indicator.text(options.pull_to_refresh_text)
    };

    // get the different objects
    content = $(this);

    // create the container for the pull indicator
    content.prepend('<div id="' + options.status_indicator_id + '">' + options.pull_to_refresh_text + '</div>');
    status_indicator = $('#' + options.status_indicator_id);

    // make sure the content is absolute positioned
    content.css('position','absolute');
    content.css('top',0);

    // move the pull_to_refresh to the top
    status_indicator.css('position','absolute');
    status_indicator.css('top','-' + status_indicator.height() + 'px');
    status_indicator.css('display','block');

    // add the listener for the touchdown event, and set the initial values
    document.body.addEventListener('touchstart', touchstart_event);
	function touchstart_event(e) {
      try {
        contentStartY = parseInt(content.css('top'));
      }
      catch(e) {
        contentStartY = 0;
      }
      startY = e.touches[0].screenY;
    }

function isScrolledIntoView(elem)
{
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}

    // this is where the magic happens, if we stop moving, we check
    // whether we haved moved enough, if so, we set a nice transition, and 
    // start the callback
    document.body.addEventListener('touchend', touchend_event); 
	function touchend_event(e) {
      if(refresh) {
		document.body.removeEventListener('touchmove',touchmove_event);
        content.css('-webkit-transition-duration','.5s');
        content.css('top',0);
        status_indicator.addClass(options.refresh_class);
        options.refresh(function() { });

        refresh = false;
      } else if(track) {
       $("#hidden_area").animate({
	        height: 0,
	        opacity: 0
        },250);
        content.css('-webkit-transition-duration','.25s');
        content.css('top','0');

      }

      track = false;
    }

    // on moving of the touch event, we move the diff down
    // unfortunately, for this to work, we need to prevent the default
    // behaviour, which means a broken bounce, any tips would be appreciated!
    document.body.addEventListener('touchmove',touchmove_event);
	function touchmove_event(e) {
      e.preventDefault(); // <- bummer!

	  if(isScrolledIntoView(".stop")) console.log("visible");

      var move_to = contentStartY - (startY - e.changedTouches[0].screenY);
      if(move_to > 0) track = true; // start tracking if near the top 
      content.css('top',move_to + 'px');
      percent = move_to / (status_indicator.height());
      $("#hidden_area").height(move_to).css("opacity",percent);

      // have we pull the whole indicator down?
      if(move_to > status_indicator.height()) {
        refresh = true;
        status_indicator.addClass(options.visible_class)

		document.body.removeEventListener('touchstart',touchstart_event);
      } else {
        content.css('-webkit-transition','');
        refresh = false;
      }
    }

	$("#close").on("click", function(e) {
		$("#hidden_area").animate({
			height: 0,
			opacity: 0
		});
	});

  }
})(jQuery);