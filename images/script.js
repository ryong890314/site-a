(function($) {

	function gnb(){
		$("#header").on("click", ".mobile-menu", function(){
			if ( $(this).hasClass("on") ){
				$(this).removeClass("on");
				$("#gnb").removeClass("on");
				$("#dimmed").remove();
			} else {
				$(this).addClass("on");
				$("#gnb").addClass("on");
				$("body").append('<div id="dimmed" />').on("click", "#dimmed", function(){
					$(".mobile-menu").click();
				});
			}
		});

		$(window).resize(function(){
			if ( $("#gnb").css("position") == "relative" ){
				if ( $("#dimmed").is(":visible") ){
					$("#dimmed").remove();
				}
				if ( $(".mobile-menu").hasClass("on") ){
					$(".mobile-menu").click();
				}
			}
		});
	}

	function getCookie(name){
		name = new RegExp(name + '=([^;]*)');
		return name.test(document.cookie) ? unescape(RegExp.$1) : '';
	}

	function mobileTable(){
		var $table = $(".entry-content table");

		if( $table.length > 0 ){
			$table.each(function(){
				if ( $(this).css("table-layout") == "fixed" && !$(this).parent().hasClass("table-wrap") ){
					$(this).wrap('<div class="table-wrap"></div>');
				}
			});
		}
	}

	function iframeWrap(){
		var $iframe = $(".entry-content iframe");

		if( $iframe.length > 0 ){
			$iframe.each(function(){
				if ( !$(this).parent().hasClass("iframe-wrap") ){
					$(this).wrap('<div class="iframe-wrap"></div>');
				}
			});
		}
	}

	// Execute
	gnb();
	if ( $(".cover-slider").length ) coverSlider();
	if ( $(".post-header .list-type").length ) postListType();
	if ( $(".paging-view-more").length && $(".post-item").length ) viewMore();
	if ( $(".entry-content").length ){
		mobileTable();
		iframeWrap();
	}

})(jQuery);
