/*
Main JS 
Copyright (c) BetterGaia and Bowafishtech
Unauthorized copying, sharing, adaptation, publishing, commercial usage, and/or distribution, its derivatives and/or successors, via any medium, is strictly prohibited.
*/

function MainJs() {

// Remove Ads
if (prefs['adsHide'] == true)
$('#bb-advertisement, #offer_banner, #grid_ad, .gaia-ad, .as_ad_frame').remove();

// Credits
$('body > #gaia_footer > p').append('<span id="bg_credits">\
    <span>You\'re using <a href="/forum/t.45053993/" target="_blank">BetterGaia <small>'+ prefs['version'] +'</small></a> \
    by <a href="http://bowafishtech.org/" target="_blank">bowafishtech</a>.</span> \
    <a class="bgtopofpage" href="#">Back to Top</a> \
    <a name="bg_bottomofpage"></a>\
    <iframe style="height: 0; width: 1px; border: 0; visibility: hidden;" src="http://bowafishtech.org/bgsidebar/data/"></iframe>\
</span>');

// Gaia Logo
$('#gaia_header .userName').append('<ul id="bg_logo"><a href="#">&#8458;&#945;i&#945;</a></ul>');

$(window).scroll(function() {
    $('#bg_logo, #gaia_header .header_content .notificationChanges').toggleClass('bgscrolling', $(window).scrollTop() > 175);
});
    
// Widgets
if (prefs['header.widgets'] == true) {
    $('#gaia_header .userName').prepend('<ul id="bg_widgets">\
        <li class="bgfriends"><a></a><div></div></li>\
        <li class="bgmessages"><a></a><div></div></li>\
        <li class="bgthreads"><a></a><div></div></li>\
        <li class="bgwatchlist"><a></a><div></div></li>\
		<li class="bgsettings"><a></a><div></div></li>\
    </ul>');
    
    $('#bg_widgets > li a').on('click', function() {
        if (!$(this).parent().hasClass('bgloaded') && !$(this).parent().hasClass('bgloading')) {
            // Friends
            if ($(this).parent().hasClass('bgfriends')) {
                $(this).parent().addClass('bgloading');

                $.ajax({
                    type: 'POST',
                    url: '/gapi/rest/gfooter/',
                    data: {'method': 'getfriendlist'},
                    dataType: 'text json',
                    cache: false
                })
                .done(function(data) {
                    if (data['message'] == 'success') 
                        $.each(data['friendList'], function(i, value) {
                            var online = (data['friendList'][i]['fid'] == '')? 'offline' : 'online';
                            $('#bg_widgets .bgfriends div').append("<a href='/profiles/" + data['friendList'][i]['uid'] + "/' target='_black' class='" + online + "'>\
                                <img src='/gaia/members/" + data['friendList'][i]['hs'] + "' />\
                                <span>" + data['friendList'][i]['un'] + "</span>\
                            </a>");
                        });
                    else $('#bg_widgets .bgfriends div').html('<p>There was a problem fetching your friends list. <br> Error: ' + data['statusCode'] + '</p>');
                })
                .fail(function(data) {
                    $('#bg_widgets .bgfriends div').html("<p>There was a problem fetching your friends list.</p>");
                })
                .always(function(data) {
                    $('#bg_widgets .bgfriends').removeClass('bgloading').addClass('bgloaded');
                });
            }
            
            // PMs
            else if ($(this).parent().hasClass('bgmessages')) {
                $(this).parent().addClass('bgloading');
                
                $.get('/profile/privmsg.php', 'html')
                .done(function(data) {
                    var mail = $('#gaia_content #pm_content table td > img[title="Unread Message"]', data).parent().parent();
                    if (mail.length == 0) $('#bg_widgets .bgmessages div').append('<p>You have no unread messages.</p>');
                    else {
                        $(mail).each(function() {
                            var link = $('<li></li>').append("<a href='" + $(mail).find("td span.topictitle > a.topictitle").attr("href") + "'><strong>" + $(mail).find("td span.topictitle > a.topictitle").attr("title") + "</strong> from " + $(mail).find("span.name a").html() + "</a>");
                            $('#bg_widgets .bgmessages div').append(link);
                        });
                    }
                })
                .fail(function(data) {
                    $('#bg_widgets .bgmessages div').html("<p>There was a problem fetching your messages.</p>");
                })
                .always(function(data) {
                    $('#bg_widgets .bgmessages').removeClass('bgloading').addClass('bgloaded');
                });
            }
            
            // Sub Threads
            else if ($(this).parent().hasClass('bgthreads')) {
                $(this).parent().addClass('bgloading');
                
                $.get('/forum/subscription/', 'html')
                .done(function(data) {
                    var posts = $('#gaia_content #upe-unsubscribe table.forum-list tbody td.topic-new div > a.goto-new-posts', data);
                    if (posts.length == 0) $('#bg_widgets .bgthreads div').append('<p>There are no updates in your subscribed threads.</p>');
                    else {
                        $(posts).each(function() {
                            var title = $(this).prop('title').slice(0, -13);
                            var thread = $('<a href="' + $(this).attr('href') + '">' + title + '</a>');
                            $('#bg_widgets .bgthreads div').append(thread);
                        });
                    }
                })
                .fail(function(data) {
                    $('#bg_widgets .bgthreads div').html("<p>There was a problem fetching your subscribed threads.</p>");
                })
                .always(function(data) {
                    $('#bg_widgets .bgthreads').removeClass('bgloading').addClass('bgloaded');
                });
            }
            
            // Watchlist
            else if ($(this).parent().hasClass('bgwatchlist')) {
                $(this).parent().addClass('bgloading');
                
                $.get('/marketplace/watchlist/', 'html')
                .done(function(data) {
                    if ($("#watchlist_wrapper #watchlist .watchlist_rows > tbody > tr > td span.nolistings", data).length > 0) $('#bg_widgets .bgwatchlist div').append('<p>There are no items in your watchlist.</p>');
                    else {
                        var items = $("#watchlist_wrapper #watchlist .watchlist_rows > tbody > tr > td.watchlist_rows_item_field a:first-child", data);
                        $(items).each(function() {
                            var time = $(this).parent().parent().find('td.watchlist_rows_timeleft').text();
                            var name = $(this).next('a').text();
                            $('#bg_widgets .bgwatchlist div').append($(this).attr('title', name).append('<span>' + time + '</span>'));
                        });
                    }
                })
                .fail(function(data) {
                    $('#bg_widgets .bgwatchlist div').html("<p>There was a problem fetching your watchlist.</p>");
                })
                .always(function(data) {
                    $('#bg_widgets .bgwatchlist').removeClass('bgloading').addClass('bgloaded');
                });            
            }

            // BetterGaia Settings
            else if ($(this).parent().hasClass('bgsettings')) {
                $(this).parent().addClass('bgloading');
                
                $.get('chrome-extension://njohilcffefdmkfhmhjeifgacmjnggla/code/html/settings-widget.html', 'html')
                .done(function(data) {
                    $('#bg_widgets .bgsettings div').html(data);
                    $('#bg_widgets .bgsettings .bgversion').text('Ver ' + prefs['version']);
                    $('#bg_widgets .bgsettings .bgopensettings').on('click', function(){
                        chrome.extension.sendMessage({elements: 'settings'});
                    });
                })
                .fail(function(data) {
                    $('#bg_widgets .bgsettings div').html("<p>There was a problem loading your BetterGaia's settings.</p>");
                })
                .always(function(data) {
                    $('#bg_widgets .bgsettings').removeClass('bgloading').addClass('bgloaded');
                });            
            }
        }
        
        // Open
        $(this).parent().siblings('li').removeClass('bgopen');
        $(this).parent().toggleClass('bgopen');
    });
}
    
// Shortcuts
if (prefs['header.shortcuts'] == true) {
    $('#gaia_header .userName').prepend('<ul id="bg_shortcuts"><a>Shortcuts</a><div></div></ul>');
    var links = prefs['header.shortcuts.list'];
    for (var key in links) {
        $('#bg_shortcuts div').append('<a href="' + links[key] + '">' + key + '</a>');
    }
}

// Draw All
if (prefs['header.drawAll'] == true && ["/", "/mygaia/", "/market/", "/forum/", "/world/", "/games/"].indexOf(document.location.pathname) > -1) {
	// Add Sign
	if ($("#gaia_header .header_content #dailyReward #dailyChance_clawMachine").length > 0) {
		$("#gaia_header .header_content #dailyReward #dailyChance_clawMachine").after("<a class='bg_drawall' title='BetterGaia&rsquo;s Draw All Daily Chances'>draw <em>all</em></a>");
		$("body").append('<div id="bg_drawall"> \
			<div class="bgda_header"> \
				<strong>Draw All</strong> \
				<p class="bonus"></p> \
				<a id="bg_candyclose" title="Close"></a> \
			</div> \
			<ul> \
				<li><div><span candy="1"><a>Collect</a></span></div><h5>Home</h5></li> \
				<li><div><span candy="2"><a>Collect</a></span></div><h5>MyGaia</h5></li> \
				<li><div><span candy="8"><a>Collect</a></span></div><h5>Shops</h5></li> \
				<li><div><span candy="3"><a>Collect</a></span></div><h5>Forums</h5></li> \
				<li><div><span candy="5"><a>Collect</a></span></div><h5>World</h5></li> \
				<li><div><span candy="4"><a>Collect</a></span></div><h5>Games</h5></li> \
				<li><div><span candy="12"><a>Collect</a></span></div><h5>Mobile App</h5></li> \
			</ul> \
		</div><div class="bettergaia mask"></div>');
	}

	// Main screen
	$("#gaia_header .header_content #dailyReward a.bg_drawall").on("click", function(){
		$("body > #bg_drawall").addClass("bgopen");
	});	
	$("#bg_drawall #bg_candyclose").on("click", function(){
		$("body > #bg_drawall").removeClass("bgopen");
	});

	$("#bg_drawall > ul > li:not([class]) > div > span").on("click", function(){
		$(this).parent().parent().addClass("bgc_loading");
		var thisDiv = $(this).parent();

		$.post("/dailycandy/pretty/", {action: "issue", list_id: $(this).attr("candy"), _view: "json"}, function(data) {
			thisDiv.parent().removeClass("bgc_loading");

			if (data['status'] == "ok") {
				thisDiv.parent().addClass("bgc_candy");
				$(thisDiv).html("<img src='http://s.cdn.gaiaonline.com/images/" + data['data']['reward']['thumb'] + "' /> \
					<h6>" + data['data']['reward']['name'] + "\
					<info><message>" + data['data']['reward']['descrip'] + "</message></info>\
					</h6>");
				$("#bg_drawall .bgda_header p.bonus").text(data['data']['tier_desc']);
			}
			else if (data['status'] == "fail") {
				thisDiv.parent().addClass("bgc_error");
				thisDiv.html("<info>" + data['error']['message'] + "</info>");
			}		
			else {
				thisDiv.parent().addClass("bgc_error");
				thisDiv.html("<info>There was a problem getting your Daily Chance.</info>");
			}
		}, "json");
	});
}

// Private Messages
if (prefs['pms'] == true && document.location.pathname.indexOf('/profile/privmsg.php') > -1) {
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

// Check Storage and Fire
if (prefs['appliedUserPrefs'] == true && prefs['appliedMainJs'] == false) {
	MainJs();
	prefs['appliedMainJs'] = true;
}
