// Main CSS JS (c) BetterGaia and bowafishtech
self.port.on("sstorage", function(response) {
    var css = "@import url('resource://jid0-nifeetyln4noyxdbzcmia3gcbkk-at-jetpack/bettergaia/data/css/bettergaia.css');";

	// Disable Header Background Overflow
	if (JSON.parse(response["main.handn.header.overflow"]) == false) {css += 'body #gaia_menu_bar {border-radius: 0 0 5px 5px; border:1px solid #111111; border-width: 0 1px !important; width:968px;} body #gaia_menu_bar #nav {width:968px; border-radius-bottomright: 5px;} body #gaia_menu_bar #nav li#home_menu {border-radius-bottomleft: 5px;} body #gaia_header {margin:0 auto; width:970px; border-radius: 0 0 5px 5px;} body #gaia_header .header_content {width: 968px; border: 1px solid #111; border-width: 0 1px;} body #gaia_header .time_mask {left:50%; margin-left:-484px; width:968px;} body #gaia_header .header_content .goldMessage {border-radius-bottomright: 5px;} body #gaia_header #gaia_menu_bar #nav:after {right: 7px;}';}

	// Disable Page centering
	if (JSON.parse(response["main.features.centerPage"]) == false) {css += 'body > #content, body:not(#extendedProfileBody) #content, body #gaia_header .header_content, body #gaia_header #gaia_menu_bar #newmenu, body #gaia_header #gaia_menu_bar #nav, body #gaia_footer, body #gaia_content, body.forums #content > #content-padding, body.forums #gaia_content.grid_dizzie_gillespie, body.forums #gaia_content.ss_2Columns_flexiLeft_wideRight > #yui-main {margin-left: 0; margin-right: 0;} body.forums #gaia_content.grid_billie_holiday {width: 970px;} body #gaia_header .header_content .userName {margin: 0 -338px 0 0; right: 50%;}';}

	// Disable Notification Bar Float
	if (JSON.parse(response["main.handn.bar.float"]) == false) {css += 'body #gaia_header .header_content .userName {position: absolute;}';}

	// Hide Get Gaia Cash
	if (JSON.parse(response["main.handn.header.getGaiaCash"]) == false) {css += 'body #gaia_header .header_content .hud-stats ul.hud-item-list li:nth-of-type(5) {display: none;}';}

	// Hide ads
	if (JSON.parse(response["main.features.hideAds"]) == true) {css += '#grid_ad, .gaia-ad, body m[id="Meebo:AdElement.Root"], #ad {display: none !important;}';}

	// Show Suggested Content
	if (JSON.parse(response["main.features.suggestedContent"]) == false) {css += 'body.mygaia #gaia_content #bd .mg_content.suggested {display: block;}';}

	// Hide Welcome Back in username
	if (JSON.parse(response["main.handn.bar.showWelcome"]) == false) {css += 'body #gaia_header .header_content .userName ul.hud-item-list li.hud-item.avatarName {font-size: 0; color: transparent;} body #gaia_header .header_content .userName ul.hud-item-list li.hud-item.avatarName span {font-size: 11px; color: #FFF;} body #gaia_header .header_content .userName ul.hud-item-list li.hud-item.avatarName span:after {content: ""; display: block; width: 5px; height: 14px; background: #92B1CA; position: absolute; top: 0; right: 18px;}';}

	// Hide Footer
	if (JSON.parse(response["style.other.hide.footer"]) == true) {css += 'body #footer.floating-footer {display: none;} body div#meebo[class] {display: none !important;}'; }

	// Disable dawn and dusk header recolors
	if (JSON.parse(response["main.handn.header.dawnduskCycle"]) == false) {css += 'body.time-dawn #gaia_header, body.time-dawn #gaia_header .header_content, body.time-dusk #gaia_header, body.time-dusk #gaia_header .header_content {box-shadow: none !important;}'; }

	// Background Image
	var style_background = response["style.background"].split(", ");
	if (style_background.length == 2) {css += ".time-day, .time-dawn {background: url(" + style_background[0] + ");} .time-night, .time-dusk {background: url(" + style_background[1] + ");}";}
	else {css += ".time-day, .time-dawn, .time-night, .time-dusk {background: url(" + style_background[0] + ");}";}

	// Background Options
	css += '.time-day, .time-dawn, .time-night, .time-dusk {';
		// Color
		css += 'background-color: #' + response["style.background.color"] + ';';
		// Position
		css += 'background-position: ' + response["style.background.position"] + ';';
		// Repeat
		if (JSON.parse(response["style.background.repeat"]) == false) {css += 'background-repeat: no-repeat;';}
		// Float
		if (JSON.parse(response["style.other.background.float"]) == true) {css += 'background-attachment: fixed;';}
	css += '}';

	// If bg set to Gaia Town
	if (style_background[0] == "resource://jid0-nifeetyln4noyxdbzcmia3gcbkk-at-jetpack/bettergaia/data/images/background/bg2.jpg") {
		css += '.time-day, .time-dawn, .time-night, .time-dusk {background-position: bottom left !important; background-repeat: no-repeat !important;}';
	}

	// Header Background
	var style_header = response["style.header"].split(", ");
	if(!style_header[1]) {style_header[1] = "/images/gaia_global/gaia_header/new_header/rs_header_bg_bassken_tile_sprite.jpg";}
		// For custom url
		css += 'body.time-day div.town-barton div.header_content, body.time-dawn div.town-barton div.header_content, body.time-dusk div.town-barton div.header_content, body.time-night div.town-barton div.header_content {background: url(' + style_header[0] + ');} .time-day div.town-barton, .time-dawn div.town-barton, .time-dusk div.town-barton, .time-night div.town-barton {background: url(' + style_header[1] + ') repeat-x;}';

	// Logo
	var style_logo = response["style.logo"];
	if (style_logo != "http://s.cdn.gaiaonline.com/images/gaia_global/gaia_header/br_gaia_logo_header.png") {css += 'body #gaia_header .header_content .gaiaLogo a, body #gaia_header .header_content .gaiaLogo a:hover {background-image: url(' + style_logo + ');}';}

	// Navigation Theme
	css += 'body #gaia_header #gaia_menu_bar, body #gaia_menu_bar #nav li[id$="_menu"], body #gaia_menu_bar #nav li#home_menu, body #gaia_header #gaia_menu_bar #nav > li > .main_panel_container > .main_panel ~ .panel_bottom {background-color: #' + response["style.nav"] + ';} body #gaia_header #gaia_menu_bar #nav > li.selected {background-color: #' + response["style.nav.current"] + ';} body #gaia_header #gaia_menu_bar #nav > li:hover, body #gaia_header #gaia_menu_bar #nav > li:hover:active, body #gaia_header #gaia_menu_bar #nav > li > .main_panel_container >  .main_panel ~ .panel_bottom {background-color: #' + response["style.nav.hover"] + ';}';
	css += 'body #gaia_header .header_content .goldMessage {background: -webkit-radial-gradient(right top, circle, #' + response["style.nav.current"] + ' 50px, transparent 250px);}';
	css += 'body #gaia_menu_bar {background: url("resource://jid0-mabhudi0wndm9ohjxijifl32vew-bettergaia-jp-data/images/nav/black.png"), -webkit-radial-gradient(center center, circle, #' + response["style.nav.current"] + ' 50px, transparent 250px) 450px 0 #' + response["style.nav"] + ';}';

	// Add CSS
	var head = document.getElementsByTagName("head");
	if (head.length > 0) {
		var style = document.createElement("style");
			style.type = "text/css";
			style.setAttribute("bg-css", "");
			style.appendChild(document.createTextNode(css));
		head[0].appendChild(style);
	}
});