// JS JS Copyright (c) BetterGaia
/*global chrome: false, console: false, Handlebars: false, prefs: false*/
/*jshint browser: true, jquery: true, multistr: true, sub: true*/

var BGjs = {
    init: function() {
        BGjs.main();

        if (document.location.pathname.indexOf('/forum/') > -1 || ['/news', '/news/'].indexOf(document.location.pathname) > -1) {
            BGjs.forum();

            // Ajax page load
            if ($('#topic_header_container #thread_header').length == 1) {
                var observer = new window.MutationObserver(function(mutations) {BGjs.forum();});
                observer.observe(document.getElementById('content-padding'), {attributes: false, childList: true, characterData: false});
            }
        }

        if ((prefs['format'] === true) && (
            (document.location.pathname.indexOf('/forum/compose/') > -1 && prefs['format.forums'] === true) ||
            (document.location.pathname.indexOf('/guilds/posting.php') > -1 && prefs['format.guildForums'] === true) || 
            (document.location.pathname.indexOf('/profile/privmsg.php') > -1 && prefs['format.pms'] === true) ||
            (document.location.pathname.indexOf('/profiles/') > -1 && document.location.search.indexOf('mode=addcomment') > -1 && prefs['format.profileComments'] === true))
        ) BGjs.format();
    }
};

BGjs.main = function() {
    // Credits
    $('body > #gaia_footer > p').append('<span id="bg_credits">\
        <span>You\'re using <a href="/forum/t.96293729/" target="_blank">BetterGaia <small>' + prefs['version'] + '</small></a> \
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
        BGjs.didScroll = false;

        $(window).scroll(function() {
            BGjs.didScroll = true;
        });

        setInterval(function() {
            if (BGjs.didScroll) {
                BGjs.didScroll = false;
                $('#gaia_header .header_content .notificationChanges').toggleClass('bgscrolling', $(window).scrollTop() > 175);
            }
        }, 500);
    }

    // Add BG Siderbar to MyGaia
    if (document.location.pathname.indexOf('/mygaia/') > -1 && prefs['mygaia.bgchat'] === true) {
        $('body.mygaia #gaia_content.grid_ray_davies #bd #yui-main .yui-g > .left').prepend('<div id="bg_sidebar" class="mg_content">\
            <div class="mg_sprite hd">BetterGaia <small class="bgversion">' + prefs['version'] + '</small>\
                <a class="bg_expand"></a>\
            </div>\
            <div class="bd">\
                <iframe sandbox="allow-scripts allow-forms allow-same-origin allow-popups" width="100%" frameborder="0" src="http://www.bettergaia.com/sidebar/"></iframe>\
            </div>\
        </div>');

        $('#bg_sidebar .bg_expand').on('click', function() {
            $('#gaia_content .left').toggleClass('bgexpanded');
        });
    }

    // Widgets
    $('#gaia_header #bg_userbar').prepend('<ul id="bg_widgets"><li class="bgsettings"><a></a><div></div></li></ul>');

    $('#bg_widgets > li.bgsettings > a').on('click.bgsettings', function() {
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
                    }).done(function(data) {
                        if (data['message'] == 'success') {
                            $.each(data['friendList'], function(i, value) {
                                var online = (data['friendList'][i]['fid'] === '')? 'offline' : 'online';
                                $('#bg_widgets .bgfriends div').append("<a href='/profiles/" + data['friendList'][i]['uid'] + "/' target='_black' class='" + online + "'>\
                                    <img src='/gaia/members/" + data['friendList'][i]['hs'] + "' />\
                                    <span>" + data['friendList'][i]['un'] + "</span>\
                                </a>");
                            });
                        }
                        else $('#bg_widgets .bgfriends div').html('<p>There was a problem fetching your friends list. <br> Error: ' + data['statusCode'] + '</p>');
                    }).fail(function(data) {
                        $('#bg_widgets .bgfriends div').html("<p>There was a problem fetching your friends list.</p>");
                    }).always(function(data) {
                        $('#bg_widgets .bgfriends').removeClass('bgloading').addClass('bgloaded');
                    });
                }

                // PMs
                else if ($(this).parent().hasClass('bgmessages')) {
                    $(this).parent().addClass('bgloading');

                    $.get('/profile/privmsg.php', 'html').done(function(data) {
                        var mail = $('#gaia_content #pm_content table td > img[title="Unread Message"]', data).parent().parent();
                        if (mail.length === 0) $('#bg_widgets .bgmessages div').append('<p>You have no unread messages.</p>');
                        else {
                            $(mail).each(function() {
                                var link = $('<li></li>').append("<a href='" + $(mail).find("td span.topictitle > a.topictitle").attr("href") + "'><strong>" + $(mail).find("td span.topictitle > a.topictitle").attr("title") + "</strong> from " + $(mail).find("span.name a").html() + "</a>");
                                $('#bg_widgets .bgmessages div').append(link);
                            });
                        }
                    }).fail(function(data) {
                        $('#bg_widgets .bgmessages div').html("<p>There was a problem fetching your messages.</p>");
                    }).always(function(data) {
                        $('#bg_widgets .bgmessages').removeClass('bgloading').addClass('bgloaded');
                    });
                }

                // Sub Threads
                else if ($(this).parent().hasClass('bgthreads')) {
                    $(this).parent().addClass('bgloading');

                    $.get('/forum/subscription/', 'html').done(function(data) {
                        var posts = $('#gaia_content #upe-unsubscribe table.forum-list tbody td.topic-new div > a.goto-new-posts', data);
                        if (posts.length === 0) $('#bg_widgets .bgthreads div').append('<p>There are no updates in your subscribed threads.</p>');
                        else {
                            $(posts).each(function() {
                                var title = $(this).prop('title').slice(0, -13);
                                var thread = $('<a href="' + $(this).attr('href') + '">' + title + '</a>');
                                $('#bg_widgets .bgthreads div').append(thread);
                            });
                        }
                    }).fail(function(data) {
                        $('#bg_widgets .bgthreads div').html("<p>There was a problem fetching your subscribed threads.</p>");
                    }).always(function(data) {
                        $('#bg_widgets .bgthreads').removeClass('bgloading').addClass('bgloaded');
                    });
                }

                // Watchlist
                else if ($(this).parent().hasClass('bgwatchlist')) {
                    $(this).parent().addClass('bgloading');

                    $.get('/marketplace/watchlist/', 'html').done(function(data) {
                        if ($("#watchlist_wrapper #watchlist .watchlist_rows > tbody > tr > td span.nolistings", data).length > 0) $('#bg_widgets .bgwatchlist div').append('<p>There are no items in your watchlist.</p>');
                        else {
                            var items = $("#watchlist_wrapper #watchlist .watchlist_rows > tbody > tr > td.watchlist_rows_item_field a:first-child", data);
                            $(items).each(function() {
                                var time = $(this).parent().parent().find('td.watchlist_rows_timeleft').text();
                                var name = $(this).next('a').text();
                                $('#bg_widgets .bgwatchlist div').append($(this).attr('title', name).append('<span>' + time + '</span>'));
                            });
                        }
                    }).fail(function(data) {
                        $('#bg_widgets .bgwatchlist div').html("<p>There was a problem fetching your watchlist.</p>");
                    }).always(function(data) {
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
        // Add emoji button
        $("body #editor #format_controls .format-text").append("<li><a class='bg_addemoji' onclick='var el = document.getElementById(\"emoticons\"); el.style.display = (el.style.display != \"block\" ? \"block\" : \"\" ); var el2 = document.getElementById(\"emote_select\"); el2.style.display = (el2.style.display != \"block\" ? \"block\" : \"\" );' title='Add Emoticons'>Add Emoticons</a></li>");

        // Add spoiler button
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
                var template = Handlebars.compile('<div id="bg_drawall" class="bg_model">\
                    <h1>Draw All <a class="close" title="Close"></a></h1>\
                    <ul class="bg_container">\
                        {{#each this}}\
                        <li>\
                            <span>{{name}}</span>\
                            <div><a data-candy="{{id}}">Collect</a></div>\
                        </li>\
                        {{/each}}\
                    </ul>\
                </div>\
                <div class="bg_mask"></div>');

                var candy = [{id: 1, name: 'Home'}, {id: 2, name: 'MyGaia'}, {id: 1279, name: 'Gaia Cash'}, {id: 8, name: 'Shops'}, {id: 1271, name: 'GoFusion'}, {id: 3, name: 'Forums'}, {id: 5, name: 'World'}, {id: 4, name: 'Games'}, {id: 12, name: 'Mobile App'}];
                $('body').append(template(candy));

                $('#bg_drawall h1 .close').on('click', function() {
                    $('#bg_drawall').removeClass('open');
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

            $('#bg_drawall').addClass('open');
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
                $('body').append('<div id="bg_anreader" class="bg_model">\
                    <h1>Announcement Reader <a class="close" title="Close"></a></h1>\
                    <div class="bg_container">\
                        <ul></ul>\
                        <div class="content">\
                            <span class="bg_spinner"></span>\
                        </div>\
                    </div>\
                </div>\
                <div class="bg_mask"></div>');

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
                    $('#bg_anreader').removeClass('open');
                    $('html').removeClass('bg_noscroll');
                });

                var apply = function() {
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

                            $('#bg_anreader .bg_container > ul').prepend(liTemplate(thread));
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

                            $('#bg_anreader .bg_container > ul').on('click', 'li', function() {
                                $('#bg_anreader .bg_container > ul li.active, #bg_anreader .content .page.active').removeClass('active');
                                $(this).removeClass('new').addClass('active');
                                $('#bg_anreader .content .page[data-announcement="' + $(this).attr('data-announcement') + '"]').addClass('active');
                            });

                            $('#bg_anreader .bg_container > ul li:first-child').click();
                        }
                    });
                };

                apply();
            }

            $('#bg_anreader').addClass('open');
            $('html').addClass('bg_noscroll');
            return false;
        });
    }
};

BGjs.forum = function() {
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
    <a class="bgpo_toggle bgpo_posts"><on>Hide</on><off>Show</off> Posts</a> <a class="bgpo_toggle bgpo_sigs"><on>Hide</on><off>Show</off>  Signatures</a></div>');

    // Adds Functions to Post Options
    if (typeof prefs['forum.hidePosts'] == 'boolean' && prefs['forum.hidePosts'] === true) {
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
            chrome.storage.local.remove('forum.hidePosts', function() {delete prefs['forum.hidePosts'];});
        }
        else {
            $("body.forums #content #content-padding #topic_header_container .detail-navlinks .thread_options .bg_postoptions .bgpo_posts").addClass("bgpo_on");
            $("body.forums #content #content-padding #topic_header_container .detail-navlinks .thread_options .bg_postoptions .bgpo_posts").parent().parent().find(".bgpo_sigs").addClass("bgpo_on");
            $("body.forums #post_container .post .post-signature").hide();
            $("body.forums #post_container .post").addClass("bgpc_hidden");

            // Enable persistance
            chrome.storage.local.set({'forum.hidePosts': true}, function() {prefs['forum.hidePosts'] = true;});
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

    // Adds Toggle Signature Button
    $("body.forums .post .post-signature").each(function () {
        $(this).parent().find(".message .messagecontent > .post-options > ul > li.post-meta").before('<li class="bg_togglesig"><a><span>Hide Signature</span></a></li>');
    });

    $('body.forums .post .message .messagecontent .bg_togglesig').click(function() {
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
                BGjs.format();
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

                $.ajax({
                    type: 'GET',
                    url: thisurl,
                    dataType: 'html'
                }).done(function(data) {
                    var pageHtml = $('<div>').html(data);

                    if (pageHtml.find('.warn_block').length === 1) {
                        $('.bgredirect').html(pageHtml.find('.warn_block')[0].outerHTML);
                        $('.bgredirect table.warn_block #warn_block #warn_head').append('<a class="bgclose" title="close"></a>');
                        $('.bgredirect a').attr('target', '_blank');
                        $('.bgredirect a.link_display, .bgredirect a.bgclose').on('click', function(){
                            $('.bgredirect').remove();
                        });
                    }
                    else {
                        $('.bgredirect').remove();
                        window.open(thisurl);
                    }
                }).fail(function() {
                    $('.bgredirect').remove();
                    window.open(thisurl);
                });

                return false;
            }
        });
    }

    // Add User Tagging
    if (prefs['usertags'] === true) {
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
                $(this).attr({href: '/forum/t.96293729/'}).text('BetterGaia Creator');
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
                chrome.storage.local.set({'usertags.list': prefs['usertags.list']}, function(){
                    $('body.forums .post .user_info_wrapper .user_info .bgUserTag a[userid="' + userid.val() + '"]').attr({href: url.val()}).text(tag.val());
                    tag.closest('.post').removeClass('bgut_loaded bgut_open');
                    tag.closest('div').remove();
                });
            }
        });
    }

    // Moves timestamp
    $('body.forums .post .message .messagecontent > .post-options > ul > li.post-meta').each(function () {
        $(this).appendTo($(this).closest('.postcontent').find('.user_info_wrapper .user_info'));
    });
};

BGjs.format = function() {
    // Only run if enabled
    if (prefs['format'] !== true) return;
    if (!((document.location.pathname.indexOf('/forum/') > -1 && prefs['format.forums'] === true) ||
    (document.location.pathname.indexOf('/guilds/posting.php') > -1 && prefs['format.guildForums'] === true) || 
    (document.location.pathname.indexOf('/profile/privmsg.php') > -1 && prefs['format.pms'] === true) ||
    (document.location.search.indexOf('mode=addcomment') > -1 && prefs['format.profileComments'] === true))) return;

    // for adding new lines
    function repeat(s, n) {var a = []; while(a.length < n) {a.push(s);} return a.join('');}

    // Run formatter
    $('textarea[name="message"]:not([identity]), textarea[name="comment"]:not([identity])').each(function() {
        var identity = Date.now();
        var post = $(this);

        // Makes sure this code runs on fresh textboxes
        $(this).add("select[name=basic_type]:not([identity])").attr("identity", identity);

        // Adds formatting bar
        var formattingbar = '';
        
        // check if recent is set
        var defaultFormatSet = false;
        if (prefs['format.list.recent'] != 'default' && prefs['format.list.useRecent'] === true) {
            for (var i=0; i < prefs['format.list'].length; i++) {
                if (prefs['format.list'][i][0] == prefs['format.list.recent']) {
                    defaultFormatSet = true;
                    break;
                }
            }
        }

        $.each(prefs['format.list'], function(index, format) {
            if ((index === 0 && !defaultFormatSet) ||
                (defaultFormatSet && (format[0] == prefs['format.list.recent']))) {
                formattingbar += '<a code="' + format[1] + '" poststyle="' + format[2] + '" class="current">' + format[0] + '</a>';

                // if quote
                if (post.val().substr(0,8) == '[quote="' && post.val().replace(/\n\s*/g,'').substr(-8) == '[/quote]') {
                    if (prefs['format.quote.removeFormatting'] === true) post.val(post.val().replace(/\[\/?(?:b|i|u|strike|code|url|color|size|align|img|imgleft|imgright|imgmap|youtube|spoiler).*?\]/img, ''));
    
                    if (prefs['format.quote.spoilerWrap'] === true) {
                        var newPost = post.val().slice(0,-8);
                        newPost += '[/spoiler][/quote]';
                        newPost = newPost.replace(/\[quote=(.+?)\]/, '[quote=$1][spoiler]');
                        post.val(newPost);
                    }
    
                    if (prefs['format.quote.endOfFormat'] === true) post.val(decodeURI(format[1]) + '\n' + repeat('\n', parseInt(prefs['format.quote.rangeNumber'], 10)) + post.val());
                    else post.val(post.val() + '\n' + repeat('\n', parseInt(prefs['format.quote.rangeNumber'], 10)) + decodeURI(format[1]));
                }
    
                // If blank
                else if (post.val().length === 0) post.val(decodeURI(format[1]));
                
                // In the end
                $('select[name=basic_type][identity="' + identity + '"]').val(format[2]);
            }

            // Not first
            else formattingbar += '<a code="' + format[1] + '" poststyle="' + format[2] + '">' + format[0] + '</a>';
        });

        $(this).after('<div id="bg_formatter" identity="' + identity + '">' + formattingbar + '</div>');
    });

    // Set button functions
    $('#bg_formatter > a').on('click', function(){
        if (!$(this).hasClass('current')) {
            var format = decodeURI($(this).attr('code')),
            identity = $(this).parent().attr('identity'),
            post = $('textarea[identity="' + identity + '"]');

            if (encodeURI(post.val()) == $(this).siblings('a.current').attr('code')) post.val(format);
            else {
                // Textbox has quote
                if (encodeURI(post.val()).indexOf($(this).siblings('a.current').attr('code')) != -1) {
                    var content = encodeURI(post.val()).replace($(this).siblings('a.current').attr('code'), '');
                    content = content.replace('%0A' + repeat('%0A', parseInt(prefs['format.quote.rangeNumber'], 10)), '');
                    post.val(decodeURI(content));
                }

                if (prefs['format.quote.endOfFormat'] === true) post.val(format + '\n' + repeat('\n', parseInt(prefs['format.quote.rangeNumber'], 10)) + post.val());
                else post.val(post.val() + '\n' + repeat('\n', parseInt(prefs['format.quote.rangeNumber'], 10)) + format);
            }

            $('select[name=basic_type][identity="' + identity + '"]').val($(this).attr('poststyle'));
            $(this).siblings('a.current').removeClass('current');
            $(this).addClass('current');

            // set as last used
            if ($(this).index() !== 0) {
                chrome.storage.local.set({'format.list.recent': $(this).text()});
                prefs['format.list.recent'] = $(this).text();
            }
            else {
                chrome.storage.local.remove('format.list.recent');
                prefs['format.list.recent'] = 'default';
            }
        }

        return false;
    });
};

// Check Storage and Fire
if (prefs['appliedPrefs'] !== true) {
    // Save a default
    prefs.default = JSON.parse(JSON.stringify(prefs));

    // Get settings
    chrome.storage.local.get(null, function(response) {
        for (var key in response) {
            try {prefs[key] = response[key];}
            catch(e) {console.warn('BetterGaia: unused preference, \'' + e + '\'.');}
        }

        prefs['appliedPrefs'] = true;
        BGjs.init();
    });
}
else BGjs.init();
