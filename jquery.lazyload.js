/*
 * jQuery lazyLoad plugin, version 1.0 [2012-06-22]
 * Copyright 2012, Perfect Sense Digital, LLC
 * Author: Brendan Brelsford [brendanb@gmail.com]
 * Licensed under the MIT license [http://opensource.org/licenses/MIT]
 * 
 * Usage:
 * 
 *     Invocation
 *
 *     $('.classSelector').lazyLoad();
 *
 *     Invocation with $.Deferred chaining
 *
 *     $('.classSelector').lazyLoad().then(function() { ... });
 *
 * Events:
 *
 *     The lazyLoad plugin returns a $.Deferred, which covers the equivalent of a "complete" event.  In the specific case of lazy-loading images,
 *     an "error" event will be triggered on the <img> if the lazyLoad fails.  This allows the UI to respond to bad image URLs.  Since iframe loading
 *     doesn't provide an equivalent, the event will never be triggered for iframes.
 * 
 * Options:
 *
 *     Options are passed as a flat javascript object with the following allowed keys:
 *
 *     "srcProp" - The HTML attribute in which the src value is stored.
 *                 Allowed Values: any non-empty string, although "data-" prefixed values are preferred not to conflict with reserved attribute names.
 *                 Default Value: "data-src"
 *
 *     "removeSrcProp" - Indicates whether the attribute keyed by "srcProp" should be removed after the lazyLoad has completed.  This does not affect
 *                 the behavior of lazyLoad when it is invoked multiple times on the same element.  It will always be called only once.
 *                 Allowed Values: true / false
 *                 Default Value: true
 *
 *     "descend" - Indicates whether to search for descendents of the current jQuery set that contain the attribute keyed by "srcProp" and lazy-load them.
 *                 Allowed Values: true / false
 *                 Default Value: true
 *
 *     "loadingClass" - CSS class applied to the objects to be loaded.  This class will be applied as soon as lazyLoad is called and removed from each
 *                 DOMNodeElement as it finishes loading.
 *                 Allowed Values: any non-empty string
 *                 Default Value: "loading"
 *
 *     "maxTimeout" - The time (in milliseconds) after which the $.Deferred returned by lazyLoad will resolve whether or not all pending loads have completed.
 *                 Allowed Values: integer > 0
 *                 Default Value: 1000
 *
 * Examples:
 *
 *     Add lazy-loading into a carousel / slide-show (e.g. Twitter bootstrap-carousel.js): 
 * 
 *     var context = this;
 *     var callback = function() { -- original code to show the slide at specified index -- };
 *     $toSlide.lazyLoad().then(function() {
 *        callback.call(context);
 *     });
 **/

if (typeof jQuery !== 'undefined') {
    (function($) {

        $.fn.lazyLoad = function(opts) {

            var options = $.extend({
                'srcProp': 'data-src',
                'removeSrcProp': true,
                'descend': true,
                'loadingClass': 'loading',
                'maxTimeout': 1000
            }, opts);

            /* find all objects with attribute options.srcProp that are contained in the current selection */
            var $objects = $(this);

            /* if "descend" is set to true, add images that are descendants */
            if(options.descend === true) {
                $objects = $objects.add($objects.find('[' + options.srcProp + ']'));
            }

            var dfdList = [];

            $objects.each(function() {

                var $loadObject = $(this);
                var src = $loadObject.attr('src');
                var newSrc = $loadObject.attr(options.srcProp);

                /* if the image has not been lazy-loaded and has a srcProp, proceed with loading */
                if($loadObject.data('lazyLoad') !== true && newSrc != null) {

                    /* add a new deferred for this image to the array */
                    var dfd = new $.Deferred();
                    dfdList.push(dfd);

                    /* add loading class for CSS convenience */
                    $loadObject.addClass(options.loadingClass);

                    if($loadObject.is('img')) {

                        /* create an anonymous Image and define its load callback */
                        var i = new Image();
                        $(i).load(function() {

                            /* change src attribute to reflect the loaded srcProp */
                            $loadObject.attr('src', newSrc);

                            /* if "removeSrcProp" is set to true, remove the srcProp from the image element */
                            if(options.removeSrcProp) {
                                $loadObject.removeAttr(options.srcProp);
                            }

                            /* delete the anonymous image */
                            delete(i);

                            /* remove CSS loading class */
                            $loadObject.removeClass(options.loadingClass);

                            /* resolve this image's deferred */
                            dfd.resolve();
                        });

                        $(i).error(function() {
                            $loadObject.trigger('error');
                        });

                        /* initiate loading of this image by setting its src prop.
                            load callback will execute when loading is complete */
                        i.src = newSrc;
                    }

                    if($loadObject.is('iframe')) {

                        $loadObject.load(function() {

                            /* if "removeSrcProp" is set to true, remove the srcProp from the iframe element */
                            if(options.removeSrcProp) {
                                $loadObject.removeAttr(options.srcProp);
                            }

                            /* remove CSS loading class */
                            $loadObject.removeClass(options.loadingClass);

                            /* resolve this image's deferred */
                            dfd.resolve();
                        });

                        $loadObject.attr('src', newSrc);
                    }

                    /* set data to indicate that the image has been lazy-loaded */
                    $loadObject.data('lazyLoad', true);
                }
            });

            /* add timeout capability to returned deferred */
            var loadOrTimeout = new $.Deferred();

            /* when all images have loaded, resolve the returned deferred */
            $.when.apply(null, dfdList).then(function() {
                loadOrTimeout.resolve();
            });

            /* alternatively, if a maxTimeout is defined, resolve the returned deferred after the specified timeout has expired */
            if(typeof(options.maxTimeout) === "number") {
                setTimeout(function() {
                    loadOrTimeout.resolve();
                }, options.maxTimeout);
            }

            /* return a deferred that will resolve after all images have loaded or after a specified timeout has expired */
            return loadOrTimeout;
        };
    })(jQuery);
}
