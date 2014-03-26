// Forum CSS JS (c) BetterGaia and bowafishtech
self.port.on("sstorage", function(response) {

    var css = "@import url('resource://jid0-nifeetyln4noyxdbzcmia3gcbkk-at-jetpack/bettergaia/data/css/forums.css');";

    // Hide ads
	if (JSON.parse(response["main.features.hideAds"]) == true) {css += 'body.forums .penthouse, body.forums > #content > #gaia_content.ss_2Columns_flexiLeft_wideRight > .yui-b, body.forums #forum_title_header  .topic_detail_penthouse, body.forums > #content > #thread_leaderboard_ad, body.forums #content #content-padding > #thread_mrec_ad, body.forums #content #post_container .post + div[style="margin-left: auto; margin-right: auto; width: 728px"] {display: none;}';}

	// Resize forum width
	if (JSON.parse(response["main.forums.size"]) == false) {css += 'body.forums #content #content-padding, body.forums #gaia_content.grid_dizzie_gillespie, body.forums #gaia_content.ss_2Columns_flexiLeft_wideRight > #yui-main {width: 97%;}';}

	// Thread header recolor
	if (response["style.forums.threadHeader"] != 'BF7F40') {css += 'body.forums #gaia_content:not(.grid_billie_holiday) #forum-header .linklist, body.forums #gaia_content #forum_ft_content, body.forums #content #content-padding > .linklist, body.forums #content #content-padding > #topic_header_container .detail-navlinks, body.forums #content #content-padding > #navlinks_pag .forum_detail_pagination {background-color: #' + response["style.forums.threadHeader"] + ';} body.forums #gaia_content:not(.grid_billie_holiday) #forum-header + .subforums {box-shadow: 0 1px 3px rgba(0,0,0,0.4), rgba(0,0,0,0.14) 0 -3px 0, 0 -3px 0 #' + response["style.forums.threadHeader"] + ';}';}

	// Make poll into drop down
	if (JSON.parse(response["main.forums.pollDropDown"]) == true) {css += 'body.forums #content #content-padding > #topic_header_container #thread_poll {height: 40px; overflow: hidden;} body.forums #content #content-padding > #topic_header_container #thread_poll:hover {height: auto; overflow: visible;} body.forums #content #content-padding > #topic_header_container #thread_poll:after {content: "\\25BC"; color: rgba(0,0,0,0.4); background: rgba(255,255,255,0.7); width: 15px; display: block; position: absolute; top: 10px; right: 10px; text-align: center; height: 15px; line-height: 12px; border-radius: 7px; font-size: 11px; padding: 2px 1px 1px 2px; box-shadow: 0 1px 1px rgba(0,0,0,0.5) inset; box-sizing: border-box; text-shadow: 0 1px 1px #FFF;} body.forums #content #content-padding > #topic_header_container #thread_poll:hover:after {background: rgba(255,255,255,0.9); color: rgba(0,0,0,0.7); content: "\\25B2";}';}

	// Places Quote Buttons at top of post
	if (JSON.parse(response["main.forums.quoteAbovePost"]) == true) {css += 'body.forums #content #post_container .post .postcontent .message .messagecontent {padding: 22px 0 0;} body.forums #content #post_container .post .postcontent .message .messagecontent .post-options {bottom: auto; top: 0; position: absolute; border-radius: 3px 3px 0 0; border-bottom: 1px solid #B7D1E8; border-top: 0;} body.forums #content #post_container .post .postcontent .post-signature {box-shadow: 0 -5px 0 #FFF;} body.forums #content #post_container .post.bgpc_hidden .postcontent .post-signature {box-shadow: none;}';}

	// Add bg to posts
	if (JSON.parse(response["main.forums.whiteBgAvis"]) == true) {css += 'body.forums #content #post_container .post {background: -webkit-linear-gradient(top, #FFF, #E7EEFE 200px); border-radius: 3px;} body.forums #content #post_container .post.bgpc_hidden {background: none;}';}

	// Hide post tipping
	if (JSON.parse(response["main.forums.postTipping"]) == true) {css += 'body.forums #content #post_container .post .postcontent .message .messagecontent .post-options ul li > .tipbox {display: none;}';}


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