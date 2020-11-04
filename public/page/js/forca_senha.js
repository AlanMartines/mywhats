$(document).ready(function() {
    // https://github.com/elboletaire/password-strength-meter
    // https://elboletaire.github.io/password-strength-meter/
    // https://adri-sorribas.github.io/passtrength/
    //
    $("#show_hide_password i").on('click', function(event) {
        event.preventDefault();

        if ($("#show_hide_password input").attr("type") === "text") {
            $("#show_hide_password input").attr('type', 'password');
            $("#show_hide_password i").addClass("fa-eye-slash");
            $("#show_hide_password i").removeClass("fa-eye");

        } else if ($("#show_hide_password input").attr("type") === "password") {
            $("#show_hide_password input").attr('type', 'text');
            $("#show_hide_password i").removeClass("fa-eye-slash");
            $("#show_hide_password i").addClass("fa-eye");
        }
    });
    //
    $("#show_hide_new i").on('click', function(event) {
        event.preventDefault();

        if ($("#show_hide_new input").attr("type") === "text") {
            $("#show_hide_new input").attr('type', 'password');
            $("#show_hide_new i").addClass("fa-eye-slash");
            $("#show_hide_new i").removeClass("fa-eye");

        } else if ($("#show_hide_new input").attr("type") === "password") {
            $("#show_hide_new input").attr('type', 'text');
            $("#show_hide_new i").removeClass("fa-eye-slash");
            $("#show_hide_new i").addClass("fa-eye");
        }
    });
//
    $("#show_password i").on('click', function(event) {
        event.preventDefault();

        if ($("#show_password input").attr("type") === "text") {
            $("#show_password input").attr('type', 'password');
            $("#show_password i").addClass("fa-eye-slash");
            $("#show_password i").removeClass("fa-eye");

        } else if ($("#show_password input").attr("type") === "password") {
            $("#show_password input").attr('type', 'text');
            $("#show_password i").removeClass("fa-eye-slash");
            $("#show_password i").addClass("fa-eye");
        }
    }); 
//
    $('#senha').passtrength({
        minChars: 8,
        passwordToggle: false,
        tooltip: true,
        textVeryWeak: "Muito Fraca",
        textWeak: "Fraca",
        textMedium: "Média",
        textStrong: "Forte",
        textVeryStrong: "Muito forte",
        eyeImgOpen: '<i class="fas fa-eye"></i>',
        eyeImgClose: '<i class="fas fa-eye-slash"></i>'
    });
    //
});