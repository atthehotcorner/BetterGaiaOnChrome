$(document).ready(function() {
    $('#menu ul li a').on('click', function() {
        $('#menu ul li.active').removeClass('active');
        $(this).parent().addClass('active');
        $('.pure-u-4-5').addClass('loading').attr('data-page', $(this).attr('href'));

        $.ajax({
            url: $(this).attr('href'),
            dataType: 'html',
            cache: false
        }).done(function(data) {
            $('.pure-u-4-5').html(data);
        }).fail(function() {
            $('.pure-u-4-5').html('<p>There was a problem getting the page.</p>');
        }).always(function() {
            $('.pure-u-4-5').removeClass('loading');
        });

        ga('set', 'page', '/sidebar/' + $(this).attr('href'));
        ga('send', 'pageview');
        return false;
    });

    $('#menu a[href="home.html"]').click();

    $('.pure-u-4-5').on('click', '.test', function() {
      $('#menu a[href="test.html"]').click();
      ga('send', 'event', 'Link', 'click', 'Firefox Testing Info');
    });

    $('.pure-u-4-5').on('click', '.test-exit', function() {
      ga('send', 'event', 'Link', 'click', 'Firefox Testing Exit');
    });
});

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-48760437-2', 'auto');
ga('set', 'page', '/sidebar/home.html');
ga('send', 'pageview');
