/*
Forum JS 
Copyright (c) BetterGaia and Bowafishtech
Unauthorized copying, sharing, adaptation, publishing, commercial usage, and/or distribution, its derivatives and/or successors, via any medium, is strictly prohibited.
*/

function ForumJS() {
} // ---

// Get Storage
if (prefs['appliedUserPrefs'] == false)
chrome.storage.sync.get(null, function(response) {
    for (var key in response) {prefs[key] = response[key];}
    ForumJS();
});
else ForumJS();