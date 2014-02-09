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
    $.each(prefs['format.list'], function(key, format) {
        $('#postformating aside format.add').before('<format>' + key + '</format>');
    });
    
    $('#postformating aside format.add').on('click', function(){
        $(this).before('<format>Kat</format>');
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