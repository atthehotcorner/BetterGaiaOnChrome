/*
Post Format JS 
Copyright (c) BetterGaia and Bowafishtech
Unauthorized copying, sharing, adaptation, publishing, commercial usage, and/or distribution, its derivatives and/or successors, via any medium, is strictly prohibited.
*/

function Format() {

if ((prefs['format'] == true)
	&& ((document.location.pathname.indexOf('/forum/') > -1 && prefs['format.forums'] == true)
	|| (document.location.pathname.indexOf('/guilds/posting.php') > -1 && prefs['format.guildForums'] == true)
	|| (document.location.pathname.indexOf('/profile/privmsg.php') > -1 && prefs['format.pms'] == true)
	|| (document.location.search.indexOf('mode=addcomment') > -1 && prefs['format.profileComments'] == true))
) {

    function repeat(s, n) {var a = []; while(a.length < n) {a.push(s);} return a.join('');} // for adding new lines

    // Run formatter
    $('textarea[name="message"]:not([identity]), textarea[name="comment"]:not([identity])').each(function() {
        var identity = Date.now();
        var post = $(this);

        // Makes sure this code runs on fresh textboxes
        $(this).add("select[name=basic_type]:not([identity])").attr("identity", identity);

        // Adds formatting bar
        var formattingbar = '', i = 0;

        $.each(prefs['format.list'], function(key, format) {
            if (i == 0) {
                formattingbar += '<a code="' + format[0] + '" poststyle="' + format[1] + '" class="current">' + key + '</a>';

                // if quote
                if (post.val().substr(0,8) == '[quote="' && post.val().replace(/\n\s*/g,'').substr(-8) == '[/quote]') {
                    if (prefs['format.quote.removeFormatting'] == true) post.val(post.val().replace(/\[\/?(?:b|i|u|strike|code|url|color|size|align|img|imgleft|imgright|imgmap|youtube|spoiler).*?\]/img, ''));
    
                    if (prefs['format.quote.spoilerWrap'] == true) {
                        var newPost = post.val().slice(0,-8);
                        newPost += '[/spoiler][/quote]';
                        newPost = newPost.replace(/\[quote=(.+?)\]/, '[quote=$1][spoiler]');
                        post.val(newPost);
                    }
    
                    if (prefs['format.quote.endOfFormat'] == true) post.val(decodeURI(format[0]) + '\n' + repeat('\n', prefs['format.quote.rangeNumber']) + post.val());
                    else post.val(post.val() + '\n' + repeat('\n', prefs['format.quote.rangeNumber']) + decodeURI(format[0]));
                }
    
                // If blank
                else if (post.val().length == 0) post.val(decodeURI(format[0]));
                
                // In the end
                $('select[name=basic_type][identity="' + identity + '"]').val(format[1]);
            }

            // Not first
            else formattingbar += '<a code="' + format[0] + '" poststyle="' + format[1] + '">' + key + '</a>';
            i++;
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
                    content = content.replace('%0A' + repeat('%0A', prefs['format.quote.rangeNumber']), '');
                    post.val(decodeURI(content));
                }

                if (prefs['format.quote.endOfFormat'] == true) post.val(format + '\n' + repeat('\n', prefs['format.quote.rangeNumber']) + post.val());
                else post.val(post.val() + '\n' + repeat('\n', prefs['format.quote.rangeNumber']) + format);
            }

            $('select[name=basic_type][identity="' + identity + '"]').val($(this).attr('poststyle'));
            $(this).siblings('a.current').removeClass('current');
            $(this).addClass('current');
        }

        return false;
    });
}

} // ---

// Check Storage and Fire
if (prefs['appliedUserPrefs'] == true && prefs['appliedFormat'] == false) {
	Format();
	prefs['appliedFormat'] = true;
}