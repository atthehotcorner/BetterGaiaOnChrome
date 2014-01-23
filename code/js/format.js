/*
Post Format JS 
Copyright (c) BetterGaia and Bowafishtech
Unauthorized copying, sharing, adaptation, publishing, commercial usage, and/or distribution, its derivatives and/or successors, via any medium, is strictly prohibited.
*/

function Format() {

// Test
console.log('5. Ran FormatJS');

} // ---

// Check Storage and Fire
if (prefs['appliedUserPrefs'] == true && prefs['appliedFormat'] == false) {
	Format();
	prefs['appliedFormat'] = true;
}