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

        // Remove defaults
        for (var key in this.push) {
            if (this.push[key] == defaultPrefs[key]) delete this.push[key];
        }
        console.log(this.push);
    }
};