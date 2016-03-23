/**
 * Created by alex on 7/4/14.
 */

(function( $ ){
    var $window = $(window);
    var windowHeight = $window.height();

    $window.resize(function () {
        windowHeight = $window.height();
    });

    $.fn.parallax = function(xpos, speedFactor, outerHeight) {
        var $this = $(this);
        var getHeight;
        var firstTop;
        var paddingTop = 0;
        var isWebkitTransform = (typeof document.body.style['-webkit-transform'] == "undefined" ? false : true);
        if(isWebkitTransform){
            $this.css('position', 'relative');
        }

        //get the starting position of each element to have parallax applied to it

        window.correctFirstTop4Parallax = function(){
            $this.each(function(){
                firstTop = $this.offset().top;
            });
        };

        window.correctFirstTop4Parallax();


        if (outerHeight) {
            getHeight = function(jqo) {
                return jqo.outerHeight(true);
            };
        } else {
            getHeight = function(jqo) {
                return jqo.height();
            };
        }

        // setup defaults if arguments aren't specified
        if (arguments.length < 1 || xpos === null) xpos = "50%";
        if (arguments.length < 2 || speedFactor === null) speedFactor = 0.1;
        if (arguments.length < 3 || outerHeight === null) outerHeight = true;
        // function to be called whenever the window is scrolled or resized
        function update(){
            var pos = $window.scrollTop();

            $this.each(function(){
                var $element = $(this);
                var top = $element.offset().top;
                var height = getHeight($element);
                var rect = this.getBoundingClientRect();
//                var backgroundVerticalShift = -Math.abs(Math.round((firstTop - pos) * speedFactor));
                // Check if totally above or totally below viewport
                if (top + height < pos || top > pos + windowHeight) {
                    return;
                }
                var backgroundVerticalShift = -1 * Math.round(rect.top * speedFactor);
                if(isWebkitTransform){
                    this.style['-webkit-transform'] = "translateY(" + backgroundVerticalShift + "px)";
                }else{
                    this.style['top'] = backgroundVerticalShift + "px";
                }
            });
        }
        $(window).resize(window.correctFirstTop4Parallax);
        $window.bind('scroll', update).resize(update);
        if(document.readyState !== "complete"){
            window.addEventListener('load', function(){
                update();
            });
        }else{
            update();
        }
    };
})(jQuery);
