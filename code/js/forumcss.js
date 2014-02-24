/*
Forum CSS JS
Copyright (c) BetterGaia and Bowafishtech
Unauthorized copying, sharing, adaptation, publishing, commercial usage, and/or distribution, its derivatives and/or successors, via any medium, is strictly prohibited.
*/

function ForumCss() {
var css = '';

// Full page forum width
if (prefs['forum.constrain'] == false)
css += 'body.forum div#content, body.forums #content #content-padding, body.app-page_forum div#content, body.forums #gaia_content.ss_2Columns_flexiLeft_wideRight > #yui-main {width: calc(100% - 25px);}';

// Thread Header Color
if (prefs['forum.threadHeader'] != '#BF7F40')
css += 'body.forums #gaia_content:not(.grid_billie_holiday) #forum-header .linklist, body.forums #gaia_content #forum_ft_content, body.forums #content #content-padding > .linklist, body.forums #content #content-padding > #topic_header_container .detail-navlinks, body.forums #content #content-padding > #navlinks_pag .forum_detail_pagination, body.forums #content #content-padding > #navlinks_pag .forum_detail_pagination::before {background-color: ' + prefs['forum.threadHeader'] + ';} body.forums #gaia_content:not(.grid_billie_holiday) #forum-header + .subforums {box-shadow: 0 1px 3px rgba(0,0,0,0.4), rgba(0,0,0,0.14) 0 -3px 0, 0 -3px 0 ' + prefs['forum.threadHeader'] + ';}';

// Post Theme
if (prefs['forum.postHeader'] != '#CFE6F9')
css += 'body.forums #content #post_container .post .postcontent .user_info_wrapper, body.forums #content #post_container .post .postcontent .message .messagecontent .post-options, body.forums #content #post_container .post .postcontent .post-signature  {background-color: ' + prefs['forum.postHeader'] + ';}';

// Add CSS
var head = document.getElementsByTagName('head');
if (head.length > 0) {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.setAttribute('bg-forumcss', '');
    style.appendChild(document.createTextNode(css));
    head[0].appendChild(style);
}

} // ---

// Check Storage and Fire
if (prefs['appliedUserPrefs'] == true && prefs['appliedForumCss'] == false) {
	ForumCss();
	prefs['appliedForumCss'] = true;
}
