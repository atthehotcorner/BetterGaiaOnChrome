/*
Settings JS 
Copyright (c) BetterGaia and Bowafishtech
Unauthorized copying, sharing, adaptation, publishing, commercial usage, and/or distribution, its derivatives and/or successors, via any medium, is strictly prohibited.
*/

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
    }
	
    $.each(prefs['format.list'], function(index, format) {
        $('#postformating aside format.add').before('<format data-bbcode="' + format[1] + '" data-poststyle="' + format[2] + '"><strong>' + format[0] + '</strong>\
        <div class="clear"><a class="edit">Edit</a><a class="delete">Delete</a></div></format>');
    });

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

        $('#postformating aside').sortable('destroy').sortable({items: 'format:not(.add)'});
    });

    $('#postformating aside').on('click', 'format .clear a.delete', function(){
        $(this).closest('format').remove();
    });

    // Insert shortcuts
    $.each(prefs['header.shortcuts.list'], function(name, url) {
        $('#shortcuts aside slink.add').before('<slink><strong data-url="' + url + '">' + name + '</strong>\
        <div class="clear"><a class="edit">Edit</a><a class="delete">Delete</a></div></slink>');
    });

    // Enable link sorting
    $('#shortcuts aside').sortable({items: 'slink:not(.add)'}).on('sortupdate', function(){
        //Triggered when the user stopped sorting and the DOM position has changed.
        console.log('done dragging!');
    });
    
    $('#shortcuts aside slink.add').on('click', function(){
        $(this).before('<slink><strong data-url="http://www.gaiaonline.com/">Gaia Online</strong>\
        <div class="clear"><a class="edit">Edit</a><a class="delete">Delete</a></div></slink>');

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

    // Save formats
    function saveFormat() {
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
                        chrome.storage.sync.set({'format.list': {}});
                    });
                }
            }
            else {
                console.log('formats saved to sync.');
                chrome.storage.local.remove('format.list');
            }
        });
    }

    // save bar for formats
    $('page.postformatting bar a.save').on('click', function(){
        saveFormat();
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