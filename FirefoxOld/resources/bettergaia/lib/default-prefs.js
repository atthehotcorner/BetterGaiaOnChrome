// Default Prefs module (c) BetterGaia and bowafishtech
var ss = require("sdk/simple-storage");

function setDefaults() {
// Main
    // Internal
    if (typeof ss.storage["needReset"] === 'undefined') ss.storage["needReset"] = false;

    // Features
    if (typeof ss.storage["main.features.drawAll"] === 'undefined') ss.storage["main.features.drawAll"] = true;
	if (typeof ss.storage["main.features.avatarStats"] === 'undefined') ss.storage["main.features.avatarStats"] = true;
	if (typeof ss.storage["main.features.suggestedContent"] === 'undefined') ss.storage["main.features.suggestedContent"] = true;
	if (typeof ss.storage["main.features.centerPage"] === 'undefined') ss.storage["main.features.centerPage"] = true;
	if (typeof ss.storage["main.features.hideAds"] === 'undefined') ss.storage["main.features.hideAds"] = true;
	if (typeof ss.storage["main.features.messages"] === 'undefined') ss.storage["main.features.messages"] = true;
	if (typeof ss.storage["style.other.hide.footer"] === 'undefined') ss.storage["style.other.hide.footer"] = false;

	// Header and Nav
	if (typeof ss.storage["main.handn.header.overflow"] === 'undefined') ss.storage["main.handn.header.overflow"] = true;
	if (typeof ss.storage["main.handn.header.dawnduskCycle"] === 'undefined') ss.storage["main.handn.header.dawnduskCycle"] = true;
	if (typeof ss.storage["main.handn.header.getGaiaCash"] === 'undefined') ss.storage["main.handn.header.getGaiaCash"] = true;

	if (typeof ss.storage["main.handn.bar.float"] === 'undefined') ss.storage["main.handn.bar.float"] = true;
	if (typeof ss.storage["main.handn.bar.showWelcome"] === 'undefined') ss.storage["main.handn.bar.showWelcome"] = false;
	if (typeof ss.storage["main.handn.bar.links"] === 'undefined') ss.storage["main.handn.bar.links"] = true;

	if (typeof ss.storage["main.handn.nav.classic"] === 'undefined') ss.storage["main.handn.nav.classic"] = false;
	
	// Forums
	if (typeof ss.storage["main.forums.size"] === 'undefined') ss.storage["main.forums.size"] = true;
	if (typeof ss.storage["main.forums.pollDropDown"] === 'undefined') ss.storage["main.forums.pollDropDown"] = false;
	if (typeof ss.storage["main.forums.quoteAbovePost"] === 'undefined') ss.storage["main.forums.quoteAbovePost"] = false;
	if (typeof ss.storage["main.forums.whiteBgAvis"] === 'undefined') ss.storage["main.forums.whiteBgAvis"] = false;
	if (typeof ss.storage["main.forums.postTipping"] === 'undefined') ss.storage["main.forums.postTipping"] = false;
	
// Style
if (typeof ss.storage["style.background"] === 'undefined') ss.storage["style.background"] = "resource://jid0-nifeetyln4noyxdbzcmia3gcbkk-at-jetpack/bettergaia/data/images/background/bg2.jpg";
	if (typeof ss.storage["style.background.color"] === 'undefined') ss.storage["style.background.color"] = "12403D";
	if (typeof ss.storage["style.background.position"] === 'undefined') ss.storage["style.background.position"] = "top left";
	if (typeof ss.storage["style.background.repeat"] === 'undefined') ss.storage["style.background.repeat"] = true;
	if (typeof ss.storage["style.other.background.float"] === 'undefined') ss.storage["style.other.background.float"] = false;

if (typeof ss.storage["style.header"] === 'undefined') ss.storage["style.header"] = "http://s.cdn.gaiaonline.com/images/gaia_global/gaia_header/new_header/il_header_bg_bassken_sprite.jpg, http://s.cdn.gaiaonline.com/images/gaia_global/gaia_header/new_header/rs_header_bg_bassken_tile_sprite.jpg";
if (typeof ss.storage["style.logo"] === 'undefined') ss.storage["style.logo"] = "http://s.cdn.gaiaonline.com/images/gaia_global/gaia_header/br_gaia_logo_header.png";
	
	// Nav
	if (typeof ss.storage["style.nav"] === 'undefined') ss.storage["style.nav"] = "1F4166";
	if (typeof ss.storage["style.nav.hover"] === 'undefined') ss.storage["style.nav.hover"] = "5395A6";
	if (typeof ss.storage["style.nav.current"] === 'undefined') ss.storage["style.nav.current"] = "6FB2C1";

	// Forums
	if (typeof ss.storage["style.forums.threadHeader"] === 'undefined') ss.storage["style.forums.threadHeader"] = "BF7F40";

// Posts
if (typeof ss.storage["posts.formatter.formats"] === 'undefined') ss.storage["posts.formatter.formats"] = '{"name": "Heart%20and%20Soul", "format": "%5Bsize%3D11%5D%5Bcolor%3Ddarkslategray%5D%5Bb%5DNot%20even%20%5Bcolor%3Dgoldenrod%5Dgold%5B/color%5D%20and%20%5Bcolor%3Dslategray%5Dsilver%5B/color%5D%20can%5B/b%5D%5B/color%5D%5B/size%5D%5Balign%3Dcenter%5D%0A%0A%0ATo%20customize%20this%20post%20format%20and%20add%20others%2C%20go%20to%20your%20BetterGaia%20Options%20in%20Firefox.%0AFor%20help%2C%20%5Burl%3Dhttp%3A//www.gaiaonline.com/forum/t.45053993/%5Dvisit%20our%20thread%5B/url%5D.%0A%0A%0A%5B/align%5D%5Balign%3Dright%5D%5Bsize%3D11%5D%5Bcolor%3Ddarkslategray%5D%5Bb%5Dbreak%20the%20%5Bcolor%3Droyalblue%5Dtwo%5B/color%5D%20of%20us...%5B/b%5D%5B/color%5D%5B/size%5D%5B/align%5D", "style": "0"}ITSurHRTnSOL{"name": "Diamond%20and%20Pearl", "format": "This%20should%20be%20under%20Diamond%20and%20Pearl.", "style": "1"}ITSurHRTnSOL{"name": "Ruby%20and%20Sapphire", "format": "This%20should%20be%20under%20Ruby%20and%20Sapphire.", "style": "2"}ITSurHRTnSOL{"name": "Gold%20and%20Silver", "format": "This%20should%20be%20under%20Gold%20and%20Silver.", "style": "3"}ITSurHRTnSOL{"name": "Red%20and%20Blue", "format": "This%20should%20be%20under%20Red%20and%20Blue.", "style": "4"}';

	// Settings
	if (typeof ss.storage["posts.settings.quotes.endOfFormat"] === 'undefined') ss.storage["posts.settings.quotes.endOfFormat"] = false;
	if (typeof ss.storage["posts.settings.quotes.removeFormatting"] === 'undefined') ss.storage["posts.settings.quotes.removeFormatting"] = false;

	if (typeof ss.storage["posts.settings.disable.postFormatter"] === 'undefined') ss.storage["posts.settings.disable.postFormatter"] = false;
	
// Shortcuts
if (typeof ss.storage["shortcuts"] === 'undefined') ss.storage["shortcuts"] = '{"name": "Forums", "URL": "/forum/"}ITSurHRTnSOL{"name": "My%20Posts", "URL": "/forum/myposts/"}ITSurHRTnSOL{"name": "My%20Topics", "URL": "/forum/mytopics/"}ITSurHRTnSOL{"name": "Shops", "URL": "/market/"}ITSurHRTnSOL{"name": "Trades", "URL": "/gaia/bank.php"}ITSurHRTnSOL{"name": "Marketplace", "URL": "/marketplace/"}ITSurHRTnSOL{"name": "MyGaia", "URL": "/mygaia/"}ITSurHRTnSOL{"name": "Private%20Messages", "URL": "/profile/privmsg.php"}ITSurHRTnSOL{"name": "Guilds", "URL": "/guilds/"}ITSurHRTnSOL{"name": "Subscribed%20Threads", "URL": "/forum/subscription/"}ITSurHRTnSOL{"name": "Subscribed%20Journals", "URL": "/j/%3Fmode%3Dlanding"}ITSurHRTnSOL{"name": "Top%20of%20Page", "URL": "%23"}ITSurHRTnSOL{"name": "Bottom%20of%20Page", "URL": "%23bg_bottomofpage"}';
if (typeof ss.storage["shortcuts.settings.disable"] === 'undefined') ss.storage["shortcuts.settings.disable"] = false;
}

exports.setDefaults = setDefaults;