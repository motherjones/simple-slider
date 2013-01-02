
(function($) {

    $.slideshow = function(slides, options) {
        var cover;
        var container_elem;
        var next_button_elem;
        var back_button_elem;
        var start_slide;
        var slides;
        var self;
        var pushed_back = false;

        var slideshow = {
            container : 'slideshow_container',
            init : function(raw_slides, options) {
                self = this;
                if (options) {
                    for ( var option in options ) {
                        self[option] = options[option];
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

                if (typeof(raw_slides) === 'string') {
                    //is a google spreadsheet
                    self.make_slides_from_google_spreadsheet(raw_slides);
                    return self;
                }

				self.calculate_aspectratios(raw_slides);

                self.slides = self.make_html_from_slide_data(raw_slides);		
                    
                self.create_cover();

                for ( var i = 0; i < self.slides.length; i++ ) {
                    self.append_slide(self.slides[i]);
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
                    self.swipe.slide(slide);
                });
                pushed_back = false;

                self.swipe = new Swipe(document.getElementById(self.container),
                        {
                            startSlide: parseInt(start_slide),
                            speed: 500,
                            callback: function(event, index, elem) {
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

                jQuery(document).bind('resize', function() {
                    self.control_container.remove();
                    self.pagination.remove();
                    self.cover.html('');
                    self.init();
                });
                cover.mouseout(function(e) {
                    jQuery(document).unbind('keydown', self.keydown_event);
                });
                cover.mouseover(function() {
                    jQuery(document).keydown(self.keydown_event);
                });
                return self;
            },
            keydown_event : function(e) {
                    if (e.keyCode === 37) {
                        self.back()
                    } else if (e.keyCode === 39) {
                        self.next()
                    }
                    return false;
            },
            make_slides_from_google_spreadsheet: function(spreadsheet_id) {
                Tabletop.init({ 
                    key: spreadsheet_id,
                    callback: function(data) {
                        var slides_data = self.make_slides_data_from_spreadsheet_data(data);
                        self.init(slides_data, options);
                    },
                    simpleSheet: true
                });
            },

			make_slides_data_from_spreadsheet_data: function(data) {					
				return data;				
			},

            make_html_from_slide_data: function(data) {
				var slides = [];
                for (var i = 0; i < data.length; i++) {
                    var row = data[i];
                    var slide = {}; 
                    slide.html = self.build_slide_html_from_row(row);
                    slides[i] = slide;
                }
                return slides;
            },

            build_slide_html_from_row: function(row) {

                return '<li '
                    + ( row.backgroundimage 
                            ? 'class="slide_with_background_image" style="background-image: url(\'' + row.backgroundimage + '\');">' 
                            : '>' )
                    + ( row.topimage 
                            ? '<img src="' + row.topimage + '" class="topimage"></img>' 
                            : ''  )
					
					+ ( row.topaspectratio
							? '<div class="videoembed" style="padding-bottom:' + row.topaspectratio + '%">' + row.topvideoembed + '</div>'
							: ''  )			
							
                    + ( row.title 
                            ? '<h1>' + row.title + '</h1>' 
                            : ''  )

		            + ( row.middleimage 
		                    ? '<img src="' + row.middleimage + '" class="middleimage"></img>' 
		                    : ''  )
					
					+ ( row.middleaspectratio
							? '<div class="videoembed" style="padding-bottom:' + row.middleaspectratio + '%">' + row.middlevideoembed + '</div>'
							: ''  )
							
                    + '<p>' + row.text + '</p>'

                    + ( row.bottomimage 
                            ? '<img src="' + row.bottomimage + '" class="bottomimage"></img>' 
                            : ''  )

					+ ( row.bottomaspectratio
							? '<div class="videoembed" style="padding-bottom:' + row.bottomaspectratio + '%">' + row.bottomvideoembed + '</div>'
							: ''  )
							
                    + '</li>';
            },

			find_aspectratio: function(videoembed) {
				var height = videoembed.match(/height="\d+"/);
				if (!height[0]) {
					console.log('Your video embed code needs a height.');
					return;
				};
				height = parseInt(height[0].replace(/height="/, '').replace(/"/, ''));
				console.log(height);
				
//				<iframe width="640" height="480" src="http://www.youtube.com/embed/DpS9Z3dj2To" frameborder="0" allowfullscreen></iframe>
				
				var width = videoembed.match(/width="\d+"/);
				if (!width[0]) {
					console.log('Your video embed code needs a width.');
					return;
				};
				width = parseInt(width[0].replace(/width="/, '').replace(/"/, ''));
				console.log(width);
			
				return (height / width)*100;
			},			
			
			calculate_aspectratios: function(data) {
				
				for (var i = 0; i < data.length; i++) {
					var row = data[i];
						if (row.topvideoembed) {
							row.topaspectratio = self.find_aspectratio(row.topvideoembed);
						}

						if (row.middlevideoembed) {
							row.middleaspectratio = self.find_aspectratio(row.middlevideoembed);
						}

						if (row.bottomvideoembed) {
							row.bottomaspectratio = self.find_aspectratio(row.bottomvideoembed);
						}
					}				
			},
			
            create_cover : function() {
                cover = $('#' + self.container);
                container_elem = jQuery('<ul></ul>');
                cover.append(container_elem);
                container_elem.addClass('slideshow_container');
                container_elem.css('padding', '0px');
                self.set_slider_width();
            },
            create_pagination: function() {
                var pagination_container = jQuery('<ul class="pagination_container" style="display: inline; list-style-type: none;"></ul>');
                for ( var i = 0; i < self.slides.length; i++ ) {
                    item = jQuery('<li class="pagination_' + i
                            + (i === parseInt(start_slide) ? ' selected' : '') 
                            + '">' + (i + 1) +'</li>');
                    (function(item, i) {
                        item.bind('click', function() {
                            self.swipe.slide(i);
                        });
                    })(item, i);
                    pagination_container.append(item);
                }
                pagination_container.after(jQuery('<span> of ' + self.slides.length + '</span>'));
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
                control_container.append(self.create_back_button_elem());
                self.pagination = self.create_pagination();
                control_container.append(self.pagination);
                control_container.append(self.create_next_button_elem());

                return control_container;
            },
            create_back_button_elem : function() {
                back_button_elem = $('<a id="slideshow_back_button"' + 
                    ' value="back">Back</a>'
                );
                back_button_elem.click(function(){self.back();});
                back_button_elem.addClass('slideshow_top_controls');
                return back_button_elem;
            },
            create_next_button_elem : function() {
                next_button_elem = $('<a id="slideshow_next_button"' + 
                    ' value="next">Next</a>'
                );
                next_button_elem.click(function(){self.next();});
                next_button_elem.addClass('slideshow_top_controls');
                return next_button_elem;
            },
            append_slide : function(slide) {
                slide.element = jQuery(slide.html);
                container_elem.append(slide.element);
            },
            display_slide : function(slide) {
                self.swipe(slide);
            },
            back : function() {
               self.swipe.prev();
            },
            next : function() {
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
}(jQuery));
