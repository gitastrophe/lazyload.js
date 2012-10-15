lazyload.js
===========

a jQuery plugin for lazy-loading images, then getting on with your code

## Overview

lazyLoad makes use of [jQuery's $.Deferred](http://api.jquery.com/category/deferred-object/) implementation, introduced in version 1.5.
While this imposes a minimum version restriction on the jQuery dependency, I feel that it makes the plugin code itself easier to read and modify.

In addition, slide-shows / photo galleries / carousels are the most common contexts for implementing lazy-loading functionality.  In these applications, the lazy-loading of an image contained within a slide or carousel item is typically followed by a transition between slides.  The $.Deferred object returned from all lazyLoad calls provides a great way to indicate the start of the transition code without synchronously stopping JavaScript execution.