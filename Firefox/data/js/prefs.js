/*
Preferences JS
Copyright (c) BetterGaia
*/

var prefs = {
    // General
    'adsHide': true,
    'instantUpdating': true,
    'notifications': '15',
    'announcementReader': true,

    // Background
    'background.image': 'default',
    'background.color': '#12403d',
    'background.repeat': true,
    'background.position': 'top center',
    'background.float': false,

    // Header
    'header.float': true,
    'header.widgets': true,
    'header.drawAll': true,

    'header.shortcuts': true,
    'header.shortcuts.list': [
    ['MyGaia', '/mygaia/'],
    ['Private Messages', '/profile/privmsg.php'],
    ['Forums', '/forum/'],
    ['My Posts', '/forum/myposts/'],
    ['My Topics', '/forum/mytopics/'],
    ['Subscribed Threads', '/forum/subscription/'],
    ['Shops', '/market/'],
    ['Trades', '/gaia/bank.php'],
    ['Marketplace', '/marketplace/'],
    ['Guilds', '/guilds/'],
    ['Top of Page', '#'],
    ['Bottom of Page', '#bg_bottomofpage']
    ],

    'header.background': 'default',
    'header.background.base': 'default',
    'header.background.stretch': true,

    'header.logo': 'default',

    'header.nav': '#5A80A1',
    'header.nav.hover': '#396C7C',
    'header.nav.current': '#93F2FF',

    // MyGaia
    'mygaia.suggested': true,
    'mygaia.bgchat': true,

    // PMs
    'pms': true,

    // Forum
    'forum.externalLinks': true,
    'forum.previewThreads': true,
    'forum.constrain': true,
    'forum.post.optionsBottom': true,
    'forum.post.bgContainer': false,
    'forum.pollHide': false,
    'forum.postOffWhite': false,

    'forum.threadHeader': '#BF7F40',
    'forum.postHeader': '#CFE6F9',

    // Format
    'format': true,
    'format.forums': true,
    'format.guildForums': true,
    'format.pms': true,
    'format.profileComments': true,

    'format.list': [
    ['Blank', "", 0],
    ['Past Lives', "%5Bcolor=#003040%5D%E2%96%8C%5B/color%5D%5Bb%5D%5Bsize=11%5D%5Bcolor=#777%5DA%20SHIP%20IS%20SAFE%20IN%20HARBOR,%5B/color%5D%5B/size%5D%5B/b%5D%0A%5Bcolor=#276B91%5D%E2%96%8C%5B/color%5D%5Bb%5D%5Bsize=11%5D%5Bcolor=#777%5DBUT%20THAT'S%20NOT%20WHAT%20SHIPS%20ARE%20FOR.%5B/color%5D%5B/size%5D%5B/b%5D%0A%0A%0A%0A%5Balign=right%5D%5Bb%5DWelcome%20to%20%5Burl=http://bettergaia.com/%5DBetterGaia%5B/url%5D.%5B/b%5D%0A%5Bi%5DNeed%20help?%20%5Burl=http://www.gaiaonline.com/forum/t.45053993/%5DSee%20our%20thread%5B/url%5D%20and%20visit%20%5Burl=http://bettergaia.com/%5DBetterGaia.com%5B/url%5D.%5B/i%5D%5B/align%5D", 0],
    ['Godfellas', "%5Bcolor=#F08080%5D%5Bsize=20%5D%E2%9D%9D%5B/size%5D%5B/color%5D%0A%5Bb%5D%5Bcolor=#8B8878%5D%5Bsize=10%5DWHEN%20YOU%20DO%20THINGS%20RIGHT,%0APEOPLE%20WON'T%20BE%20SURE%20YOU'VE%20DONE%20ANYTHING%20AT%20ALL.%5B/size%5D%5B/color%5D%5B/b%5D%0A%5Bcolor=#F08080%5D%5Bsize=20%5D%20%E2%9D%9E%5B/size%5D%5B/color%5D%0A%0A%0A%0A%5Balign=right%5D%5Bb%5DWelcome%20to%20%5Burl=http://bettergaia.com/%5DBetterGaia%5B/url%5D.%5B/b%5D%0A%5Bi%5DNeed%20help?%20%5Burl=http://www.gaiaonline.com/forum/t.45053993/%5DSee%20our%20thread%5B/url%5D%20and%20visit%20%5Burl=http://bettergaia.com/%5DBetterGaia.com%5B/url%5D.%5B/i%5D%5B/align%5D", 0],
    ['Alice', "%E2%99%A6%20%5Bcolor=#222222%5D%5Bsize=11%5D%5Bi%5DWhat%20road%20do%20I%20take?%5B/i%5D%5B/size%5D%5B/color%5D%0A%E2%99%A3%20%5Bb%5D%5Bcolor=brown%5D%22Where%20do%20you%20want%20to%20go?%22%5B/color%5D%5B/b%5D%0A%E2%99%A5%20%5Bcolor=#222222%5D%5Bsize=11%5D%5Bi%5DI%20don't%20know.%5B/i%5D%5B/size%5D%5B/color%5D%0A%E2%99%A0%20%5Bb%5D%5Bcolor=brown%5D%22Then,%20it%20really%20doesn't%20matter,%20does%20it?%22%5B/color%5D%5B/b%5D%0A%0A%0A%0A%5Balign=right%5D%5Bb%5DWelcome%20to%20%5Burl=http://bettergaia.com/%5DBetterGaia%5B/url%5D.%5B/b%5D%0A%5Bi%5DNeed%20help?%20%5Burl=http://www.gaiaonline.com/forum/t.45053993/%5DSee%20our%20thread%5B/url%5D%20and%20visit%20%5Burl=http://bettergaia.com/%5DBetterGaia.com%5B/url%5D.%5B/i%5D%5B/align%5D", 0]
    ],
    'format.list.recent': 'default',
    'format.list.useRecent': true,

    'format.quote.removeFormatting': false,
    'format.quote.spoilerWrap': false,
    'format.quote.endOfFormat': false,
    'format.quote.rangeNumber': '2',

    // Usertags
    'usertags': true,
    'usertags.list': {
        //'12345': ['cat', 'He is a cat.', 'http://google.com', 2014]
    },

    // Other
    'appliedUserPrefs': false,
    'appliedMainCss': false,
    'appliedMainJs': false,
    'appliedForumCss': false,
    'appliedForumJs': false,
    'appliedFormat': false,
    'version': '2014'
};

// overwrite default prefs with any userset
for (var key in self.options.prefs) {
    try {prefs[key] = self.options.prefs[key];}
    catch(e) {console.warn('BetterGaia: Missing pref \'' + e + '\'.');}
}
