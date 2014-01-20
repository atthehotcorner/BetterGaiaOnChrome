/*
Main JS 
Copyright (c) BetterGaia and Bowafishtech
Unauthorized copying, sharing, adaptation, publishing, commercial usage, and/or distribution, its derivatives and/or successors, via any medium, is strictly prohibited.
*/

function MainJS() {

// Gaia Logo
$('#gaia_header .userName').append('<ul id="bg_logo"><a>gaia</a></ul>');

// Widgets
if (prefs['header.widgets'] == true) {
$('#gaia_header .userName').prepend('<ul id="bg_widgets">\
    <li class="bgfriends"><a></a><div></div></li>\
    <li class="bgmessages"><a></a><div></div></li>\
    <li class="bgthreads"><a></a><div></div></li>\
    <li class="bgwatchlist"><a></a><div></div></li>\
</ul>');

$('#bg_widgets > li a').on('click', function() {
    //if ($(this).hasClass('bgloaded')) {
        $(this).parent().siblings('li').removeClass('bgopen');
        $(this).parent().toggleClass('bgopen');
    /*}
    else {
        if ($(this).hasClass('bgfriends')) {}
        else if ($(this).hasClass('bgmessages')) {}
        else if ($(this).hasClass('bgthreads')) {}
        else if ($(this).hasClass('bgwatchlist')) {}
    }*/
});
}
    
// Shortcuts
if (prefs['shortcuts'] == true) {
$('#gaia_header .userName').prepend('<ul id="bg_shortcuts"><a>Shortcuts</a><div></div></ul>');
}

// Private Messages
if (/*pref['main.features.messages'] == true && */document.location.pathname.indexOf('/profile/privmsg.php') > -1) {
	// Private message selectors
	$('body.mail #pm_content table tr[height="20"] td[align]').after("<div class='bg_selecttypes'><span><a class='all'>All</a><a class='read'>Read</a><a  class='unread'>Unread</a><a class='replied'>Replied</a><a class='none'>None</a></span></div>");	
	$('body.mail #pm_content table tr[bgcolor][height="42"] > td:nth-of-type(2) img').each(function(index, element) {
		$(this).closest('tr[bgcolor][height="42"]').attr('status', $(this).attr('title'));
  });

	$('body.mail #pm_content .bg_selecttypes a').on('click', function() {
		if ($(this).hasClass('all')) $('tr[bgcolor][height="42"]:not(.bgpm_hide) input[type="checkbox"]').prop('checked', true);
		if ($(this).hasClass('read')) $('tr[bgcolor][height="42"][status="Read Message"]:not(.bgpm_hide) input[type="checkbox"]').prop('checked', true);
		if ($(this).hasClass('unread')) $('tr[bgcolor][height="42"][status="Unread Message"]:not(.bgpm_hide) input[type="checkbox"]').prop('checked', true);
		if ($(this).hasClass('replied')) $('tr[bgcolor][height="42"][status="Replied Message"]:not(.bgpm_hide) input[type="checkbox"]').prop('checked', true);
		if ($(this).hasClass('none')) $('tr[bgcolor][height="42"]:not(.bgpm_hide) input[type="checkbox"]').prop('checked', false);
	});

	// Add Avatar Image
	var userids = [];
	$('tr[bgcolor][height="42"] span.name a[href]').each(function(index, element) {
		var userid = $(this).attr("href").split("/")[5];
		$(this).closest('tr[bgcolor][height="42"]').attr("userid", userid);

		if (userids.indexOf(userid) == -1) {
			userids.push(userid);
			$.get("/profiles?mode=lookup&avatar_username=" + $(this).closest('tr[bgcolor][height="42"]').find('span.name').text(), function(data){
				var i = document.createElement('img');
				$(i).load(function(){
       		$('tr[bgcolor][height="42"][userid="'+userid+'"] span.topictitle a').css({'background-image': 'url(/dress-up/avatar/' + $(data).find('response').attr('avatarPath') + ')', 'background-position': 'right -35px'});
				});
				i.src = 'http://www.gaiaonline.com/dress-up/avatar/' + $(data).find('response').attr('avatarPath');
			});
		}
	});

	// Instant Search
	$('body.mail #pm_content table tr[height="20"]').append('<input type="text" class="bgpm_search" placeholder="Search" value="" />');
	$.extend($.expr[":"], {"Contains": function(elem, i, match, array) {return (elem.textContent || elem.innerText || "").toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;}});
	$('body.mail #pm_content table tr[height="20"] .bgpm_search').keyup(function() {
		var value = $(this).val();
		if (value.length > 0) {
			$('body.mail #pm_content table tr[bgcolor][height="42"]:not(:Contains("' + value + '"))').addClass('bgpm_hide').find('input[type="checkbox"]').prop('checked', false);
			$('body.mail #pm_content table tr[bgcolor][height="42"]:Contains("' + value + '")').removeClass('bgpm_hide');
		}
		else $('body.mail #pm_content table tr[bgcolor][height="42"]').removeClass('bgpm_hide');
	});
}

} // ---

// Get Storage
if (prefs['appliedUserPrefs'] == false)
chrome.storage.sync.get(null, function(response) {
    for (var key in response) {prefs[key] = response[key];}
    MainJS();
});
else MainJS();