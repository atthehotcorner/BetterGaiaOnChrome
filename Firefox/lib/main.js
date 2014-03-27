/*
BetterGaia by bowafishtech
Copyright (c) BetterGaia and Bowafishtech
Unauthorized copying, sharing, adaptation, publishing, commercial usage, and/or distribution, its derivatives and/or successors, via any medium, is strictly prohibited.
*/
/*global require: false, console: false */
/*jshint sub:true */

// Import APIs
var pageMod = require('sdk/page-mod');
var self = require('sdk/self');
var ss = require('sdk/simple-storage');
var tabs = require('sdk/tabs');

// Create page mod
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