// Forum JS (c) BetterGaia and bowafishtech

var bgforum = { loadedForumPage: function() {
// Adds Post Options on Thread Page
jQuery("body.forums #content #content-padding #topic_header_container .detail-navlinks .thread_options").append('<div class="bg_postoptions">\
<a class="bgpo_toggle bgpo_posts"><on>Hide</on><off>Show</off> Posts</a> <a class="bgpo_toggle bgpo_sigs"><on>Hide</on><off>Show</off> Sigs</a></div>');

// Adds Functions to Post Options
jQuery("body.forums #content #content-padding #topic_header_container .detail-navlinks .thread_options .bg_postoptions .bgpo_posts").on("click", function(){
    if ( jQuery(this).hasClass("bgpo_on") ) {
		jQuery("body.forums #content #content-padding #topic_header_container .detail-navlinks .thread_options .bg_postoptions .bgpo_posts").removeClass("bgpo_on");
		jQuery("body.forums #content #content-padding #topic_header_container .detail-navlinks .thread_options .bg_postoptions .bgpo_posts").parent().parent().find(".bgpo_sigs").removeClass("bgpo_on");
		jQuery("body.forums #post_container .post .post-signature").show();
		jQuery("body.forums #post_container .post").removeClass("bgpc_hidden");
	}
	else {
		jQuery("body.forums #content #content-padding #topic_header_container .detail-navlinks .thread_options .bg_postoptions .bgpo_posts").addClass("bgpo_on");
		jQuery("body.forums #content #content-padding #topic_header_container .detail-navlinks .thread_options .bg_postoptions .bgpo_posts").parent().parent().find(".bgpo_sigs").addClass("bgpo_on");
		jQuery("body.forums #post_container .post .post-signature").hide();
		jQuery("body.forums #post_container .post").addClass("bgpc_hidden");
	}
});

jQuery("body.forums #content #content-padding #topic_header_container .detail-navlinks .thread_options .bg_postoptions .bgpo_sigs").on("click", function(){
	if ( jQuery("body.forums #content #content-padding #topic_header_container .detail-navlinks .thread_options .bg_postoptions .bgpo_sigs").hasClass("bgpo_on") ) {
		jQuery("body.forums #content #content-padding #topic_header_container .detail-navlinks .thread_options .bg_postoptions .bgpo_sigs").removeClass("bgpo_on");
		jQuery("body.forums #post_container .post .post-signature").show();
	}
	else {
		jQuery("body.forums #content #content-padding #topic_header_container .detail-navlinks .thread_options .bg_postoptions .bgpo_sigs").addClass("bgpo_on");
		jQuery("body.forums #post_container .post .post-signature").hide();
	}
});

// Adds Toggle Signiture Button
jQuery("body.forums .post .post-signature").each(function () { 
	jQuery(this).parent().find(".message .messagecontent > .post-options > ul > li.post-meta").before('<li><a class="bg_togglesig">Hide Sig</a></li>');
});

jQuery('body.forums .post .message .messagecontent a.bg_togglesig').click( function() { 
	jQuery(this).parent().parent().parent().parent().parent().parent().find(".post-signature").toggle();
});

// Toggles Each Post by Clicking Button
jQuery("body.forums .post .user_info_wrapper .user_info").append('<div class="bg_postcollapse" title="Collapse/Expand Post"></div>');

jQuery("body.forums .post .user_info_wrapper .user_info .bg_postcollapse").click( function() { 
	if (jQuery(this).parent().parent().parent().parent().hasClass("bgpc_hidden")) {jQuery(this).parent().parent().parent().parent().removeClass("bgpc_hidden");}
	else {jQuery(this).parent().parent().parent().parent().addClass("bgpc_hidden");}
});

// Moves timestamp
jQuery("body.forums .post .message .messagecontent > .post-options > ul > li.post-meta").each(function () { 
	jQuery(this).appendTo(jQuery(this).parent().parent().parent().parent().parent().find(".user_info_wrapper .user_info"));
});

}};

// -- set up forum page transformations --

// first run
bgforum.loadedForumPage();

// ajax based runs
// Seems to cause an unknown exception in Firefox, not Chrome though
if (window.MutationObserver) {
	var observer = new window.MutationObserver(function(mutations) {
		bgforum.loadedForumPage();
	});
	
	observer.observe(document.getElementById("content-padding"), { attributes: false, childList: true, characterData: false });
}