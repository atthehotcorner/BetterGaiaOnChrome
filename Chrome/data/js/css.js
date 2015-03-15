// CSS JS Copyright (c) BetterGaia
/*global chrome: false, console: false, Handlebars: false, prefs: false*/
/*jshint browser: true, jquery: true, multistr: true, sub: true*/

var BGcss = {
    inject: {
        link: function(url) {
            var link = document.createElement('link');
                link.href = url;
                link.type = 'text/css';
                link.rel = 'stylesheet';
            document.documentElement.appendChild(link);
        },
        text: function(text) {
            if (text === '') return;
            var style = document.createElement('style');
                style.type = 'text/css';
                style.setAttribute('bg-css', '');
                style.appendChild(document.createTextNode(text));
            document.documentElement.appendChild(style);
        }
    },
    
    main: function() {
        // Inject stylesheets
        this.inject.link(chrome.extension.getURL('data/css/font.css'));
        this.inject.link(chrome.extension.getURL('data/css/main.css'));
        
        // CSS container
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
            css += 'body.time-day, body.time-night, body.time-dawn, body.time-dusk, body table.warn_block {';
                css += 'background-color: ' + prefs['background.color'] + ';'; // Color
                css += 'background-position: ' + prefs['background.position'] + ';'; // Position
                if (prefs['background.repeat'] === false) css += 'background-repeat: no-repeat;'; // Repeat
                else css += 'background-repeat: repeat;'; // Repeat
                if (prefs['background.float'] === true) css += 'background-attachment: fixed;'; // Float
                else css += 'background-attachment: scroll;'; // Float
            css += '}';
        }

        // Header Background
        if (prefs['header.background'] != 'default')
        css += '.time-day div.town-barton .header_content, .time-dawn div.town-barton .header_content, .time-dusk div.town-barton .header_content, .time-night div.town-barton .header_content, .time-day div.town-isledegambino .header_content, .time-dawn div.town-isledegambino .header_content, .time-dusk div.town-isledegambino .header_content, .time-night div.town-isledegambino .header_content, .time-day div.town-aekea .header_content, .time-dawn div.town-aekea .header_content, .time-dusk div.town-aekea .header_content, .time-night div.town-aekea .header_content, .time-day div.town-durem .header_content, .time-dawn div.town-durem .header_content, .time-dusk div.town-durem .header_content, .time-night div.town-durem .header_content, .time-day div.town-basskenlake .header_content, .time-dawn div.town-basskenlake .header_content, .time-dusk div.town-basskenlake .header_content, .time-night div.town-basskenlake .header_content {background-image: url(' + prefs['header.background'] + ');}';
        
        // Header Background Base
        if (prefs['header.background.base'] != 'default')
        css += '.time-day div.town-barton, .time-dawn div.town-barton, .time-dusk div.town-barton, .time-night div.town-barton, .time-day div.town-isledegambino, .time-dawn div.town-isledegambino, .time-dusk div.town-isledegambino, .time-night div.town-isledegambino, .time-day div.town-aekea, .time-dawn div.town-aekea, .time-dusk div.town-aekea, .time-night div.town-aekea, .time-day div.town-durem, .time-dawn div.town-durem, .time-dusk div.town-durem, .time-night div.town-durem, .time-day div.town-basskenlake, .time-dawn div.town-basskenlake, .time-dusk div.town-basskenlake, .time-night div.town-basskenlake {background-image: url(' + prefs['header.background.base'] + '); background-repeat: repeat;}';

        // Header Background Stretch
        if (prefs['header.background.stretch'] === false)
        css += 'body div#gaia_header {width: 1140px;}';

        // Logo
        if (prefs['header.logo'] != 'default')
        css += 'body #gaia_header .header_content .gaiaLogo a, body #gaia_header .header_content .gaiaLogo a:hover {background-image: url(' + prefs['header.logo'] + ');}';

        // Navigation and HUD theme color
        css += 'body #gaia_header .hud-account > ul, body #gaia_menu_bar, #nav > li .main_panel_container .main_panel .panel-title {background-color: ' + prefs['header.nav'] + ';}';

        // Nav Hover
        css += '#nav > li:not(#menu_search):hover, #nav > li:not(#menu_search):hover:active {background-image: radial-gradient(ellipse at bottom center, ' + prefs['header.nav.hover'] + ', transparent 95%);}';

        // Nav Current
        css += '#nav > li.selected {background-image: radial-gradient(ellipse at bottom center, ' + prefs['header.nav.current'] + ', transparent 95%);}';
        
        // Inject customized css
        this.inject.text(css);
    },

    forum: function() {
        // Inject Stylesheets
        this.inject.link(chrome.extension.getURL('data/css/forum.css'));

        // CSS container
        var css = '';
        
        // Full page forum width
        if (prefs['forum.constrain'] === false)
        css += 'body.forum div#content, body.forums #content #content-padding, body.app-page_forum div#content, body.forums #gaia_content.ss_2Columns_flexiLeft_wideRight > #yui-main {width: calc(100% - 25px);}';

        // Thread Header Color
        if (prefs['forum.threadHeader'] != prefs.default['forum.threadHeader'])
        css += 'body.forums #gaia_content:not(.grid_billie_holiday) #forum-header .linklist, body.forums #content #content-padding > .linklist, body.forums #gaia_content .forum-list + #forum_ft_content:before {background-color: ' + prefs['forum.threadHeader'] + ';}';

        // Poll Drop Down
        if (prefs['forum.pollHide'] === true) {css += 'body.forums #content #content-padding > #topic_header_container #thread_poll {height: 40px; overflow: hidden;} body.forums #content #content-padding > #topic_header_container #thread_poll:hover {height: auto; overflow: visible;} body.forums #content #content-padding > #topic_header_container #thread_poll:after {content: "\\25BC"; color: rgba(0,0,0,0.35); display: block; position: absolute; top: 9px; right: 8px; font-size: 17px; text-shadow: 0 1px 1px #FFF;} body.forums #content #content-padding > #topic_header_container #thread_poll:hover:after {color: rgba(0,0,0,0.7); content: "\\25B2";}';}

        // Post Theme
        if (prefs['forum.postHeader'] != prefs.default['forum.postHeader'])
        css += 'body.forums #content #post_container .post .postcontent .user_info_wrapper {background-color: ' + prefs['forum.postHeader'] + ';}';

        // Add background to posts
        if (prefs['forum.post.bgContainer'] === true)
        css += 'body.forums #content #post_container .post > .postcontent {border-radius: 5px 0 0 0; background-image: linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(255,255,255,0.9)); background-size: 130px 130px; background-repeat: repeat-y;} body.forums #content #post_container .post.bgpc_hidden > .postcontent {border-radius: 5px;} body.forums #content #post_container .post .postcontent .user_info_wrapper .user_info .user_name {border-radius: 0;}';

        // Make posts off white
        if (prefs['forum.postOffWhite'] === true) {css += 'body.forums #content #post_container .post .postcontent .message .messagecontent .post-bubble {background-color: rgba(255,255,255,0.9);} body.forums #content #post_container .post .postcontent .message .messagecontent .post-bubble div.content, body.forums #content #post_container .post .postcontent .message .messagecontent .post-bubble .avi-speech:not(.document) .avi-speech-bd {background-color: transparent;}';}

        // Make forums all white
        if (prefs['forum.reduceTransparency'] === true) {css += 'body.forums #content #content-padding > #topic_header_container #thread_header, body.forums #content #content-padding > #topic_header_container #thread_poll, body.forums #content #content-padding > #topic_header_container .detail-navlinks, body.forums #content #post_container .post .postcontent .message .messagecontent .post-options, body.forums #content #post_container .post .postcontent .post-signature, body.forums #content #content-padding > #navlinks_pag {background-color: #FFF;}';}

        // Put post options on top
        if (prefs['forum.post.optionsBottom'] === false)
        css += 'body.forums #content #post_container .post .postcontent .message .messagecontent {flex-direction: column-reverse;}';
        
        // Inject customized css
        this.inject.text(css);
    },
    
    init: function() {
        this.main();

        if (document.location.pathname.indexOf('/forum/') > -1 || ['/news', '/news/'].indexOf(document.location.pathname) > -1) this.forum();
    }
};

// Check Storage and Fire
if (prefs['appliedPrefs'] !== true) {
    // Save a default
    prefs.default = JSON.parse(JSON.stringify(prefs));

    // Get settings
    chrome.storage.local.get(null, function(response) {
        for (var key in response) {
            try {prefs[key] = response[key];}
            catch(e) {console.warn('BetterGaia: unused preference, \'' + e + '\'.');}
        }

        prefs['appliedPrefs'] = true;
        BGcss.init();
    });
}
else BGcss.init();
