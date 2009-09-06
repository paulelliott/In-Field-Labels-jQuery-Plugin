/*
 * In-Field Label jQuery Plugin
 *
 * Branch Author:
 *   Copyright (c) 2009 Paul Elliott with Red-Line IT
 *   http://github.com/paulelliott/In-Field-Labels-jQuery-Plugin/tree/master
 *
 * Original Author:
 *   Copyright (c) 2009 Doug Neiner
 *   http://fuelyourcoding.com/scripts/infield.html
 *
 * Dual licensed under the MIT and GPL licenses.
 * Uses the same license as jQuery, see:
 * http://docs.jquery.com/License
 *
 * @version 0.1
 */
(function($){
  $.InFieldLabels = function(label,field, options){
    // To avoid scope issues, use 'base' instead of 'this'
    // to reference this class from internal events and functions.
    var base = this;
  
    // Access to jQuery and DOM versions of each element
    base.$label = $(label);
    base.label = label;

 		base.$field = $(field);
		base.field = field;
      
		base.$label.data("InFieldLabels", base);
		base.showing = true;
      
    base.init = function(){
		// Merge supplied options with default options
    base.options = $.extend({},$.InFieldLabels.defaultOptions, options);

		// Check if the field is already filled in
		if (base.$field.val() != ""){
			base.$label.hide();
			base.showing = false;
		};
		
		base.$field.focus(function(){
			base.fadeOnFocus();
		}).blur(function(){
			base.checkForEmpty(true);
		}).bind('keydown.infieldlabel',function(e){
			// Use of a namespace (.infieldlabel) allows us to
			// unbind just this method later
			base.hideOnChange(e);
		}).change(function(e){
			base.checkForEmpty();
		}).bind('onPropertyChange', function(){
			base.checkForEmpty();
		});
  };

	// If the label is currently showing
	// then fade it down to the amount
	// specified in the settings
	base.fadeOnFocus = function(){
		base.showing && base.setOpacity(base.options.fadeOpacity);
	};
	
	base.setOpacity = function(opacity){
		base.$label.stop().animate({ opacity: opacity }, base.options.fadeDuration);
		base.showing = (opacity > 0.0);
	};
	
	// Checks for empty as a fail safe
	// set blur to true when passing from
	// the blur event
	base.checkForEmpty = function(blur){
		if(base.$field.val() == ""){
			base.prepForShow();
			base.setOpacity( blur ? 1.0 : base.options.fadeOpacity );
		} else {
			base.setOpacity(0.0);
		};
	};
	
	base.prepForShow = function(e){
		if(!base.showing) {
			// Prepare for a animate in...
			base.$label.css({opacity: 0.0}).show();
			
			// Reattach the keydown event
			base.$field.bind('keydown.infieldlabel',function(e){
				base.hideOnChange(e);
			});
		};
	};

	base.hideOnChange = function(e){
	  //Skip shift and tab
		if ((e.keyCode == 16) || (e.keyCode == 9)) return; 
		
		if (base.showing) {
			base.$label.hide();
			base.showing = false;
		};
		
		// Remove keydown event to save on CPU processing
		base.$field.unbind('keydown.infieldlabel');
	};
    
	// Run the initialization method
    base.init();
  };

  $.InFieldLabels.defaultOptions = {
    fadeOpacity: 0.5, // Once a field has focus, how transparent should the label be
		fadeDuration: 300 // How long should it take to animate from 1.0 opacity to the fadeOpacity
  };

  $.fn.inFieldLabels = function(options){
    if (options === 'remove') {
      //Removes the label from the selected input fields.
      return this.each(function() {
        var input = $(this);
        input.inFieldLabels('get').remove();
        input.removeData('jquery-infieldlabel-id');
      });
    } else if (options === 'get') {
      //Gets the labels for the selected input fields.
      var labels = [];
      this.each(function() {
        labels = $.merge(labels, $.makeArray($("#" + $(this).data('jquery-infieldlabel-id'))));
      });
      return $(labels);
    } else {
      //Merges the default options into the passed in options.
      if (!options) options = {};
      else if (typeof options === 'string') options = { text : options };
      options = $.extend({}, options, $.InFieldLabels.defaultOptions);
      
      //Applies the labels to the selected input fields.
      return this.each(function(){
        var $input = $(this);
        
        //Create the label and store the id in a data field of the form element.
        var id = "infieldlabel" + labelCount++;
        $input.data("jquery-infieldlabel-id", id);
        $("body").append("<label id='" + id + "' for='" + this.id + "' class='infieldlabel' style='position:absolute;'>" +
          options.text + "</label>");
        var $label = $("#" + id);

        //This will prevent an overlay from closing is in case the label is rendered inside an overlay.
        $label.click(function() {
          $input.focus();
          return false;
        });

        //Calculate the offset and padding for the label based on that of the input.
        var offset = $input.offset();
        console.log($input.outerHeight(true) + "~" + $input.innerHeight());
        $label.css({
          'z-index': 99999,
          top: offset.top + "px",
          left: offset.left + "px",
          padding: (($input.outerHeight(true) - $input.innerHeight()) / 2) + "px " +
            ((($input.outerWidth(true) - $input.innerWidth()) / 2)) + "px"
        });

    		// Only create object for input[text], input[password], or textarea
        (new $.InFieldLabels($label[0], this, options));
      });
    }
  };
  
  var labelCount = 0;
})(jQuery);
