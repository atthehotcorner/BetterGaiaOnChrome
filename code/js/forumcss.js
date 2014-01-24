/*
Forum CSS JS
Copyright (c) BetterGaia and Bowafishtech
Unauthorized copying, sharing, adaptation, publishing, commercial usage, and/or distribution, its derivatives and/or successors, via any medium, is strictly prohibited.
*/

function ForumCss() {

} // ---

// Check Storage and Fire
if (prefs['appliedUserPrefs'] == true && prefs['appliedForumCss'] == false) {
	ForumCss();
	prefs['appliedForumCss'] = true;
}