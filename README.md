lazyload.js
===========

a jQuery plugin for lazy-loading images, then getting on with your code

## Overview

lazyLoad makes use of [jQuery's $.Deferred](http://api.jquery.com/category/deferred-object/) implementation, introduced in version 1.5.
While this imposes a minimum version restriction on the jQuery dependency, I feel that it makes the plugin code itself easier to read and modify.

In addition, slide-shows / photo galleries / carousels are the most common contexts for implementing lazy-loading functionality.  In these applications, the lazy-loading of an image contained within a slide or carousel item is typically followed by a transition between slides.  The $.Deferred object returned from all lazyLoad calls provides a great way to indicate the start of the transition code without synchronously stopping JavaScript execution.

## Examples

I've used lazyLoad in a number of different gallery-like applications, but it's difficult to come up with illustrative examples without pasting the entire contents of the gallery JS code into this project.

So I have decided to include one such example - the most simple implementation of lazy-loading I could find as a [four-line modification](https://github.com/gitastrophe/lazyload.js/blob/master/examples/bootstrap-carousel.js) to the [Twitter bootstrap carousel](http://twitter.github.com/bootstrap/javascript.html#carousel) JS source.
I don't particularly like digging through other peoples' code either, so I'm pasting the summary of those changes as a code snippet here:

    var context = this; /* lazyLoad */
    var callback = function() { /* lazyLoad */
    
      if ($.support.transition && this.$element.hasClass('slide')) {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $next.addClass(type)
        $next[0].offsetWidth // force reflow
        $active.addClass(direction)
        $next.addClass(direction)
        this.$element.one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
      } else {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $active.removeClass('active')
        $next.addClass('active')
        this.sliding = false
        this.$element.trigger('slid')
      }

      isCycling && this.cycle()

    }; /* lazyLoad */

    $next.lazyLoad().then(function() { callback.call(context); }); /* lazyLoad, then call workhorse code */

    return this

The four added lines are all noted with inline JavaScript comments.