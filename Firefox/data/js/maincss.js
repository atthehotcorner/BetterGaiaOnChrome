/*
CSS JS
Copyright (c) BetterGaia and Bowafishtech
Unauthorized copying, sharing, adaptation, publishing, commercial usage, and/or distribution, its derivatives and/or successors, via any medium, is strictly prohibited.
*/
/*global localStorage: false, console: false, $: false, unescape: false, prefs: false, localPrefs: true, window: false, document: false, Format: false, CssJs: false, ForumCss: false, MainJs: false, ForumJs: false, self: false */
/*jshint sub:true */
/*jshint multistr:true */

function MainCss() {

// Inject CSS
var link = document.createElement('link');
    link.href = self.options.mainCssUrl.slice(0,-12) + 'css/font.css';
    link.type = 'text/css';
    link.rel = 'stylesheet';
document.getElementsByTagName('head')[0].appendChild(link);

var link2 = document.createElement('link');
    link2.href = self.options.mainCssUrl;
    link2.type = 'text/css';
    link2.rel = 'stylesheet';
document.getElementsByTagName('head')[0].appendChild(link2);

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
document.getElementsByTagName('head')[0].appendChild(style);

// Instant CSS Updating
if (prefs['instantUpdating'] === true && typeof(prefs['css']) == 'string') {
    var style2 = document.createElement('style');
        style2.type = 'text/css';
        style2.setAttribute('bg-updatedcss', '');
        style2.appendChild(document.createTextNode(prefs['css']));
    document.getElementsByTagName('head')[0].appendChild(style2);
}

} // ---

// Get Storage and Fire
MainCss();