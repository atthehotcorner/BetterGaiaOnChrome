/*
Forum JS 
Copyright (c) BetterGaia and Bowafishtech
Unauthorized copying, sharing, adaptation, publishing, commercial usage, and/or distribution, its derivatives and/or successors, via any medium, is strictly prohibited.
*/

function ForumJs() {

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

} // ---

// Check Storage and Fire
if (prefs['appliedUserPrefs'] == true && prefs['appliedForumJS'] == false) {
	ForumJs();
	prefs['appliedForumJS'] = true;
}