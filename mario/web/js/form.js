$('#registrationModal').on('click', function() {
    $('#registrationModal').modal('show');
});
$('#registrationModal').on('shown.bs.modal', function() {
    $('#registrationModal').on('click', function() {
        $('#registrationModal').hide('show');
        window.location.href = '/authorization.php';
    });
});
