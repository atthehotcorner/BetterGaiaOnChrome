/*
Forum JS 
Copyright (c) BetterGaia and Bowafishtech
Unauthorized copying, sharing, adaptation, publishing, commercial usage, and/or distribution, its derivatives and/or successors, via any medium, is strictly prohibited.
*/

function ForumJs() {

// Add thread preview
if (prefs['forum.previewThreads'] == true) {
	$("body.forums #gaia_content table.forum-list tr td.title .one-line-title .topic-icon").after('<a class="bgThreadPreview" title="View the first post of this thread">[+]</a>');
	$("body.forums #gaia_content table.forum-list tr td.title .one-line-title a.bgThreadPreview").on("click", function(){
		if ($(this).closest('tr.rowon, tr.rowoff').next('tr.bgThreadPreviewBox').length == 0) {
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
    
// Enable redirects on same page
if (prefs['forum.externalLinks'] == true) {
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
					$(".bgredirect").html($('<div>' + data + '</div>').html());
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
if (prefs['usertags'] == true) {
	$("body.forums .post .user_info_wrapper .user_info .user_name").each(function() {
		// Get userid
		var userid = '', avibox = $(this).closest('.postcontent').find('.avatar_wrapper .avi_box');
		if (avibox.find('a.avatar').length == 0) userid = avibox.find('#animated_item > object').attr('onmousedown').replace("window.location='", '').split("/")[5];
		else userid = avibox.find('a.avatar').attr("href").split("/")[5];
	
		$(this).after('<div class="bgUserTag"><a target="_blank" title="Tag" userid="' + userid + '"></a><span title="Tag this user"></span></div>');
	});
	
	// Add stored tags
	var tags = prefs['usertags.list'];
	// special [color=#FEFEF0][size=1].[/size][/color]
	$('.bgUserTag a[userid="8152358"]').each(function() {
		if ($(this).closest('.postcontent').find('.message .post-bubble span[style="color: #FEFEF0"] span[style="font-size: 1px"]').length != 1)
			$(this).attr({href: '/forum/t.45053993/'}).text('BetterGaia Creator');
	});

	if (tags[0] != '') {
		for (var i=0; i < tags.length && tags.length > 0; i++) {
			var tag = JSON.parse(tags[i]);
			if ($('.bgUserTag a[userid="' + tag.userid + '"]')) {
				var url = unescape(tag.url);
				if (url.match(/\S/) && url.length > 1) $('.bgUserTag a[userid="' + tag.userid + '"]').attr({href: url}).text(unescape(tag.tag));
				else $('.bgUserTag a[userid="' + tag.userid + '"]').text(unescape(tag.tag));
			}
		}
	}
	
	$('body.forums .post .user_info_wrapper .user_info .bgUserTag > span').on('click', function(){
		if (!$(this).closest('.post').hasClass('bgut_loaded')) {
			var tagvalue = '', urlvalue = $(this).closest('.postcontent').find('.post-directlink a').attr('href');
			if ($(this).siblings('a').text().length > 0) {
				tagvalue = $(this).siblings('a').text();
				if ($(this).siblings('a').attr('href')) urlvalue = $(this).siblings('a').attr('href');
			}
			
			$(this).after('<div><h2>Tag ' +  $(this).closest('.user_info').find('.user_name').text() + '<a class="bgclose"></a></h2><form>\
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
		if ($(this).siblings('.bgerror').length == 0) letsSave = true;
	
		// Save
		if (letsSave) {
			var data = {username: escape($(this).closest('.user_info').find('.user_name').text()), userid: userid.val(), tag: escape(tag.val()), url: escape(url.val()), createdon: Date.now()};
	
			var port = chrome.runtime.connect({name: 'bettergaia'});
			port.postMessage({request: 'usertag', tag: data});
			port.onMessage.addListener(function(msg) {
				if (msg.result == 'success') {
					$('body.forums .post .user_info_wrapper .user_info .bgUserTag a[userid="' +  data.userid + '"]').attr({href: unescape(data.url)}).text(unescape(data.tag));
					tag.closest('.post').removeClass('bgut_loaded bgut_open');
					tag.closest('div').remove();
				}
				else alert('Sorry about that, there was a problem saving your tag.');
			});
		}
	});
} // End Tags

// Moves timestamp
$("body.forums .post .message .messagecontent > .post-options > ul > li.post-meta").each(function () { 
	$(this).appendTo($(this).closest('.postcontent').find(".user_info_wrapper .user_info"));
});

} // ---

// Check Storage and Fire
if (prefs['appliedUserPrefs'] == true && prefs['appliedForumJs'] == false) {
	ForumJs();
	prefs['appliedForumJs'] = true;
}

// Ajax page load
if ($('#topic_header_container #thread_header').length == 1) {
    var observer = new window.MutationObserver(function(mutations) {ForumJs();});
    observer.observe(document.getElementById('content-padding'), {attributes: false, childList: true, characterData: false});
}