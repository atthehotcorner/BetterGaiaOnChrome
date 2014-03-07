$(document).ready(function() {
    $('#download a.button.chrome').on('click', function(){
        chrome.webstore.install('https://chrome.google.com/webstore/detail/lmgjagdflhhfjflolfalapokbplfldna', function() {
            $('#download a.button.chrome').parent().text('Get ready for a better gaia.');
        }, function() {
            //window.location.href = $('#download a.button.chrome').attr('href');
        });
        return false;
    });
});