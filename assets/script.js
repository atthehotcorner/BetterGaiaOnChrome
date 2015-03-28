/*global chrome: false*/
/*jshint browser: true, jquery: true*/

var Animate = {
    timeout: {
        drawAll: '',
        notification: ''
    },

    ran: {
        drawAll: false,
        notification: false
    },
    
    drawAll: function() {
        this.ran.drawAll = true;

        $('.drawall').removeClass('state-2').addClass('state-0');
        
        Animate.timeout.drawAll = setTimeout(function() {
            $('.drawall').removeClass('state-0').addClass('state-1');
                
            Animate.timeout.drawAll = setTimeout(function() {
                $('.drawall').removeClass('state-1').addClass('state-2');

                /*Animate.timeout.drawAll = setTimeout(function() {
                    Animate.drawAll();
                }, 5000);*/
            }, 1250);
        }, 250);
    },
    
    notification: function() {
        this.ran.notification = true;

        $('.notification').removeClass('state-1').addClass('state-0');
        
        Animate.timeout.notification = setTimeout(function() {
            $('.notification').removeClass('state-0').addClass('state-1');
        }, 250);
    }
};

// Animate once when in view (could use reduced polling of scroll)
$(window).scroll(function() {
    if (!Animate.ran.drawAll && $(this).scrollTop() > ($('.drawall').offset().top - 0.5*$(window).height())) {
        Animate.drawAll();
    }
    else if (!Animate.ran.notification && $(this).scrollTop() > ($('.notification').offset().top - 0.65*$(window).height())) {
        Animate.notification();
    }
});


$('.download .chrome').on('click', function() {
    try {
        chrome.webstore.install('https://chrome.google.com/webstore/detail/lmgjagdflhhfjflolfalapokbplfldna');
        return false;
    }
    catch (error) {}
});
