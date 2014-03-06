$.fn.preload = function() {
    this.each(function(){
        $('<img/>')[0].src = this;
    });
}

function checkMobileSize() {
    if (window.innerWidth < 600) $('body').addClass('mobile');
    else $('body').removeClass('mobile');
}

$(window).resize(function(){
    checkMobileSize();
});

$(document).ready(function(){
    checkMobileSize();
    
    $(['assets/img/1.jpg', 'assets/img/2.jpg', 'assets/img/3.jpg', 'assets/img/4.jpg']).preload();
    
    $('#about .wrapper article').mouseover(function() {
        if (!$(this).hasClass('active') && !$('body').hasClass('mobile')) {
            var url = $(this).attr('data-urlbackground');
            $('#pane .background').css('background-image', $('#pane').css('background-image')).show(0, function(){
                $('#pane').css('background-image', 'url(' + url + ')');
                $(this).fadeOut(750);
            });
            
            $('#about .wrapper article.active').removeClass('active');
            $(this).addClass('active');
        }
    });
    
    $('#contact a[href]').on('click', function(){
        $(this).text('contact@abrahamyuen.com').off('click');
    });
});