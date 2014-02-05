/*
Settings JS 
Copyright (c) BetterGaia and Bowafishtech
Unauthorized copying, sharing, adaptation, publishing, commercial usage, and/or distribution, its derivatives and/or successors, via any medium, is strictly prohibited.
*/

function Main() {
    // Set up pages
    $('header menu').on('click', 'a:not(.current)', function(){
        var tabClass = $(this).attr('class');
        $('#pages .page.selected').removeClass('selected');
        $('#pages .page.' + tabClass).addClass('selected');

        $('header menu a.current').removeClass('current');
        $(this).addClass('current');
		});

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
};

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