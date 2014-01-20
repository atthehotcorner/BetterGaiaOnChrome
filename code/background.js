// BetterGaia by bowafishtech
// becoming faster, light and cleaner since summer 2013

// Check if install, update
chrome.runtime.onInstalled.addListener(function(details) {
});

// Send data to scripts
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.elements == "post formatter") {chrome.tabs.executeScript(sender.tab.id, {file: "code/postformatter.js"});}
	else if (request.elements == "options page") {
		var optionsUrl = chrome.runtime.getURL('options/options.html');

		chrome.tabs.query({url: optionsUrl}, function(tabs) {
			if (tabs.length) {chrome.tabs.update(tabs[0].id, {active: true});}
			else {chrome.tabs.create({url: optionsUrl});}
		});	
	}
	else if (request.elements == "reset") {setPrefs(); sendResponse({"reset": true});}
});

chrome.runtime.onConnect.addListener(function(port) {
	console.assert(port.name == 'bettergaia');
	port.onMessage.addListener(function(msg) {
		if (msg.request == 'usertag') {
			var stored = false;
			var usertags = localStorage["usertags"].split("ITSurHRTnSOL");

			// not empty
			if (usertags.length >= 1 && usertags[0] != "") {
				for (var i=0; i < usertags.length; ++i) {
					usertags[i] = JSON.parse(usertags[i]);

					// check if user already in store and replace
					if (usertags[i].userid == msg.tag.userid) {
						usertags[i] = msg.tag;
						stored = true;
					}					
				}
			}
			// add to end otherwise
			if (stored == false) {
				if (usertags[0] == "") usertags[0] = msg.tag;
				else usertags.push(msg.tag);
				stored = true;
			}

			// save to localstorage
			if (stored == true) {
				var stringifiedUserTags = "";
				for (var i=0; i < usertags.length; ++i) stringifiedUserTags += JSON.stringify(usertags[i]) + "ITSurHRTnSOL";
				if (stringifiedUserTags.slice(-12) == "ITSurHRTnSOL") stringifiedUserTags = stringifiedUserTags.slice(0,-12);
				
				// save
				localStorage["usertags"] = stringifiedUserTags;
				port.postMessage({result: 'success'});
			}
			else port.postMessage({result: 'fail'});
		}
  });
});

// On start
chrome.runtime.onStartup.addListener(function() {
	// Create alarms
	if (JSON.parse(localStorage["main.features.notifications"]) == true) {
		chrome.alarms.create('gaia-notifications', {
			when: 0,
			periodInMinutes: parseInt(localStorage["main.features.notifications.time"], 10)
		});
	}
});

// Fire alarm
chrome.alarms.onAlarm.addListener(function(alarm) {
	if (alarm.name == 'gaia-notifications') {	
		$.get('http://gaiaonline.com/supportal/header', function(data) {
			var r = $("<div/>").html(data);

			if (r.find('#notifyBubbleContainer').length == 1) {
				var text = [], userimg = '';
				
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
						title: 'Hey ' + r.find('#gaia_header .header_content .userName ul.hud-item-list li.avatarName span').text().slice(0,-1) + ', you got...',
						message: '',
						items: text,
						buttons: [{title: 'Open Gaia', iconUrl: 'images/icons/mailbox.png'}, {title: 'Hide these notifications for now', iconUrl: 'images/icons/clock.png'}],
						priority: 1
					}, function() {}); 
				}			
			}
		}, 'html');
	}
});

chrome.notifications.onButtonClicked.addListener(function(notificationId, buttonIndex) {
	if (notificationId == 'gaia-notify') {
		if (buttonIndex == 0) {
			chrome.tabs.create({url: 'http://gaiaonline.com/'});
			chrome.notifications.clear('gaia-notify', function(){});
		}
		else if (buttonIndex == 1) {
			chrome.alarms.clear('gaia-notifications');
			chrome.notifications.clear('gaia-notify', function(){});
		}
	}
});