/*global chrome: false, console: false, data: false, Handlebars: false, prefs: false*/
/*jshint browser: true, jquery: true, multistr: true, sub: true*/

// Handlebars setup
Handlebars.registerHelper('if_eq', function (a, b, opts) {
    if (a == b) return opts.fn(this);
    else return opts.inverse(this);
});
Handlebars.registerHelper('urlComplete', function(url) {
    if (url.substr(0,4) != 'http') return 'http://www.gaiaonline.com' + url;
    return url;
});
Handlebars.registerHelper('timeFromEpoch', function(epoch) {
    return new Date(epoch).toLocaleDateString();
});
Handlebars.registerHelper('stringify', function(item) {
    return JSON.stringify(item);
});
var template = Handlebars.compile($('#option-template').html()),
    shortcutsTemplate = Handlebars.compile($('#shortcuts-template').html()),
    usertagsTemplate = Handlebars.compile($('#usertags-template').html());

// Debug message
function debugBro(error) {
    window.prompt('We\'re having some trouble with Settings. \nCan you pass this message over to us?',
                  'Runtime message: ' + error + ' Name: ' + error.name + ' Stack: ' + error.stack + ' Message: ' + error.message);
}

var Settings = {
    pageInit: function(pageName) {
        if (['Home', 'Background', 'Header', 'Logo', 'Colors', 'Forums', 'PostFormat', 'UserTags'].indexOf(pageName) > -1) {
            // Compile HTML
            $('.page[data-page="' + pageName + '"] fieldset').html(template(data[pageName]));

            // Set prefs
            $('.page[data-page="' + pageName + '"] *[data-pref]').each(function() {
                var pref = $(this).attr('data-pref');
                
                // Error Handling
                if (typeof(prefs[pref]) == 'undefined') {
                    $(this).prop('disabled', true);
                    throw('Error: ' + pref + ' is not a valid preference to initialize.');
                }

                // Checkbox
                if ($(this).attr('type') == 'checkbox') $(this).prop('checked', prefs[pref]);
                // Select, Textbox
                else $(this).val(prefs[pref]);
            });
        }

        if (pageName == 'Shortcuts') {
            $('.page[data-page="Shortcuts"] fieldset').html(shortcutsTemplate(prefs['header.shortcuts.list']));
            
            $('.page[data-page="Shortcuts"] .add').on('click', function() {
                $('.page[data-page="Shortcuts"] fieldset').append(shortcutsTemplate([['', '']]));
            });
            
            $('.page[data-page="Shortcuts"] fieldset').on('click', '.delete', function() {
                $(this).parentsUntil('fieldset').remove();
            });
        }

        else if (pageName == 'Background') {
            $('.page[data-page="Background"] .options').on('click', 'a[data-url]', function() {
                var image = $(this).attr('data-url');
                if (image == 'default') $('#preview').attr('style', '');
                else $('#preview').css('background-image', 'url(' + image + ')');
                $(this).parent().children('.selected').removeClass('selected');
                $(this).addClass('selected');
                
                $('input[data-pref="background.image"]').val(image).change();
            });

            $.ajax({
                type: 'GET',
                url: 'backgrounds.json',
                dataType: 'text json',
                cache: false
            }).done(function(data) {
                $.each(data['Backgrounds'], function(index, url) {
                    var html;
                    if (url == 'default') html = '<a data-url="' + url + '"></a>';
                    else html = '<a data-url="' + url + '" style="background-image: url(' + url + ');"></a>';
                    $('.page[data-page="Background"] .options .custom').before(html);
                });

                // set selected
                $('.page[data-page="Background"] .options a[data-url="' + $('input[data-pref="background.image"]').val() + '"]').addClass('selected');
            });
        }

        else if (pageName == 'Header') {
            $('.page[data-page="Header"] .options').on('click', 'a[data-url][data-base-url]', function() {
                var base = $(this).attr('data-base-url');
                if (base == 'default') $('#preview .header').attr('style', '');
                else $('#preview .header').css('background-image', 'url(' + base + ')');
                
                var image = $(this).attr('data-url');
                if (image == 'default') $('#preview .header .wrap').attr('style', '');
                else $('#preview .header .wrap').css('background-image', 'url(' + image + ')');

                $('.page[data-page="Header"] .options a.selected').removeClass('selected');
                $(this).addClass('selected');
                
                $('input[data-pref="header.background.base"]').val(base).change();
                $('input[data-pref="header.background"]').val(image).change();
            });

            $.ajax({
                type: 'GET',
                url: 'headers.json',
                dataType: 'text json',
                cache: false
            }).done(function(data) {
                // get host prefix
                var host = data['info']['host'];
                delete data['info'];

                // add header options to page
                $.each(data, function(key, headers) {
                    // Add title
                    $('.page[data-page="Header"] .options').prepend('<h3>' + key + '</h3><div class="h' + key + '"></div>');

                    // Add headers
                    $.each(headers, function(name, url) {
                        // check if url needs prefix
                        if (url[0] != 'default' && url[0].substring(0,7) != 'http://' && url[0].substring(0,19) != 'chrome-extension://') url[0] = host + url[0];
                        if (url[1] != 'default' && url[1].substring(0,7) != 'http://' && url[1].substring(0,19) != 'chrome-extension://') url[1] = host + url[1];
                        $('.page[data-page="Header"] .options .h' + key).append('<a data-url="' + url[0] + '" data-base-url="' + url[1] + '" title="' + name + '">' + name + '</a>');
                    });
                });
                
                // set selected
                $('.page[data-page="Header"] .options a[data-url="' + $('input[data-pref="header.background"]').val() + '"][data-base-url="' + $('input[data-pref="header.background.base"]').val() + '"]').addClass('selected');
            });
        }
        else if (pageName == 'Logo') {
            $('.page[data-page="Logo"] .options').on('click', 'a[data-url]', function() {
                var image = $(this).attr('data-url');
                if (image == 'default') $('#preview .header .wrap .logo').attr('style', '');
                else $('#preview .header .wrap .logo').css('background-image', 'url(' + image + ')');
                $(this).parent().children('.selected').removeClass('selected');
                $(this).addClass('selected');
                
                $('input[data-pref="header.logo"]').val(image).change();
            });

            // set selected
            $('.page[data-page="Logo"] .options a[data-url="' + $('input[data-pref="header.logo"]').val() + '"]').addClass('selected');
        }

        else if (pageName == 'PostFormat') {
        }

        else if (pageName == 'UserTags') {
            $('.page[data-page="UserTags"] fieldset').html(usertagsTemplate(prefs['usertags.list']));
            
            $('.page[data-page="UserTags"] fieldset').on('click', '.delete', function() {
                $(this).parentsUntil('fieldset').remove();
            });
        }

        else if (pageName == 'About') {
            // nothing at the moment
            $('.page[data-page="About"] .version').text(prefs.version);
            $('.page[data-page="About"] .reset').on('click', function() {
                localStorage.clear();
                chrome.storage.local.clear(function(){
                    chrome.storage.sync.clear(function(){
                        chrome.runtime.reload();
                    });
                });
            });
        }
    },

    onload: function() {
        // Save a default
        prefs.default = JSON.parse(JSON.stringify(prefs));

        // Get settings
        chrome.storage.local.get(null, function(response) {
            for (var key in response) {
                try {prefs[key] = response[key];}
                catch(e) {console.warn('Missing pref \'' + e + '\'.');}
            }

            try {Settings.init();}
            catch(e) {debugBro(e);}
        });
    },

    init: function() {
        // Save prefs
        $('#pages').on('change', '.page.loaded *[data-pref]', function() {
            var pref = $(this).attr('data-pref'), save = {};

            // Checkbox
            if ($(this).attr('type') == 'checkbox') save[pref] = $(this).is(':checked');
            // Select, Textbox
            else save[pref] = $(this).val();

            // Change menu visiblity
            if (pref == 'format') {
                if (save[pref] === false) $('#nav a[href="#PostFormat"]').parent().hide();
                else $('#nav a[href="#PostFormat"]').parent().show();
            }
            if (pref == 'usertags') {
                if (save[pref] === false) $('#nav a[href="#UserTags"]').parent().hide();
                else $('#nav a[href="#UserTags"]').parent().show();
            }

            // Change notifications
            if (pref == 'notifications') {
                if (save[pref] == '0') {
                    chrome.alarms.clear('gaia-notifications');
                    chrome.notifications.clear('gaia-notify', function() {});
                }
                else {
                    chrome.alarms.create('gaia-notifications', {when: 0, periodInMinutes: parseInt(save[pref], 10)});
                }
            }

            // Preview
            if (pref == 'background.repeat') {
                if (save[pref] === false) $('#preview').css('background-repeat', 'no-repeat');
                else $('#preview').css('background-repeat', 'repeat');
            }
            if (pref == 'background.position') $('#preview').css('background-position', save[pref]);
            if (pref == 'background.color') $('#preview').css('background-color', save[pref]);
            if (pref == 'header.nav') $('#preview .nav, #preview .header .wrap .username').css('background-color', save[pref]);
            if (pref == 'header.nav.hover') $('#preview .nav a:nth-of-type(3)').css('background-image', 'radial-gradient(ellipse at bottom center, ' + save[pref] + ', transparent 95%)');
            if (pref == 'header.nav.current') $('#preview .nav a:first-child').css('background-image', 'radial-gradient(ellipse at bottom center, ' + save[pref] + ', transparent 95%)');
            if (pref == 'forum.threadHeader') $('#preview .body .linklist').css('background-color', save[pref]);
            if (pref == 'forum.postHeader') $('#preview .body .username').css('background-color', save[pref]);

            // Chrome Storage
            if (prefs.default[pref] == save[pref]) chrome.storage.local.remove(pref);
            else chrome.storage.local.set(save);
        });
        
        // Menu
        $('#nav .pure-menu').on('click', 'a[href]', function() {
            if ($(this).hasClass('selected')) return false;
            else {
                $('#pages .page.selected, #nav .pure-menu a.selected').removeClass('selected');

                var pageName = $(this).attr('href').substring(1),
                    page = $('#pages .page[data-page="' + pageName + '"]');
                if (!page.hasClass('loaded')) {
                    try {Settings.pageInit(pageName);}
                    catch(e) {debugBro(e);}
                    page.addClass('loaded');
                }
                page.addClass('selected');
                $(this).addClass('selected');
            }
        });

        // Change menu visiblity
        if (prefs['format'] === false) $('#nav a[href="#PostFormat"]').parent().hide();
        if (prefs['usertags'] === false) $('#nav a[href="#UserTags"]').parent().hide();

        // Hashes
        $(window).on('hashchange', function() {
            if (window.location.hash === '') $('#nav .pure-menu a[href="#Home"]').click();
            else $('#nav .pure-menu a[href="' + window.location.hash + '"]').click();
        });

        if (window.location.hash === '') $('#nav .pure-menu a[href="#Home"]').click();
        else $('#nav .pure-menu a[href="' + window.location.hash + '"]').click();

        // Preview
        var background = {
            'background-repeat': (prefs['background.repeat'])? 'repeat':'no-repeat',
            'background-position': prefs['background.position'],
            'background-color': prefs['background.color'],
            'background-image': 'url(' + prefs['background.image'] + ')'
        };
        $('#preview').css(background);
        if (prefs['header.background.base'] != 'default') $('#preview .header').css('background-image', 'url(' + prefs['header.background.base'] + ')');
        if (prefs['header.background'] != 'default') $('#preview .header .wrap').css('background-image', 'url(' + prefs['header.background'] + ')');
        if (prefs['header.logo'] != 'default') $('#preview .header .wrap .logo').css('background-image', 'url(' + prefs['header.logo'] + ')');
        if (prefs['header.nav'] != prefs.default['header.nav']) $('#preview .nav, #preview .header .wrap .username').css('background-color', prefs['header.nav']);
        if (prefs['header.nav.hover'] != prefs.default['header.nav.hover']) $('#preview .nav a:nth-of-type(3)').css('background-image', 'radial-gradient(ellipse at bottom center, ' + prefs['header.nav.hover'] + ', transparent 95%)');
        if (prefs['header.nav.current'] != prefs.default['header.nav.current']) $('#preview .nav a:first-child').css('background-image', 'radial-gradient(ellipse at bottom center, ' + prefs['header.nav.current'] + ', transparent 95%)');
        if (prefs['forum.threadHeader'] != prefs.default['forum.threadHeader']) $('#preview .body .linklist').css('background-color', prefs['forum.threadHeader']);
        if (prefs['forum.postHeader'] != prefs.default['forum.postHeader']) $('#preview .body .username').css('background-color', prefs['forum.postHeader']);
    }
};

// Run
try {Settings.onload();}
catch(e) {debugBro(e);}
