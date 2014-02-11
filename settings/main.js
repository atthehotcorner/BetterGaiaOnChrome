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


    // Enable format sorting
    function formatSorting() {
        $('#postformating aside').sortable({items: 'format:not(.add)'}).on('sortupdate', function(){
            //Triggered when the user stopped sorting and the DOM position has changed.
            console.log('done dragging!');
        });
    }

    // Insert formats
    $.each(prefs['format.list'], function(key, format) {
        $('#postformating aside format.add').before('<format data-bbcode="' + format[0] + '" data-poststyle="' + format[1] + '"><strong>' + key + '</strong>\
        <div class="clear"><a class="edit">Edit</a><a class="delete">Delete</a></div></format>');
    });
    formatSorting();
    
    $('#postformating aside format.add').on('click', function(){
        var bbcode = "%5Bcolor=#003040%5D%E2%96%8C%5B/color%5D%5Bb%5D%5Bsize=11%5D%5Bcolor=#777%5DA%20SHIP%20IS%20SAFE%20IN%20HARBOR,%5B/color%5D%5B/size%5D%5B/b%5D%0A%5Bcolor=#276B91%5D%E2%96%8C%5B/color%5D%5Bb%5D%5Bsize=11%5D%5Bcolor=#777%5DBUT%20THAT'S%20NOT%20WHAT%20SHIPS%20ARE%20FOR.%5B/color%5D%5B/size%5D%5B/b%5D%0A%0A%0A%0A%5Balign=right%5D%5Bb%5DWelcome%20to%20%5Burl=http://bettergaia.com/%5DBetterGaia%5B/url%5D.%5B/b%5D%0A%5Bi%5DNeed%20help?%20%5Burl=http://www.gaiaonline.com/forum/t.45053993/%5DSee%20our%20thread.%5B/url%5D%5B/i%5D%5B/align%5D";
        $(this).before('<format data-bbcode="' + bbcode + '" data-poststyle="0" draggable="true"><strong>Human</strong>\
        <div class="clear"><a class="edit">Edit</a><a class="delete">Delete</a></div></format>');

        $('#postformating aside').sortable('destroy').sortable({items: 'format:not(.add)'});
    });

    // Insert shortcuts
    $.each(prefs['header.shortcuts.list'], function(name, url) {
        $('#shortcuts aside slink.add').before('<slink>' + name + ': ' + url + '</slink>');
    });
    
    $('#shortcuts aside slink.add').on('click', function(){
        $(this).before('<slink>Kat</slink>');
    });

    // Set sync usage
    chrome.storage.sync.getBytesInUse(function(data){
        $('page.about strong.inuse').text(data);
        $('page.about strong.outof').text(chrome.storage.sync.QUOTA_BYTES);
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
var defaultPrefs = prefs;

// Get synced settings
chrome.storage.sync.get(null, function(response) {
    for (var key in response) {
        try {prefs[key] = response[key];}
        catch(e) {console.warn('BetterGaia: Missing pref \'' + e + '\'.')}
    }
    Main();
});