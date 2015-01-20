// Settings
var data = {
    home: [{
        key: 'header.drawAll',
        type: 'checkbox',
        description: 'Use Draw All for Daily Chance'
    }, {
        key: 'pms',
        type: 'checkbox',
        description: 'Enhance private messages and use instant search'
    }, {
        key: 'mygaia.suggested',
        type: 'checkbox',
        description: 'Hide suggested content in MyGaia'
    }, {
        key: 'header.background.stretch',
        type: 'checkbox',
        description: 'Stretch the header background'
    }, {
        key: 'header.float',
        type: 'checkbox',
        description: 'Float username and notifications when scrolling'
    }, {
        key: 'header.widgets',
        type: 'checkbox',
        description: 'Add widgets by your username'
    }, {
        key: 'announcementReader',
        type: 'checkbox',
        description: 'Use Announcement Reader'
    }, {
        key: 'mygaia.bgchat',
        type: 'checkbox',
        description: 'Chat with other BetterGaia users'
    }, {
        key: 'notifications',
        type: 'select',
        values: [
            {name: '1 minute', value: 1}, 
            {name: '5 minutes', value: 5}, 
            {name: '10 minutes', value: 10}, 
            {name: '15 minutes', value: 15},
            {name: '30 minutes', value: 30},
            {name: '1 hour', value: 60},
            {name: 'Never', value: 0}
        ],
        description: 'When logged in, check for and show new notifications on the desktop every'
    }],
    
    background: [{
        key: 'background.repeat',
        type: 'checkbox',
        description: 'Tile background image'
    }, {
        key: 'background.float',
        type: 'checkbox',
        description: 'Float background when scrolling'
    }, {
        key: 'background.color',
        type: 'text',
        description: 'Background color'
    }, {
        key: 'background.position',
        type: 'select',
        values: [
            {name: 'Top Left', value: 'top left'}, 
            {name: 'Top Center', value: 'top center'}, 
            {name: 'Top Right', value: 'top right'}, 
            {name: 'Center Left', value: 'center left'},
            {name: 'Center Center', value: 'center center'},
            {name: 'Center Right', value: 'center right'},
            {name: 'Bottom Left', value: 'bottom left'},
            {name: 'Bottom Center', value: 'bottom center'},
            {name: 'Bottom Right', value: 'bottom right'}
        ],
        description: 'Position of background image'
    }],
    
    colors: [{
        key: 'header.nav',
        type: 'text',
        description: 'Navigation base color'
    }, {
        key: 'header.nav.hover',
        type: 'text',
        description: 'Navigation hover color'
    }, {
        key: 'header.nav.current',
        type: 'text',
        description: 'Navigation selected color'
    }, {
        key: 'forum.threadHeader',
        type: 'text',
        description: 'Forums main color'
    }, {
        key: 'forum.postHeader',
        type: 'text',
        description: 'Forums posts color'
    }],

    forums: [{
        key: 'forum.constrain',
        type: 'checkbox',
        description: 'Constrain width of forums'
    }, {
        key: 'forum.externalLinks',
        type: 'checkbox',
        description: 'Show external link warning in same page'
    }, {
        key: 'forum.previewThreads',
        type: 'checkbox',
        description: 'Use thread preview in thread listings'
    }, {
        key: 'forum.post.optionsBottom',
        type: 'checkbox',
        description: 'Show post options at bottom of posts'
    }, {
        key: 'forum.post.bgContainer',
        type: 'checkbox',
        description: 'Show background around posts'
    }, {
        key: 'forum.pollHide',
        type: 'checkbox',
        description: 'Show polls collapsed in threads'
    }, {
        key: 'forum.postOffWhite',
        type: 'checkbox',
        description: 'Show posts with an off-white background'
    }],
    
    postformat: [{
        key: 'format.list.useRecent',
        type: 'checkbox',
        description: 'Set the format I last used as the default format'
    }, {
        key: 'format.quote.endOfFormat',
        type: 'checkbox',
        description: 'Place my format before the post I quote'
    }, {
        key: 'format.quote.removeFormatting',
        type: 'checkbox',
        description: 'Remove BBCode from posts I quote'
    }, {
        key: 'format.quote.spoilerWrap',
        type: 'checkbox',
        description: 'Wrap posts I quote in a spoiler tag'
    }, {
        key: 'format.quote.rangeNumber',
        type: 'select',
        values: [
            {name: 'No lines', value: 0}, 
            {name: '1 line', value: 1}, 
            {name: '2 lines', value: 2}, 
            {name: '3 lines', value: 3},
            {name: '4 lines', value: 4},
            {name: '5 lines', value: 5}
        ],
        description: 'Seperate my post format and the quote with'
    }, {
        key: 'format.forums',
        type: 'checkbox',
        description: 'Forums'
    }, {
        key: 'format.guildForums',
        type: 'checkbox',
        description: 'Guilds'
    }, {
        key: 'format.pms',
        type: 'checkbox',
        description: 'Private Messages'
    }, {
        key: 'format.profileComments',
        type: 'checkbox',
        description: 'Profile Comments'
    }]
};

// Handlebars setup
Handlebars.registerHelper('if_eq', function(a, b, opts) {
    if(a == b) // Or === depending on your needs
        return opts.fn(this);
    else
        return opts.inverse(this);
});
var template = Handlebars.compile($('#option-template').html());

// Init functions (Could be better written, I know)
function init(pageName) {
    if (pageName == 'Home') {
        $('.page[data-page="Home"] fieldset').html(template(data.home));
    }
    else if (pageName == 'Shortcuts') {
        // nothing at the moment
    }
    else if (pageName == 'Personalize') {
        // nothing at the moment
    }
    else if (pageName == 'Background') {
        $('.page[data-page="Background"] fieldset').html(template(data.background));
    }
    else if (pageName == 'Header') {
        $('.page[data-page="Header"] fieldset').html(template(data.header));
    }
    else if (pageName == 'Logo') {
        $('.page[data-page="Logo"] fieldset').html(template(data.logo));
    }
    else if (pageName == 'Colors') {
        $('.page[data-page="Colors"] fieldset').html(template(data.colors));
    }
    else if (pageName == 'Forums') {
        $('.page[data-page="Forums"] fieldset').html(template(data.forums));
    }
    else if (pageName == 'PostFormat') {
        $('.page[data-page="PostFormat"] fieldset').html(template(data.postformat));
    }
    else if (pageName == 'UserTags') {
        $('.page[data-page="UserTags"] fieldset').html(template(data.usertags));
    }
    else if (pageName == 'About') {
        // nothing at the moment
    }
    else {
        throw('Error: ' + pageName + ' is not a valid page to initialize.');
    }
};

// Menu
$('#nav .pure-menu').on('click', 'a[href]', function() {
    if ($(this).hasClass('selected')) return false;
    else {
        $('#pages .page.selected, #nav .pure-menu a.selected').removeClass('selected');
        
        var pageName = $(this).attr('href').substring(1),
            page = $('#pages .page[data-page="' + pageName + '"]');
        if (!page.hasClass('loaded')) {
            try {init(pageName);}
            catch(e) {debugBro(e);}
            page.addClass('loaded');
        }
        page.addClass('selected');
        $(this).addClass('selected');
    }
});

$(window).on('hashchange', function() {
    if (window.location.hash === '') $('#nav .pure-menu a[href="#Home"]').click();
    else $('#nav .pure-menu a[href="' + window.location.hash + '"]').click();
});

if (window.location.hash === '') $('#nav .pure-menu a[href="#Home"]').click();
else $('#nav .pure-menu a[href="' + window.location.hash + '"]').click();

// Debug message
function debugBro(error) {
    window.prompt('We\'re having some trouble with Settings. \nCan you pass this message over to us?',
                  'Runtime message: ' + error + ' Name: ' + error.name + ' Stack: ' + error.stack + ' Message: ' + error.message);
};