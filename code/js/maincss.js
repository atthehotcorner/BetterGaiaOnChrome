/*
CSS JS
Copyright (c) BetterGaia and Bowafishtech
Unauthorized copying, sharing, adaptation, publishing, commercial usage, and/or distribution, its derivatives and/or successors, via any medium, is strictly prohibited.
*/

function MainCss() {
var css = '';

if (prefs['adsHide'] == true)
css += '#bb-advertisement, #offer_banner, #grid_ad, .gaia-ad, .as_ad_frame {display: none !important;}';

// Add CSS
var head = document.getElementsByTagName('head');
if (head.length > 0) {
    var style = document.createElement('style');
    style.setAttribute('bg-css', '');
    style.appendChild(document.createTextNode(css));
    head[0].appendChild(style);
}

} // ---

// Get Storage and Fire
if (prefs['appliedUserPrefs'] != true)
chrome.storage.sync.get(null, function(response) {
  for (var key in response) {
		try {prefs[key] = response[key];}
		catch(e) {console.warn('BetterGaia: Missing pref \'' + e + '\'.')}
  }

	prefs['appliedUserPrefs'] = true;

  // Could use some code reuse
  if (typeof(MainCss) == 'function' && prefs['appliedMainCss'] == false) {
		MainCss();
		prefs['appliedMainCss'] = true;
	}
	if (typeof(MainJs) == 'function' && prefs['appliedMainJs'] == false) {
		MainJs();
		prefs['appliedMainJs'] = true;
	}
	if (typeof(ForumCss) == 'function' && prefs['appliedForumCss'] == false) {
		ForumCss();
		prefs['appliedForumCss'] = true;
	}
	if (typeof(ForumJs) == 'function' && prefs['appliedForumJs'] == false) {console.log('ss')
		ForumJs();
		prefs['appliedForumJs'] = true;
	}
	if (typeof(Format) == 'function' && prefs['appliedFormat'] == false) {
		Format();
		prefs['appliedFormat'] = true;
	}
});
else CssJs();

chrome.storage.local.get(null, function(response) {
  for (var key in response) {
		try {prefs[key] = response[key];}
		catch(e) {console.warn('BetterGaia: Missing pref \'' + e + '\'.')}
  }
});