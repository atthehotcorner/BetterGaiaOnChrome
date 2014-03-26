// Prefs JS (c) BetterGaia and bowafishtech

// Message setting
function message(key, value) {
	$("<p/>", {"class": "message"}).appendTo("header .wrap").html("<strong>Behind the scenes</strong>:<br/> <em>" + value + "</em> set for preference <em>" + key + "</em>.").fadeIn(300).delay(4000).animate({height: 0, opacity: 0, "padding-top": 0, "padding-bottom": 0}, 700, function() { $(this).remove(); })
}

self.on("message", function(response) {
// Onload -- Fill in current pref values
	// Migrate check
	if (response['needReset'] === true) {
		$('header menu a:not(.migrate)').parent().hide();
		$('header menu a.migrate').parent().addClass("current").show();
		$("#pages .page").hide();
		$("#pages .page.migrate").show();
	}

	// Checkbox prefs
	$("input[type='checkbox'][pref]").each(function() {
		var value = response[$(this).attr("pref")];

		if (value == true) $(this).prop("checked", true);
		else if (value == false) $(this).prop("checked", false);
		else $(this).prop("disabled", true);
	});

	// Background
	var background = response['style.background'];

	if (background.substring(0,11) != "resource://" && background.substring(0,39) != "http://gaiaonline.com/images/global_bg/") {
		$("#background aside input[label='Custom URL']").val(background).attr("checked", "checked");
		$("#background aside input[label='Custom URL']").parent().css({"background-image": "url(" + background + ")"});
	}
	else {
		$("#background aside input[name='bg'][value='" + background + "']").click();
	}

	// Background Options
	$("#pages .page section#bg_extras aside li:nth-of-type(2) input").val(response["style.background.color"]);
	$("#pages .page section#bg_extras aside li:nth-of-type(3) select").val(response["style.background.position"]);

	// Header
	var header = response['style.header'];

	if (header.substring(0,11) != "resource://" && header.substring(0,70) != "http://s.cdn.gaiaonline.com/images/gaia_global/gaia_header/new_header/") {
		$("#header .header").attr("style", "background-image: url(" + header.split(", ")[0] + ");");
		$("#header aside input[label='Custom URL']").val(header).attr("checked", "checked");
	}
	else {	
		$("#header aside input[name='hr'][value='" + header + "']").click();
	}

	// Logo
	var logo = response['style.logo'];

	if (logo.substring(0,11) != "resource://" && logo != "http://s.cdn.gaiaonline.com/images/gaia_global/gaia_header/br_gaia_logo_header.png") {
		$("#logo aside input[label='Custom URL']").val(logo).attr("checked", "checked");
		$("#header .header .logo").attr("style", "background-image: url(" + logo + ");");
	}
	else {
		$("#logo aside input[name='lg'][value='" + logo + "']").click();
	}

	// Nav Color
	$("#pages .page section#navigation aside li:nth-of-type(1) input").val(response["style.nav"]);
	$("#navigation .navigation .bar").css({"background-color": "#" + response["style.nav"]});

	$("#pages .page section#navigation aside li:nth-of-type(2) input").val(response["style.nav.hover"]);
	$("#navigation .navigation .bar .hover, #navigation .navigation .menu").css({"background-color": "#" + response["style.nav.hover"]});

	$("#pages .page section#navigation aside li:nth-of-type(3) input").val(response["style.nav.current"]);
	$("#navigation .navigation .bar .current").css({"background-color": "#" + response["style.nav.current"]});

	// Forums thread header
	$("#pages .page section#thread_header aside li:nth-of-type(1) input").val(response["style.forums.threadHeader"]);
	$("#thread_header .thread_header .linklist").css({"background-color": "#" + response["style.forums.threadHeader"]});

	// Post Formats
	if ($("input[pref='posts.settings.disable.postFormatter']:not([disabled])").prop("checked")) $("#pages div.page.postformatting").addClass("hide"); // Add hidden appearance

	var postformating = response["posts.formatter.formats"].split("ITSurHRTnSOL");
	var formats = "";

	if (postformating.length >= 1 && postformating[0] != "") {
		$.each(postformating, function(key, value) {
			value = JSON.parse(value);
	
			var select_style = $("<select><option value='0'>Say</option><option value='1'>Whisper</option><option value='2'>Shout</option><option value='3'>Think</option><option value='4'>Document</option><option value='5'>Ornate</option></select>").find("[value='" + unescape(value["style"]) + "']").attr("selected","selected").parent().wrap("<div />").parent().html();
	
			formats += "<li>\
				<div>\
					<div class='name'><input type='text' value='" + unescape(value["name"]) + "' maxlength='50'></div>\
					<div class='options'><a class='edit' title='Edit'></a><a class='delete' title='Delete'></a></div>\
				</div>\
				<form>\
					<div class='code'><textarea>" + unescape(value["format"]) + "</textarea></div>\
					<div class='style'>" + select_style + "</div>\
				</form>\
			</li>";
		});
		$("#postformating aside").append(formats);
	}

	// Shortcuts
	if ($("input[pref='shortcuts.settings.disable']:not([disabled])").prop("checked")) $("#pages div.page.shortcuts").addClass("hide"); // Add hidden appearnce

	var shortcuts = response["shortcuts"].split("ITSurHRTnSOL");
	var links = "";

	if (shortcuts.length >= 1 && shortcuts[0] != "") {
		$.each(shortcuts, function(key, value) {
			value = JSON.parse(value);
	
			links += "<li>\
				<div class='name'><input type='text' value='" + unescape(value["name"]) + "' maxlength='50'></div>\
				<div class='url'><input type='text' value='" + unescape(value["URL"]) + "'></div>\
				<div class='options'>\
					<a class='delete' title='Delete'></a>\
				</div>\
			</li>";
		});
		$("#shortcuts aside").append(links);
	}
// -- end filling in --

// Update and save values
	// Checkbox prefs
	$("input[type='checkbox'][pref]:not([disabled])").change(function() {
		if ($(this).prop("checked")) self.port.emit('pref', [$(this).attr("pref"), true]);
		else self.port.emit('pref', [$(this).attr("pref"), false]);

		message($(this).attr("pref"), $(this).prop("checked"));
	});

	// Verify url
	function verifyImage(url) {
		if (/(http(s?):)|([/|.|\w|\s])*\.(?:jpe?g|gif|png|bmp)/i.test(url)) return true;
		else return false;
	}

	// Background
	$("#background aside :input[@name='bg']:not([label='Custom URL'])").change(function() {
		self.port.emit('pref', ["style.background", $(this).val()]);

		message("style.background", $(this).val());
	});

	$("#background aside input[label='Custom URL']").click(function(){
		var url = prompt("Enter the URL of the image you want to use.", "");
		var check = verifyImage(url);

		if (check == true) {
			$(this).val(url);
			$(this).parent().css({"background-image": "url(" + url + ")"});
			self.port.emit('pref', ["style.background", $(this).val()]);

			message("style.background", $(this).val());
		}
		else if (check == false) {
			alert("There's a problem with your URL. Check and try again.");
			$("#background aside input[name='bg']")[0].click();
		}
		else {
			$("#background aside input[name='bg']")[0].click();
		}
	});

	// Background Options
	$("#bg_extras aside li:nth-of-type(2) input").change(function() {
		var color = $(this).val();
		self.port.emit('pref', ["style.background.color", color]);
	});

	$("#bg_extras aside li:nth-of-type(3) select").change(function() {
		self.port.emit('pref', ["style.background.position", $(this).val()]);

		message("style.background.position", $(this).val());
	});

	// Header
	$("#header aside :input[@name='hr']:not([label='Custom URL'])").change(function() {
		self.port.emit('pref', ["style.header", $(this).val()]);

		message("style.header", $(this).val());
	});

	$("#header aside input[label='Custom URL']").click(function(){
		var url = prompt("Enter the URL of the image you want to use.\nTo set the overflow of the header, put \", \" (comma and a space) at the end of the first URL and then add a second URL.", "");
		if (url) {
			var urlParts = url.split(", ");
			var check1 = verifyImage(urlParts[0]);
		}
		else var check1 = false;

		if (check1 == true) {
			if (!urlParts[1] == false) {
				if (verifyImage(urlParts[1]) == true) {
					$(this).val(url);
					$("#header .header").attr("style", "background-image: url(" + urlParts[0] + ");");
					self.port.emit('pref', ["style.header", $(this).val()]);

					message("style.header w/ overflow", $(this).val());
				}
				else {
					alert("There's a problem with your overflow URL. Check and try again.");
					$("#header aside input[name='hr']")[0].click();
				}
			}
			else {
				$(this).val(url);
				$("#header .header").attr("style", "background-image: url(" + url + ");");
				self.port.emit('pref', ["style.header", $(this).val()]);
	
				message("style.header w/o Overflow", $(this).val());
			}
		}
		else if (check1 == false) {
			alert("There's a problem with your URL. Check and try again.");
			$("#header aside input[name='hr']")[0].click();
		}
		else {
			$("#header aside input[name='hr']")[0].click();
		}
	});

	// Logo
	$("#logo aside :input[@name='lg']:not([label='Custom URL'])").change(function() {
		self.port.emit('pref', ["style.logo", $(this).val()]);

		message("style.logo", $(this).val());
	});

	$("#logo aside input[label='Custom URL']").click(function(){
		var url = prompt("Enter the URL of the image you want to use.", "");
		var check = verifyImage(url);

		if (check == true) {
			$(this).val(url);
			$("#header .header .logo").attr("style", "background-image: url(" + url + ");");
			self.port.emit('pref', ["style.logo", $(this).val()]);

			message("style.logo", $(this).val());
		}
		else if (check == false) {
			alert("There's a problem with your URL. Check and try again.");
			$("#logo aside input[name='lg']")[0].click();
		}
		else {
			$("#logo aside input[name='lg']")[0].click();
		}
	});

	// Navigation
	$("#pages .page section#navigation aside li:nth-of-type(1) input").change(function() {
		var color = $(this).val();
		self.port.emit('pref', ["style.nav", color]);
		$("#navigation .navigation .bar").css({"background-color": "#" + color});

		message("style.nav", color);
	});
	$("#pages .page section#navigation aside li:nth-of-type(2) input").change(function() {
		var color = $(this).val();
		self.port.emit('pref', ["style.nav.hover", color]);
		$("#navigation .navigation .bar .hover, #navigation .navigation .menu").css({"background-color": "#" + color});

		message("style.nav.hover", color);
	});
	$("#pages .page section#navigation aside li:nth-of-type(3) input").change(function() {
		var color = $(this).val();
		self.port.emit('pref', ["style.nav.current", color]);
		$("#navigation .navigation .bar .current").css({"background-color": "#" + color});

		message("style.nav.current", color);
	});

	// Nav Resets
	$("#pages .page section#navigation aside li:nth-of-type(1) .reset").click(function(){
		//$(this).prev('input')[0].color.fromString('1F4166');
		$(this).prev('input').val('1F4166').change();
	});

	$("#pages .page section#navigation aside li:nth-of-type(2) .reset").click(function(){
		//$(this).prev('input')[0].color.fromString('5395A6');
		$(this).prev('input').val('5395A6').change();
	});

	$("#pages .page section#navigation aside li:nth-of-type(3) .reset").click(function(){
		//$(this).prev('input')[0].color.fromString('6FB2C1');
		$(this).prev('input').val('6FB2C1').change();
	});
	
	// Forums
	$("#pages .page section#thread_header aside li:nth-of-type(1) .reset").click(function(){
		//$(this).prev('input')[0].color.fromString('BF7F40');
		$(this).prev('input').val('BF7F40').change();
	});	

	// Forums thread header
	$("#pages .page section#thread_header aside li:nth-of-type(1) input").change(function() {
		var color = $(this).val();
		self.port.emit('pref', ["style.forums.threadHeader", color]);
		$("#thread_header .thread_header .linklist").css({"background-color": "#" + color});

		message("style.forums.threadHeader", color);
	});

	// Post Formatter
	$("#postformating h3 .save button").click(function(){
		$("#postformating h3 .save").fadeOut(500);
		
		// Compile Shortcuts
		var postformats = $("#postformating aside li");
		var list = "";
	
		$.each(postformats, function(key, value) {
			var name = $(value).find("div.name input").val();
			var code = $(value).find("div.code textarea").val();
			var style = $(value).find("div.style select").val();
	
			list += '{"name": "' + escape(name) + '", "format": "' + escape(code) + '", "style": "' + escape(style) + '"}ITSurHRTnSOL';
		});
	
		list = list.slice(0, -12);
		self.port.emit('pref', ["posts.formatter.formats", list]);

		message("posts.formatter.formats", list);
	});

	$("input[pref='posts.settings.disable.postFormatter']:not([disabled])").change(function() {
		if ($(this).prop("checked")) $("#pages div.page.postformatting").addClass("hide");
		else $("#pages div.page.postformatting").removeClass("hide");
	});

	// Shortcuts
	$("#shortcuts h3 .save button").click(function(){
		$("#shortcuts h3 .save").fadeOut(500);
		
		// Compile Shortcuts
		var shortcuts = $("#shortcuts aside li");
		var list = "";
	
		$.each(shortcuts, function(key, value) {
			var name = $(value).find("div.name input").val();
			var URL = $(value).find("div.url input").val();
	
			list += '{"name": "' + escape(name) + '", "URL": "' + escape(URL) + '"}ITSurHRTnSOL';
		});
	
		list = list.slice(0, -12);
		self.port.emit('pref', ["shortcuts", list]);

		message("shortcuts", list);
	});

	$("input[pref='shortcuts.settings.disable']:not([disabled])").change(function() {
		if ($(this).prop("checked")) $("#pages div.page.shortcuts").addClass("hide");
		else $("#pages div.page.shortcuts").removeClass("hide");
	});
	
	// About
	$("#pages .page.about section button.reset").click(function(){
		var prefs = [];
		$.each($("[pref]"), function(key, value) {
			prefs.push($(value).attr("pref"));
		});

		self.port.emit('reset', prefs);
		window.location.reload(); 
	});

	// Migrate
	$("#pages .page.migrate section button.migrate").click(function(){
		self.port.emit('migrate', '');
		window.location.reload(); 
	});

// -- end updating and saving values

// End
});