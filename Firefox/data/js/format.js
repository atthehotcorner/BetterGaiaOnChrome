/*
Post Format JS 
Copyright (c) BetterGaia and Bowafishtech
Unauthorized copying, sharing, adaptation, publishing, commercial usage, and/or distribution, its derivatives and/or successors, via any medium, is strictly prohibited.
*/
/*global localStorage: false, console: false, $: false, chrome: false, unescape: false, prefs: false, localPrefs: false, window: false, document: false */
/*jshint sub:true */
/*jshint multistr:true */

function Format() {

function repeat(s, n) {var a = []; while(a.length < n) {a.push(s);} return a.join('');} // for adding new lines

if ((prefs['format'] === true) && 
    ((document.location.pathname.indexOf('/forum/') > -1 && prefs['format.forums'] === true) ||
    (document.location.pathname.indexOf('/guilds/posting.php') > -1 && prefs['format.guildForums'] === true) || 
    (document.location.pathname.indexOf('/profile/privmsg.php') > -1 && prefs['format.pms'] === true) ||
    (document.location.search.indexOf('mode=addcomment') > -1 && prefs['format.profileComments'] === true))
) {
    // Run formatter
    $('textarea[name="message"]:not([identity]), textarea[name="comment"]:not([identity])').each(function() {
        var identity = Date.now();
        var post = $(this);

        // Makes sure this code runs on fresh textboxes
        $(this).add("select[name=basic_type]:not([identity])").attr("identity", identity);

        // Adds formatting bar
        var formattingbar = '';

        // check if local prefs exist
        if (typeof(localPrefs['format.list']) == 'object' && $.isEmptyObject(prefs['format.list'])) {
            prefs['format.list'] = localPrefs['format.list'];
            console.warn('Your formats are currently saved locally.');
        }
        
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
                chrome.storage.sync.set({'format.list.recent': $(this).text()});
                prefs['format.list.recent'] = $(this).text();
            }
            else {
                chrome.storage.sync.remove('format.list.recent');
                prefs['format.list.recent'] = 'default';
            }
        }

        return false;
    });
}

} // ---

// Check Storage and Fire
if (prefs['appliedUserPrefs'] === true && prefs['appliedFormat'] === false) {
	Format();
	prefs['appliedFormat'] = true;
}