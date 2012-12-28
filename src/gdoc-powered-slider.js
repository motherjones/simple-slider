
(function($) {

    $.slideshow = function(slides, options) {
        var cover;
        var container_elem;
        var next_button_elem;
        var back_button_elem;
        var start_slide;
        var slides;
        var that;
        var pushed_back = false;

        var slideshow = {
            container : 'slideshow_container',
            init : function(slides, options) {
                that = this;
                if (options) {
                    for ( var option in options ) {
                        that[option] = options[option];
                    }
                }

                start_slide = (function() {
                    if (!document.location.search) {
                        return 0;
                    }
                    if (!document.location.search.match('slide') ) {
                        return 0;
                    }
                    return parseInt(document.location.search.replace('?slide=', ''));
                })()

                if (typeof(slides) === 'string') {
                    //is a google spreadsheet
                    that.make_slides_from_google_spreadsheet(slides);
                    return that;
                }
                that.slides = slides;
                    
                that.create_cover();

                for ( var i = 0; i < that.slides.length; i++ ) {
                    that.append_slide(slides[i]);
                }

                jQuery(window).bind("popstate", function(e) {
                    slide = event.state 
                        ? event.state.slide 
                        : (function() {
                            if (!document.location.search) {
                                return 0;
                            }
                            if (!document.location.search.match('slide') ) {
                                return 0;
                            }
                            return parseInt(document.location.search.replace('?slide=', ''));
                        })();

                    if (e.originalEvent.state) {
                        pushed_back = true;
                    }
                    that.swipe.slide(slide);
                });
                pushed_back = false;

                that.swipe = new Swipe(document.getElementById(that.container),
                        {
                            startSlide: parseInt(start_slide),
                            speed: 500,
                            callback: function(event, index, elem) {
                                cover.find('.control_container .disabled').removeClass('disabled');
                                if (index === 0) {
                                    cover.find('.control_container #slideshow_back_button').addClass('disabled');
                                } else if (index === that.slides.length) {
                                    cover.find('.control_container #slideshow_next_button').addClass('disabled');
                                }
                                cover.find('.selected').removeClass('selected');
                                cover.find('.pagination_' + index).addClass('selected');
                                if (!pushed_back) {
                                    history.pushState({slide: parseInt(index)}, 'slide ' + index, '?slide=' + index);
                                }
                                pushed_back = false;
                            }
                        }
                );

                that.control_container = that.create_controls();
                cover.append(that.control_container)
                if (that.swipe.index === 0) {
                    console.log(cover.find('.control_container #slideshow_back_button'));
                    cover.find('.control_container #slideshow_back_button').addClass('disabled');
                } else if (that.swipe.index === (that.slides.length - 1)) {
                    cover.find('.control_container #slideshow_next_button').addClass('disabled');
                }

                jQuery(document).bind('resize', function() {
                    that.control_container.remove();
                    that.pagination.remove();
                    that.cover.html('');
                    that.init();
                });
                cover.mouseout(function(e) {
                    jQuery(document).unbind('keydown', that.keydown_event);
                });
                cover.mouseover(function() {
                    jQuery(document).keydown(that.keydown_event);
                });
                return that;
            },
            keydown_event : function(e) {
                    if (e.keyCode === 37) {
                        that.back()
                    } else if (e.keyCode === 39) {
                        that.next()
                    }
                    return false;
            },
            make_slides_from_google_spreadsheet: function(spreadsheet_id) {
                Tabletop.init({ 
                    key: spreadsheet_id,
                    callback: function(data) {
                        var slides_data = that.make_slides_data_from_spreadsheet_data(data);
                        that.init(slides_data, options);
                    },
                    simpleSheet: true
                });
            },
            make_slides_data_from_spreadsheet_data: function(data) {
                var slides = [];
                for (var i = 0; i < data.length; i++) {
                    var row = data[i];
                    var slide = {}; 
                    slide.html = that.build_slide_html_from_row(row);
                    slides[i] = slide;
                }
                return slides;
            },
            build_slide_html_from_row: function(row) {
                return '<li '
                    + ( row.backgroundimage 
                            ? 'style="background-image: url(\'' + row.backgroundimage + '\');">' 
                            : '>' )
                    + ( row.topimage 
                            ? '<img src="' + row.topimage + '" class="topimage"></img>' 
                            : ''  )
                    + ( row.title 
                            ? '<h1>' + row.title + '</h1>' 
                            : ''  )
		            + ( row.middleimage 
		                    ? '<img src="' + row.middleimage + '" class="middleimage"></img>' 
		                    : ''  )
                    + '<p>' + row.text + '</p>'
                    + ( row.bottomimage 
                            ? '<img src="' + row.bottomimage + '" class="bottomimage"></img>' 
                            : ''  )
                    + '</li>';
            },
            create_cover : function() {
                cover = $('#' + that.container);
                container_elem = jQuery('<ul></ul>');
                cover.append(container_elem);
                container_elem.addClass('slideshow_container');
                container_elem.css('padding', '0px');
                that.set_slider_width();
            },
            create_pagination: function() {
                var pagination_container = jQuery('<ul class="pagination_container" style="display: inline; list-style-type: none;"></ul>');
                for ( var i = 0; i < that.slides.length; i++ ) {
                    item = jQuery('<li class="pagination_' + i
                            + (i === parseInt(start_slide) ? ' selected' : '') 
                            + '">' + (i + 1) +'</li>');
                    (function(item, i) {
                        item.bind('click', function() {
                            that.swipe.slide(i);
                        });
                    })(item, i);
                    pagination_container.append(item);
                }
                pagination_container.after(jQuery('<span> of ' + that.slides.length + '</span>'));
                return pagination_container;
            },
            set_slider_width : function() {
                                   return;
               var width;
               if (window.getComputedStyle) {
                   width = window.getComputedStyle(document.getElementById(cover.attr('id'))).width;
               } else {
                   width = document.getElementById(cover.attr('id')).currentStyle.width;
               }
               container_elem.css('width', width);
            },
            create_controls : function() {
                var control_container = jQuery('<div class="control_container"></div>');
                control_container.append(that.create_back_button_elem());
                that.pagination = that.create_pagination();
                control_container.append(that.pagination);
                control_container.append(that.create_next_button_elem());

                return control_container;
            },
            create_back_button_elem : function() {
                back_button_elem = $('<a id="slideshow_back_button"' + 
                    ' value="back">Back</a>'
                );
                back_button_elem.click(function(){that.back();});
                back_button_elem.addClass('slideshow_top_controls');
                return back_button_elem;
            },
            create_next_button_elem : function() {
                next_button_elem = $('<a id="slideshow_next_button"' + 
                    ' value="next">Next</a>'
                );
                next_button_elem.click(function(){that.next();});
                next_button_elem.addClass('slideshow_top_controls');
                return next_button_elem;
            },
            append_slide : function(slide) {
                slide.element = jQuery(slide.html)
                container_elem.append(slide.element);
            },
            display_slide : function(slide) {
                that.swipe(slide);
            },
            back : function() {
               that.swipe.prev();
            },
            next : function() {
               if ( that.swipe.index !== (that.slides.length - 1) ) { 
                   that.swipe.next();
               }
            }
        };
        return slideshow.init(slides, options);
    };

    $.fn.slideshow = function(slides, options) {
        options = options || {};
        options.container = this.attr('id');
        this.slideshow = $.slideshow(slides, options);
        return this;
    };
}(jQuery));
