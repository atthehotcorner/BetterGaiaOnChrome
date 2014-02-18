/*
Settings JS 
Copyright (c) BetterGaia and Bowafishtech
Unauthorized copying, sharing, adaptation, publishing, commercial usage, and/or distribution, its derivatives and/or successors, via any medium, is strictly prohibited.

I know this isn't modular, but its the 1st edition :p
*/

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
                'header.nav': '#preview .navigation',
                'header.nav.hover': '#preview .navigation .hover',
                'header.nav.current': '#preview .navigation .current',
                'forum.threadHeader': '#preview2 .thread_header .linklist',
                'forum.postHeader': '#preview2 .post .username'
            };
            if (dict[pref]) $(dict[pref]).css({'background-color': $('input[pref="' + pref + '"]').val()});
        },
        colors: function(pref, value) {
            if (defaultPrefs[pref] == value) chrome.storage.sync.remove(pref, function(){console.log(pref + ' removed.');});
            else {
                var send = {};
                send[pref] = value;
                chrome.storage.sync.set(send, function(){console.log(pref + ' saved.');});
            }
            this.color(pref);
        }
    }
};

function Main() {
    // Set up pages
    $('header menu').on('click', 'a:not(.current)', function(){
        var tabClass = $(this).attr('class');
        $('#pages page.selected').removeClass('selected');
        $('#pages page.' + tabClass).addClass('selected');

        $('header menu a.current').removeClass('current');
        $(this).addClass('current');

        if (tabClass == 'about')
        chrome.storage.sync.getBytesInUse(function(data){
            $('page.about strong.inuse').text(data);
        });
		});

    if (window.location.hash) $('header menu a[href="' + window.location.hash + '"]').click();

    // Set checkboxes
    $('input[type="checkbox"][pref]').each(function(){
        var pref = $(this).attr('pref');
        if (typeof(prefs[pref]) != 'undefined') $(this).prop('checked', prefs[pref]);
        else $(this).prop('disabled', true);
    });

    // Set selects
    $('select[pref]').each(function(){
        var pref = $(this).attr('pref');
        if (typeof(prefs[pref]) != 'undefined') $(this).val(prefs[pref]);
        else $(this).prop('disabled', true);
    });

    // set colors
    $('input[pref].color').each(function(){
        var pref = $(this).attr('pref');
        if (typeof(prefs[pref]) != 'undefined') $(this).val(prefs[pref]);
        else $(this).prop('disabled', true);
        Preview.set.color(pref);
    });

    // Set bar links
    $('bar a[pref]').each(function(){
        var pref = $(this).attr('pref');
        if (typeof(prefs[pref]) != 'undefined') $(this).attr('value', prefs[pref]);
        if ($(this).attr('value') == 'false') $(this).closest('page').addClass('off');
        else $(this).closest('page').removeClass('off');
    });

    // Insert formats
	
    // if local prefs are set
    if (typeof(localPrefs['format.list']) == 'object' && $.isEmptyObject(prefs['format.list'])) {
        prefs['format.list'] = localPrefs['format.list'];
        console.warn('Your formats are currently saved locally.');
        $('page.postformatting .localonly').show();
    }
	
    $.each(prefs['format.list'], function(index, format) {
        $('#postformating aside format.add').before('<format data-bbcode="' + format[1] + '" data-poststyle="' + format[2] + '"><strong>' + format[0] + '</strong>\
        <div class="clear"><a class="edit">Edit</a><a class="delete">Delete</a></div></format>');
    });

	// -- Add backgrounds
	$.ajax({
		type: 'GET',
		url: 'data/backgrounds.json',
		dataType: 'text json',
		cache: false,
		async: false
	})
	.done(function(data){
		$.each(data['Backgrounds'], function(index, url) {
            if (url == 'default') $('#background a.customurl').before('<a data-url="' + url + '"></a>');
            else $('#background a.customurl').before('<a data-url="' + url + '" style="background-image: url(' + url + ');"></a>');
        });
    })
	.fail(function(data){
		console.warn('Couldn\'t insert background options.');
    });
   
    var bgurl = prefs['background.image'];
    if ($('#background a[data-url="' + bgurl + '"]').length > 0) $('#background a[data-url="' + bgurl + '"]').addClass('selected');
    else {
        $('#background a.customurl').attr('data-url', bgurl).addClass('selected').css({'background-image': 'url(' + bgurl + ')'});
    }
    
    Preview.set.background(bgurl);
	// END backgrounds

	// -- Add headers
	$.ajax({
		type: 'GET',
		url: 'data/headers.json',
		dataType: 'text json',
		cache: false,
		async: false
	})
	.done(function(data){
        // get host prefix
        var host = data['info']['host'];
        delete data['info'];

        // add header options to page
        $.each(data, function(key, headers){
            // Add title
            $('#header aside').prepend('<div class="h' + key + '"><h4>' + key + '</h4></div>');

            // Add headers
            $.each(headers, function(name, url) {
                // check if url needs prefix
                if (url[0] != 'default' && url[0].substring(0,7) != 'http://' && url[0].substring(0,19) != 'chrome-extension://') url[0] = host + url[0];
                if (url[1] != 'default' && url[1].substring(0,7) != 'http://' && url[1].substring(0,19) != 'chrome-extension://') url[1] = host + url[1];

                if (url[0] == 'default') $('#header .h' + key).append('<a data-name="' + name + '" data-url="' + url[0] + '" data-base-url="' + url[1] + '"></a>');
                else $('#header .h' + key).append('<a data-name="' + name + '" data-url="' + url[0] + '" data-base-url="' + url[1] + '" style="background-image: url(' + url[0] + ');"></a>');
            });
        });
    })
	.fail(function(data){
		console.warn('Couldn\'t insert header options.');
    });

    var value = [prefs['header.background'], prefs['header.background.base']];
    if ($('#header a[data-url="' + value[0] + '"][data-base-url="' + value[1] + '"]').length > 0) $('#header a[data-url="' + value[0] + '"][data-base-url="' + value[1] + '"]').addClass('selected');
    else if (value[0] == 'default') $('#header a.customurl').attr({'data-url': value[0], 'data-base-url': value[1]}).addClass('selected');
    else $('#header a.customurl').attr({'data-url': value[0], 'data-base-url': value[1]}).addClass('selected').css({'background-image': 'url(' + value[0] + ')'});
    
    Preview.set.header(value[0], value[1]);
	// -- END headers

   	// -- Add logos
    var logourl = prefs['header.logo'];
    if ($('#logo a[data-url="' + logourl + '"]').length > 0) $('#logo a[data-url="' + logourl + '"]').addClass('selected');
    else $('#logo a.customurl').attr('data-url', logourl).addClass('selected');
    Preview.set.logo(logourl);
    
    $('#logo a[data-url]:not([data-url="default"])').each(function(){
        $(this).css({'background-image': 'url(' + $(this).attr('data-url') + ')'});
    });
    // END logos 

    // Enable format sorting
    $('#postformating aside').sortable({items: 'format:not(.add)'}).on('sortupdate', function(){
        //Triggered when the user stopped sorting and the DOM position has changed.
        console.log('done dragging!');
    });
    
    $('#postformating aside format.add').on('click', function(){
        var bbcode = "%5Bcolor=#003040%5D%E2%96%8C%5B/color%5D%5Bb%5D%5Bsize=11%5D%5Bcolor=#777%5DA%20SHIP%20IS%20SAFE%20IN%20HARBOR,%5B/color%5D%5B/size%5D%5B/b%5D%0A%5Bcolor=#276B91%5D%E2%96%8C%5B/color%5D%5Bb%5D%5Bsize=11%5D%5Bcolor=#777%5DBUT%20THAT'S%20NOT%20WHAT%20SHIPS%20ARE%20FOR.%5B/color%5D%5B/size%5D%5B/b%5D%0A%0A%0A%0A%5Balign=right%5D%5Bb%5DWelcome%20to%20%5Burl=http://bettergaia.com/%5DBetterGaia%5B/url%5D.%5B/b%5D%0A%5Bi%5DNeed%20help?%20%5Burl=http://www.gaiaonline.com/forum/t.45053993/%5DSee%20our%20thread.%5B/url%5D%5B/i%5D%5B/align%5D",
		name = ['Almost', 'Human', 'Grumpy Cat', 'Business Cat', 'Doge', 'Sophisticated Cat'];

        $(this).before('<format data-bbcode="' + bbcode + '" data-poststyle="0" draggable="true"><strong>' + name[Math.floor(Math.random() * name.length)] + '</strong>\
        <div class="clear"><a class="edit">Edit</a><a class="delete">Delete</a></div></format>');

        // re-enable sorting
        $('#postformating aside').sortable('destroy').sortable({items: 'format:not(.add)'});
    });

    $('#postformating aside').on('click', 'format .clear a.edit', function(){
        var format = $(this).closest('format');
        $('#editformat h3 input').val(format.find('strong').text());
        $('#editformat textarea').val(decodeURI(format.attr('data-bbcode')));
        $('#editformat select').val(format.attr('data-poststyle'));
        
        $(this).closest('format').addClass('editing');
        $('page.postformatting').addClass('editing');
    });

    $('#editformat .clear .done').on('click', function(){
        $('#postformating format.editing strong').text($('#editformat h3 input').val());
        $('#postformating format.editing').attr({
            'data-bbcode': encodeURI($('#editformat textarea').val()), 
            'data-poststyle': $('#editformat select').val()
        });

        $('page.postformatting.editing, #postformatting format.editing').removeClass('editing');    
    });

    $('#editformat .clear .cancel').on('click', function(){
        $('page.postformatting.editing, #postformatting format.editing').removeClass('editing');       
    });

    $('#postformating aside').on('click', 'format .clear a.delete', function(){
        $(this).closest('format').remove();
    });
    
    // Insert shortcuts

    // if local prefs are set
    if (typeof(localPrefs['header.shortcuts.list']) == 'object' && $.isEmptyObject(prefs['header.shortcuts.list'])) {
        prefs['header.shortcuts.list'] = localPrefs['header.shortcuts.list'];
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
        //Triggered when the user stopped sorting and the DOM position has changed.
        console.log('done dragging!');
    });
    
    $('#shortcuts aside slink.add').on('click', function(){
        $(this).before('<slink>\
            <input type="text" class="name" placeholder="Name" value="Gaia Online">\
            <input type="text" class="url" placeholder="URL" value="http://www.gaiaonline.com/">\
            <div class="clear"><a class="delete">Delete</a></div>\
        </slink>');
        $('#shortcuts aside').sortable('destroy').sortable({items: 'slink:not(.add)'});
    });

    $('#shortcuts aside').on('click', 'slink .clear a.delete', function(){
        $(this).closest('slink').remove();
    });

    // Insert usertags
    $.each(prefs['usertags.list'], function(id, data) {
        $('#usertags aside').append('<usertag data-id="' + id + '">\
            <div class="username">' + data[0] + '</div>\
            <div class="tag">' + data[1] + '</div>\
            <div class="url">' + data[2] + '</div>\
            <div class="createdon">' + moment(data[3]).calendar() + '</div>\
            <a class="delete">Delete</a>\
        </usertag>');
    });

    $('#usertags aside a.delete').on('click', function(){
        var id = $(this).closest('usertag').attr('data-id');
        chrome.storage.sync.get('usertags.list', function(data){
            delete data['usertags.list'][id];
            chrome.storage.sync.set({'usertags.list': data['usertags.list']}, function(){
                $('#usertags usertag[data-id="' + id + '"]').remove();
            });
        });
    });

    // Set sync usage
    chrome.storage.sync.getBytesInUse(function(data){
        $('page.about strong.inuse').text(data);
        $('page.about strong.outof').text(chrome.storage.sync.QUOTA_BYTES);
		$('page.about strong.pereach').text(chrome.storage.sync.QUOTA_BYTES_PER_ITEM);
    });

    // Enable Saving
    Save();
};

function Save() {
    // Update checkboxes
    $('input[type="checkbox"][pref]:not([disabled])').on('change', function(){
        var pref = $(this).attr('pref'), value = $(this).prop('checked');
        if (defaultPrefs[pref] == value) chrome.storage.sync.remove(pref, function(){console.log(pref + ' removed.');});
        else {
            var send = {};
            send[pref] = value;
            chrome.storage.sync.set(send, function(){console.log(pref + ' saved.');});
        }
    });

    // Update selects
    $('select[pref]:not([disabled])').on('change', function(){
        var pref = $(this).attr('pref'), value = $(this).val();
        if (defaultPrefs[pref] == value) chrome.storage.sync.remove(pref, function(){console.log(pref + ' removed.');});
        else {
            var send = {};
            send[pref] = value;
            chrome.storage.sync.set(send, function(){console.log(pref + ' saved.');});
        }
    });

    // save background
    $('#background aside.left').on('click.default', 'a[data-url]:not(.selected)', function(){
        var pref = 'background.image', value = $(this).attr('data-url');
        if (defaultPrefs[pref] == value) chrome.storage.sync.remove(pref, function(){console.log(pref + ' removed.');});
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
        if (defaultPrefs[pref[0]] == value[0]) chrome.storage.sync.remove(pref[0], function(){console.log(pref[0] + ' removed.');});
        else {
            var send = {};
            send[pref[0]] = value[0];
            chrome.storage.sync.set(send, function(){console.log(pref[0] + ' saved.');});
        }
        
        if (defaultPrefs[pref[1]] == value[1]) chrome.storage.sync.remove(pref[1], function(){console.log(pref[1] + ' removed.');});
        else {
            var send = {};
            send[pref[1]] = value[1];
            chrome.storage.sync.set(send, function(){console.log(pref[1] + ' saved.');});
        }

        $('#header aside a[data-url].selected').removeClass('selected');
        $(this).addClass('selected');
        Preview.set.header(value[0], value[1]);
    });    

    // save logo
    $('#logo').on('click.default', 'a[data-url]:not(.selected)', function(){
        var pref = 'header.logo', value = $(this).attr('data-url');
        if (defaultPrefs[pref] == value) chrome.storage.sync.remove(pref, function(){console.log(pref + ' removed.');});
        else {
            var send = {};
            send[pref] = value;
            chrome.storage.sync.set(send, function(){console.log(pref + ' saved.');});
        }

        $('#logo a[data-url].selected').removeClass('selected');
        $(this).addClass('selected');
        Preview.set.logo(value);
    });

    // Save formats
    $('page.postformatting bar a.save').on('click', function(){
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
                        $('page.postformatting .localonly').show();
                        chrome.storage.sync.set({'format.list': {}});
                    });
                }
            }
            else {
                console.log('formats saved to sync.');
                $('page.postformatting .localonly').hide();
                chrome.storage.local.remove('format.list');
            }
        });
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
                    });
                }
            }
            else {
                console.log('shortcuts saved to sync.');
                $('page.shortcuts .localonly').hide();
                chrome.storage.local.remove('header.shortcuts.list');
            }
        });
    });

		// Update bar links
		$('bar a[pref]').on('click', function(){
        $(this).attr('value', ($(this).attr('value') == 'true')? false:true);
        var pref = $(this).attr('pref'), value = ($(this).attr('value') == 'true')? true:false;
        if (defaultPrefs[pref] == value) chrome.storage.sync.remove(pref, function(){console.log(pref + ' removed.');});
        else {
            var send = {};
            send[pref] = value;
            chrome.storage.sync.set(send, function(){console.log(pref + ' saved.');});
        }
        if ($(this).attr('value') == 'false') $(this).closest('page').addClass('off');
        else $(this).closest('page').removeClass('off');
		});
    
        // enable asks
        $('a.customurl').on('click', function(){
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

        $('.ask h3 .close').on('click', function(){
			$(this).closest('aside').removeClass('editing');
		});

		$('.ask button').on('click', function(){
            var customurl = $(this).closest('aside').find('a.customurl');

            // Update Value
            if ($.trim($(this).siblings('input.url').val()) != '') {
                if ($(this).siblings('input.baseurl').length > 0) customurl.attr('data-base-url', $(this).siblings('input.baseurl').val());
                customurl.attr('data-url', $(this).siblings('input.url').val()).removeClass('selected').trigger('click.default');
            }
				
            // Close Ask
            $(this).closest('aside').removeClass('editing');
		});
    
        // enable colorpickers
        $('input[pref].color').minicolors({
            change: function(hex, opacity) {Preview.set.colors($(this).attr('pref'), hex);},
            changeDelay: 200,
            letterCase: 'uppercase',
            position: 'top left'
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
}

$(window).scroll(function() {
    $('#preview > div').width($('page.styling').width() / 0.65).toggleClass('scrolling', $(window).scrollTop() > $('#preview').offset().top);
});

// Save a default
var defaultPrefs = prefs,
localPrefs = {};

// Get settings
chrome.storage.sync.get(null, function(response) {
	chrome.storage.local.get(null, function(response2) {
		localPrefs = response2;
		for (var key in response) {
			try {prefs[key] = response[key];}
			catch(e) {console.warn('BetterGaia: Missing pref \'' + e + '\'.')}
		}
		Main();
	});
});