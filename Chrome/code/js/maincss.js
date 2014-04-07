/*
CSS JS
Copyright (c) BetterGaia and Bowafishtech
Unauthorized copying, sharing, adaptation, publishing, commercial usage, and/or distribution, its derivatives and/or successors, via any medium, is strictly prohibited.
*/
/*global localStorage: false, console: false, $: false, chrome: false, unescape: false, prefs: false, localPrefs: true, window: false, document: false, Format: false, CssJs: false, ForumCss: false, MainJs: false, ForumJs: false */
/*jshint sub:true */
/*jshint multistr:true */

// Inject CSS
var link = document.createElement('link');
    link.href = chrome.extension.getURL('code/css/main.css');
    link.type = 'text/css';
    link.rel = 'stylesheet';
document.documentElement.appendChild(link);

function MainCss() {

var css = '';

// Hide Ads
if (prefs['adsHide'] === true)
css += '#bb-advertisement, #offer_banner, #grid_ad, .gaia-ad, .as_ad_frame, #cr_overlay {display: none !important;}';

// Float Username
if (prefs['header.float'] === false)
css += 'body #gaia_header .hud-account {position: absolute;}';

// Show Suggested Content
if (prefs['mygaia.suggested'] === false)
css += 'body.mygaia #gaia_content #bd .mg_content.suggested {display: block;}';

// Background
if (prefs['background.image'] != 'default')
css += 'body.time-day, body.time-night, body.time-dawn, .time-dusk, body table.warn_block {background-image: url(' + prefs['background.image'] + ');}';

// Background Options
css += 'body.time-day, body.time-night, body.time-dawn, .time-dusk, body table.warn_block {';
    css += 'background-color: ' + prefs['background.color'] + ';'; // Color
    css += 'background-position: ' + prefs['background.position'] + ';'; // Position
    if (prefs['background.repeat'] === false) css += 'background-repeat: no-repeat;'; // Repeat
    if (prefs['background.float'] === true) css += 'background-attachment: fixed;'; // Float
css += '}';

// If Background is Gaia Town
if (prefs['background.image'] == 'http://s.cdn.gaiaonline.com/images/global_bg/bg2.jpg') 
css += 'body.time-day, body.time-night, body.time-dawn, .time-dusk, body table.warn_block, body[style] {background-position: bottom left !important; background-repeat: no-repeat !important; background-color: #12403d !important;}';

// Header Background
if (prefs['header.background'] != 'default')
css += 'body #gaia_header .header_content {background-image: url(' + prefs['header.background'] + ');}';

// Header Background Base
if (prefs['header.background.base'] != 'default')
css += 'body #gaia_header {background: url(' + prefs['header.background.base'] + ') repeat-x;}';

// Header Background Stretch
if (prefs['header.background.stretch'] === false)
css += 'body div#gaia_header {width: 1140px;}';

// Logo
if (prefs['header.logo'] != 'default') 
css += 'body #gaia_header .header_content .gaiaLogo a, body #gaia_header .header_content .gaiaLogo a:hover {background-image: url(' + prefs['header.logo'] + ');}';

// Navigation and HUD
css += 'body #gaia_header .hud-account ul, body #gaia_menu_bar {background-color: ' + prefs['header.nav'] + ';}';

function hexToRgb(hex) {
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;
    return r + "," + g + "," + b;
}
var rgb = hexToRgb(prefs['header.nav.current']);
css += 'body #gaia_header .header_content .goldMessage {linear-gradient(to right, rgba(' + rgb + ', 0), rgba(' + rgb + ',0.5), rgba(' + rgb + ',0)), radial-gradient(ellipse at center top, rgba(255,255,255,0.25), rgba(255,255,255,0) 50%), radial-gradient(ellipse at center bottom, rgba(0,0,0,0.25), rgba(0,0,0,0) 50%);}';

// Nav Hover
css += '#nav > li:not(#menu_search):hover, #nav > li:not(#menu_search):hover:active {background-color: ' + prefs['header.nav.hover'] + ';}';

// Nav Current
css += '#nav > li.selected {background-color: ' + prefs['header.nav.current'] + ';}';

// Add CSS
var style = document.createElement('style');
    style.type = 'text/css';
    style.setAttribute('bg-css', '');
    style.appendChild(document.createTextNode(css));
document.documentElement.appendChild(style);

// Instant CSS Updating
if (prefs['instantUpdating'] === true && typeof(localPrefs['css']) == 'string') {
    var style2 = document.createElement('style');
        style2.type = 'text/css';
        style2.setAttribute('bg-updatedcss', '');
        style2.appendChild(document.createTextNode(localPrefs['css']));
    document.documentElement.appendChild(style2);
}

} // ---

// Get Storage and Fire
if (prefs['appliedUserPrefs'] !== true)
chrome.storage.sync.get(null, function(response) {
  chrome.storage.local.get(null, function(response2) {
    localPrefs = response2;

    for (var key in response) {
        try {prefs[key] = response[key];}
        catch(e) {console.warn('BetterGaia: Missing pref \'' + e + '\'.');}
    }

    prefs['appliedUserPrefs'] = true;
    
    // Could use some code reuse
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
});
else MainCss();