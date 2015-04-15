// Background JS Copyright (c) BetterGaia
// Unauthorized copying, sharing, adaptation, publishing, commercial usage, and/or distribution, its derivatives and/or successors, via any medium, is strictly prohibited.
/*global chrome: false, console: false, Handlebars: false, prefs: false, require: false*/
/*jshint browser: true, jquery: true, moz: true, multistr: true, sub: true*/

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

// CSS PageMod
pageMod.PageMod({
    include: '*.gaiaonline.com',
    exclude: [/.+\.gaiaonline.com\/profiles\/.+\/.+\//, /.+\.gaiaonline.com\/(launch|tank)\/.*/],
    contentScriptWhen: 'start',
    attachTo: 'top',
    contentScriptFile: ['./js/prefs.js', './js/css.js'],
    contentScriptOptions: {
        prefs: ss.storage,
        baseUrl: self.data.url('')
    }
});

// JS PageMod
pageMod.PageMod({
    include: '*.gaiaonline.com',
    exclude: [/.+\.gaiaonline.com\/profiles\/.+\/.+\//, /.+\.gaiaonline.com\/(launch|tank)\/.*/],
    contentScriptWhen: 'ready',
    attachTo: 'top',
    contentScriptFile: ['./js/jquery.min.js', './js/prefs.js', './js/handlebars.min.js', './js/js.js'],
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
                if (tab.url.indexOf('resource://bettergaia-at-bowafishtech-dot-co-dot-cc/bettergaia/data/settings/main.html') != -1) {
                    tabIndex = tab.index;
                    break;
                }
            }
            if (tabIndex > -1) tabs[tabIndex].activate();
            else tabs.open(self.data.url('settings/main.html'));
        });
    }
});

// Settings Page Mod
pageMod.PageMod({
    include: self.data.url('settings/main.html') + '*',
    contentScriptWhen: 'ready',
    attachTo: 'top',
    contentScriptFile: ['./js/jquery.min.js', './js/handlebars.min.js', './js/prefs.js', './settings/html.sortable.min.js', './settings/data.js', './settings/main.js'],
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
        worker.port.on('reset', function() {
            for (var key in ss.storage) {
                try {delete ss.storage[key];}
                catch(e) {console.warn('BetterGaia: could not remove preference, \'' + e + '\'.');}
            }
            ss.storage.version = self.version;
            worker.port.emit('reload');
        });
    }
});
