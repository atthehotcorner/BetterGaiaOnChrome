function isElementInViewport(el) {
    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
}

$(document).ready(function(){
    $('#home').css('min-height', ($(window).innerHeight() > 650)? $(window).innerHeight() : 650);
    
    var infoHeight = $('#home .info').outerHeight();
    var infoWidth = $('#home .info').outerWidth();
    $('#home .info').css({'margin-top': -infoHeight/2 - 20, 'margin-left': -infoWidth/2});

    $('#home').parallax("50%", 0.2);
    $('#about').parallax("50%", 0.1);
    $('#personalize').parallax("50%", 0.1);
    $('#download').parallax("50%", 0.1);

    $('nav a').on('click', function(){
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top
        }, 1000);
    });
    
    $('#download button.install').on('click', function(){
        if (chrome.app.isInstalled) $(this).html('You already have BetterGaia!');
        else if (/chrom(e|ium)/.test(navigator.userAgent.toLowerCase())) chrome.webstore.install();
        else $(this).html('You\'re not using Chrome!');
    })
});

$(window).resize(function(){
    var infoHeight = $('#home .info').outerHeight();
    var infoWidth = $('#home .info').outerWidth();
    $('#home .info').css({'margin-top': -infoHeight/2 - 20, 'margin-left': -infoWidth/2});
});

$(window).scroll(function(){
    var windscroll = $(window).scrollTop();

    // visiblity
    if (windscroll >= 600) {
        $('#pages > section').each(function(i) {
            if ($(this).position().top <= windscroll + 50) $(this).addClass('visible');
            else $(this).removeClass('visible');
        });
    }
    
    // for navigation
    if (windscroll >= 550) {
        $('nav').addClass('fixed');
        $('#pages > section').each(function(i) {
            if ($(this).position().top <= windscroll + 75) {
                $('nav a.active').removeClass('active');
                $('nav a').eq(i).addClass('active');
            }
        });

    }
    else {
        $('nav').removeClass('fixed');
        $('nav a.active').removeClass('active');
        $('nav a:first').addClass('active');
    }

});