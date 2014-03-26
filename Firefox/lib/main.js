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
 
// Create page mod
pageMod.PageMod({
    include: '*.gaiaonline.com',
    contentStyleFile: self.data.url('css/main.css'),
    contentScriptFile: [self.data.url('js/jquery.min.js'), self.data.url('main.js')]
});