// Analytics JS Copyright (c) BetterGaia
/*global chrome: false, console: false, Handlebars: false, prefs: false*/
/*jshint browser: true, jquery: true, multistr: true, sub: true*/

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-32843062-1']);
_gaq.push(['_setCustomVar', 1, 'Version', chrome.runtime.getManifest().version, 1]);
_gaq.push(['_trackPageview']);
(function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();