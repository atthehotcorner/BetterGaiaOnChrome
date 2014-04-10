/*
Forum JS 
Copyright (c) BetterGaia and Bowafishtech
Unauthorized copying, sharing, adaptation, publishing, commercial usage, and/or distribution, its derivatives and/or successors, via any medium, is strictly prohibited.
*/
/*global localStorage: false, console: false, $: false, chrome: false, unescape: false, prefs: false, localPrefs: false, window: false, document: false, Format: false */
/*jshint sub:true */
/*jshint multistr:true */

function ForumJs() {

// Fetch all announcements
if (prefs['announcementReader'] === true && document.location.pathname == '/news/' && $('#gaia_header #notifyItemList .notify_announcements .notify_icon_announcement').length == 1) {
    // Get number of remaining announcements
    var remaining = parseInt($('#gaia_header #notifyItemList .notify_announcements .notify_icon_announcement').text().replace(/\D/g, ''), 10);
    if (remaining > 10) remaining = 10;

    // Add button
    var s = (remaining == 1)? '':'s';
    $('#content').prepend('<a id="bgFetchAnnouncements">You still have ' + remaining + ' announcement' + s + ' to open. Would you like to open the rest on this page?</a>');

    // Fetch
    $('#bgFetchAnnouncements').on('click', function() {
        $('#bgFetchAnnouncements').after('<h3 class="bgFAh3">' + (remaining + 1) + ', Oldest</h3>');

        function apply() {
            console.log('apply');
            $.ajax({
                url: '/news/',
                cache: false,
                dataType: 'html',
                headers: {'X-PJAX': true}
            })
            .done(function(html) {
                if ($('#thread_header #thread_title', html).length == 1) {
                    var text = (remaining == 1)? ', Newest':'';
                    $('#bgFetchAnnouncements').after('<h3 class="bgFAh3">' + remaining + text + '</h3><div id="content-padding">' + html + '</div>');
                }
                else {
                    remaining = 0;
                }

                console.log(remaining);
                // Keep loading
                if (remaining > 0) {
                    remaining--;
                    apply();
                }
                // No more, end
                else {
                    $('#gaia_header #notifyItemList .notify_announcements, #bgFetchAnnouncements').remove();
                    ForumJs();
                }
            });
        }

        $(this).off('click').addClass('loading').text('Fetching your announcements...');
        apply();
    });
}

// Add thread preview
if (prefs['forum.previewThreads'] === true) {
	$("body.forums #gaia_content table.forum-list tr td.title .one-line-title .topic-icon").after('<a class="bgThreadPreview" title="View the first post of this thread">[+]</a>');
	$("body.forums #gaia_content table.forum-list tr td.title .one-line-title a.bgThreadPreview").on("click", function(){
		if ($(this).closest('tr.rowon, tr.rowoff').next('tr.bgThreadPreviewBox').length === 0) {
			$(this).closest('tr.rowon, tr.rowoff').after('<tr class="bgThreadPreviewBox loading"><td colspan="6"><div>Test</div></td></tr>');
			var box = $(this).closest('tr.rowon, tr.rowoff').next('tr.bgThreadPreviewBox');
			$.ajax({
				type: 'GET',
				url: $(this).siblings('a[href]:not(.goto-new-posts)').attr('href'),
				headers: {'X-PJAX': true},
				success: function(data) {
					data = $("<div>").html(data);
					var avi = data.find("#post-1 .avi_box").html();
					var bubble = data.find("#post-1 .post-bubble").html();
					box.removeClass("loading").find('td > div').html("<div class='bgavi'>" + avi + "</div><div class='bgbubble'>" + bubble + "</div>");
				},
				error: function(error) {box.html("There was a problem retrieving the post.").removeClass('loading');}
			});
		}
		else $(this).closest('tr.rowon, tr.rowoff').next('tr.bgThreadPreviewBox').find('td > div').slideToggle('slow');
	});
}

// Adds Post Options on Thread Page
$("body.forums #content #content-padding #topic_header_container .detail-navlinks .thread_options").append('<div class="bg_postoptions">\
<a class="bgpo_toggle bgpo_posts"><on>Hide</on><off>Show</off> Posts</a> <a class="bgpo_toggle bgpo_sigs"><on>Hide</on><off>Show</off> Sigs</a></div>');

// Adds Functions to Post Options
if (typeof localPrefs['forum.hidePosts'] == 'boolean' && localPrefs['forum.hidePosts'] === true) {
    $('body.forums #content #content-padding #topic_header_container .detail-navlinks .thread_options .bg_postoptions .bgpo_posts, body.forums #content #content-padding #topic_header_container .detail-navlinks .thread_options .bg_postoptions .bgpo_sigs').addClass('bgpo_on');
	$('body.forums #post_container .post .post-signature').hide();
    $('body.forums #post_container .post').addClass('bgpc_hidden');
}

$('body.forums #topic_header_container .detail-navlinks .thread_options .bg_postoptions .bgpo_posts').on('click', function() {
	if ( $(this).hasClass("bgpo_on") ) {
		$("body.forums #content #content-padding #topic_header_container .detail-navlinks .thread_options .bg_postoptions .bgpo_posts").removeClass("bgpo_on");
		$("body.forums #content #content-padding #topic_header_container .detail-navlinks .thread_options .bg_postoptions .bgpo_posts").parent().parent().find(".bgpo_sigs").removeClass("bgpo_on");
		$("body.forums #post_container .post .post-signature").show();
		$("body.forums #post_container .post").removeClass("bgpc_hidden");

        // Disable persistance
        chrome.storage.local.remove('forum.hidePosts', function() {delete localPrefs['forum.hidePosts'];});
	}
	else {
		$("body.forums #content #content-padding #topic_header_container .detail-navlinks .thread_options .bg_postoptions .bgpo_posts").addClass("bgpo_on");
		$("body.forums #content #content-padding #topic_header_container .detail-navlinks .thread_options .bg_postoptions .bgpo_posts").parent().parent().find(".bgpo_sigs").addClass("bgpo_on");
		$("body.forums #post_container .post .post-signature").hide();
		$("body.forums #post_container .post").addClass("bgpc_hidden");

        // Enable persistance
        chrome.storage.local.set({'forum.hidePosts': true}, function() {localPrefs['forum.hidePosts'] = true;});
	}
});

$("body.forums #content #content-padding #topic_header_container .detail-navlinks .thread_options .bg_postoptions .bgpo_sigs").on("click", function(){
	if ( $("body.forums #content #content-padding #topic_header_container .detail-navlinks .thread_options .bg_postoptions .bgpo_sigs").hasClass("bgpo_on") ) {
		$("body.forums #content #content-padding #topic_header_container .detail-navlinks .thread_options .bg_postoptions .bgpo_sigs").removeClass("bgpo_on");
		$("body.forums #post_container .post .post-signature").show();
	}
	else {
		$("body.forums #content #content-padding #topic_header_container .detail-navlinks .thread_options .bg_postoptions .bgpo_sigs").addClass("bgpo_on");
		$("body.forums #post_container .post .post-signature").hide();
	}
});

// Adds Toggle Signiture Button
$("body.forums .post .post-signature").each(function () { 
	$(this).parent().find(".message .messagecontent > .post-options > ul > li.post-meta").before('<li><a class="bg_togglesig"><span>Hide Sig</span></a></li>');
});

$('body.forums .post .message .messagecontent a.bg_togglesig').click(function() { 
	$(this).closest('.postcontent').find(".post-signature").toggle();
});

// Toggles Each Post by Clicking Button
$("body.forums .post .user_info_wrapper .user_info").each(function(){ 
    if ($(this).find('.bg_postcollapse').length === 0) $(this).append('<div class="bg_postcollapse" title="Collapse/Expand Post"></div>');
});

$('body.forums .post .user_info_wrapper .user_info .bg_postcollapse').click(function() {
	$(this).closest('.post').toggleClass('bgpc_hidden');
});

// Adds Instants
$('body.forums .post .message .messagecontent .post-options ul').each(function () {
	if ($(this).find('a.post-quote').length > 0 || $(this).find('a.post-edit').length > 0) 
      $(this).prepend('<div class="bg_instant"><li><a class="bg_instanttext"><span>Instant</span></a></li></div>');

	if ($(this).find('a.post-quote').length > 0) {
		$(this).find('.bg_instant').append('<li><a class="bg_instantquote"><span>Quote</span></a></li>');
	}
	if ($(this).find('a.post-edit').length > 0) {
		$(this).find('.bg_instant').append('<li><a class="bg_instantedit"><span>Edit</span></a></li>');
	}
});

$("body.forums .post .message .messagecontent .post-options ul a.bg_instantquote").click(function() {
	var bubbleThis = $(this).closest('.messagecontent');
	
	if (bubbleThis.find(".bg_instantbox.quote").length === 0) {
		bubbleThis.find(".post-bubble").after("<div class='bg_instantbox quote loading'></div>");
		
		//get url
		var url = bubbleThis.find(".post-options a.post-quote").attr("href");
		$.get(url).done(function(data) {
            var pageHtml = $('<div>').html(data);
            pageHtml.find('script').remove();

			bubbleThis.find(".bg_instantbox.quote").removeClass("loading").html(pageHtml.find("form#compose_entry")[0].outerHTML);
            if (typeof(Format) === 'function') Format();
            else chrome.extension.sendMessage({elements: 'format'});
		});
	}
	else {
		$(this).closest('.messagecontent').find(".bg_instantbox.quote").slideToggle('slow');
	}
});

$("body.forums .post .message .messagecontent .post-options ul a.bg_instantedit").click( function() {
	var bubbleThis = $(this).closest('.messagecontent');
	
	if (bubbleThis.find(".bg_instantbox.edit").length === 0) {
		bubbleThis.find(".post-bubble").after("<div class='bg_instantbox edit loading'></div>");
		
		//get url
		var url = bubbleThis.find(".post-options a.post-edit").attr("href");
		$.get(url).done(function(data) {
            var pageHtml = $('<div>').html(data);
            pageHtml.find('script').remove();

			bubbleThis.find(".bg_instantbox.edit").removeClass("loading").html(pageHtml.find("form#compose_entry")[0].outerHTML);
		});
	}
	else {
		$(this).closest('.messagecontent').find('.bg_instantbox.edit').slideToggle('slow');
	}
});
        
// Enable redirects on same page
if (prefs['forum.externalLinks'] === true) {
	$("body.forums .post a[href^='http://www.gaiaonline.com/gaia/redirect.php?r=']").on("click", function(e){
		if ($(this).prop("href").match(/gaiaonline/g).length > 1 || e.ctrlKey || e.which == 2) {
			return true;
		}
		else {
			$("body").append($("<div class='bgredirect'></div>"));
			var thisurl = $(this).prop("href");
			if ($(this).children('img').attr('ismap')) {
				thisurl += "?" + e.offsetX + "," + e.offsetY;
			}

			$.ajax({type: "GET", url: thisurl, dataType: "html",
				success: function(data) {
                    var pageHtml = $('<div>').html(data);
                    pageHtml.find('script').remove();
                    
					$(".bgredirect").html($('<div>' + pageHtml + '</div>').html());
					$(".bgredirect table.warn_block #warn_block #warn_head").append("<a class='bgclose' title='close'></a>");
					$(".bgredirect a").attr("target", "_blank");
					$(".bgredirect a.link_display, .bgredirect a.bgclose").on("click", function(){
						$(".bgredirect").remove();
					});
				},
				error: function() {
					$(".bgredirect").remove();
					window.open(thisurl);
				}
			});

			return false;
		}
	});
}

// Add User Tagging
if (prefs['usertags'] === true) {
    // check if local prefs exist
    if (typeof(localPrefs['usertags.list']) == 'object' && $.isEmptyObject(prefs['usertags.list'])) {
        prefs['usertags.list'] = localPrefs['usertags.list'];
        console.warn('Your tags are currently saved locally.');
    }

    // Get userid and add tag links
    $('body.forums .post .user_info_wrapper .user_info .user_name').each(function() {
        if ($(this).siblings('.bgUserTag').length === 0) {
            var userid = '', avibox = $(this).closest('.postcontent').find('.avatar_wrapper .avi_box');
            if (avibox.find('a.avatar').length === 0) userid = avibox.find('#animated_item > object').attr('onmousedown').replace("window.location='", '').split("/")[5];
            else userid = avibox.find('a.avatar').attr('href').split('/')[5];
            $(this).after('<div class="bgUserTag"><a target="_blank" title="Tag" userid="' + userid + '"></a><span></span></div>');
        }
    });
	
    // Add stored tags
    var tags = prefs['usertags.list'];

    // Idenitfy me, special [color=#FEFEF0][size=1].[/size][/color]
    $('.bgUserTag a[userid="8152358"]').each(function() {
        if ($(this).closest('.postcontent').find('.message .post-bubble span[style="color: #FEFEF0"] span[style="font-size: 1px"]').length != 1)
            $(this).attr({href: '/forum/t.45053993/'}).text('BetterGaia Creator');
    });

    if (!$.isEmptyObject(tags)) {
        $.each(tags, function(key, tag){
            if ($('.bgUserTag a[userid="' + key + '"]')) {
                var url = tag[2];
                if (url.match(/\S/) && url.length > 1) $('.bgUserTag a[userid="' + key + '"]').attr({href: url}).text(tag[1]);
                else $('.bgUserTag a[userid="' + key + '"]').text(tag[1]);
            }
        });
    }
	
    $('body.forums .post .user_info_wrapper .user_info .bgUserTag > span').on('click', function(){
        if (!$(this).closest('.post').hasClass('bgut_loaded')) {
            var tagvalue = '', urlvalue = $(this).closest('.postcontent').find('.post-directlink a').attr('href');

            if ($(this).siblings('a').text().length > 0) {
                tagvalue = $(this).siblings('a').text();
                if ($(this).siblings('a').attr('href')) urlvalue = $(this).siblings('a').attr('href');
            }
			
            $(this).after('<div><h2>Tag ' +    $(this).closest('.user_info').find('.user_name').text() + '<a class="bgclose"></a></h2><form>\
                <label for="bgut_tagtag">Tag</label>\
                <input type="text" id="bgut_tagtag" maxlength="50" placeholder="Notes and comments" value="' + tagvalue + '">\
                <label for="bgut_idtag">User ID</label>\
                <input type="text" id="bgut_idtag" placeholder="Numerical" value="' + $(this).siblings('a').attr('userid') + '">\
                <label for="bgut_linktag">Link</label>\
                <input type="text" id="bgut_linktag" placeholder="URL" value="' + urlvalue + '">\
                <p>You can manage your tags in your BetterGaia Settings.</p>\
                <a class="bgut_save">Save</a>\
            </form></div>');

            $(this).closest('.post').addClass('bgut_loaded bgut_open');
        }
        else $(this).closest('.post').toggleClass('bgut_open');

        $(this).parent().find('#bgut_tagtag').focus();
    });

    $('body.forums .post .user_info_wrapper .user_info').on('click', '.bgUserTag a.bgclose', function(){
        $(this).closest('.post').removeClass('bgut_open');
    });
    
    $('body.forums .post .user_info_wrapper .user_info').on('click', '.bgUserTag a.bgut_save', function(){
        var letsSave = false,
        username = $(this).closest('.user_info').find('.user_name').text(),
        tag = $(this).siblings('#bgut_tagtag'),
        userid = $(this).siblings('#bgut_idtag'),
        url = $(this).siblings('#bgut_linktag');
	
        // Tags
        if (!tag.val().match(/\S/) || tag.val().length < 1) tag.prev('label').addClass('bgerror');
        else $(this).siblings('label[for="bgut_tagtag"].bgerror').removeClass('bgerror');

        // User ID
        if (userid.val().length < 1 || !userid.val().match(/\S/) || !$.isNumeric(userid.val())) userid.prev('label').addClass('bgerror');
        else $(this).siblings('label[for="bgut_idtag"].bgerror').removeClass('bgerror');

        // Check
        if ($(this).siblings('.bgerror').length === 0) letsSave = true;

        // Save
        if (letsSave) {
            prefs['usertags.list'][userid.val()] = [username, tag.val(), url.val(), Date.now()];

            // Save
            chrome.storage.sync.set({'usertags.list': prefs['usertags.list']}, function(){
                function saved() {
                    $('body.forums .post .user_info_wrapper .user_info .bgUserTag a[userid="' + userid.val() + '"]').attr({href: url.val()}).text(tag.val());
                    tag.closest('.post').removeClass('bgut_loaded bgut_open');
                    tag.closest('div').remove();
                }

                if (typeof(chrome.runtime.lastError) == 'object') {
                    console.warn('Error when setting tags: ' + chrome.runtime.lastError['message']);

                    // save to local
                    if (chrome.runtime.lastError['message'] == 'QUOTA_BYTES_PER_ITEM quota exceeded') {
                        chrome.storage.local.set({'usertags.list': prefs['usertags.list']}, function(){
                            console.log('tags saved locally.');
                            chrome.storage.sync.set({'usertags.list': {}});
                            saved();
                        });
                    }
                }
                else {
                    console.log('tags saved to sync.');
                    chrome.storage.local.remove('usertags.list');
                    saved();
                }
            });
        }
    });
}

// Moves timestamp
$('body.forums .post .message .messagecontent > .post-options > ul > li.post-meta').each(function () { 
    $(this).appendTo($(this).closest('.postcontent').find('.user_info_wrapper .user_info'));
});

} // ---

// Check Storage and Fire
if (prefs['appliedUserPrefs'] === true && prefs['appliedForumJs'] === false) {
	ForumJs();
	prefs['appliedForumJs'] = true;
}

// Ajax page load
if ($('#topic_header_container #thread_header').length == 1) {
    var observer = new window.MutationObserver(function(mutations) {ForumJs();});
    observer.observe(document.getElementById('content-padding'), {attributes: false, childList: true, characterData: false});
}