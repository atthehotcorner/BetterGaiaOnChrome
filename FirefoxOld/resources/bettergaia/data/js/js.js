// Main JS (c) BetterGaia and bowafishtech
self.port.on("sstorage", function(response) {
// start historic bettergaia js file code

// Adds text to headers in MyGaia
jQuery("body.mygaia #gaia_content.grid_ray_davies #bd #yui-main .yui-g > .clear").append('<div id="bgSidebar"><div id="bgSidebarHeader">BetterGaia <span>'+ response["version"] +'</span></div><div id="bgSidebarContent" style="color:#fff"><h1>Thank you for trying out this BetterGaia Preview version.</h1><h3>A few features are disabled as they are reimplemented.</h3><a href="http://bowafishtech.org/" id="bgLink">bowafishtech.</a></div></div>');

// Adds BetterGaia Footer
jQuery("body > #gaia_footer .accessAid").html('\
<div class="bg_links">\
<span>You\'re using BetterGaia <small>'+ response["version"] +'</small> by bowafishtech.</span> \
<ul>\
    <a href="/forum/t.45053993/" target="_blank"> Official Thread</a>. \
	<a href="http://facebook.com/BetterGaia/" target="_blank">Our Facebook</a>. \
	<a href="http://bowafishtech.org/" target="_blank">bowafishtech</a>. \
</ul>\
</div>\
<a class="bg_topofpage" href="#">Back to Top</a> \
<a name="bg_bottomofpage"></a>');

// Creates Emoticons div slide
jQuery("body > #editor #format_controls .format-text").append("<li><a class='bg_addemoji' onclick='var el = document.getElementById(\"emoticons\"); el.style.display = (el.style.display != \"block\" ? \"block\" : \"\" ); var el2 = document.getElementById(\"emote_select\"); el2.style.display = (el2.style.display != \"block\" ? \"block\" : \"\" );' title='Add Emoticons'>Add Emoticons</a></li>");

// Add spoiler button to formatter
jQuery("body > #editor #format_controls .format-elements").append("<li><a class='bg_spoiler' onclick='function wrapText(elementID, openTag, closeTag) {var textarea = document.getElementById(elementID); var len = textarea.value.length; var start = textarea.selectionStart; var end = textarea.selectionEnd; var selectedText = textarea.value.substring(start, end); var replacement = openTag + selectedText + closeTag; textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end, len);} wrapText(\"message\", \"[spoiler]\", \"[/spoiler]\");' title='Add Spoiler - [spoiler][/spoiler]'>Add Spoiler Tag</a></li>");
// End historic code

	// BetterGaia Messages
	if (JSON.parse(response["main.features.messages"]) == true) {
		jQuery("#gaia_content #pm_content table[style='clear:left;']").before("<div id='bg_messages'><ul class='bgpm_list'></ul></div>");
		
		jQuery("#gaia_content #pm_content table[style='clear:left;'] table table > tbody > tr[height='42']").each(function(){
			var li = document.createElement("li");
		
			// Add message status to class
			jQuery(li).addClass(jQuery(this).find("td:nth-of-type(2) img").attr("title"));
		
			// Checkbox
			var checkbox = jQuery(this).find("input[type='checkbox']").wrap("<span class='checkbox'></span>").parent();
			jQuery(li).append(checkbox);
		
			// Icon
			var icon = jQuery(this).find("td:nth-of-type(2) img").wrap("<span class='icon'></span>").parent();
			jQuery(li).append(icon);
				
			// Author
			var from = jQuery(this).find("span.name").html();
			jQuery(li).append("<span class='author'>" + from + "</span>");
				
			// Subject
			var topictitle = jQuery(this).find("span.topictitle a.topictitle").wrapInner("<span></span>");
			jQuery(li).append(topictitle);
				
			// Timestamp
			var timestamp = jQuery(this).find("span.postdetails").html();
			jQuery(li).append("<span class='postdetails'>" + timestamp.replace("<br>", ", ") + "</span>");
				
			jQuery("#gaia_content #pm_content #bg_messages .bgpm_list").append(li);
			// .match(/\/[0-9]*\/$/)
		});
		
		// Private message selectors
		jQuery("#gaia_content #pm_content #bg_messages .bgpm_list").prepend("<div class='bg_selecttypes'><span><a class='all'>All</a><a class='read'>Read</a><a  class='unread'>Unread</a><a class='replied'>Replied</a><a class='none'>None</a></span></div>");
		
		jQuery("body.mail #gaia_content #pm_content #bg_messages .bgpm_list .bg_selecttypes a.all").click(function() {
			jQuery("body.mail #bg_messages .bgpm_list li:visible span.checkbox input").attr("checked", true);
		});
		
		jQuery("body.mail #gaia_content #pm_content #bg_messages .bgpm_list .bg_selecttypes a.read").click(function() {
			jQuery("body.mail #bg_messages .bgpm_list li:visible[class='Read Message'] span.checkbox input").attr("checked", true);
		});
			
		jQuery("body.mail #gaia_content #pm_content #bg_messages .bgpm_list .bg_selecttypes a.unread").click(function() {
			jQuery("body.mail #bg_messages .bgpm_list li:visible[class='Unread Message'] span.checkbox input, body.mail #bg_messages .bgpm_list li:visible[class='New Message'] span.checkbox input").attr("checked", true);
		});
			
		jQuery("body.mail #gaia_content #pm_content #bg_messages .bgpm_list .bg_selecttypes a.replied").click(function() {
			jQuery("body.mail #bg_messages .bgpm_list li:visible[class='Replied Message'] span.checkbox input").attr("checked", true);
		});
			
		jQuery("body.mail #gaia_content #pm_content #bg_messages .bgpm_list .bg_selecttypes a.none").click(function() {
			jQuery("body.mail #bg_messages .bgpm_list li:visible span.checkbox input").attr("checked", false);
		});
		
		// Instant Search
		jQuery("#gaia_content #pm_content #bg_messages .bgpm_list .bg_selecttypes").append("<form onsubmit='return false'><input type='text' class='bgpm_search' placeholder='Search messages on this page' value='' /></form>");
		
		jQuery.expr[':'].Contains = function(a, i, m) { 
			return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0; 
		};
			
		jQuery("#gaia_content #pm_content #bg_messages .bgpm_list .bg_selecttypes input.bgpm_search").keyup(function() {
			var txtVal = this.value;
		
			if (txtVal.length != 0) {
				jQuery("#gaia_content #pm_content #bg_messages .bgpm_list li:not(:Contains('" + txtVal + "'))").hide().find("span.checkbox input").attr("checked", false);
				jQuery("#gaia_content #pm_content #bg_messages .bgpm_list li:Contains('" + txtVal + "')").show();
			}
			else {
				jQuery("#gaia_content #pm_content #bg_messages .bgpm_list li").show();
			}
		}); 
	}// End BG Messages

	// Shortcuts
	if (JSON.parse(response["shortcuts.settings.disable"]) == false) {
		var shortcuts = response["shortcuts"].split("ITSurHRTnSOL");
		var links = "";

		jQuery.each(shortcuts, function(key, value) {
			value = JSON.parse(value);
			links += "<li><a href='" + unescape(value["URL"]) + "'>" + unescape(value["name"]) + "</a></li>";
		});
		jQuery("body #gaia_header .header_content .userName").append("<div id='bg_shortcuts'><a>Shortcuts</a><ul>" + links + "</ul></div>");
	}
});

// when we get our clean html...
self.port.on("receiveAvatarStats", function(data) {
  var stats = jQuery("#gaia_content.grid_ray_davies #bd #yui-main .yui-g > .mg_sprite.top_bg + .left + .right .mystats .bd", data).html();
  if (!stats) {jQuery("#bg_asInfo").html("There was a problem retrieving your stats.").removeClass("load");} 
  else {jQuery("#bg_asInfo").html(stats).removeClass("load");}
});