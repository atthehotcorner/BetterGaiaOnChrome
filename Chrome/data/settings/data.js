var data = {
    Home: [{
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
        key: 'header.shortcuts',
        type: 'checkbox',
        description: 'Use Shortcuts by your username'
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
        description: 'When logged in, check for and show a desktop notification every'
    }, {
        key: 'notifications.ignoreAnnouncements',
        type: 'checkbox',
        description: 'If the only notifications are announcements, don\'t show a desktop notification'
    }],
    
    Background: [{
        key: 'background.image',
        type: 'text',
        description: 'Background image',
        hidden: true
    }, {
        key: 'background.repeat',
        type: 'checkbox',
        description: 'Tile background image'
    }, {
        key: 'background.float',
        type: 'checkbox',
        description: 'Float background when scrolling'
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
    }, {
        key: 'background.color',
        type: 'color',
        description: 'Background color'
    }],

    Header: [{
        key: 'header.background',
        type: 'text',
        description: 'Header image',
        hidden: true
    }, {
        key: 'header.background.base',
        type: 'text',
        description: 'Header image base',
        hidden: true
    }],
    
    Logo: [{
        key: 'header.logo',
        type: 'text',
        description: 'Logo image',
        hidden: true
    }],
    
    Colors: [{
        key: 'header.nav',
        type: 'color',
        description: 'Navigation base color'
    }, {
        key: 'header.nav.hover',
        type: 'color',
        description: 'Navigation hover color'
    }, {
        key: 'header.nav.current',
        type: 'color',
        description: 'Navigation selected color'
    }, {
        key: 'forum.threadHeader',
        type: 'color',
        description: 'Forums main color'
    }, {
        key: 'forum.postHeader',
        type: 'color',
        description: 'Forums posts color'
    }],

    Forums: [{
        key: 'format',
        type: 'checkbox',
        description: 'Use post formatting'
    }, {
        key: 'usertags',
        type: 'checkbox',
        description: 'Use user tags to add notes about other users'
    }, {
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
    }, {
        key: 'forum.reduceTransparency',
        type: 'checkbox',
        description: 'Reduce transparency in forums'
    }],
    
    PostFormat: [{
        key: 'format.list.useRecent',
        type: 'checkbox',
        description: 'Set the format last used as the default format'
    }, {
        key: 'format.quote.endOfFormat',
        type: 'checkbox',
        description: 'Place format before the post quoted'
    }, {
        key: 'format.quote.removeFormatting',
        type: 'checkbox',
        description: 'Remove BBCode from posts quoted'
    }, {
        key: 'format.quote.spoilerWrap',
        type: 'checkbox',
        description: 'Wrap posts quoted in a spoiler tag'
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
        description: 'Seperate format and the quote with'
    }, {
        key: 'format.forums',
        type: 'checkbox',
        description: 'Use in Forums'
    }, {
        key: 'format.guildForums',
        type: 'checkbox',
        description: 'Use in Guilds'
    }, {
        key: 'format.pms',
        type: 'checkbox',
        description: 'Use in Private Messages'
    }, {
        key: 'format.profileComments',
        type: 'checkbox',
        description: 'Use in Profile Comments'
    }]
};