// Post Formatting JS (c) BetterGaia and bowafishtech.
self.port.on("sstorage", function(response) {

if (JSON.parse(response["posts.settings.disable.postFormatter"]) == false) {

if (jQuery("body #bg_postbuttons").length == 0) {
	var formats = response["posts.formatter.formats"].split("ITSurHRTnSOL");
	jQuery("textarea[name='message'], textarea[name='comment']").after("<div id='bg_postbuttons'></div>");

	// Add formatting bar
	var formattingbar = "";

	jQuery.each(formats, function(key, value) {
		value = JSON.parse(value);

		if (key == 0) {
			formattingbar += "<a code='" + value["format"] + "' poststyle='" + unescape(value["style"]) + "' class='current'>" + unescape(value["name"]) + "</a>";

			var post = jQuery("textarea[name='message'], textarea[name='comment']").val();
			// if quote
			if (post.substr(0,8) == '[quote="' && post.replace(/\n\s*/g,"").substr(-8) == '[/quote]') {
				if (JSON.parse(response["posts.settings.quotes.removeFormatting"]) == true) post = post.replace(/\[\/?(?:b|i|u|strike|code|url|color|size|align|img|imgleft|imgright|imgmap|youtube).*?\]/img, '');

				if (JSON.parse(response["posts.settings.quotes.endOfFormat"]) == true) jQuery("textarea[name='message'], textarea[name='comment']").val(unescape(value["format"]) + "\n\n\n" + post);
				else jQuery("textarea[name='message'], textarea[name='comment']").val(post += "\n\n\n" + unescape(value["format"]));

				jQuery('body select[name=basic_type]').val(unescape(value["style"]));
			}
			// If textbox blank
			else if (post.length == 0) {
				jQuery("textarea[name='message'], textarea[name='comment']").val(unescape(value["format"]));

				jQuery('body select[name=basic_type]').val(unescape(value["style"]));
			}
		} else {
			formattingbar += "<a code='" + value["format"] + "' poststyle='" + unescape(value["style"]) + "'>" + unescape(value["name"]) + "</a>";
		}
	});
	jQuery("#bg_postbuttons").append(formattingbar);

	// Set button functions
	jQuery("body #bg_postbuttons > a:not(.current)").on("click", function(){
		var format = unescape(jQuery(this).attr("code"));
		var post = jQuery(this).parent().parent().find("textarea").val();

		if (escape(post) === jQuery(this).parent().find("a.current").attr("code")) {
			jQuery(this).parent().parent().find("textarea").val(format);
		} else {
			jQuery(this).parent().parent().find("textarea").val(post + "\n\n\n" + format);
		}

		jQuery('body select[name=basic_type]').val(jQuery(this).attr("poststyle"));

		jQuery(this).parent().find("a").removeClass();
		jQuery(this).addClass("current");

		return false;
	});
};

}
});