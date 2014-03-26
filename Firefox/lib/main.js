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

console.log(ss.storage);

// Create page mod
pageMod.PageMod({
    include: '*.gaiaonline.com',
    contentScriptWhen: 'start',
    attachTo: ['top'],
    contentScriptFile: [self.data.url('js/prefs.js'), self.data.url('js/maincss.js')],
    contentScriptOptions: {
        mainCssUrl: self.data.url('css/main.css'),
        prefs: ss.storage,
        forumCssUrl: self.data.url('css/forum.css'),
    }
}, {
    include: '*.gaiaonline.com',
    contentScriptWhen: 'ready',
    attachTo: ['top'],
    contentScriptFile: [self.data.url('js/jquery.min.js'), self.data.url('js/main.js')]
});

//pageMod.PageMod();

pageMod.PageMod({
    include: ['http://www.gaiaonline.com/forum*', 'https://www.gaiaonline.com/forum*', 'http://www.gaiaonline.com/news*', 'https://www.gaiaonline.com/news*'],
    contentScriptWhen: 'start',
    attachTo: ['top'],
    contentScriptFile: [self.data.url('js/forumcss.js')]
});

pageMod.PageMod({
    include: ['http://www.gaiaonline.com/forum*', 'https://www.gaiaonline.com/forum*', 'http://www.gaiaonline.com/news*', 'https://www.gaiaonline.com/news*'],
    contentScriptWhen: 'ready',
    attachTo: ['top'],
    contentScriptFile: [self.data.url('js/forum.js')]
});

pageMod.PageMod({
    include: ['*.gaiaonline.com/forum/compose/*', '*.gaiaonline.com/guilds/posting.php*', '*.gaiaonline.com/profile/privmsg.php*', '*.gaiaonline.com/profiles/*mode=addcomment*'],
    contentScriptWhen: 'ready',
    attachTo: ['top'],
    contentScriptFile: [self.data.url('js/format.js')]
});