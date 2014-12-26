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

        return false;
    });

    $('#menu a[href="home.html"]').click();
});
