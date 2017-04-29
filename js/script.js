
(($ => {

    $.slideshow = (slides, options) => {
        var cover;
        var container_elem;
        var next_button_elem;
        var back_button_elem;
        var start_slide;
        var slides;
        var self;
        var pushed_back = false;

        var slideshow = {
            container : 'slideshow',
            init(raw_slides, options) {
                self = this;
                if (options) {
                    for ( var option in options ) {
                        self[option] = options[option];
                    }
                }

                start_slide = ((() => {
                    if (!document.location.search) {
                        return 0;
                    }
                    if (!document.location.search.match('slide') ) {
                        return 0;
                    }
                    return parseInt(document.location.search.replace('?slide=', ''));
                }))()

                if (typeof(raw_slides) === 'string') {
                    //is a google spreadsheet
                    self.make_slides_from_google_spreadsheet(raw_slides);
                    return self;
                }

                self.slides = self.make_html_from_slide_data(raw_slides);       
                    
                self.create_cover();

                for ( var i = 0; i < self.slides.length; i++ ) {
                    self.append_slide(self.slides[i]);
                }

                jQuery(window).bind("popstate", e => {
                    slide = event.state 
                        ? event.state.slide 
                        : ((() => {
                            if (!document.location.search) {
                                return 0;
                            }
                            if (!document.location.search.match('slide') ) {
                                return 0;
                            }
                            return parseInt(document.location.search.replace('?slide=', ''));
                        }))();

                    if (e.originalEvent.state) {
                        pushed_back = true;
                    }
                    self.swipe.slide(slide);
                });
                pushed_back = false;

                self.swipe = new Swipe(document.getElementById(self.container),
                        {
                            startSlide: parseInt(start_slide),
                            speed: 500,
                            callback(event, index, elem) {
                                cover.find('.control_container .disabled').removeClass('disabled');
                                if (index === 0) {
                                    cover.find('.control_container #slideshow_back_button').addClass('disabled');
                                } else if (index === self.slides.length) {
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

                self.control_container = self.create_controls();
                cover.append(self.control_container)
                if (self.swipe.index === 0) {
                    cover.find('.control_container #slideshow_back_button').addClass('disabled');
                } else if (self.swipe.index === (self.slides.length - 1)) {
                    cover.find('.control_container #slideshow_next_button').addClass('disabled');
                }

                jQuery(document).bind('resize', () => {
                    self.control_container.remove();
                    self.pagination.remove();
                    self.cover.html('');
                    self.init();
                });
                cover.mouseout(e => {
                    jQuery(document).unbind('keydown', self.keydown_event);
                });
                cover.mouseover(() => {
                    jQuery(document).keydown(self.keydown_event);
                });
                return self;
            },
            keydown_event(e) {
                    if (e.keyCode === 37) {
                        self.back()
                    } else if (e.keyCode === 39) {
                        self.next()
                    }
                    return false;
            },
            make_slides_from_google_spreadsheet(spreadsheet_id) {
                Tabletop.init({ 
                    key: spreadsheet_id,
                    callback(data) {
                        var slides_data = self.make_slides_data_from_spreadsheet_data(data);
                        self.init(slides_data, options);
                    },
                    simpleSheet: true
                });
            },

            make_slides_data_from_spreadsheet_data(data) {                    
                return data;                
            },

            make_html_from_slide_data(data) {
                var slides = [];
                for (var i = 0; i < data.length; i++) {
                    var row = data[i];
                    var slide = {}; 
                    slide.html = self.build_slide_html_from_row(row);
                    slides[i] = slide;
                }
                return slides;
            },

            build_slide_html_from_row(row) {

                return '<li '
                    + ( row.backgroundimage 
                            ? 'class="slide_with_background_image" style="background-image: url(\'' + row.backgroundimage + '\');">' 
                            : '>' )
                    + ( row.title 
                            ? '<h1>' + row.title + '</h1>' 
                            : ''  ) 
                    + ( row.image 
                            ? '<img src="' + row.image + '" class="image img-responsive"></img>' 
                            : ''  )
                    
                    + ( row.embed
                            ? '<div class="embed-responsive embed-responsive-4by3">' + row.embed + '</div>'
                            : ''  )
                            
                    + '<p>' + row.text + '</p>'
                            
                    + '</li>';
            },
            
            create_cover() {
                cover = $('#' + self.container);
                container_elem = jQuery('<ul></ul>');
                cover.append(container_elem);
                container_elem.addClass('slideshow_container');
                container_elem.css('padding', '0px');
                self.set_slider_width();
            },
            create_pagination() {
                var pagination_container = jQuery('<ul class="pagination_container" style="display: inline; list-style-type: none;"></ul>');
                for ( var i = 0; i < self.slides.length; i++ ) {
                    item = jQuery('<li class="pagination_' + i
                            + (i === parseInt(start_slide) ? ' selected' : '') 
                            + '">' + (i + 1) +'</li>');
                    (((item, i) => {
                        item.bind('click', () => {
                            self.swipe.slide(i);
                        });
                    }))(item, i);
                    pagination_container.append(item);
                }
                pagination_container.after(jQuery('<span> of ' + self.slides.length + '</span>'));
                return pagination_container;
            },
            set_slider_width() {
                                   return;
               var width;
               if (window.getComputedStyle) {
                   width = window.getComputedStyle(document.getElementById(cover.attr('id'))).width;
               } else {
                   width = document.getElementById(cover.attr('id')).currentStyle.width;
               }
               container_elem.css('width', width);
            },
            create_controls() {
                var control_container = jQuery('<div class="control_container"></div>');
                control_container.append(self.create_back_button_elem());
                self.pagination = self.create_pagination();
                control_container.append(self.pagination);
                control_container.append(self.create_next_button_elem());

                return control_container;
            },
            create_back_button_elem() {
                back_button_elem = $('<a id="slideshow_back_button"' + 
                    ' value="back">Back</a>'
                );
                back_button_elem.click(() => {self.back();});
                back_button_elem.addClass('slideshow_top_controls');
                return back_button_elem;
            },
            create_next_button_elem() {
                next_button_elem = $('<a id="slideshow_next_button"' + 
                    ' value="next">Next</a>'
                );
                next_button_elem.click(() => {self.next();});
                next_button_elem.addClass('slideshow_top_controls');
                return next_button_elem;
            },
            append_slide(slide) {
                slide.element = jQuery(slide.html);
                container_elem.append(slide.element);
            },
            display_slide(slide) {
                self.swipe(slide);
            },
            back() {
               self.swipe.prev();
            },
            next() {
               if ( self.swipe.index !== (self.slides.length - 1) ) { 
                   self.swipe.next();
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
})(jQuery));
