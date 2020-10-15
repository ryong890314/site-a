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

	function coverSlider(){
		var $slider = $(".cover-slider");

		$slider.each(function(){
			var $this = $(this),
				$sliderItem = $(this).find("li"),
				itemLength = $sliderItem.length,
				num = 0;

			if ( itemLength > 1 ){
				$this.prepend('<button type="button" class="prev">이전</button><button type="button" class="next">다음</button>');
				if ( !$this.find("paging").length ){
					$this.append('<div class="paging"></div>');
					$sliderItem.each(function(i){
						$this.find(".paging").append('<button type="button">'+(i+1)+'</button>');
					});
					$this.find(".paging button:first").addClass("current");
					$this.on("click", ".paging button", function(){
						if ( $(this).index() > num ){
							$sliderItem.eq(num).animate({ left: "-100%" }, 500 ).siblings().css("left","100%");
						} else if ( $(this).index() < num ){
							$sliderItem.eq(num).animate({ left: "100%" }, 500 ).siblings().css("left","-100%");
						}
						num = $(this).index();
						slideMove()
						$(this).addClass("current").siblings().removeClass("current");
					});
				}
				$sliderItem.css({
					"position": "absolute",
					"top": 0,
				});
				$sliderItem.eq(num).siblings().css("left","100%");

				$this.on("click", ".prev", function(){
					if ( !$sliderItem.eq(num).is(":animated") ){
						$sliderItem.eq(num).animate({ left: "100%" }, 500 ).siblings().css("left","-100%");
						num = num-1 < 0 ? $sliderItem.length-1 : num-1;
						slideMove();
					}
				});

				$this.on("click", ".next", function(){
					if ( !$sliderItem.eq(num).is(":animated") ){
						$sliderItem.eq(num).animate({ left: "-100%" }, 500 ).siblings().css("left","100%");
						num = num+1 >= $sliderItem.length ? 0 : num+1;
						slideMove();
					}
				});

				function slideMove(index){
					$sliderItem.eq(num).animate({ left: "0" }, 500 );
					$(".cover-slider .paging button").eq(num).addClass("current").siblings().removeClass("current");
				}

				$this.on("touchstart", function(){
					var touch = event.touches[0];
					touchstartX = touch.clientX,
					touchstartY = touch.clientY;
				});

				$this.on("touchend", function(){
					if( event.touches.length == 0 ){
						var touch = event.changedTouches[event.changedTouches.length - 1];
						touchendX = touch.clientX,
						touchendY = touch.clientY,
						touchoffsetX = touchendX - touchstartX,
						touchoffsetY = touchendY - touchstartY;

						if ( Math.abs(touchoffsetX) > 10 && Math.abs(touchoffsetY) <= 100 ){
							if (touchoffsetX < 0 ){
								$this.find(".next").click();
							} else {
								$this.find(".prev").click();
							}
						}
					}
				});
			}
		});
	}

	function getCookie(name){
		name = new RegExp(name + '=([^;]*)');
		return name.test(document.cookie) ? unescape(RegExp.$1) : '';
	}

	function postListType(){
		var cookie = document.cookie;

		if ( !getCookie('post-type') && !$("body").hasClass("post-type-thumbnail") ){
			$(".post-header .list-type .list").addClass("current");
		}

		if ( $("body").hasClass("post-type-thumbnail") ){
			$(".post-header .list-type .thum").addClass("current").siblings().removeClass("current");
		} else {
			$(".post-header .list-type .list").addClass("current").siblings().removeClass("current");
		}

		$(".post-header .list-type").on("click", "button", function(){
			if ( $(this).hasClass("list") ){
				$("body").addClass("post-type-text");
				$("body").removeClass("post-type-thumbnail");
				$(this).addClass("current").siblings().removeClass("current");
				document.cookie = "post-type=list; path=/; expires=0;"
			} else {
				$("body").addClass("post-type-thumbnail");
				$("body").removeClass("post-type-text");
				document.cookie = "post-type=thumbnail; path=/; expires=0;"
				$(this).addClass("current").siblings().removeClass("current");
			}
		});

		if ( getCookie('post-type') ){
			if ( getCookie('post-type') == 'thumbnail' ){
				$(".post-header .list-type .thum").click();
			} else if ( getCookie('post-type') == 'list' ){
				$(".post-header .list-type .list").click();
			}
		}
	}

	function viewMore(){
		if ( $(".paging-view-more").length && $(".post-item").length ){
			viewMoreShow();
		}

		function viewMoreShow(){
			var nextUrl = $(".pagination .next").attr("href");
			$(".pagination a").hide();
			if( nextUrl ){
				$(".pagination").append('<a href="'+nextUrl+'" class="view-more">목록 더보기</a>');
				$(".pagination .view-more").on("click", function(){
					viewMore(nextUrl);
					return false;
				});
			}
		}

		function viewMore(url){
			$.ajax({
				url: url
			}).done(function (res) {
				var $res = $(res),
						$nextPostItem = $res.find(".post-item"),
						$paginationInner = $res.find(".pagination").html();
				if ( $nextPostItem.length > 0 ){
					$("#content .inner").append($nextPostItem);
					$(".pagination").html($paginationInner);
					viewMoreShow();
				} else {
					$(".pagination").remove();
				}
			});
		}
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

	// 글 제목 표시 (on/off)
	// if(window.location.href.toLowerCase().indexOf("entry/aboutkeywordlab") > -1) {
	// 	$('.hgroup').hide();
	// 	} else if(window.location.href.toLowerCase().indexOf("entry/history") > -1) {
	// 	$('.hgroup').hide();
	// 	} else if(window.location.href.toLowerCase().indexOf("entry/location") > -1) {
	// 	$('.hgroup').hide();
	// 	} else if(window.location.href.toLowerCase().indexOf("entry/bigdata") > -1) {
	// 	$('.hgroup').hide();
	// 	} else if(window.location.href.toLowerCase().indexOf("entry/ai") > -1) {
	// 	$('.hgroup').hide();
	// 	} else if(window.location.href.toLowerCase().indexOf("entry/ml") > -1) {
	// 	$('.hgroup').hide();
	// 	} else if(window.location.href.toLowerCase().indexOf("entry/iot") > -1) {
	// 	$('.hgroup').hide();
	// 	} else if(window.location.href.toLowerCase().indexOf("entry/rnd") > -1) {
	// 	$('.hgroup').hide();
	// 	} else {
	// 		$('.hgroup').show();
	// 	}

	// 카테고리별 css 적용
	
	if (decodeURI(window.location.href).indexOf("/category/새소식") > -1 ) {
		if(document.getElementById("tt-body-category").classList.contains('post-type-thumbnail')) {
		  document.getElementById("tt-body-category").classList.remove('post-type-thumbnail');
		  }
		document.getElementById("tt-body-category").classList.add('post-type-text');
	  }

	// if(window.location.href.toLowerCase().indexOf("news") > -1) {
	// 	$('.post-item-text').hide(); // 보도자료 카테고리 가림 (text 형식)
	// 	}
	// 	else {
	// 	$('.post-item').hide(); // 보도자료 카테고리 제외하고 가림 (thum 형식)
	// 	}

		
	// 카테고리명(영 -> 한)

	// if (document.getElementsByClassName("post-header").length > 0 ){

	// 	if (document.getElementsByClassName("post-header").item(0).innerText.toLowerCase() == "support/notice"){
	// 		document.getElementsByClassName("post-header").item(0).innerText = "공지사항";
	// 	}
	// 	if (document.getElementsByClassName("post-header").item(0).innerText.toLowerCase() == "support/news"){
	// 		document.getElementsByClassName("post-header").item(0).innerText = "보도자료";
	// 	}
	// 	if (document.getElementsByClassName("post-header").item(0).innerText.toLowerCase() == "careers"){
	// 		document.getElementsByClassName("post-header").item(0).innerText = "채용";
	// 	}

	// }

	// 페이징 숨기기
	if(window.location.href.indexOf("entry") > -1) {
		$(".entry-content").css({"max-width":"1920px", "padding":"unset"});
	} else {
		$('.hgroup .date').show();
		$('.hgroup.bottom').show();
		$('.pagination').show();
	}


if(document.getElementsByClassName("category_title").length > 0) {

	if(document.getElementsByClassName("category_title").item(0).innerHTML == "키워드랩") {
		$(".category_image").css({"background-image":"url(https://tistory3.daumcdn.net/tistory/3089742/skin/images/co_bg_img1.jpg)"});
	}
	if(document.getElementsByClassName("category_title").item(0).innerHTML == "연구") {
		$(".category_image").css({"background-image":"url(https://tistory3.daumcdn.net/tistory/3089742/skin/images/research_bg_img.jpg)"});
	}
	if(document.getElementsByClassName("category_title").item(0).innerHTML == "제품화") {
		$(".category_image").css({"background-image":"url(https://tistory3.daumcdn.net/tistory/3089742/skin/images/production_bg_img.jpg)"});
	}
	if(document.getElementsByClassName("category_title").item(0).innerHTML == "문의") {
		$(".category_image").css({"background-image":"url(https://tistory3.daumcdn.net/tistory/3089742/skin/images/research_bg_img.jpg)"});
	}

	if (document.getElementsByClassName("category_title").item(0).innerHTML.indexOf("개발") > -1 ) {
		$(".category_image").css({"background-image":"url(https://tistory3.daumcdn.net/tistory/3089742/skin/images/development_bg_img.jpg)"});
		if(document.getElementsByClassName("category_title").item(0).innerHTML.split("/", 2).length == 2) {
			document.getElementsByClassName("category_title").item(0).innerHTML = document.getElementsByClassName("category_title").item(0).innerHTML.split("/", 2)[1];
		}
	}
	if (document.getElementsByClassName("category_title").item(0).innerHTML.indexOf("디자인") > -1 ) {
		$(".category_image").css({"background-image":"url(https://tistory3.daumcdn.net/tistory/3089742/skin/images/design_bg_img.jpg)"});
		if(document.getElementsByClassName("category_title").item(0).innerHTML.split("/", 2).length == 2) {
			document.getElementsByClassName("category_title").item(0).innerHTML = document.getElementsByClassName("category_title").item(0).innerHTML.split("/", 2)[1];
		}
	}
	if (document.getElementsByClassName("category_title").item(0).innerHTML.indexOf("새소식") > -1 ) {
		$(".category_image").css({"background-image":"url(https://tistory3.daumcdn.net/tistory/3089742/skin/images/news_bg_img.jpg)"});
		if(document.getElementsByClassName("category_title").item(0).innerHTML.split("/", 2).length == 2) {
		document.getElementsByClassName("category_title").item(0).innerHTML = document.getElementsByClassName("category_title").item(0).innerHTML.split("/", 2)[1];
		}
	}
}

})(jQuery);
