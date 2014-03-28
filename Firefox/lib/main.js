/*
BetterGaia by bowafishtech
Copyright (c) BetterGaia and Bowafishtech
Unauthorized copying, sharing, adaptation, publishing, commercial usage, and/or distribution, its derivatives and/or successors, via any medium, is strictly prohibited.
*/
/*global require: false, console: false */
/*jshint sub:true */

// /code is /data
// /images is /data/images

// Import APIs
var pageMod = require('sdk/page-mod');
var Request = require('sdk/request').Request;
var self = require('sdk/self');
var ss = require('sdk/simple-storage');
var tabs = require('sdk/tabs');

// Check if new install, update
if (self.loadReason === 'install' || self.loadReason === 'upgrade') {
    ss.storage.version = self.version;
}

// Analytics - will create privacy policy
// https://developers.google.com/analytics/devguides/collection/protocol/v1/reference
// http://stackoverflow.com/questions/7715878/unique-identifier-for-each-addon-user
// https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/util_uuid
if (!ss.storage.hasOwnProperty('userid')) ss.storage.userid = require('sdk/util/uuid').uuid()['number'];
Request({
    url: 'https://ssl.google-analytics.com/collect',
    content: {
        'an': 'BetterGaia for Firefox',
        'av': self.version,
        'v': 1,
        'tid': 'UA-32843062-4',
        'cid': ss.storage.userid,
        't': 'appview'
    }
    //onComplete: function(response) {}
}).post();

// Create page mod for main site, forums and formatting
pageMod.PageMod({
    include: '*.gaiaonline.com',
    contentScriptWhen: 'start',
    attachTo: ['top'],
    contentScriptFile: [self.data.url('js/jquery.min.js'), self.data.url('js/prefs.js'), self.data.url('js/maincss.js'), self.data.url('js/main.js')],
    contentScriptOptions: {
        prefs: ss.storage,
        mainCssUrl: self.data.url('css/main.css')
    },
    onAttach: function(worker) {
        worker.port.on('set', function(data) {
            ss.storage[data[0]] = data[1];
        });
        worker.port.on('remove', function(key) {
            delete ss.storage[key];
        });
        worker.port.on('settings', function() {
            tabs.open(self.data.url('settings/main.html'));
        });
        worker.port.on('getHtml', function(url) {
            worker.port.emit(url, self.data.load(url));
        });
    }
});

pageMod.PageMod({
    include: ['http://www.gaiaonline.com/forum*', 'https://www.gaiaonline.com/forum*', 'http://www.gaiaonline.com/news*', 'https://www.gaiaonline.com/news*'],
    contentScriptWhen: 'start',
    attachTo: ['top'],
    contentScriptFile: [self.data.url('js/jquery.min.js'), self.data.url('js/prefs.js'), self.data.url('js/forumcss.js'), self.data.url('js/forum.js')],
    contentScriptOptions: {
        prefs: ss.storage,
        forumCssUrl: self.data.url('css/forum.css')
    },
    onAttach: function(worker) {
        worker.port.on('set', function(data) {
            ss.storage[data[0]] = data[1];
        });
        worker.port.on('remove', function(key) {
            delete ss.storage[key];
        });
        worker.port.on('format', function() {
            // format the page
        });
    }
});

pageMod.PageMod({
    include: ['http://www.gaiaonline.com/forum/compose/*', 'http://www.gaiaonline.com/guilds/posting.php*', 'http://www.gaiaonline.com/profile/privmsg.php*', 'http://www.gaiaonline.com/profiles/*'],
    contentScriptWhen: 'ready',
    attachTo: ['top'],
    contentScriptFile: [self.data.url('js/jquery.min.js'), self.data.url('js/prefs.js'), self.data.url('js/format.js')],
    contentScriptOptions: {
        prefs: ss.storage,
    },
    onAttach: function(worker) {
        worker.port.on('set', function(data) {
            ss.storage[data[0]] = data[1];
        });
        worker.port.on('remove', function(key) {
            delete ss.storage[key];
        });
    }
});