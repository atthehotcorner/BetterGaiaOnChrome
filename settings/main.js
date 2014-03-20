/*
Settings JS 
Copyright (c) BetterGaia and Bowafishtech
Unauthorized copying, sharing, adaptation, publishing, commercial usage, and/or distribution, its derivatives and/or successors, via any medium, is strictly prohibited.
*/
/*global localStorage: false, console: false, $: false, chrome: false, unescape: false, prefs: false, window: false, Transfer: false, moment: false */
/*jshint sub:true */
/*jshint multistr:true */

var Preview = {
    set: {
        background: function(url) {
            if (url == 'default') $('#preview > div, #preview2').removeAttr('style');
            else $('#preview > div, #preview2').css({'background-image': 'url(' + url + ')'});
        },
        header: function(url, baseurl) {
            if (baseurl == 'default') $('#preview .header').removeAttr('style');
            else $('#preview .header').css({'background-image': 'url(' + baseurl + ')'});

            if (url == 'default') $('#preview .header > div').removeAttr('style');
            else $('#preview .header > div').css({'background-image': 'url(' + url + ')'});
        },
        logo: function(url) {
            if (url == 'default')$('#preview .logo').removeAttr('style');
            else $('#preview .logo').css({'background-image': 'url(' + url + ')'});
        },
        color: function(pref) {
            var dict = {
                'background.color': '#preview > div, #preview2',
                'header.nav': '#preview .navigation, #preview .header .username item',
                'header.nav.hover': '#preview .navigation .hover',
                'header.nav.current': '#preview .navigation .current',
                'forum.threadHeader': '#preview2 .thread_header .linklist',
                'forum.postHeader': '#preview2 .post .username'
            };
            if (dict[pref]) $(dict[pref]).css({'background-color': $('input[pref="' + pref + '"]').val()});
        },
        colors: function(pref, value) {
            if (prefs.default[pref] == value) chrome.storage.sync.remove(pref, function(){console.log(pref + ' removed.');});
            else {
                var send = {};
                send[pref] = value;
                chrome.storage.sync.set(send, function(){console.log(pref + ' saved.');});
            }
            this.color(pref);
        }
    }
};

var Settings = {
    page: {}
};

Settings.page.init = function(pageName) {    
    // Set nav link as init, check if init
    $('header menu a.init.' + pageName);
    $('header menu a.' + pageName).addClass('init');
    pageName = 'page.' + pageName;

    // Set checkboxes
    $('input[type="checkbox"][pref]', pageName).each(function() {
        var pref = $(this).attr('pref');
        if (typeof(prefs[pref]) != 'undefined') $(this).prop('checked', prefs[pref]);
        else $(this).prop('disabled', true);
    });

    // Set selects
    $('select[pref]', pageName).each(function() {
        var pref = $(this).attr('pref');
        if (typeof(prefs[pref]) != 'undefined') $(this).val(prefs[pref]);
        else $(this).prop('disabled', true);
    });

    // Set colors
    $('input[pref].color', pageName).each(function() {
        var pref = $(this).attr('pref');
        if (typeof(prefs[pref]) != 'undefined') $(this).val(prefs[pref]);
        else $(this).prop('disabled', true);
        Preview.set.color(pref);
    });

    // Set bar links
    $('bar a[pref]', pageName).each(function() {
        var pref = $(this).attr('pref');
        if (typeof(prefs[pref]) != 'undefined') $(this).attr('value', prefs[pref]);
        if ($(this).attr('value') == 'false') $(this).closest('page').addClass('off');
        else $(this).closest('page').removeClass('off');
    });

    // enable colorpickers
    $('input[pref].color', pageName).minicolors({
        change: function() {Preview.set.colors($(this).attr('pref'), $(this).val());},
        changeDelay: 500,
        letterCase: 'uppercase',
        position: 'top left'
    });

    // Update checkboxes
    $('input[type="checkbox"][pref]:not([disabled])', pageName).on('change', function(){
        var pref = $(this).attr('pref'), value = $(this).prop('checked');
        if (prefs.default[pref] == value) chrome.storage.sync.remove(pref, function(){console.log(pref + ' removed.');});
        else {
            var send = {};
            send[pref] = value;
            chrome.storage.sync.set(send, function(){console.log(pref + ' saved.');});
        }
    });

    // Update selects
    $('select[pref]:not([disabled])', pageName).on('change', function(){
        var pref = $(this).attr('pref'), value = $(this).val();
        if (prefs.default[pref] == value) chrome.storage.sync.remove(pref, function(){console.log(pref + ' removed.');});
        else {
            var send = {};
            send[pref] = value;
            chrome.storage.sync.set(send, function(){console.log(pref + ' saved.');});
        }
    });

	// Update bar links
	$('bar a[pref]', pageName).on('click', function(){
        $(this).attr('value', ($(this).attr('value') == 'true')? false:true);
        var pref = $(this).attr('pref'), value = ($(this).attr('value') == 'true')? true:false;
        if (prefs.default[pref] == value) chrome.storage.sync.remove(pref, function(){console.log(pref + ' removed.');});
        else {
            var send = {};
            send[pref] = value;
            chrome.storage.sync.set(send, function(){console.log(pref + ' saved.');});
        }
        if ($(this).attr('value') == 'false') $(this).closest('page').addClass('off');
        else $(this).closest('page').removeClass('off');
    });
};

Settings.page.home = function() {
    this.init('home');
    var pageName = 'page.home';

	// Remove alarm
	$('select[pref="notifications"]', pageName).on('change', function(){
        if ($(this).val() == '0') {
            chrome.alarms.clear('gaia-notifications');
            chrome.notifications.clear('gaia-notify', function(){});
        }
        else {
            chrome.alarms.create('gaia-notifications', {when: 0, periodInMinutes: parseInt($(this).val(), 10)});
        }
    });
};

Settings.page.personalize = function() {
    this.init('personalize');
    var pageName = 'page.personalize';

    $(window).scroll(function() {
        $('#preview > div').width($('page.personalize').width() / 0.65).toggleClass('scrolling', $(window).scrollTop() > $('#preview').offset().top);
    });

	// -- Add backgrounds
	$.ajax({
		type: 'GET',
		url: 'data/backgrounds.json',
		dataType: 'text json',
		cache: false
	}).done(function(data) {
		$.each(data['Backgrounds'], function(index, url) {
            if (url == 'default') $('#background a.customurl').before('<a data-url="' + url + '"></a>');
            else $('#background a.customurl').before('<a data-url="' + url + '" style="background-image: url(' + url + ');"></a>');
        });
        
        // Set selected background
        var bgurl = prefs['background.image'];
        if ($('#background a[data-url="' + bgurl + '"]').length > 0) $('#background a[data-url="' + bgurl + '"]').addClass('selected');
        else $('#background a.customurl').attr('data-url', bgurl).addClass('selected').css({'background-image': 'url(' + bgurl + ')'});
    }).fail(function() {
		console.warn('Couldn\'t fetch backgrounds.');
    }).always(function() {
        Preview.set.background(prefs['background.image']);
    });
	// END backgrounds

	// -- Add headers
	$.ajax({
		type: 'GET',
		url: 'data/headers.json',
		dataType: 'text json',
		cache: false
	}).done(function(data) {
        // get host prefix
        var host = data['info']['host'];
        delete data['info'];

        // add header options to page
        $.each(data, function(key, headers) {
            // Add title
            $('#header aside').prepend('<div class="h' + key + '"><h4>' + key + '</h4></div>');

            // Add headers
            $.each(headers, function(name, url) {
                // check if url needs prefix
                if (url[0] != 'default' && url[0].substring(0,7) != 'http://' && url[0].substring(0,19) != 'chrome-extension://') url[0] = host + url[0];
                if (url[1] != 'default' && url[1].substring(0,7) != 'http://' && url[1].substring(0,19) != 'chrome-extension://') url[1] = host + url[1];
                $('#header .h' + key).append('<a data-name="' + name + '" data-url="' + url[0] + '" data-base-url="' + url[1] + '"></a>');
            });

            $(window).scroll(function() {
                if ($('#header aside .h' + key).offset().top < $(window).scrollTop() + $(window).height() - 75) {
                    $('#header aside .h' + key + ' a[data-url]').each(function() {
                        var dataUrl = $(this).attr('data-url');
                        // Parse into imgur thumbnail
                        if (dataUrl.substring(0,19) == 'http://i.imgur.com/') {
                            $(this).css('background-image', 'url(' + dataUrl.substr(0, dataUrl.lastIndexOf('.')) + 's.jpg' + ')');
                        }
                        else if (dataUrl != 'default') $(this).css('background-image', 'url(' + dataUrl + ')');
                    });
                }
            });
        });

        // set current header
        var value = [prefs['header.background'], prefs['header.background.base']];
        if ($('#header a[data-url="' + value[0] + '"][data-base-url="' + value[1] + '"]').length > 0) $('#header a[data-url="' + value[0] + '"][data-base-url="' + value[1] + '"]').addClass('selected');
        else if (value[0] == 'default') $('#header a.customurl').attr({'data-url': value[0], 'data-base-url': value[1]}).addClass('selected');
        else $('#header a.customurl').attr({'data-url': value[0], 'data-base-url': value[1]}).addClass('selected').css({'background-image': 'url(' + value[0] + ')'});
    }).fail(function() {
        console.warn('Couldn\'t fetch headers.');
    }).always(function() {
        Preview.set.header(prefs['header.background'], prefs['header.background.base']);
    });
	// -- END headers

    // -- Add logos
    var logourl = prefs['header.logo'];
    if ($('#logo a[data-url="' + logourl + '"]').length > 0) $('#logo a[data-url="' + logourl + '"]').addClass('selected');
    else $('#logo a.customurl').attr('data-url', logourl).addClass('selected');
    Preview.set.logo(logourl);
    
    $('#logo a[data-url]:not([data-url="default"])').each(function(){
        $(this).css({'background-image': 'url(' + $(this).attr('data-url') + ')'});
    });

    /*$(window).scroll(function() {
        if ($('#logo').offset().top < $(window).scrollTop() + $(window).height() - 85) {
            $('#logo a[data-url]:not([data-url="default"])').css('background-image', 'url(' + $(this).attr('data-url') + ')');
        }
    });*/
    // END logos 

    // nav color reset
    $('#navigation .reset').on('click', function(){
        $('input[pref="header.nav"]').minicolors('value', prefs.default['header.nav']);
        $('input[pref="header.nav.hover"]').minicolors('value', prefs.default['header.nav.hover']);
        $('input[pref="header.nav.current"]').minicolors('value', prefs.default['header.nav.current']);
    });

    // nav color reset
    $('#thread_header .reset').on('click', function(){
        $('input[pref="forum.threadHeader"]').minicolors('value', prefs.default['forum.threadHeader']);
        $('input[pref="forum.postHeader"]').minicolors('value', prefs.default['forum.postHeader']);
    });

    // save background
    $('#background aside.left').on('click.default', 'a[data-url]:not(.selected)', function(){
        var pref = 'background.image', value = $(this).attr('data-url');
        if (prefs.default[pref] == value) chrome.storage.sync.remove(pref, function(){console.log(pref + ' removed.');});
        else {
            var send = {};
            send[pref] = value;
            chrome.storage.sync.set(send, function(){console.log(pref + ' saved.');});
        }

        $('#background .left a[data-url].selected').removeClass('selected');
        $(this).addClass('selected');        
        Preview.set.background(value);
    });

    // save header
    $('#header aside').on('click.default', 'a[data-url]:not(.selected)', function(){
        var pref = ['header.background', 'header.background.base'], value = [$(this).attr('data-url'), $(this).attr('data-base-url')];
        if (prefs.default[pref[0]] == value[0]) chrome.storage.sync.remove(pref[0], function(){console.log(pref[0] + ' removed.');});
        else {
            var send = {};
            send[pref[0]] = value[0];
            chrome.storage.sync.set(send, function(){console.log(pref[0] + ' saved.');});
        }
        
        if (prefs.default[pref[1]] == value[1]) chrome.storage.sync.remove(pref[1], function(){console.log(pref[1] + ' removed.');});
        else {
            var send2 = {};
            send2[pref[1]] = value[1];
            chrome.storage.sync.set(send2, function(){console.log(pref[1] + ' saved.');});
        }

        $('#header aside a[data-url].selected').removeClass('selected');
        $(this).addClass('selected');
        Preview.set.header(value[0], value[1]);
    });    

    // save logo
    $('#logo').on('click.default', 'a[data-url]:not(.selected)', function(){
        var pref = 'header.logo', value = $(this).attr('data-url');
        if (prefs.default[pref] == value) chrome.storage.sync.remove(pref, function(){console.log(pref + ' removed.');});
        else {
            var send = {};
            send[pref] = value;
            chrome.storage.sync.set(send, function(){console.log(pref + ' saved.');});
        }

        $('#logo a[data-url].selected').removeClass('selected');
        $(this).addClass('selected');
        Preview.set.logo(value);
    });

    // Enable asks
    $('a.customurl', pageName).on('click', function(){
        // prefill data
        if (typeof($(this).attr('data-url')) == 'string') {
            $(this).closest('aside').find('.ask input.url').val($(this).attr('data-url'));
        }
        if (typeof($(this).attr('data-base-url')) == 'string') {
            $(this).closest('aside').find('.ask input.baseurl').val($(this).attr('data-base-url'));
        }

        // show
		$(this).closest('aside').addClass('editing');
        return false;
	});

    $('.ask h3 .close', pageName).on('click', function(){
		$(this).closest('aside').removeClass('editing');
	});

	$('.ask button', pageName).on('click', function(){
        var customurl = $(this).closest('aside').find('a.customurl');

        // Update Value
        if ($.trim($(this).siblings('input.url').val()) !== '') {
            if ($(this).siblings('input.baseurl').length > 0) customurl.attr('data-base-url', $(this).siblings('input.baseurl').val());
            customurl.attr('data-url', $(this).siblings('input.url').val()).removeClass('selected').trigger('click.default');
        }
		
        // Close Ask
        $(this).closest('aside').removeClass('editing');
	});
};

Settings.page.formats = function() {
    this.init('formats');
    var pageName = 'page.formats';

    function showSave() {
        $('bar .save', pageName).css('display', 'inline-block');
    }

    // Insert formats
    // if local prefs are set
    if (typeof(prefs.local['format.list']) == 'object' && $.isEmptyObject(prefs['format.list'])) {
        prefs['format.list'] = prefs.local['format.list'];
        console.warn('Your formats are currently saved locally.');
        $('.localonly', pageName).show();
    }

    $.each(prefs['format.list'], function(index, format) {
        $('#postformating aside format.add').before('<format data-bbcode="' + format[1] + '" data-poststyle="' + format[2] + '"><strong>' + format[0] + '</strong>\
        <div class="clear"><a class="edit">Edit</a><a class="delete">Delete</a></div></format>');
    });

    // Enable format sorting
    $('#postformating aside').sortable({items: 'format:not(.add)'}).on('sortupdate', function(){
        console.log('done dragging!');
        showSave();
    });
    
    $('#postformating aside format.add').on('click', function(){
        var bbcode = "%5Bcolor=#003040%5D%E2%96%8C%5B/color%5D%5Bb%5D%5Bsize=11%5D%5Bcolor=#777%5DA%20SHIP%20IS%20SAFE%20IN%20HARBOR,%5B/color%5D%5B/size%5D%5B/b%5D%0A%5Bcolor=#276B91%5D%E2%96%8C%5B/color%5D%5Bb%5D%5Bsize=11%5D%5Bcolor=#777%5DBUT%20THAT'S%20NOT%20WHAT%20SHIPS%20ARE%20FOR.%5B/color%5D%5B/size%5D%5B/b%5D%0A%0A%0A%0A%5Balign=right%5D%5Bb%5DWelcome%20to%20%5Burl=http://bettergaia.com/%5DBetterGaia%5B/url%5D.%5B/b%5D%0A%5Bi%5DNeed%20help?%20%5Burl=http://www.gaiaonline.com/forum/t.45053993/%5DSee%20our%20thread.%5B/url%5D%5B/i%5D%5B/align%5D",
		name = ['Almost', 'Human', 'Grumpy Cat', 'Business Cat', 'Doge', 'Sophisticated Cat'];

        $(this).before('<format data-bbcode="' + bbcode + '" data-poststyle="0" draggable="true"><strong>' + name[Math.floor(Math.random() * name.length)] + '</strong>' +
        '<div class="clear"><a class="edit">Edit</a><a class="delete">Delete</a></div></format>');

        // re-enable sorting
        $('#postformating aside').sortable('destroy').sortable({items: 'format:not(.add)'});
        showSave();
    });

    $('#postformating aside').on('click', 'format .clear a.edit', function(){
        var format = $(this).closest('format');
        $('#editformat h3 input').val(format.find('strong').text());
        $('#editformat textarea').val(decodeURI(format.attr('data-bbcode')));
        $('#editformat select').val(format.attr('data-poststyle'));

        $('#editformat .right').html(bbcodePreview(decodeURI(format.attr('data-bbcode'))));
        
        $(this).closest('format').addClass('editing');
        $('page.formats').addClass('editing');
        showSave();
    });

    function bbcodePreview(data) {var search=new Array(/\[b\]([\s\S]*?)\[\/b\]/ig,/\[i\]([\s\S]*?)\[\/i\]/ig,/\[u\]([\s\S]*?)\[\/u\]/ig,/\[strike\](.*?)\[\/strike\]/ig,/\[img\](.*?)\[\/img\]/ig,/\[img(left|right)\](.*?)\[\/img(left|right)\]/ig,/\[imgmap\](.*?)\[\/imgmap\]/ig,/\[url\="?(.*?)"?\](.*?)\[\/url\]/ig,/\[url\](.*?)\[\/url\]/ig,/\[code\]([\s\S]*?)\[\/code\]/ig,/\[quote\]([\s\S]*?)\[\/quote\]/ig,/\[quote\="?(.*?)"?\]([\s\S]*?)\[\/quote\]/ig,/\[color\=(.*?)\]([\s\S]*?)\[\/color\]/ig,/\[size\="?(.*?)"?\]([\s\S]*?)\[\/size\]/gi,/\[align\="?(right|left|center)"?\]([\s\S]*?)\[\/align\]/ig,/\[align\=(.*?)\]([\s\S]*?)\[\/align\]/ig,/\[list\="?(.*?)"?\]([\s\S]*?)\[\/list\]/gi,/\[list\]/gi,/\[\/list\]/gi,/\[\*\]\s?(.*?)\n/ig,/\n\n/ig,/\[center\]([\s\S]*?)\[\/center\]/ig,/\[left\]([\s\S]*?)\[\/left\]/ig,/\[right\]([\s\S]*?)\[\/right\]/ig);var replace=new Array("<strong>$1</strong>","<em>$1</em>",'<span style="text-decoration: underline">$1</span>','<span style="text-decoration: line-through">$1</span>','<img src="$1" alt="User Image" />','<img src="$2" style="float:$1;" alt="User Image" />','<img src="$1" ismap="ismap" alt="User Image" />','<a href="$1">$2</a>','<a href="$1">$1</a>','<div class="code">test</div>','<div class="quote"><div class="cite">Quote:</div><div class="quoted">$1<div class="clear"></div></div></div>','<div class="quote"><div class="cite">$1</div><div class="quoted">$2<div class="clear"></div></div></div>','<span style="color:$1">$2</span>','<span style="font-size: $1px">$2</span>','<div class="postcontent-align-$1" style="text-align: $1">$2</div>',"$1","<ol>$2</ol>","<ul>","</ul>","<li>$1</li>","<br />",'<div class="postcontent-align-center" style="text-align: center">$1</div>','<div class="postcontent-align-left" style="text-align: left">$1</div>','<div class="postcontent-align-right" style="text-align: right">$1</div>');var t;for(var i=0;i<search.length;i++){var n=false;while(n===false){data=data.replace(search[i],replace[i]);t=data.match(search[i]);if(t===null){n=true;}}}return data;}

    $('#editformat .clear .done').on('click', function(){
        $('#postformating format.editing strong').text($('#editformat h3 input').val());
        $('#postformating format.editing').attr({
            'data-bbcode': encodeURI($('#editformat textarea').val()), 
            'data-poststyle': $('#editformat select').val()
        });

        $('page.formats.editing, #postformating format.editing').removeClass('editing');    
    });

    $('#editformat .clear .cancel').on('click', function(){
        $('page.formats.editing, #postformating format.editing').removeClass('editing');       
    });

    $('#editformat textarea').bind('input propertychange', function(){
        $('#editformat .right').html(bbcodePreview($(this).val()));
    });

    $('#postformating aside').on('click', 'format .clear a.delete', function(){
        $(this).closest('format').remove();
        showSave();
    });

    // Save formats
    $('page.formats bar a.save').on('click', function(){
        var formats = [];
        $('#postformating aside format:not(.add)').each(function(index, element) {
            var name = $(this).find('strong').text();
            var bbcode = $(this).attr('data-bbcode');
            var style = $(this).attr('data-poststyle');
            formats.push([name, bbcode, parseInt(style, 10)]);
        });

        chrome.storage.sync.set({'format.list': formats}, function(){
            if (typeof(chrome.runtime.lastError) == 'object') {
                console.warn('Error when setting formats: ' + chrome.runtime.lastError['message']);
                
                // save to local
                if (chrome.runtime.lastError['message'] == 'QUOTA_BYTES_PER_ITEM quota exceeded') {
                    chrome.storage.local.set({'format.list': formats}, function(){
                        console.log('formats saved locally.');
                        $('page.formats .localonly').show();
                        chrome.storage.sync.set({'format.list': {}});
                        $('bar .save', pageName).hide();
                    });
                }
            }
            else {
                console.log('formats saved to sync.');
                $('page.formats .localonly').hide();
                chrome.storage.local.remove('format.list');
                $('bar .save', pageName).hide();
            }
        });
    });

    // Change text if most recent selected
    if ($('page.formats input[pref="format.list.useRecent"]').prop('checked')) $('#postformating').addClass('useRecent');
	$('page.formats input[pref="format.list.useRecent"]').on('change', function() {
        if ($(this).prop('checked')) $('#postformating').addClass('useRecent');
        else $('#postformating').removeClass('useRecent');
	});
};

Settings.page.shortcuts = function() {
    this.init('shortcuts');
    var pageName = 'page.shortcuts';

    function showSave() {
        $('bar .save', pageName).css('display', 'inline-block');
    }

    // Insert shortcuts
    // if local prefs are set
    if (typeof(prefs.local['header.shortcuts.list']) == 'object' && $.isEmptyObject(prefs['header.shortcuts.list'])) {
        prefs['header.shortcuts.list'] = prefs.local['header.shortcuts.list'];
        console.warn('Your shortcuts are currently saved locally.');
        $('page.shortcuts .localonly').show();
    }

    $.each(prefs['header.shortcuts.list'], function(index, data) {
        $('#shortcuts aside slink.add').before('<slink>\
            <input type="text" class="name" placeholder="Name" value="' + data[0] + '">\
            <input type="text" class="url" placeholder="URL" value="' + data[1] + '">\
            <div class="clear"><a class="delete">Delete</a></div>\
        </slink>');
    });

    // Enable link sorting
    $('#shortcuts aside').sortable({items: 'slink:not(.add)'}).on('sortupdate', function(){
        console.log('done dragging!');
        showSave();
    });
    
    $('#shortcuts aside slink.add').on('click', function(){
        $(this).before('<slink>\
            <input type="text" class="name" placeholder="Name" value="Gaia Online">\
            <input type="text" class="url" placeholder="URL" value="http://www.gaiaonline.com/">\
            <div class="clear"><a class="delete">Delete</a></div>\
        </slink>');
        $('#shortcuts aside').sortable('destroy').sortable({items: 'slink:not(.add)'});
        showSave();
    });

    $('#shortcuts aside').on('click', 'slink .clear a.delete', function(){
        $(this).closest('slink').remove();
        showSave();
    });

    $('#shortcuts aside').on('focusout', 'slink input', function(){
        showSave();
    });

    // Save shortcuts
    $('page.shortcuts bar a.save').on('click', function(){
        var links = [];
        $('#shortcuts aside slink:not(.add)').each(function() {
            links.push([$(this).find('input.name').val(), $(this).find('input.url').val()]);
        });

        chrome.storage.sync.set({'header.shortcuts.list': links}, function(){
            if (typeof(chrome.runtime.lastError) == 'object') {
                console.warn('Error when setting shortcuts: ' + chrome.runtime.lastError['message']);
                
                // save to local
                if (chrome.runtime.lastError['message'] == 'QUOTA_BYTES_PER_ITEM quota exceeded') {
                    chrome.storage.local.set({'header.shortcuts.list': links}, function(){
                        console.log('shortcuts saved locally.');
                        $('page.shortcuts .localonly').show();
                        chrome.storage.sync.set({'header.shortcuts.list': {}});
                        $('bar .save', pageName).hide();
                    });
                }
            }
            else {
                console.log('shortcuts saved to sync.');
                $('page.shortcuts .localonly').hide();
                chrome.storage.local.remove('header.shortcuts.list');
                $('bar .save', pageName).hide();
            }
        });
    });
};

Settings.page.usertags = function() {
    this.init('usertags');
    var pageName = 'page.usertags';

    function showSave() {
        $('bar .save', pageName).css('display', 'inline-block');
    }

    // Insert usertags
    // if local prefs are set
    if (typeof(prefs.local['usertags.list']) == 'object' && $.isEmptyObject(prefs['usertags.list'])) {
        prefs['usertags.list'] = prefs.local['usertags.list'];
        console.warn('Your tags are currently saved locally.');
        $('.localonly', pageName).show();
    }

    $.each(prefs['usertags.list'], function(id, data) {
        $('#usertags aside').append('<usertag data-tag="' + encodeURI(JSON.stringify([id, data])) + '">\
            <div class="username">' + data[0] + '</div>\
            <div class="tag">' + data[1] + '</div>\
            <div class="url">' + data[2] + '</div>\
            <div class="createdon">' + moment(data[3]).calendar() + '</div>\
            <a class="delete">Delete</a>\
        </usertag>');
    });

    $('#usertags aside a.delete').on('click', function(){
        $(this).parent().remove();
        showSave();
    });

    // Save shortcuts
    $('page.usertags bar a.save').on('click', function(){
        var tags = {};
        $('#usertags usertag:not(.add)').each(function() {
            var tag = JSON.parse(decodeURI($(this).closest('usertag').attr('data-tag')));
            tags[tag[0]] = tag[1];
        });

        chrome.storage.sync.set({'usertags.list': tags}, function(){
            if (typeof(chrome.runtime.lastError) == 'object') {
                console.warn('Error when setting shortcuts: ' + chrome.runtime.lastError['message']);
                
                // save to local
                if (chrome.runtime.lastError['message'] == 'QUOTA_BYTES_PER_ITEM quota exceeded') {
                    chrome.storage.local.set({'usertags.list': tags}, function(){
                        console.log('tags saved locally.');
                        $('.localonly', pageName).show();
                        chrome.storage.sync.set({'usertags.list': {}});
                        $('bar .save', pageName).hide();
                    });
                }
            }
            else {
                console.log('tags saved to sync.');
                $('.localonly', pageName).hide();
                chrome.storage.local.remove('usertags.list');
                $('bar .save', pageName).hide();
            }
        });
    });
};

Settings.page.about = function() {
    this.init('about');
    var pageName = 'page.about';

    // Load change log
    $.get('../code/html/changelog.html', function(data) {
        $('.credits', pageName).after('<section class="changelog"><h4>Change log</h4><aside>' + data + '</aside></section>');
    });

    // Set sync usage
    chrome.storage.sync.getBytesInUse(function(data){
        $('page.about strong.inuse').text(data);
        $('page.about strong.outof').text(chrome.storage.sync.QUOTA_BYTES);
		$('page.about strong.pereach').text(chrome.storage.sync.QUOTA_BYTES_PER_ITEM);
    });

	// Transfer
    if (localStorage.length > 0) {
        $('page.about .transferSection .yes').show();
        $('page.about .transferSection .no').hide();
    }

	$('page.about .viewTransfer').on('click', function(){
        $('page.about').addClass('showModule');

        if (!$('#viewTransfer').hasClass('loaded')) {
            var html = '';
            for (var i=0; i < localStorage.length; i++) {
                html += '<li><strong>' + localStorage.key(i) + '</strong><p>' + localStorage.getItem(localStorage.key(i)) + '</p></li>';
            }
            $('#viewTransfer').addClass('loaded');
            $('#viewTransfer .list').html(html);
        }
    });

    $('#viewTransfer .clear .close').on('click', function(){
        $('page.about').removeClass('showModule');     
    });

	$('page.about input.agreeTransfer').on('click', function(){
        if($(this).prop('checked')) {
            $("page.about button.transfer").show();
            $(this).prop("disabled", true);
        }
	});

	$('page.about button.transfer').on('click', function(){
        Transfer.init();
        window.location.hash = '';
        window.location.reload();
    });

	// Reset
	$('page.about input.agreeReset').on('click', function(){
        if($(this).prop('checked')) {
            $("page.about button.reset").show();
            $(this).prop("disabled", true);
        }
	});

	$('page.about button.reset').on('click', function(){
        localStorage.clear();
        chrome.storage.local.clear(function(){
            chrome.storage.sync.clear(function(){
                chrome.runtime.reload();
            });
        });
    });
};

Settings.page.welcome = function() {
    $('page.selected').removeClass('selected');
    $('page.welcome').addClass('selected');
    $('header').addClass('hidden');

    if (typeof(localStorage['version']) == 'string' && prefs.local['version'] != '2014.10')
    $('page.welcome .ready').text($('page.welcome .ready').text() + ' We\'ll also transfer your current settings.');

    $('page.welcome button').on('click', function(){
        if (typeof(localStorage['version']) == 'string' && prefs.local['version'] != '2014.10') Transfer.init();
        chrome.storage.local.set({'welcome': true}, function(){
            console.log('welcome set locally.');
            window.location.reload();
        });
    });
};

Settings.load = function() {    
    // Save a default
    prefs.default = JSON.parse(JSON.stringify(prefs));
    prefs.local = {};

    // Get settings
    chrome.storage.local.get(null, function(responseLocal) {
        // save locals
        prefs.local = JSON.parse(JSON.stringify(responseLocal));

        chrome.storage.sync.get(null, function(responseSync) {
            // parse syncs
            for (var key in responseSync) {
                try {prefs[key] = responseSync[key];}
                catch(e) {console.warn('Missing pref \'' + e + '\'.');}
            }

            try {Settings.init();}
            catch(e) {debugBro(e);}
        });
    });
};

Settings.init = function() {
    // Show welcome screen if new
    if (typeof prefs.local['welcome'] == 'undefined') Settings.page.welcome();

    // Set up pages
    $('header menu').on('click', 'a:not(.current)', function(){
        var pageName = $(this).attr('page-name');
        $('#pages page.selected').removeClass('selected');
        $('#pages page.' + pageName).addClass('selected');

        if (!$(this).hasClass('init')) {
            try {Settings.page[pageName]();}
            catch(e) {debugBro(e);}

            $(this).addClass('init');
        }
        $('header menu a.current').removeClass('current');
        $(this).addClass('current');

        if (pageName == 'about')
        chrome.storage.sync.getBytesInUse(function(data){
            $('page.about strong.inuse').text(data);
        });
	});

    if (window.location.hash) $('header menu a[href="' + window.location.hash + '"]').click();
    else {
        try {Settings.page.home();}
        catch(e) {debugBro(e);}
    }

    $(window).on('hashchange', function() {
        if (window.location.hash === '') $('header menu a[href="#"]').click();
        else $('header menu a[href="' + window.location.hash + '"]').click();
    });
};

// Debug message
function debugBro(error) {
    window.prompt('There\'s a problem, bro. \nCan you pass this message over to our thread?', 
                  'Runtime message: ' + error + ' Name: ' + error.name + ' Stack: ' + error.stack + ' Message: ' + error.message);
}

// Run
try {Settings.load();}
catch(e) {debugBro(e);}