// Background JS Copyright (c) BetterGaia
// Unauthorized copying, sharing, adaptation, publishing, commercial usage, and/or distribution, its derivatives and/or successors, via any medium, is strictly prohibited.
/*global chrome: false, console: false, Handlebars: false, prefs: false, require: false*/
/*jshint browser: true, jquery: true, moz: true, multistr: true, sub: true*/

// Check if install, update
chrome.runtime.onInstalled.addListener(function(details) {
    chrome.storage.local.set({version: chrome.runtime.getManifest().version});
});

// Send data to scripts
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.elements == 'settings') {
        var optionsUrl = chrome.runtime.getURL('data/settings/main.html');
        chrome.tabs.query({url: optionsUrl}, function(tabs) {
            if (tabs.length) chrome.tabs.update(tabs[0].id, {active: true});
            else chrome.tabs.create({url: optionsUrl});
        });
    }
});

// On start
chrome.runtime.onStartup.addListener(function() {
    // Create alarm for user notifications
    chrome.storage.local.get(['notifications'], function(data) {
        if (typeof(data['notifications']) == 'undefined') data['notifications'] = '60';
        if (parseInt(data['notifications']) > 0) chrome.alarms.create('gaia-notifications', {when: 0, periodInMinutes: parseInt(data['notifications'])});
    });
});

// Fire alarm
chrome.alarms.onAlarm.addListener(function(alarm) {
	if (alarm.name == 'gaia-notifications') {
		$.get('http://gaiaonline.com/supportal/header', function(data) {
			var r = $('<div/>').html(data);

            chrome.storage.local.get(['notifications.ignoreAnnouncements'], function(storage) {
                var ignoreAnnouncements = false;
                if (typeof(storage['notifications.ignoreAnnouncements']) != 'undefined') ignoreAnnouncements = true;
                
                if (r.find('#notifyBubbleContainer').length == 1) {
                    var text = [], userimg = '';

                    if (ignoreAnnouncements && r.find('#notifyItemList > li').length == 1 && r.find('#notifyItemList > li.notify_announcements').length == 1) return;

                    r.find('#notifyBubbleContainer #notifyItemList li a').each(function(index) {
                        var count = $(this).text().replace(/(^\d+)(.+$)/i,'$1');
                        text.push({title: count, message: $(this).text().substring(count.length + 1)});
                    });

                    if (typeof r.find('#gaia_header .header_content .imgAvatar a img').attr('src') === 'string') {
                        userimg = r.find('#gaia_header .header_content .imgAvatar a img').attr('src');
                    }
                    else if (typeof r.find('#gaia_header #animated_item object object img').attr('src') === 'string') {
                        userimg = r.find('#gaia_header #animated_item object object img').attr('src');
                    }

                    if (text.length > 0) {
                        chrome.notifications.create('gaia-notify', {
                            type: 'list',
                            iconUrl: userimg,
                            title: 'Hey ' + r.find('#gaia_header .avatarName span').text().slice(0,-1) + ', you got...',
                            message: '',
                            items: text,
                            buttons: [{title: 'Go to Gaia'}, {title: 'Hide these notifications for now'}],
                            priority: 1
                        }, function() {});
                    }
                }
                else {
                    chrome.notifications.clear('gaia-notify', function(){});
                }
            });
		}, 'html');
	}
});

chrome.notifications.onButtonClicked.addListener(function(notificationId, buttonIndex) {
	if (notificationId == 'gaia-notify') {
		if (buttonIndex === 0) {
			chrome.tabs.create({url: 'http://gaiaonline.com/'});
			chrome.notifications.clear('gaia-notify', function(){});
		}
		else if (buttonIndex == 1) {
			chrome.alarms.clear('gaia-notifications');
			chrome.notifications.clear('gaia-notify', function(){});
		}
	}
});
