/*
CSS JS
Copyright (c) BetterGaia and Bowafishtech
Unauthorized copying, sharing, adaptation, publishing, commercial usage, and/or distribution, its derivatives and/or successors, via any medium, is strictly prohibited.
*/

function MainCss() {

// Test
console.log('1. Ran MainCSS');

} // ---

// Get Storage and Fire
if (prefs['appliedUserPrefs'] != true)
chrome.storage.sync.get(null, function(response) {
    for (var key in response) {
		try {prefs[key] = response[key];}
		catch(e) {console.warn('BetterGaia: Missing pref \'' + e + '\'.')}
	}

	prefs['appliedUserPrefs'] == true;

	if (prefs['appliedMainCss'] == false) {
		MainCss();
		prefs['appliedMainCss'] = true;
	}
	if (prefs['appliedMainJs'] == false) {
		MainJs();
		prefs['appliedMainJs'] = true;
	}
	if (prefs['appliedForumCss'] == false) {
		ForumCss();
		prefs['appliedForumCss'] = true;
	}
	if (prefs['appliedForumJs'] == false) {
		ForumJs();
		prefs['appliedForumJs'] = true;
	}
	if (typeof(Format == 'function') && prefs['appliedFormat'] == false) {
		Format();
		prefs['appliedFormat'] = true;
	}
});
else CssJs();