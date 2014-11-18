/*
Main JS
Copyright (c) BetterGaia and Bowafishtech
Unauthorized copying, sharing, adaptation, publishing, commercial usage, and/or distribution, its derivatives and/or successors, via any medium, is strictly prohibited.
*/


$(document).ready(function() {
    $('#user_account').wrap('<div class="wrap"></div>');
    $('#user_header_wrap > .hud-stats').css('margin-right', ($('#user_account').width() + 10) + 'px')
});
