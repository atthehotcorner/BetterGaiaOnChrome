/*
CSS JS
Copyright (c) BetterGaia
*/

// Inject CSS
var link = document.createElement('link');
    link.href = chrome.extension.getURL('data/css/font.css');
    link.type = 'text/css';
    link.rel = 'stylesheet';
document.documentElement.appendChild(link);

var link2 = document.createElement('link');
    link2.href = chrome.extension.getURL('data/css/main.css');
    link2.type = 'text/css';
    link2.rel = 'stylesheet';
document.documentElement.appendChild(link2);

function MainCss() {

var css = '';

// Float Username
if (prefs['header.float'] === false)
css += 'body #gaia_header #user_header_wrap > #user_account, body #gaia_header #bg_userbar {position: absolute;}';

// Show Suggested Content
if (prefs['mygaia.suggested'] === false)
css += 'body.mygaia #gaia_content #bd .mg_content.suggested {display: block;}';

// Background
if (prefs['background.image'] != 'default')
css += 'body.time-day, body.time-dawn, body.time-dusk, body.time-night, body table.warn_block {background-image: url(' + prefs['background.image'] + ');}';

// Background Options
if (prefs['background.image'] != 'default') {
    css += 'body.time-day, body.time-night, body.time-dawn, .time-dusk, body table.warn_block {';
        css += 'background-color: ' + prefs['background.color'] + ';'; // Color
        css += 'background-position: ' + prefs['background.position'] + ';'; // Position
        if (prefs['background.repeat'] === false) css += 'background-repeat: no-repeat;'; // Repeat
        else css += 'background-repeat: repeat;'; // Repeat
        if (prefs['background.float'] === true) css += 'background-attachment: fixed;'; // Float
        else css += 'background-attachment: scroll;'; // Float
    css += '}';
}

// If Background is Gaia Town
if (prefs['background.image'] == 'http://s.cdn.gaiaonline.com/images/global_bg/bg2.jpg')
css += 'body.time-day, body.time-night, body.time-dawn, .time-dusk, body table.warn_block {background-position: bottom left !important; background-repeat: no-repeat !important; background-color: #12403d !important;}';

// Header Background
if (prefs['header.background'] != 'default')
css += '.time-day div.town-barton .header_content, .time-dawn div.town-barton .header_content, .time-dusk div.town-barton .header_content, .time-night div.town-barton .header_content {background-image: url(' + prefs['header.background'] + ');}';

// Header Background Base
if (prefs['header.background.base'] != 'default')
css += '.time-day div.town-barton, .time-dawn div.town-barton, .time-dusk div.town-barton, .time-night div.town-barton {background-image: url(' + prefs['header.background.base'] + '); background-repeat: repeat;}';

// Header Background Stretch
if (prefs['header.background.stretch'] === false)
css += 'body div#gaia_header {width: 1140px;}';

// Logo
if (prefs['header.logo'] != 'default')
css += 'body #gaia_header .header_content .gaiaLogo a, body #gaia_header .header_content .gaiaLogo a:hover {background-image: url(' + prefs['header.logo'] + ');}';

// Navigation and HUD
css += 'body #gaia_header .hud-account > ul, body #gaia_menu_bar, #nav > li .main_panel_container .main_panel .panel-title {background-color: ' + prefs['header.nav'] + ';}';

// Nav Hover
css += '#nav > li:not(#menu_search):hover, #nav > li:not(#menu_search):hover:active {background-image: radial-gradient(ellipse at bottom center, ' + prefs['header.nav.hover'] + ', transparent 95%);}';

// Nav Current
css += '#nav > li.selected {background-image: radial-gradient(ellipse at bottom center, ' + prefs['header.nav.current'] + ', transparent 95%);}';

// Add CSS
var style = document.createElement('style');
    style.type = 'text/css';
    style.setAttribute('bg-css', '');
    style.appendChild(document.createTextNode(css));
document.documentElement.appendChild(style);

// Instant CSS Updating
if (prefs['instantUpdating'] === true && typeof(prefs['css']) == 'string') {
    var style2 = document.createElement('style');
        style2.type = 'text/css';
        style2.setAttribute('bg-updatedcss', '');
        style2.appendChild(document.createTextNode(prefs['css']));
    document.documentElement.appendChild(style2);
}

} // ---

// Get Storage and Fire
if (prefs['appliedUserPrefs'] !== true) {
    chrome.storage.local.get(null, function(response) {
        for (var key in response) {
            try {prefs[key] = response[key];}
            catch(e) {console.warn('BetterGaia: Missing pref \'' + e + '\'.');}
        }

        prefs['appliedUserPrefs'] = true;

        // Could be better written
        if (typeof(MainCss) == 'function' && prefs['appliedMainCss'] === false) {
            MainCss();
            prefs['appliedMainCss'] = true;
        }
        if (typeof(MainJs) == 'function' && prefs['appliedMainJs'] === false) {
            MainJs();
            prefs['appliedMainJs'] = true;
        }
        if (typeof(ForumCss) == 'function' && prefs['appliedForumCss'] === false) {
            ForumCss();
            prefs['appliedForumCss'] = true;
        }
        if (typeof(ForumJs) == 'function' && prefs['appliedForumJs'] === false) {
            ForumJs();
            prefs['appliedForumJs'] = true;
        }
        if (typeof(Format) == 'function' && prefs['appliedFormat'] === false) {
            Format();
            prefs['appliedFormat'] = true;
        }
    });
}
else MainCss();
