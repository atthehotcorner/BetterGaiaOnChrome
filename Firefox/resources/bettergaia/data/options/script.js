/* (c) 2011 BetterGaia, bowafishtech.org. */

(function($){$.fn.wrapChildren=function(options){var options=$.extend({childElem:undefined,sets:1,wrapper:'div'},options||{});if(options.childElem===undefined)return this;return this.each(function(){var elems=$(this).children(options.childElem);var arr=[];elems.each(function(i,value){arr.push(value);if(((i+1)%options.sets===0)||(i===elems.length-1)){var set=$(arr);arr=[];set.wrapAll(document.createElement(options.wrapper));}});});}})(jQuery);

$(document).ready(function() {
	// --Preloading--
	
	$("section#background aside li > input").each(function(){
		var label = $(this).attr("label");
		$(this).parent().attr("label", label);
		var url = $(this).attr("value").split(", ")[0];
		$(this).parent().attr("style", "background-image: url(" + url + ");");
	});

	$("#header ol li > input").each(function(){
		var label = $(this).attr("label");
		$(this).parent().append(label);
	});
	$("#header ol").each(function(){
		if ($("li", this).length > 7) {
			$(this).attr("style", "width: auto;").wrapChildren({childElem: "li", sets: 7});
		}
	});

	$("#logo li > input").each(function(){
		var label = $(this).attr("label");
		$(this).parent().append(label);
	});

	// Enable .list elements 
	$("section.list aside").sortable(); // {containment: "parent"}, grid: [700, 1]

	// --End preloading--

	// Fix header on window size
	if ($("header .wrap").height() < $(window).height()) {
		$("header").addClass("fixed");
	}

	// Fix header if height too small
	$(window).resize(function() {
		if ($("header .wrap").height() < $(window).height()) {
			$("header").addClass("fixed").css("height", "100%");
		}
		else {
			$("header").removeClass("fixed").css("height", $("body").height());
		}
	});

	// Fix header if x scrolled
	$(window).scroll(function() {
		if (window.pageXOffset > 0 && $("header").hasClass("fixed")) {
			$("header").css({'left': -window.pageXOffset});
		}
		else {
			$("header").css({'left': '0'});
		}
	});

	// Background
	$("#background h3 .options button").click(function(){
		$("#bg_extras").toggleClass("open"); 
	});
	
	// Headers
	$("#header ol li input:not([label='Custom URL'])").click(function(){
		var url = $(this).attr("value").split(", ")[0];
		$("#header .header").attr("style", "background-image: url(" + url + ");");
	});

	// Logo
	$("#logo li input:not([label='Custom URL'])").click(function(){
		var url = $(this).attr("value");
		$("#header .header .logo").attr("style", "background-image: url(" + url + ");");
	});
	
	// Post formating
	$("#postformating h3 .options, #postformating aside").click(function(){ $("#postformating h3 .save").fadeIn(500); });
	$("#postformating aside li .options .edit").live("click", function(){ $(this).parent().parent().parent().find("form").toggleClass("table"); });
	$("#postformating aside li .options .delete").live("click", function(){ $(this).parent().parent().parent().remove(); });

		// Add format
		$("#postformating h3 .options button").click(function(){
			if ($("#postformating aside li").length >= 30) {
				alert("For sanity reasons, we limit the amount of formats you can have to 30.");
			}
			else {
				$("#postformating aside").append("<li>\
					<div>\
						<div class='name'><input type='text' value='Name' maxlength='50'></div>\
						<div class='options'><a class='edit' title='Edit'></a><a class='delete' title='Delete'></a></div>\
					</div>\
					<form>\
						<div class='code'><textarea>Post Code</textarea></div>\
						<div class='style'><select><option value='0'>Say</option><option value='1'>Whisper</option><option value='2'>Shout</option><option value='3'>Think</option><option value='4'>Document</option><option value='5'>Ornate</option></select></div>\
					</form>\
				</li>");
			}
		});

	// Shortcuts
	$("#shortcuts h3 .options, #shortcuts aside").click(function(){ $("#shortcuts h3 .save").fadeIn(500); });	
	$("#shortcuts aside li .options .delete").live("click", function(){ $(this).parent().parent().remove(); });
	
		// Add link
		$("#shortcuts h3 .options button").click(function(){
			if ($("#shortcuts aside li").length >= 30) {
				alert("For sanity reasons, we limit the amount of links you can have to 30.");
			}
			else {
				$("#shortcuts aside").append("<li>\
					<div class='name'><input type='text' value='Name' maxlength='50'></div>\
					<div class='url'><input type='text' value='URL'></div>\
					<div class='options'><a class='delete' title='Delete'></a></div>\
				</li>");
			}
		});

	// Links
	$("menu li a").click(function(){
		$("menu li.current").removeClass("current");
		$(this).parent().addClass("current");

		var tab_class = $(this).attr("class");
		$("#pages .page").hide();
		$("#pages .page." + tab_class).show();
	});
});