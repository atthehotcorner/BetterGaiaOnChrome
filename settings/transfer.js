/*
Transfer JS 
Copyright (c) BetterGaia and Bowafishtech
Unauthorized copying, sharing, adaptation, publishing, commercial usage, and/or distribution, its derivatives and/or successors, via any medium, is strictly prohibited.
*/

var Transfer = {
    push: {},

    boolean: {
        'style.background.repeat': 'background.repeat',
        'style.other.background.float': 'background.float',
        'main.handn.bar.float': 'header.float',
        'main.handn.bar.links': 'header.widgets',
        'main.features.drawAll': 'header.drawAll',
        'main.handn.header.overflow': 'header.background.stretch',
        'main.features.suggestedContent': 'mygaia.suggested',
        'main.features.messages': 'pms',
        'main.forums.externalLinks': 'forum.externalLinks',
        'main.forums.previewThreads': 'forum.previewThreads',
        'main.forums.size': 'forum.constrain',
        'posts.settings.pages.forums': 'format.forums',
        'posts.settings.pages.guildForums': 'format.guildForums',
        'posts.settings.pages.pms': 'format.pms',
        'posts.settings.pages.profileComments': 'format.profileComments',    
        'posts.settings.quotes.removeFormatting': 'format.quote.removeFormatting',
        'posts.settings.quotes.spoilerWrap': 'format.quote.spoilerWrap',
        'posts.settings.quotes.endOfFormat': 'format.quote.endOfFormat',
    },

    color: {
        'style.background.color': 'background.color',
        'style.nav': 'header.nav',
        'style.nav.hover': 'header.nav.hover',
        'style.nav.current': 'header.nav.current',
        'style.forums.threadHeader': 'forum.threadHeader',
        'style.forums.postHeader': 'forum.postHeader',
    },

    string: {
        'style.background': 'background.image',
        'style.background.position': 'background.position',
        'style.header': 'header.background', //'header.background.base'
        'style.logo': 'header.logo',
        'posts.settings.quotes.rangeNumber': 'format.quote.rangeNumber',
    },

    other: {
        'shortcuts': 'header.shortcuts.list',
        'posts.formatter.formats': 'format.list',
        'usertags': 'usertags.list'
    },
    
    init:function() {
        console.log('Transfering settings...');

        // Set booleans
        for (var key in this.boolean) {
            if (typeof(localStorage[key]) == 'string') {
                var value = false;
                if (localStorage[key] == 'true') value = true;
                this.push[this.boolean[key]] = value;
            }
        }

        // Set colors
        for (var key in this.color) {
            if (typeof(localStorage[key]) == 'string') {
                if (key == 'style.nav' && localStorage[key] == '7EACC5' ||
                    key == 'style.forums.postHeader' && localStorage[key] == '92B1CA'
                ) continue;
                this.push[this.color[key]] = '#' + localStorage[key];
            }
        }

        // Set strings
        for (var key in this.string) {
            if (typeof(localStorage[key]) == 'string') {
                if (key == 'style.background' && localStorage[key].substring(0,19) == 'chrome-extension://' ||
                    key == 'style.logo' && (localStorage[key].substring(0,19) == 'chrome-extension://' || localStorage[key] == 'http://s.cdn.gaiaonline.com/images/gaia_global/gaia_header/br_gaia_logo_header.png') ||
                    key == 'style.background.position' && localStorage[key] == 'top left'
                ) continue;
                else if (key == 'style.header') {
                    var value = localStorage[key].split(', ');
                    if (value[0].substring(0,19) != 'chrome-extension://' && value[0] != "http://s.cdn.gaiaonline.com/images/gaia_global/gaia_header/new_header/il_header_bg_barton_sprite.jpg") this.push['header.background'] = value[0];
                    if (typeof(value[1]) == 'string' && value[1].substring(0,19) != 'chrome-extension://' && value[1] != 'http://s.cdn.gaiaonline.com/images/gaia_global/gaia_header/new_header/rs_header_bg_barton_tile_sprite.jpg') this.push['header.background.base'] = value[1];
                }
                else this.push[this.string[key]] = localStorage[key];
            }
        }

        // Set other
        for (var key in this.other) {
            if (typeof(localStorage[key]) == 'string') {
                if (key == 'shortcuts' && (localStorage[key] == '{"name": "Forums", "URL": "/forum/"}ITSurHRTnSOL{"name": "My%20Posts", "URL": "/forum/myposts/"}ITSurHRTnSOL{"name": "My%20Topics", "URL": "/forum/mytopics/"}ITSurHRTnSOL{"name": "Shops", "URL": "/market/"}ITSurHRTnSOL{"name": "Trades", "URL": "/gaia/bank.php"}ITSurHRTnSOL{"name": "Marketplace", "URL": "/marketplace/"}ITSurHRTnSOL{"name": "MyGaia", "URL": "/mygaia/"}ITSurHRTnSOL{"name": "Private%20Messages", "URL": "/profile/privmsg.php"}ITSurHRTnSOL{"name": "Guilds", "URL": "/guilds/"}ITSurHRTnSOL{"name": "Subscribed%20Threads", "URL": "/forum/subscription/"}ITSurHRTnSOL{"name": "Subscribed%20Journals", "URL": "/j/%3Fmode%3Dlanding"}ITSurHRTnSOL{"name": "Top%20of%20Page", "URL": "%23"}ITSurHRTnSOL{"name": "Bottom%20of%20Page", "URL": "%23bg_bottomofpage"}' || localStorage[key] == '') ||
                    key == 'posts.formatter.formats' && (localStorage[key] == '{"name": "Heart%20and%20Soul", "format": "%5Bsize%3D11%5D%5Bcolor%3Ddarkslategray%5D%5Bb%5DNot%20even%20%5Bcolor%3Dgoldenrod%5Dgold%5B/color%5D%20and%20%5Bcolor%3Dslategray%5Dsilver%5B/color%5D%20can%5B/b%5D%5B/color%5D%5B/size%5D%5Balign%3Dcenter%5D%0A%0A%0ATo%20customize%20this%20post%20format%20and%20add%20others%2C%20go%20to%20your%20BetterGaia%20Options%20in%20Chrome.%0AFor%20help%2C%20%5Burl%3Dhttp%3A//www.gaiaonline.com/forum/t.45053993/%5Dvisit%20our%20thread%5B/url%5D.%0A%0A%0A%5B/align%5D%5Balign%3Dright%5D%5Bsize%3D11%5D%5Bcolor%3Ddarkslategray%5D%5Bb%5Dbreak%20the%20%5Bcolor%3Droyalblue%5Dtwo%5B/color%5D%20of%20us...%5B/b%5D%5B/color%5D%5B/size%5D%5B/align%5D", "style": "0"}ITSurHRTnSOL{"name": "Diamond%20and%20Pearl", "format": "This%20should%20be%20under%20Diamond%20and%20Pearl.", "style": "1"}ITSurHRTnSOL{"name": "Ruby%20and%20Sapphire", "format": "This%20should%20be%20under%20Ruby%20and%20Sapphire.", "style": "2"}ITSurHRTnSOL{"name": "Gold%20and%20Silver", "format": "This%20should%20be%20under%20Gold%20and%20Silver.", "style": "3"}ITSurHRTnSOL{"name": "Red%20and%20Blue", "format": "This%20should%20be%20under%20Red%20and%20Blue.", "style": "4"}' || localStorage[key] == '') ||
                    key == 'usertags' && localStorage[key] == ''
                ) continue;

                if (key == 'shortcuts') {
                    var shortcuts = localStorage['shortcuts'].split('ITSurHRTnSOL');
                    var links = [];

                    for (var i; i <= shortcuts.length; i++) {
                        var value = JSON.parse(shortcuts[i]);
                        links.push([unescape(value['name']), unescape(value['URL'])]);
                    }

                    this.push[this.string[key]] = links;
                }
                else if (key == 'posts.formatter.formats') {
                    var postformating = localStorage['posts.formatter.formats'].split('ITSurHRTnSOL');
                    var formats = [];
	
                    for (var i; i <= postformating.length; i++) {
                        var value = JSON.parse(postformating[i]);
                        formats.push([unescape(value['name']), encodeURI(unescape(value['format'])), unescape(value['style'])]);
                    }

                    this.push[this.string[key]] = formats;
                }
                else if (key == 'usertags') {
                    var usertags = localStorage['usertags'].split('ITSurHRTnSOL');
                    var tags = {};

                    for (var i; i <= usertags.length; i++) {
                        var value = JSON.parse(usertags[i]);
                        var id = value['userid'];
                        tags.push({id: [unescape(value['username']), unescape(value['tag']), unescape(value['url']), value['createdon']]});
                    }

                    this.push[this.string[key]] = tags;                    
                }
            }
        }

        // Remove defaults
        for (var key in this.push) {
            if (this.push[key] == defaultPrefs[key]) delete this.push[key];
        }

        // Save
        console.log(this.push);
    }
};