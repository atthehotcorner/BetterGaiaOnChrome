// 2013 (c) BetterGaia and bowafishtech
// Begin main function
exports.main = function() {

// Requires
var addontab = require("sdk/addon-page");
var pageMod = require("sdk/page-mod");
var prefs = require("sdk/preferences/service");
var self = require("sdk/self");
var ss = require("sdk/simple-storage");
var sanitizer = require("./sanitizer");
var {Cc,Ci} = require("chrome");

// Create Preference defaults
var defaultPrefs = require("./default-prefs");
defaultPrefs.setDefaults();
if (ss.storage["version"] != self.version) ss.storage["version"] = self.version;
if (prefs.isSet('extensions.bettergaia.posts.formatter.formats') || prefs.isSet('extensions.bettergaia.shortcuts')) ss.storage["needReset"] = true;

// Main
// - Add CSS for author-like inheritance (workaround for user stylesheet inheritance from contentStyle)
new pageMod.PageMod({
  include: ["*.gaiaonline.com"],
  contentScriptWhen: 'start',
  contentScriptFile: [self.data.url("js/css.js")],
  onAttach: function onAttach(worker) {worker.port.emit("sstorage", ss.storage);}
});

// - Add JS
new pageMod.PageMod({
  include: ["*.gaiaonline.com"],
  contentScriptWhen: 'ready',
  contentScriptFile: [self.data.url("js/jquery.min.js"), self.data.url("js/js.js")],
  onAttach: function onAttach(worker) {
    worker.port.emit("sstorage", ss.storage);
    worker.port.on("sendAvatarStats", function(data) {
      worker.port.emit("receiveAvatarStats", sanitizer.sanitize(data));
    });
  }
});

// Forums
// - Add CSS for author-like inheritance (workaround for user stylesheet inheritance from contentStyle)
new pageMod.PageMod({
  include: ["http://www.gaiaonline.com/forum", "http://www.gaiaonline.com/forum/*", "http://www.gaiaonline.com/news", "http://www.gaiaonline.com/news/*"],
  contentScriptWhen: 'start',
  contentScriptFile: [self.data.url("js/forum/css.js")],
  onAttach: function onAttach(worker) {worker.port.emit("sstorage", ss.storage);}
});

// - Add JS
new pageMod.PageMod({
  include: ["http://www.gaiaonline.com/forum", "http://www.gaiaonline.com/forum/*", "http://www.gaiaonline.com/news", "http://www.gaiaonline.com/news/*"],
  contentScriptWhen: 'ready',
  contentScriptFile: [self.data.url("js/jquery.min.js"), self.data.url("js/forum/js.js")]
});

// Post Formatter
new pageMod.PageMod({
  include: ["http://www.gaiaonline.com/forum/compose/*", "http://www.gaiaonline.com/guilds/posting.php*", "http://www.gaiaonline.com/profile/privmsg.php*", "http://www.gaiaonline.com/profiles/*"],
  contentScriptWhen: 'ready',
  contentScriptFile: [self.data.url("js/jquery.min.js"), self.data.url("js/postformatter.js")],
  onAttach: function onAttach(worker) {worker.port.emit("sstorage", ss.storage);}
});

// Options
new pageMod.PageMod({
  include: ["resource://jid0-nifeetyln4noyxdbzcmia3gcbkk-at-jetpack/bettergaia/data/options/options.html"],
  contentScriptWhen: 'ready',
  contentScriptFile: [self.data.url("js/jquery.min.js"), self.data.url("options/prefs.js")],
  onAttach: function onAttach(worker) {
    worker.postMessage(ss.storage);
    worker.port.on('pref', function(message) {
      ss.storage[message[0]] = message[1];
    });
    worker.port.on('reset', function(message) {
      message.push('style.background', 'style.background.position', 'style.header', 'style.logo', 'posts.formatter.formats', 'shortcuts');
      message.forEach(function(pref){ delete ss.storage[pref]; });
      defaultPrefs.setDefaults();
    });
    worker.port.on('migrate', function(message) {
      //if (prefs.isSet('extensions.bettergaia.style.background')) ss.storage['style.background'] = prefs.get('extensions.bettergaia.style.background');
      //if (prefs.isSet('extensions.bettergaia.style.header')) ss.storage['style.header'] = prefs.get('extensions.bettergaia.style.header');
      //if (prefs.isSet('extensions.bettergaia.style.logo')) ss.storage['style.logo'] = prefs.get('extensions.bettergaia.style.logo');

      if (prefs.isSet('extensions.bettergaia.posts.formatter.formats')) {
        ss.storage['posts.formatter.formats'] = prefs.get('extensions.bettergaia.posts.formatter.formats');
        prefs.reset('extensions.bettergaia.posts.formatter.formats');
      }
      if (prefs.isSet('extensions.bettergaia.shortcuts')) {
        ss.storage['shortcuts'] = prefs.get('extensions.bettergaia.shortcuts');
        prefs.reset('extensions.bettergaia.shortcuts');
      }
      ss.storage["needReset"] = false;
    });
  }
});

}; // End main function