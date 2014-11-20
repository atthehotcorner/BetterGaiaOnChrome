/*
Main JS
Copyright (c) BetterGaia and Bowafishtech
Unauthorized copying, sharing, adaptation, publishing, commercial usage, and/or distribution, its derivatives and/or successors, via any medium, is strictly prohibited.
*/

$(document).ready(function() {
    $('#user_account').wrap('<div class="wrap"></div>');
    $('#gaia_header #user_account').prepend('<a class="bgsettings">BG</a>');
    $('#gaia_header #user_account a.bgsettings').on('click', function() {
        window.location.hash = '#bgsettings';
    });
    $('#user_header_wrap > .hud-stats').css('margin-right', ($('#user_account').width() + 10) + 'px');
});
