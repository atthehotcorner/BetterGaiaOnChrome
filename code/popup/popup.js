/*
Popup JS 
Copyright (c) BetterGaia and Bowafishtech
Unauthorized copying, sharing, adaptation, publishing, commercial usage, and/or distribution, its derivatives and/or successors, via any medium, is strictly prohibited.
*/
/*global localStorage: false, console: false, $: false, chrome: false, unescape: false, _gaq: false, document: false */
/*jshint sub:true */

function options() {
	var optionsUrl = chrome.extension.getURL('settings/main.html');

	chrome.tabs.query({url: optionsUrl}, function(tabs) {
        if (tabs.length) {chrome.tabs.update(tabs[0].id, {active: true});}
        else {chrome.tabs.create({url: optionsUrl});}
    });
    _gaq.push(['_trackEvent', 'Popup', 'clicked', 'Settings Link']);
}
function thread() {
    chrome.tabs.create({url: 'http://www.gaiaonline.com/forum/gaia-guides-and-resources/t.45053993/'});
    _gaq.push(['_trackEvent', 'Popup', 'clicked', 'Threads Link']);
}
function guild() {
    chrome.tabs.create({url: 'http://www.gaiaonline.com/guilds-home/bettergaia-outpost/g.258449/'});
    _gaq.push(['_trackEvent', 'Popup', 'clicked', 'Guilds Link']);
}

document.addEventListener('DOMContentLoaded', function() {
	document.getElementById('options').addEventListener('click', options);
	document.getElementById('thread').addEventListener('click', thread);
	document.getElementById('guild').addEventListener('click', guild);
	document.getElementById('version').innerHTML = chrome.runtime.getManifest().version;
});