/*
CSS JS
Copyright (c) BetterGaia and Bowafishtech
Unauthorized copying, sharing, adaptation, publishing, commercial usage, and/or distribution, its derivatives and/or successors, via any medium, is strictly prohibited.
*/

function MainCss() {
var css = '';

// Hide Ads
if (prefs['adsHide'] == true)
css += '#bb-advertisement, #offer_banner, #grid_ad, .gaia-ad, .as_ad_frame, #cr_overlay {display: none !important;}';

// Show Suggested Content
if (prefs['mygaia.suggested'] == false)
css += 'body.mygaia #gaia_content #bd .mg_content.suggested {display: block;}';

// Background
if (prefs['background.image'] != 'default')
css += '.time-day, .time-dawn, .time-night, .time-dusk, table.warn_block {background-image: url(' + prefs['background.image'] + ');}';

// Background Options
css += '.time-day, .time-dawn, .time-night, .time-dusk {';
    css += 'background-color: #' + prefs['background.color'] + ';'; // Color
    css += 'background-position: ' + prefs['background.position'] + ';'; // Position
    if (prefs['background.repeat'] == false) css += 'background-repeat: no-repeat;'; // Repeat
    if (prefs['background.float'] == true) css += 'background-attachment: fixed;'; // Float
css += '}';

// If Background is Gaia Town
if (prefs['background.image'] == 'http://s.cdn.gaiaonline.com/images/global_bg/bg2.jpg') 
css += '.time-day, .time-dawn, .time-night, .time-dusk {background-position: bottom left !important; background-repeat: no-repeat !important; background-color: #12403d !important;}';

// Header Background
if (prefs['header.background'] != 'default')
css += 'body #gaia_header .header_content {background-image: url(' + prefs['header.background'] + ');}';

// Header Background Base
if (prefs['header.background.base'] != 'default')
css += 'body #gaia_header {background: url(' + prefs['header.background.base'] + ') repeat-x;}';

// Logo
if (prefs['header.logo'] != 'default') 
css += 'body #gaia_header .header_content .gaiaLogo a, body #gaia_header .header_content .gaiaLogo a:hover {background-image: url(' + prefs['header.logo'] + ');}';

// Navigation and HUD
css += 'body #gaia_header .hud-account ul, body #gaia_menu_bar {background-color: #' + prefs['header.nav'] + ';}';

function hexToRgb(hex) {
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;
    return r + "," + g + "," + b;
}
var rgb = hexToRgb(prefs['header.nav']);
css += 'body #gaia_header .header_content .goldMessage {background: linear-gradient(to right, rgba('+ rgb +',0), rgba('+ rgb +',0.5), rgba('+ rgb +',0)), radial-gradient(ellipse at center top, rgba(255,255,255,0.25), rgba(255,255,255,0) 50%), radial-gradient(ellipse at center bottom, rgba(0,0,0,0.25), rgba(0,0,0,0) 50%)';

// Nav Hover
css += 'body #gaia_header #gaia_menu_bar #nav > li:hover, body #gaia_header #gaia_menu_bar #nav > li:hover:active, body #gaia_header #gaia_menu_bar #nav > li > .main_panel_container >  .main_panel ~ .panel_bottom {background-color: #' + prefs['header.nav.hover'] + ';}';

// Nav Current
css += 'body #gaia_header #gaia_menu_bar #nav > li.selected {background-color: #' + prefs['header.nav.current'] + ';}';

// Instant CSS Updating
if (prefs['instantUpdating'] == true) {
    chrome.storage.local.get('css', function(data) {
        if (typeof(data) == 'object' && typeof(data.css) == 'string' && data.css != '') {
            var head = document.getElementsByTagName('head');
            if (head.length > 0) {
                var style = document.createElement('style');
                style.type = 'text/css';
                style.setAttribute('bg-updatedcss', '');
                style.appendChild(document.createTextNode(data.css));
                head[0].appendChild(style);
            }
        }
    });
}

// Add CSS
var head = document.getElementsByTagName('head');
if (head.length > 0) {
    var style = document.createElement('style');
    style.setAttribute('bg-css', '');
    style.appendChild(document.createTextNode(css));
    head[0].appendChild(style);
}

} // ---

// Get Storage and Fire
if (prefs['appliedUserPrefs'] != true)
chrome.storage.sync.get(null, function(response) {
  for (var key in response) {
		try {prefs[key] = response[key];}
		catch(e) {console.warn('BetterGaia: Missing pref \'' + e + '\'.')}
  }

	prefs['appliedUserPrefs'] = true;

  // Could use some code reuse
  if (typeof(MainCss) == 'function' && prefs['appliedMainCss'] == false) {
		MainCss();
		prefs['appliedMainCss'] = true;
	}
	if (typeof(MainJs) == 'function' && prefs['appliedMainJs'] == false) {
		MainJs();
		prefs['appliedMainJs'] = true;
	}
	if (typeof(ForumCss) == 'function' && prefs['appliedForumCss'] == false) {
		ForumCss();
		prefs['appliedForumCss'] = true;
	}
	if (typeof(ForumJs) == 'function' && prefs['appliedForumJs'] == false) {console.log('ss')
		ForumJs();
		prefs['appliedForumJs'] = true;
	}
	if (typeof(Format) == 'function' && prefs['appliedFormat'] == false) {
		Format();
		prefs['appliedFormat'] = true;
	}
});
else CssJs();

chrome.storage.local.get(null, function(response) {
  for (var key in response) {
		try {prefs[key] = response[key];}
		catch(e) {console.warn('BetterGaia: Missing pref \'' + e + '\'.')}
  }
});