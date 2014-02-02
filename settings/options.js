// Options JS (c) BetterGaia and bowafishtech

var options = {
	message: function(key, value) {
		$("#message").stop().addClass("show").delay(2000).queue(function(next){$(this).removeClass("show"); next();});
		localStorage["lastUpdate"] = Date.now();
	},
	
	verifyImage: function(url) {
		if (/(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|bmp))/i.test(url)) return true;
		else return false;
	},

	// Set up page
	prepare: function() {
		// -- Set last sync
		$(".page.about .lastSync").text(new Date(parseInt(localStorage["lastUpdate"], 10)));

		// Range number for notify time
		$("#pages .page.features section aside li.range input[pref='main.features.notifications.time']").val(localStorage["main.features.notifications.time"]);
		$("#pages .page.features section aside li.range span.value").html(localStorage["main.features.notifications.time"]);

		// Set up preview
		if ($.cookie('preview-hide') == 'true') $("#preview > div").addClass("hide");
		if ($.cookie('preview-small') == 'true') $("#preview > div").addClass("small");

		// -- Add backgrounds
		$.ajax({type: "GET", url: "data/backgrounds.json", dataType: "json", async: false,
			success: function(list) {
				var imageHostPrefix = list.Info.imageHostPrefix;
	
				// add background options to page
				$.each(list.Backgrounds, function(key, url) {
					if (url.substring(0,7) != "http://") url = imageHostPrefix + url;
					$("#background aside.left").append("<a value='" + url + "' style='background-image: url(" + url + ");'></a>");
				});
				
				$("#background aside.left").append("<a class='customurl' value='chrome-extension://lmgjagdflhhfjflolfalapokbplfldna/images/logo_options.png'>Custom URL</a>");
			},
			error: function() {}
		});
		// END backgrounds

		// -- Add headers
		$.ajax({type: "GET", url: "data/headers.json", dataType: "json", async: false,
			success: function(headersList) {
				var imageHostPrefix = headersList.Info.imageHostPrefix;
				
				// get only the image data
				var imageYears = [];
				$.each(headersList, function(key, value) {
					if (key != "Info") imageYears.push(key);
				});
				imageYears.reverse();
			
				// add header options to page
				$.each(imageYears, function(key, year) {
					$("#header aside > div").append("<ol class='h" + year + "'><h3>" + year + "</h3></ol>");
			
					$.each(headersList[year], function(key, value) {
						var url = "";
						if (value[0].substring(0,7) != "http://" && value[0].substring(0,19) != "chrome-extension://") {url += imageHostPrefix + value[0];}
						else {url += value[0];}
						if (value[1]) {
							if (value[1].substring(0,7) != "http://" && value[1].substring(0,19) != "chrome-extension://") {url += ", " + imageHostPrefix + value[1];}
							else {url += ", " + value[1];}
						}
						$("#header ol.h" + year).append("<li class='radio'><input type='radio' name='hr' value='" + url + "' />" + key + "</li>");
					});
				});
			
				// Fix horizontal scrolling
				var hrdWidth = 0;
				$("#header ol").each(function(){
					if ($("li", this).length > 7) {
						$(this).attr("style", "width: auto;").wrapChildren({childElem: "li", sets: 7});
					}
					hrdWidth += $(this).outerWidth(true);
				});
				$("#header aside > div").width(hrdWidth);
				$("#header aside").height($("#header aside > div").outerHeight(true) + 20);

				// Fill in current header
				var header = localStorage['style.header'];

				if ($("#header aside input[name='hr'][value='" + header + "']").length > 0) {
					$("#header aside input[name='hr'][value='" + header + "']").prop("checked", true);
				}
				else {
					$("#header aside ol.hOther input").val(header).prop("checked", true);
				}
				$("#preview .header").attr("style", "background-image: url(" + header.split(", ")[0] + ");");

			},
			error: function() {}
		});
		// -- END headers

		// Logos
		$("#logo li > input").each(function(){
			var label = $(this).attr("label");
			$(this).parent().append(label);
		});

		// Nav Color
		$("#navigation input[pref='style.nav']").val(localStorage["style.nav"]);
		$("#preview .navigation .bar, #preview .header .username item, #preview .header .coins").css({"background-color": "#" + localStorage["style.nav"]});

		$("#navigation input[pref='style.nav.hover']").val(localStorage["style.nav.hover"]);
		$("#preview .navigation .bar .hover").css({"background-color": "#" + localStorage["style.nav.hover"]});

		$("#navigation input[pref='style.nav.current']").val(localStorage["style.nav.current"]);
		$("#preview .navigation .bar .current").css({"background-color": "#" + localStorage["style.nav.current"]});
	
		// Forums thread header
		$("#thread_header input[pref='style.forums.threadHeader']").val(localStorage["style.forums.threadHeader"]);
		$("#preview .thread_header .linklist").css({"background-color": "#" + localStorage["style.forums.threadHeader"]});

		$("#thread_header input[pref='style.forums.postHeader']").val(localStorage["style.forums.postHeader"]);
		//$("#preview .thread_header .linklist").css({"background-color": "#" + localStorage["style.forums.postHeader"]});

		// -- Add post formats
		var postformating = localStorage["posts.formatter.formats"].split("ITSurHRTnSOL");
		var formats = "";
	
		if (postformating.length >= 1 && postformating[0] != "") {
			$.each(postformating, function(key, value) {
				value = JSON.parse(value);
		
				var select_style = $("<select><option value='0'>Say</option><option value='1'>Whisper</option><option value='2'>Shout</option><option value='3'>Think</option><option value='4'>Document</option><option value='5'>Ornate</option></select>").find("[value='" + unescape(value["style"]) + "']").attr("selected","selected").parent().wrap("<div />").parent().html();
		
				formats += "<li formatname='" + unescape(value["name"]) + "'>\
					<div class='tools'><a class='edit'>Edit</a> | <a class='delete'>Delete</a></div>\
					<div class='ask'>\
						<h3>Edit <span class='close' title='Close'>&#10005;</span></h3>\
						<div class='preview right'>" + bbcode_parser(unescape(value["format"])) + "</div>\
						<div class='form'>\
							<input type='text' value='" + unescape(value["name"]) + "' maxlength='50' placeholder='Name' />\
							<textarea class='code'>" + unescape(value["format"]) + "</textarea>\
							" + select_style + "\
						</div>\
					</div>\
				</li>";
			});
			$("#postformating aside").append(formats);
		}
		// -- END post formats
		
		// Range number for quote new lines
		$("#pages .page.postformatting section aside li.range input[pref='posts.settings.quotes.rangeNumber']").val(localStorage["posts.settings.quotes.rangeNumber"]);
		$("#pages .page.postformatting section aside li.range span.value").html(localStorage["posts.settings.quotes.rangeNumber"]);
	
		// -- Shortcuts	
		var shortcuts = localStorage["shortcuts"].split("ITSurHRTnSOL");
		var links = "";
	
		if (shortcuts.length >= 1 && shortcuts[0] != "") {
			$.each(shortcuts, function(key, value) {
				value = JSON.parse(value);
		
				links += "<li>\
					<div class='name'><input type='text' value='" + unescape(value["name"]) + "' maxlength='50'></div>\
					<div class='url'><input type='text' value='" + unescape(value["URL"]) + "'></div>\
					<div class='options'>\
						<a class='delete' title='Delete'>&#10005;</a>\
					</div>\
				</li>";
			});
			$("#shortcuts aside").append(links);
		}
		// -- END shortcuts

		// -- Usertags	
		var usertags = localStorage["usertags"].split("ITSurHRTnSOL");
		var tags = "";
	
		if (usertags.length >= 1 && usertags[0] != "") {
			$.each(usertags, function(key, value) {
				value = JSON.parse(value);

				tags += "<li>\
					<div class='username'><a href='http://www.gaiaonline.com/profiles/" + value["userid"] + "/' target='_blank'>" + unescape(value["username"]) + "</a></div>\
					<div class='userid'>" + value["userid"] + "</div>\
					<div class='tag'>" + unescape(value["tag"]) + "</div>\
					<div class='createdon' value='" + value["createdon"] + "'>" + moment(value["createdon"]).calendar() + "</div>";

				var url = unescape(value["url"]);
				if (url.match(/\S/) && url.length > 1) {
					if (url.substring(0,7) != "http://" || url.substring(0,8) != "https://") url = 'http://www.gaiaonline.com/' + url;
					tags += "<div class='url'><a href='" + url + "' target='_blank'>" + unescape(value["url"]) + "</a></div>";
				}
				else tags += "<div class='url'>" + unescape(value["url"]) + "</div>";

				tags += "\
					<div class='options'>\
						<a class='delete' title='Delete'>&#10005;</a>\
					</div>\
				</li>";
			});
			$("#usertags aside").append(tags);
		}
		// -- END usertags

		this.loadPrefs();
	},

	// Fill in current values from local storage
	loadPrefs: function() {
		// Checkbox prefs
		$("input[type='checkbox'][pref]").each(function() {
			var value = localStorage[$(this).attr("pref")];
	
			if (value == "true") $(this).prop("checked", true);
			else if (value == "false") $(this).prop("checked", false);
			else $(this).prop("disabled", true);
		});

		// Background
		var background = localStorage['style.background'];
	
		if ($("#background aside.left a[value='" + background + "']").length > 0) {
			$("#background aside.left a[value='" + background + "']").addClass("selected");
		}
		else {
			$("#background aside.left a.customurl").attr("value", background).addClass("selected");
		}
		$("#preview > div").css("background-image", "url(" + background + ")");
	
		// Background Options
		$("#background aside.right input[pref='style.background.color']").val(localStorage["style.background.color"]);
		$("#background aside.right select").val(localStorage["style.background.position"]);
		

		// Logo
		var logo = localStorage['style.logo'];
	
		if ($("#logo aside input[name='lg'][value='" + logo + "']").length > 0) {
			$("#logo aside input[name='lg'][value='" + logo + "']").prop("checked", true);
		}
		else {
			$("#logo aside input[label='Custom URL']").val(logo).prop("checked", true);
		}
		$("#preview .header .logo").attr("style", "background-image: url(" + logo + ");");

		// Add hidden appearence
		if ($("input[pref='posts.settings.disable.postFormatter']:not([disabled])").prop("checked")) $("#pages div.page.postformatting").addClass("hide");
		if ($("input[pref='shortcuts.settings.disable']:not([disabled])").prop("checked")) $("#pages div.page.shortcuts").addClass("hide");
		
		this.run();
	},

	// Update prefs
	run: function() {
		// Checkbox prefs
		$("input[type='checkbox'][pref]:not([disabled])").change(function() {
			if ($(this).prop("checked")) localStorage[$(this).attr("pref")] = true;
			else localStorage[$(this).attr("pref")] = false;
			message();
		});

		// Enable ask popup		
		$(".page").on("click", ".ask h3 .close", function() {
			$(this).parent().parent().hide();
		});

		// Enable preview links
		$("#preview .toggle").on("click", function() {
			if ($("#preview > div").hasClass('hide')) {
				$("#preview > div").removeClass("hide");
				$.removeCookie('preview-hide');
			}
			else {
				$("#preview > div").addClass("hide");
				$.cookie('preview-hide', 'true', {expires: 7});
			}
		});
	
		$("#preview .size").on("click", function() {
			if ($("#preview > div").hasClass('small')) {
				$("#preview > div").removeClass("small");
				$.removeCookie('preview-small');
			}
			else {
				$("#preview > div").addClass("small");
				$.cookie('preview-small', 'true', {expires: 7});
			}
		});

		// Enable custom urls
		$(".page.styling .ask input[type='text']").keyup(function() {
			if (options.verifyImage($(this).val()) == true) {
				$(this).parent().children("p").remove();
			}
			else {
				if (!$(this).is("[placeholder='Background Image URL']")) {}//$(this).parent().children("button").prop("disabled", true);
				if ($(this).val().length > 2 && $(this).parent().children("p").length == 0) {
					$(this).parent().append("<p>Check your URL. It doesn't look valid.</p>");
				}
				else if ($(this).val().length < 3) {
					$(this).parent().children("p").remove();
				}
			}
		});

		// Remove alarm
		$("input[pref='main.features.notifications']").change(function() {
			if ($(this).prop("checked")) return true;
			else {
				chrome.alarms.clear('gaia-notifications');
				chrome.notifications.clear('gaia-notify', function(){});
			}
		});

		// Range number for quote new lines		
		$(".page.features li.range input[pref='main.features.notifications.time']").change(function(){
			$(".page.features li.range span.value").html('&#8230;');
			if (this.sliderTimeout) clearTimeout(this.sliderTimeout);
			this.sliderTimeout = setTimeout(function() {
				var value = $(".page.features li.range input[pref='main.features.notifications.time']").val();
				$(".page.features li.range span.value").text(value);
				localStorage["main.features.notifications.time"] = value;

				// Create alarms
				if (JSON.parse(localStorage["main.features.notifications"]) == true) {
					chrome.alarms.create('gaia-notifications', {
						when: 0,
						periodInMinutes: parseInt(value, 10)
					});
				}

				message();
			}, 1000);
		});

		// Background
		$("#background aside.left a").on("click", function() {
			if (!$(this).hasClass("customurl")) {
				$(this).parent().children(".selected").removeClass("selected");
				$(this).addClass("selected");
				$("#preview > div").css("background-image", "url(" + $(this).attr("value") + ")");
				localStorage["style.background"] = $(this).attr("value");	
				message();
			}
			else {
				var position = $(this).position();
				$("#background .ask").css({'top': position.top + $(this).outerHeight(true), 'left': position.left}).show();

				if ($(this).hasClass("selected")) {$("#background .ask input[type='text']").val($(this).attr("value")).keyup();}
				else $(this).removeClass("selected");
			}
		});

		$("#background .ask button").on("click", function() {
			//if (options.verifyImage($("#background .ask input[type='text']").val())) {
				// Update Background Preview
				var url = $("#background .ask input[type='text']").val();
				$("#preview > div").css({"background-image": "url(" + url + ")"});
				
				// Update Value
				$("#background aside.left a.customurl").attr("value", url);
				localStorage["style.background"] = url;	
				message();
				
				// Close Ask
				$("#background .ask .close").click();
				
				// Select custom url
				$("#background aside.left a.selected").removeClass("selected");
				$("#background aside.left a.customurl").addClass("selected");
			//}
		});
	
		// Background Options
		$("#background aside.right input[pref='style.background.color']").change(function() {
			var color = $(this).val();
			localStorage["style.background.color"] = color;
			message();
		});
	
		$("#background aside.right select").change(function() {
			localStorage["style.background.position"] = $(this).val();
			message();
		});

		// Header
		$("#header ol li").on("click", function(){
			if (!$(this).parent().hasClass("hOther")) {
				var img = $(this).children("input");
				img.prop("checked", true);

				// Update Header Preview
				var url = img.attr("value").split(", ")[0];
				$("#preview .header").attr("style", "background-image: url(" + url + ");");
				
				// Update Value
				localStorage["style.header"] = img.val();	
				message();
			}
			else {
				var img = $(this).children("input");
				var position = img.position();
				$("#header .ask").css({'top': position.top + img.height(), 'left': position.left}).show();

				if (img.prop("checked")) {
					var url = img.val().split(", ");
					$("#header .ask input[type='text'][placeholder='Main Image URL']").val(url[0]).keyup();
					if (url[1]) $("#header .ask input[type='text'][placeholder='Background Image URL']").val(url[1]).keyup();
				}
				else img.prop("checked", false);
			}
		});

		$("#header .ask button").on("click", function() {
			//if (options.verifyImage($(this).parent().children("input[type='text'][placeholder='Main Image URL']").val())) {
				// Update Header Preview
				var url = $(this).parent().children("input[type='text'][placeholder='Main Image URL']").val();
				$("#preview .header").attr("style", "background-image: url(" + url + ");");
				
				// Add 2nd image if vaild
				if (options.verifyImage($(this).parent().children("input[type='text'][placeholder='Background Image URL']").val())) {
					url += ", " + $(this).parent().children("input[type='text'][placeholder='Background Image URL']").val();
				}
				
				// Update Value
				$("#header ol.hOther li input").val(url);
				localStorage["style.header"] = url;	
				message();
				
				// Close Ask
				$("#header .ask .close").click();
				
				// Select custom url
				$("#header ol.hOther li input").prop("checked", true);
			//}
		});

		// Logo
		$("#logo aside li").on("click", function(){
			if ($(this).children("input:not([label='Custom URL'])").length > 0) {
				var img = $(this).children("input:not([label='Custom URL'])");
				img.prop("checked", true);

				// Update Logo Preview
				var url = img.attr("value");
				$("#preview .header .logo").attr("style", "background-image: url(" + url + ");");
				
				// Update Value
				localStorage["style.logo"] = url;	
				message();
			}
			else {
				var img = $(this).children("input");
				var position = $("#logo aside input[label='Custom URL']").position();
				$("#logo .ask").css({'top': position.top + img.height(), 'left': position.left}).show();

				if (img.prop("checked")) {$("#logo .ask input[type='text']").val(img.val()).keyup();}
				else img.prop("checked", false);
			}
		});
		
		$("#logo .ask button").on("click", function() {
			// Update Logo Preview
			var url = $("#logo .ask input[type='text']").val();
			$("#preview .header .logo").attr("style", "background-image: url(" + url + ");");
			
			// Update Value
			$("#logo li input[label='Custom URL']").val(url);
			localStorage["style.logo"] = url;	
			message();
				
			// Close Ask
			$("#logo .ask .close").click();
				
			// Select custom url
			$("#logo aside input[label='Custom URL']").prop("checked", true);
		});

		// Navigation
		$("#navigation input[pref='style.nav']").change(function() {
			var color = $(this).val();
			$("#preview .navigation .bar, #preview .header .username item, #preview .header .coins").css({"background-color": "#" + color});
			localStorage["style.nav"] = color;
			message();
		});
		$("#navigation input[pref='style.nav.hover']").change(function() {
			var color = $(this).val();
			$("#preview .navigation .bar .hover").css({"background-color": "#" + color});
			localStorage["style.nav.hover"] = color;
			message();
		});
		$("#navigation input[pref='style.nav.current']").change(function() {
			var color = $(this).val();
			$("#preview .navigation .bar .current").css({"background-color": "#" + color});
			localStorage["style.nav.current"] = color;
			message();
		});
	
		// Nav Reset
		$("#navigation button.reset").click(function(){
			$("#navigation input[pref='style.nav']")[0].color.fromString('7EACC5');
			$("#navigation input[pref='style.nav.hover']")[0].color.fromString('396C7C');
			$("#navigation input[pref='style.nav.current']")[0].color.fromString('93F2FF');
			$("#navigation input").change();
		});

		// Forums thread header
		$("#thread_header input[pref='style.forums.threadHeader']").change(function() {
			var color = $(this).val();
			$("#preview .thread_header .linklist").css({"background-color": "#" + color});
			localStorage["style.forums.threadHeader"] = color;
			message();
		});

		$("#thread_header input[pref='style.forums.postHeader']").change(function() {
			var color = $(this).val();
			//$("#preview .thread_header .linklist").css({"background-color": "#" + color});
			localStorage["style.forums.postHeader"] = color;
			message();
		});		

		// Forums thread header reset
		$("#thread_header button.reset").click(function(){
			$("#thread_header input[pref='style.forums.threadHeader']")[0].color.fromString('BF7F40');
			$("#thread_header input[pref='style.forums.threadHeader']").change();

			$("#thread_header input[pref='style.forums.postHeader']")[0].color.fromString('92B1CA');
			$("#thread_header input[pref='style.forums.postHeader']").change();
		});

		// Post Formatter
		$("#postformating .save").click(function(){		
			var postformats = $("#postformating aside li div.ask");
			var list = "";
		
			$.each(postformats, function(key, value) {
				var name = $(value).find("input").val();
				var code = $(value).find("textarea").val();
				var style = $(value).find("select").val();
		
				list += '{"name": "' + escape(name) + '", "format": "' + escape(code) + '", "style": "' + escape(style) + '"}ITSurHRTnSOL';
			});
		
			list = list.slice(0, -12);
			localStorage["posts.formatter.formats"] = list;

			$("#postformating").delay(500).queue(function(next) {$(this).removeClass("needtosave"); next();});
			message();
		});
	
		$("input[pref='posts.settings.disable.postFormatter']:not([disabled])").change(function() {
			if ($(this).prop("checked")) $("#pages div.page.postformatting").addClass("hide");
			else $("#pages div.page.postformatting").removeClass("hide");
		});

		$("#postformating").click(function(){ $(this).addClass("needtosave"); });
		$("#postformating aside").on("click", "li .tools .edit", function(){ 
			$("#postformating aside > li .ask").hide();
			$(this).parent().parent().find('.ask').show(); 
			
			$("#postformating aside > li").removeClass("editing");
			$(this).parent().parent().addClass("editing");
		});
		$("#postformating aside").on("click", ".tools .delete", function(){ $(this).parent().parent().remove(); });

		$("#postformating aside").on("keyup", ".ask input[type='text']", function(){ 
			$(this).parent().parent().parent().attr("formatname", $(this).val());
		});
		$("#postformating aside").on("keyup", ".ask textarea.code", function(){ 
			$(this).parent().parent().find(".preview").html(bbcode_parser($(this).val()));
		});

		$("#postformating aside").on("click", ".ask h3 .close", function() {
			$(this).parent().parent().parent().removeClass("editing");
		});
	
			// Add format
			$("#postformating .add").click(function(){
				if ($("#postformating aside li").length >= 30) {
					alert("For sanity reasons, we limit the amount of formats you can have to 30.");
				}
				else {
					var format = unescape("%5Bsize%3D11%5D%5Bcolor%3Dlightgrey%5D%5Bb%5DAs%20time%20%5Bcolor%3Dsteelblue%5Dgoes%20by%5B/color%5D%20and%20we%20grow%20%5Bcolor%3Dslategray%5Dolder%5B/color%5D%20...%5B/b%5D%5B/color%5D%5B/size%5D%5Balign%3Dcenter%5D%0A%0A%0ATo%20customize%20this%20post%20format%20and%20add%20others%2C%20go%20to%20your%20BetterGaia%20Options%20in%20Chrome.%0AFor%20help%2C%20%5Burl%3Dhttp%3A//www.gaiaonline.com/forum/t.45053993/%5Dvisit%20our%20thread%5B/url%5D.%0A%0A%0A%5B/align%5D%5Balign%3Dright%5D%5Bsize%3D11%5D%5Bcolor%3Dlightgrey%5D%5Bb%5Dthe%20%5Bcolor%3Dbrown%5Dworld%5B/color%5D%20brings%20us%20%5Bcolor%3Ddarkorange%5Dcloser%5B/color%5D...%5B/b%5D%5B/color%5D%5B/size%5D%5B/align%5D");

					$("<textarea class='code'></textarea>").val();
					$("#postformating aside").append("<li formatname='X and Y'>\
						<div class='tools'><a class='edit'>Edit</a> | <a class='delete'>Delete</a></div>\
						<div class='ask'>\
							<h3>Edit <span class='close' title='Close'>&#10005;</span></h3>\
							<div class='preview right'>" + bbcode_parser(format) + "</div>\
							<div class='form'>\
								<input type='text' value='X and Y' maxlength='50' placeholder='Name' />\
								<textarea class='code'>" + format + "</textarea>\
								<select><option value='0'>Say</option><option value='1'>Whisper</option><option value='2'>Shout</option><option value='3'>Think</option><option value='4'>Document</option><option value='5'>Ornate</option></select>\
							</div>\
						</div>\
					</li>");
				}
			});
	
		// Range number for quote new lines
		$("#pages .page.postformatting section aside li.range input[pref='posts.settings.quotes.rangeNumber']").change(function() {
			var value = $(this).siblings("span.value")[0];
			$(value).html($(this).val());
			localStorage["posts.settings.quotes.rangeNumber"] = $(this).val();
			message();
		});
	
		// Shortcuts
		$("#shortcuts .save").click(function(){
			var shortcuts = $("#shortcuts aside li");
			var list = "";
		
			$.each(shortcuts, function(key, value) {
				var name = $(value).find("div.name input").val();
				var URL = $(value).find("div.url input").val();
		
				list += '{"name": "' + escape(name) + '", "URL": "' + escape(URL) + '"}ITSurHRTnSOL';
			});
		
			list = list.slice(0, -12);
			localStorage["shortcuts"] = list;

			$("#shortcuts").delay(500).queue(function(next) {$(this).removeClass("needtosave"); next();});
			message();
		});
	
		$("input[pref='shortcuts.settings.disable']:not([disabled])").change(function() {
			if ($(this).prop("checked")) $("#pages div.page.shortcuts").addClass("hide");
			else $("#pages div.page.shortcuts").removeClass("hide");
		});

		$("#shortcuts").click(function(){ $(this).addClass("needtosave"); });	
		$("#shortcuts aside").on("click", ".options .delete", function(){ $(this).parent().parent().remove(); });
		
			// Add link
			$("#shortcuts .add").click(function(){
				if ($("#shortcuts aside li").length >= 30) {
					alert("For sanity reasons, we limit the amount of links you can have to 30.");
				}
				else {
					$("#shortcuts aside").append("<li>\
						<div class='name'><input type='text' value='Name' maxlength='50'></div>\
						<div class='url'><input type='text' value='URL'></div>\
						<div class='options'><a class='delete' title='Delete'>&#10005;</a></div>\
					</li>");
				}
			});

		// User Tags
		$("#usertags .save").click(function(){
			var usertags = $("#usertags aside li");
			var tags = "";
		
			$.each(usertags, function(key, value) {
				var username = $(value).find("div.username a").text();
				var userid = $(value).find("div.userid").text();
				var tag = $(value).find("div.tag").text();
				var createdon = $(value).find("div.createdon").attr('value');
				var url = $(value).find("div.url").text();
		
				tags += '{"username": "' + escape(username) + '", "userid": "' + userid + '", "tag": "' + escape(tag) + '", "url": "' + escape(url) + '", "createdon": ' + createdon + '}ITSurHRTnSOL';
			});
		
			tags = tags.slice(0, -12);
			localStorage["usertags"] = tags;

			$("#usertags").delay(500).queue(function(next) {$(this).removeClass("needtosave"); next();});
			message();
		});
	
		$("input[pref='usertags.settings.disable']:not([disabled])").change(function() {
			if ($(this).prop("checked")) $("#pages div.page.usertags").addClass("hide");
			else $("#pages div.page.usertags").removeClass("hide");
		});

		$("#usertags aside").on("click", ".options .delete", function(){
			$(this).closest('li').remove();
			$("#usertags").addClass("needtosave");
		});

		// Enable .list elements 
		$("section.list aside").sortable({distance: 30});
		
		// About
		$("#pages .page.about section input.agreeReset").click(function(){
			if($(this).prop("checked")) {
				$("#pages .page.about section button.reset").show();
				$(this).prop("disabled", true);
				_gaq.push(['_trackEvent', 'Settings', 'opened', 'Reset']);
			}
		});
		$("#pages .page.about section button.reset").click(function(){
			localStorage.clear();
			chrome.storage.sync.clear();
			chrome.extension.sendMessage({elements: 'reset'}, function(){
				chrome.runtime.reload();
			});
			_gaq.push(['_trackEvent', 'Settings', 'clicked', 'Reset']);
		});
	
		// Links
		$("menu a").click(function(){
			$("menu a.current").removeClass("current");
	
			var tab_class = $(this).attr("class");
			$("#pages .page").removeClass("selected");
			$("#pages .page." + tab_class).addClass("selected");
	
			$(this).addClass("current");
			_gaq.push(['_trackEvent', 'Settings Sidebar', 'opened', $(this).text()]);
		});
		
		if (window.location.hash) {
			$("menu a[href='" + window.location.hash + "']").click();
		}
		
		// Event tracking
		$("#preview a.toggle").click(function(){ _gaq.push(['_trackEvent', 'Settings', 'clicked', 'Preview Unpin']); });
		$("#preview a.size").click(function(){ _gaq.push(['_trackEvent', 'Settings', 'clicked', 'Preview Shrink']); });
		$("#header h3 a.right").click(function(){ _gaq.push(['_trackEvent', 'Settings', 'clicked', 'Get More Headers']); });
	}
}

function message(key, value) {options.message(key, value);}

(function($){$.fn.wrapChildren=function(options){var options=$.extend({childElem:undefined,sets:1,wrapper:'div'},options||{});if(options.childElem===undefined)return this;return this.each(function(){var elems=$(this).children(options.childElem);var arr=[];elems.each(function(i,value){arr.push(value);if(((i+1)%options.sets===0)||(i===elems.length-1)){var set=$(arr);arr=[];set.wrapAll(document.createElement(options.wrapper));}});});}})(jQuery);

function bbcode_parser(e) {search=new Array(/\[b\]([\s\S]*?)\[\/b\]/ig,/\[i\]([\s\S]*?)\[\/i\]/ig,/\[u\]([\s\S]*?)\[\/u\]/ig,/\[strike\](.*?)\[\/strike\]/ig,/\[img\](.*?)\[\/img\]/ig,/\[img(left|right)\](.*?)\[\/img(left|right)\]/ig,/\[imgmap\](.*?)\[\/imgmap\]/ig,/\[url\="?(.*?)"?\](.*?)\[\/url\]/ig,/\[url\](.*?)\[\/url\]/ig,/\[code\]([\s\S]*?)\[\/code\]/ig,/\[quote\]([\s\S]*?)\[\/quote\]/ig,/\[quote\="?(.*?)"?\]([\s\S]*?)\[\/quote\]/ig,/\[color\=(.*?)\]([\s\S]*?)\[\/color\]/ig,/\[size\="?(.*?)"?\]([\s\S]*?)\[\/size\]/gi,/\[align\="?(right|left|center)"?\]([\s\S]*?)\[\/align\]/ig,/\[align\=(.*?)\]([\s\S]*?)\[\/align\]/ig,/\[list\="?(.*?)"?\]([\s\S]*?)\[\/list\]/gi,/\[list\]/gi,/\[\/list\]/gi,/\[\*\]\s?(.*?)\n/ig,/\n\n/ig,/\[center\]([\s\S]*?)\[\/center\]/ig,/\[left\]([\s\S]*?)\[\/left\]/ig,/\[right\]([\s\S]*?)\[\/right\]/ig);replace=new Array("<strong>$1</strong>","<em>$1</em>",'<span style="text-decoration: underline">$1</span>','<span style="text-decoration: line-through">$1</span>','<img src="$1" alt="User Image" />','<img src="$2" style="float:$1;" alt="User Image" />','<img src="$1" ismap="ismap" alt="User Image" />','<a href="$1">$2</a>','<a href="$1">$1</a>','<div class="code">test</div>','<div class="quote"><div class="cite">Quote:</div><div class="quoted">$1<div class="clear"></div></div></div>','<div class="quote"><div class="cite">$1</div><div class="quoted">$2<div class="clear"></div></div></div>','<span style="color:$1">$2</span>','<span style="font-size: $1px">$2</span>','<div class="postcontent-align-$1" style="text-align: $1">$2</div>',"$1","<ol>$2</ol>","<ul>","</ul>","<li>$1</li>","<br />",'<div class="postcontent-align-center" style="text-align: center">$1</div>','<div class="postcontent-align-left" style="text-align: left">$1</div>','<div class="postcontent-align-right" style="text-align: right">$1</div>');var t;for(i=0;i<search.length;i++){var n=false;while(n==false){e=e.replace(search[i],replace[i]);t=e.match(search[i]);if(t==null){n=true}}}return e}

$(window).scroll(function() {
  $("#preview > div").toggleClass('scrolling', $(window).scrollTop() > $("#preview").offset().top);
});

$(window).resize(function() {
	$("#preview > div").width($("#preview").outerWidth(true));
});

$(document).ready(function() {
	$("#preview").height($("#preview").outerHeight(false));
	$("#preview > div").width($("#preview").outerWidth(true));

	options.prepare();
});