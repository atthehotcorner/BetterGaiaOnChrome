// BetterGaia by bowafishtech
// becoming faster, light and cleaner since summer 2013

// Check if install, update
chrome.runtime.onInstalled.addListener(function(details) {	
	// Set preferences
	setPrefs();
	chrome.storage.local.set({css: ''});
});

// Send data to scripts
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.elements == "storage") {sendResponse({"storage": localStorage});}
	else if (request.elements == "post formatter") {chrome.tabs.executeScript(sender.tab.id, {file: "code/postformatter.js"});}
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

function setPrefs() {
	// Set Prefs
	localStorage['version'] = chrome.runtime.getManifest().version;
	if (!localStorage["lastUpdate"]) localStorage["lastUpdate"] = Date.now();
	if (!localStorage["instantUpdate"]) localStorage["instantUpdate"] = true;
	if (!localStorage["sync"]) localStorage["sync"] = true;
	
		// Features
		if (!localStorage["main.features.drawAll"]) localStorage["main.features.drawAll"] = true;
		if (!localStorage["main.features.avatarStats"]) localStorage["main.features.avatarStats"] = true;
		if (!localStorage["main.features.suggestedContent"]) localStorage["main.features.suggestedContent"] = true;
		if (!localStorage["main.features.centerPage"]) localStorage["main.features.centerPage"] = true;
		if (!localStorage["main.features.hideAds"]) localStorage["main.features.hideAds"] = true;
		if (!localStorage["main.features.messages"]) localStorage["main.features.messages"] = true;
		if (!localStorage["main.features.notifications"]) localStorage["main.features.notifications"] = true;
		if (!localStorage["main.features.notifications.time"]) localStorage["main.features.notifications.time"] = 25;
	
		// Header and Nav
		if (!localStorage["main.handn.header.overflow"]) localStorage["main.handn.header.overflow"] = true;
		if (!localStorage["main.handn.header.getGaiaCash"]) localStorage["main.handn.header.getGaiaCash"] = true;
	
		if (!localStorage["main.handn.bar.float"]) localStorage["main.handn.bar.float"] = true;
		if (!localStorage["main.handn.bar.showWelcome"]) localStorage["main.handn.bar.showWelcome"] = false;
		if (!localStorage["main.handn.bar.links"]) localStorage["main.handn.bar.links"] = true;
		
		// Forums
		if (!localStorage["main.forums.size"]) localStorage["main.forums.size"] = true;
		if (!localStorage["main.forums.pollDropDown"]) localStorage["main.forums.pollDropDown"] = false;
		if (!localStorage["main.forums.quoteAbovePost"]) localStorage["main.forums.quoteAbovePost"] = false;
		if (!localStorage["main.forums.whiteBgAvis"]) localStorage["main.forums.whiteBgAvis"] = false;
		if (!localStorage["main.forums.postTipping"]) localStorage["main.forums.postTipping"] = false;
		if (!localStorage["main.forums.postOffWhite"]) localStorage["main.forums.postOffWhite"] = false;
		if (!localStorage["main.forums.externalLinks"]) localStorage["main.forums.externalLinks"] = true;
		if (!localStorage["main.forums.previewThreads"]) localStorage["main.forums.previewThreads"] = true;
		
	// Style
	if (!localStorage["style.background"]) localStorage["style.background"] = "chrome-extension://lmgjagdflhhfjflolfalapokbplfldna/images/background/legacy.jpg";
		if (!localStorage["style.background.color"]) localStorage["style.background.color"] = "666666";
		if (!localStorage["style.background.position"]) localStorage["style.background.position"] = "top left";
		if (!localStorage["style.background.repeat"]) localStorage["style.background.repeat"] = true;
		if (!localStorage["style.other.background.float"]) localStorage["style.other.background.float"] = false;
	
	if (!localStorage["style.header"]) localStorage["style.header"] = "http://s.cdn.gaiaonline.com/images/gaia_global/gaia_header/new_header/il_header_bg_barton_sprite.jpg, http://s.cdn.gaiaonline.com/images/gaia_global/gaia_header/new_header/rs_header_bg_barton_tile_sprite.jpg";
	if (!localStorage["style.logo"]) localStorage["style.logo"] = "http://s.cdn.gaiaonline.com/images/gaia_global/gaia_header/br_gaia_logo_header.png";
		
		// Nav
		if (!localStorage["style.nav"]) localStorage["style.nav"] = "7EACC5";
		if (!localStorage["style.nav.hover"]) localStorage["style.nav.hover"] = "396C7C";
		if (!localStorage["style.nav.current"]) localStorage["style.nav.current"] = "93F2FF";
	
		// Forums
		if (!localStorage["style.forums.threadHeader"]) localStorage["style.forums.threadHeader"] = "BF7F40";
		if (!localStorage["style.forums.postHeader"]) localStorage["style.forums.postHeader"] = "92B1CA";
	
		// Disable
		if (!localStorage["style.other.hide.footer"]) localStorage["style.other.hide.footer"] = false;
	
	// Posts
	if (!localStorage["posts.formatter.formats"]) localStorage["posts.formatter.formats"] = '{"name": "Heart%20and%20Soul", "format": "%5Bsize%3D11%5D%5Bcolor%3Ddarkslategray%5D%5Bb%5DNot%20even%20%5Bcolor%3Dgoldenrod%5Dgold%5B/color%5D%20and%20%5Bcolor%3Dslategray%5Dsilver%5B/color%5D%20can%5B/b%5D%5B/color%5D%5B/size%5D%5Balign%3Dcenter%5D%0A%0A%0ATo%20customize%20this%20post%20format%20and%20add%20others%2C%20go%20to%20your%20BetterGaia%20Options%20in%20Chrome.%0AFor%20help%2C%20%5Burl%3Dhttp%3A//www.gaiaonline.com/forum/t.45053993/%5Dvisit%20our%20thread%5B/url%5D.%0A%0A%0A%5B/align%5D%5Balign%3Dright%5D%5Bsize%3D11%5D%5Bcolor%3Ddarkslategray%5D%5Bb%5Dbreak%20the%20%5Bcolor%3Droyalblue%5Dtwo%5B/color%5D%20of%20us...%5B/b%5D%5B/color%5D%5B/size%5D%5B/align%5D", "style": "0"}ITSurHRTnSOL{"name": "Diamond%20and%20Pearl", "format": "This%20should%20be%20under%20Diamond%20and%20Pearl.", "style": "1"}ITSurHRTnSOL{"name": "Ruby%20and%20Sapphire", "format": "This%20should%20be%20under%20Ruby%20and%20Sapphire.", "style": "2"}ITSurHRTnSOL{"name": "Gold%20and%20Silver", "format": "This%20should%20be%20under%20Gold%20and%20Silver.", "style": "3"}ITSurHRTnSOL{"name": "Red%20and%20Blue", "format": "This%20should%20be%20under%20Red%20and%20Blue.", "style": "4"}';
	
		// Settings
		if (!localStorage["posts.settings.pages.forums"]) localStorage["posts.settings.pages.forums"] = true;
		if (!localStorage["posts.settings.pages.guildForums"]) localStorage["posts.settings.pages.guildForums"] = true;
		if (!localStorage["posts.settings.pages.pms"]) localStorage["posts.settings.pages.pms"] = true;
		if (!localStorage["posts.settings.pages.profileComments"]) localStorage["posts.settings.pages.profileComments"] = true;
	
		if (!localStorage["posts.settings.quotes.endOfFormat"]) localStorage["posts.settings.quotes.endOfFormat"] = false;
		if (!localStorage["posts.settings.quotes.removeFormatting"]) localStorage["posts.settings.quotes.removeFormatting"] = false;
		if (!localStorage["posts.settings.quotes.spoilerWrap"]) localStorage["posts.settings.quotes.spoilerWrap"] = false;
		if (!localStorage["posts.settings.quotes.rangeNumber"]) localStorage["posts.settings.quotes.rangeNumber"] = 2;
	
		if (!localStorage["posts.settings.disable.postFormatter"]) localStorage["posts.settings.disable.postFormatter"] = false;
		
	// Shortcuts
	if (!localStorage["shortcuts"]) localStorage["shortcuts"] = '{"name": "Forums", "URL": "/forum/"}ITSurHRTnSOL{"name": "My%20Posts", "URL": "/forum/myposts/"}ITSurHRTnSOL{"name": "My%20Topics", "URL": "/forum/mytopics/"}ITSurHRTnSOL{"name": "Shops", "URL": "/market/"}ITSurHRTnSOL{"name": "Trades", "URL": "/gaia/bank.php"}ITSurHRTnSOL{"name": "Marketplace", "URL": "/marketplace/"}ITSurHRTnSOL{"name": "MyGaia", "URL": "/mygaia/"}ITSurHRTnSOL{"name": "Private%20Messages", "URL": "/profile/privmsg.php"}ITSurHRTnSOL{"name": "Guilds", "URL": "/guilds/"}ITSurHRTnSOL{"name": "Subscribed%20Threads", "URL": "/forum/subscription/"}ITSurHRTnSOL{"name": "Subscribed%20Journals", "URL": "/j/%3Fmode%3Dlanding"}ITSurHRTnSOL{"name": "Top%20of%20Page", "URL": "%23"}ITSurHRTnSOL{"name": "Bottom%20of%20Page", "URL": "%23bg_bottomofpage"}';
	if (!localStorage["shortcuts.settings.disable"]) localStorage["shortcuts.settings.disable"] = false;

	// User Tags
	if (!localStorage["usertags"]) localStorage["usertags"] = '';
	if (!localStorage["usertags.settings.disable"]) localStorage["usertags.settings.disable"] = false;
}