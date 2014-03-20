/*
Forum CSS JS
Copyright (c) BetterGaia and Bowafishtech
Unauthorized copying, sharing, adaptation, publishing, commercial usage, and/or distribution, its derivatives and/or successors, via any medium, is strictly prohibited.
*/
/*global localStorage: false, console: false, $: false, chrome: false, unescape: false, prefs: false, localPrefs: false, window: false, document: false */
/*jshint sub:true */
/*jshint multistr:true */

function ForumCss() {

// Inject CSS
var link = document.createElement('link');
    link.href = chrome.extension.getURL('code/css/forum.css');
    link.type = 'text/css';
    link.rel = 'stylesheet';
document.getElementsByTagName('head')[0].appendChild(link);

var css = '';

// Full page forum width
if (prefs['forum.constrain'] === false)
css += 'body.forum div#content, body.forums #content #content-padding, body.app-page_forum div#content, body.forums #gaia_content.ss_2Columns_flexiLeft_wideRight > #yui-main {width: calc(100% - 25px);}';

// Thread Header Color
if (prefs['forum.threadHeader'] != '#BF7F40')
css += 'body.forums #gaia_content:not(.grid_billie_holiday) #forum-header .linklist, body.forums #gaia_content #forum_ft_content, body.forums #content #content-padding > .linklist, body.forums #content #content-padding > #topic_header_container .detail-navlinks {background-color: ' + prefs['forum.threadHeader'] + ';} body.forums #gaia_content:not(.grid_billie_holiday) .subforums {box-shadow: 0 -3px 3px rgba(0,0,0,0.4), 0 -3px 0 ' + prefs['forum.threadHeader'] + ';}';

// Poll Drop Down
if (prefs['forum.pollHide'] === true) {css += 'body.forums #content #content-padding > #topic_header_container #thread_poll {height: 40px; overflow: hidden;} body.forums #content #content-padding > #topic_header_container #thread_poll:hover {height: auto; overflow: visible;} body.forums #content #content-padding > #topic_header_container #thread_poll:after {content: "\\25BC"; color: rgba(0,0,0,0.35); display: block; position: absolute; top: 9px; right: 8px; font-size: 17px; text-shadow: 0 1px 1px #FFF;} body.forums #content #content-padding > #topic_header_container #thread_poll:hover:after {color: rgba(0,0,0,0.7); content: "\\25B2";}';}

// Post Theme
if (prefs['forum.postHeader'] != '#CFE6F9')
css += 'body.forums #content #post_container .post .postcontent .user_info_wrapper, body.forums #content #post_container .post .postcontent .message .messagecontent .post-options, body.forums #content #post_container .post .postcontent .post-signature {background-color: ' + prefs['forum.postHeader'] + ';}';

// Add background to posts
if (prefs['forum.post.bgContainer'] === true)
css += 'body.forums #content #post_container .post > .postcontent {border-radius: 4px 10px 0 0; background-image: linear-gradient(to bottom, rgba(255,255,255,0.6), rgba(255,255,255,0.6)); background-color: ' + prefs['forum.postHeader'] + ';} body.forums #content #post_container .post.bgpc_hidden > .postcontent {border-radius: 4px;}';

// Make posts off white
if (prefs['forum.postOffWhite'] === true) {css += 'body.forums #content #post_container .post .postcontent .message .messagecontent {background-color: rgba(255,255,255,0.95);} body.forums #content #post_container .post .postcontent .message .messagecontent .post-bubble div.content, body.forums #content #post_container .post .postcontent .message .messagecontent .post-bubble .avi-speech:not(.document) .avi-speech-bd {background-color: transparent;} body.forums #content #post_container .post .postcontent .message .messagecontent::before {border-right-color: rgba(255,255,255,0.95);}';}

// Put post options on top
if (prefs['forum.post.optionsBottom'] === false)
css += 'body.forums #content #post_container .post .postcontent .message .messagecontent {padding: 30px 0 0;} body.forums #content #post_container .post .postcontent .message .messagecontent .post-options {top: 0; bottom: auto; border-top: 0;}';

// Add CSS
var style = document.createElement('style');
    style.type = 'text/css';
    style.setAttribute('bg-forumcss', '');
    style.appendChild(document.createTextNode(css));
document.getElementsByTagName('head')[0].appendChild(style);

} // ---

// Check Storage and Fire
if (prefs['appliedUserPrefs'] === true && prefs['appliedForumCss'] === false) {
	ForumCss();
	prefs['appliedForumCss'] = true;
}
