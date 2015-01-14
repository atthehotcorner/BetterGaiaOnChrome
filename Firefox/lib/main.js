/*
BetterGaia
Copyright (c) BetterGaia
Unauthorized copying, sharing, adaptation, publishing, commercial usage, and/or distribution, its derivatives and/or successors, via any medium, is strictly prohibited.
*/

// APIs
var pageMod = require('sdk/page-mod');
var Request = require('sdk/request').Request;
var self = require('sdk/self');
var ss = require('sdk/simple-storage');
var tabs = require('sdk/tabs');

// Check if new install, update
if (['install', 'upgrade', 'enable'].indexOf(self.loadReason) != -1) {
    ss.storage.version = self.version;
}

/* Analytics - will create privacy policy
// https://developers.google.com/analytics/devguides/collection/protocol/v1/reference
// http://stackoverflow.com/questions/7715878/unique-identifier-for-each-addon-user
// https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/util_uuid
if (!ss.storage.hasOwnProperty('userid')) ss.storage.userid = require('sdk/util/uuid').uuid()['number'];
Request({
    url: 'https://ssl.google-analytics.com/collect',
    content: {
        'v': 1,
        'tid': 'UA-32843062-4',
        'cid': '35009a79-1a05-49d7-b876-2b884d0f825b', //ss.storage.userid,
        't': 'pageview',
        'an': 'BetterGaia for Firefox',
        'av': self.version
    },
    onComplete: function(response) {
        console.log(response);
    }
}).post();*/

// Attach Page Mod
pageMod.PageMod({
    include: '*.gaiaonline.com',
    //exclude: ['*.gaiaonline.com/profiles/*/*/', '*.gaiaonline.com/launch/*', '*.gaiaonline.com/tank/*'],
    contentScriptWhen: 'start',
    attachTo: 'top',
    contentScriptFile: ['./js/jquery.min.js', './js/handlebars.js', './js/prefs.js', './js/maincss.js', './js/main.js', './js/forumcss.js', './js/forum.js', './js/format.js'],
    contentScriptOptions: {
        prefs: ss.storage,
        baseUrl: self.data.url('')
    },
    onAttach: function(worker) {
        worker.port.on('set', function(data) {
            ss.storage[data[0]] = data[1];
        });
        worker.port.on('remove', function(key) {
            delete ss.storage[key];
        });
        worker.port.on('settings', function() {
            var tabIndex = -1;
            for (let tab of tabs) {
                if (tab.url == 'resource://bettergaia-at-bowafishtech-dot-co-dot-cc/bettergaia/data/settings/main.html') {
                    tabIndex = tab.index;
                    break;
                }
            }
            if (tabIndex > -1) tabs[tabIndex].activate();
            else tabs.open(self.data.url('settings/main.html'));
        });
        /*worker.port.on('getHtml', function(url) {
            worker.port.emit(url, self.data.load(url));
        });*/
    }
});

// Settings Page Mod
pageMod.PageMod({
    include: self.data.url('settings/main.html'),
    contentScriptWhen: 'start',
    attachTo: 'top',
    contentScriptFile: ['./js/jquery.min.js', './js/prefs.js'],
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
