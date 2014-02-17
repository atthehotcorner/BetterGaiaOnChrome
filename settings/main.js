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
        $('page.postformatting .localonly').show();
    }
	
    $.each(prefs['format.list'], function(index, format) {
        $('#postformating aside format.add').before('<format data-bbcode="' + format[1] + '" data-poststyle="' + format[2] + '"><strong>' + format[0] + '</strong>\
        <div class="clear"><a class="edit">Edit</a><a class="delete">Delete</a></div></format>');
    });

		// -- Add backgrounds
		$.ajax({type: 'GET', url: 'data/backgrounds.json', dataType: 'json', async: false}).done(function(data){
        console.log('cat')
        // add backgrounds to page
				$.each(data['Backgrounds'], function(index, url) {
            if (url == 'default') $('#background a.customurl').before('<a value="' + url + '"></a>');
            else $('#background a.customurl').before('<a value="' + url + '" style="background-image: url(' + url + ');"></a>');
        });
    });
    
    var bgurl = prefs['background.image'];
    if ($('#background a[value="' + bgurl + '"]').length > 0) $('#background a[value="' + bgurl + '"]').addClass('selected');
    else {
        $('#background a.customurl').attr('value', bgurl).addClass('selected').css({'background-image': 'url(' + bgurl + ')'});
        
    }
		// END backgrounds

   	// -- Add logos
    var logourl = prefs['header.logo'];
    if ($('#logo a[value="' + logourl + '"]').length > 0) $('#logo a[value="' + logourl + '"]').addClass('selected');
    else $('#logo a.customurl').attr('value', logourl).addClass('selected');

		$('#logo a[value]:not([value="default"])').each(function(){
        $(this).css({'background-image': 'url(' + $(this).attr('value') + ')'});
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