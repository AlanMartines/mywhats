function startVenon(SessionName) {
    $.ajax({
        url: '/sistem/start/' + SessionName,
        dataType: 'json',
        beforeSend: function () {

        },
        success: function (response) {
            console.log(response);
            if (response.result == "info" && response.state == "STARTING") {
                $("#qrcodeVenon").html('<img src="/images/whatsapp-logo.png" class="img-fluid" width="120px" alt="Sucesso">');
                $("#startVenom").html("Iniciando");
                $("#statusVenon").html("Off-line");
            } else if (response.result == "warning" && response.state == "QRCODE") {
                qrcodeVenon(SessionName);
                $("#startVenom").html("Ler QR-Code");
                $("#statusVenon").html("Off-line");
            } else if (response.result == "success" && response.state == "CONNECTED") {
                $("#qrcodeVenon").html('<img src="/images/whatsapp-logo.png" class="img-fluid" width="120px" alt="Sucesso">');
                $("#startVenom").html("Conectado");
                $("#statusVenon").html("On-line");
            } else if (response.result == "error" && response.state == "UNPAIRED" || response.state == "UNPAIRED_IDLE") {
                $("#qrcodeVenon").html('<img src="/images/whatsapp-logo-off.png" class="img-fluid" width="120px" alt="Sucesso">');
                $("#startVenom").html("Não Conectado");
                $("#statusVenon").html("Off-line");
            } else if (response.result == "success" && response.state == "CLOSED") {
                $("#qrcodeVenon").html('<img src="/images/whatsapp-logo-off.png" class="img-fluid" width="120px" alt="Sucesso">');
                $("#startVenom").html("Saindo...");
                $("#statusVenon").html("Off-line");
            } else {

            }
        }
    });
}
//
function statusVenon(SessionName) {
    $.ajax({
        url: '/sistem/close/' + SessionName,
        dataType: 'json',
        beforeSend: function () {

        },
        success: function (response) {
            if (response.result == "success" && response.state == "CLOSED") {
                $("#qrcodeVenon").html('<img src="/images/whatsapp-logo-off.png" class="img-fluid" width="120px" alt="Sucesso">');
                $("#statusVenon").html("Off-line");
            } else {
                $("#qrcodeVenon").html('<img src="/images/whatsapp-logo.png" class="img-fluid" width="120px" alt="Sucesso">');
                $("#statusVenon").html(response.state);
            }
        }
    });
}
//
function closeVenon(SessionName) {
    $.ajax({
        url: '/sistem/close/' + SessionName,
        dataType: 'json',
        beforeSend: function () {

        },
        success: function (response) {
            if (response.result == "success" && response.state == "CLOSED") {
                $("#qrcodeVenon").html('<img src="/images/whatsapp-logo-off.png" class="img-fluid" width="150px" alt="Sucesso">');
                $("#startVenom").html("Saindo...");
            } else {
                $("#qrcodeVenon").html('<img src="/images/whatsapp-logo.png" class="img-fluid" width="150px" alt="Sucesso">');
                $("#startVenom").html(response.state);
            }
        }
    });
}
//
function qrcodeVenon(SessionName) {
    $.ajax({
        url: '/sistem/QRCode/' + SessionName + '/false',
        dataType: 'json',
        beforeSend: function () {

        },
        success: function (response) {
            if (response.result == "warning" && response.state == "QRCODE" || response.state == "UNPAIRED" || response.state == "UNPAIRED_IDLE") {
                $("#qrcodeVenon").html('<img src="' + response.qrcode + '" class="img-fluid" width="120px" alt="QR-Code">');
            } else {
                $("#qrcodeVenon").html('<img src="../images/whatsapp-logo.png" class="img-fluid" width="120px" alt="Sucesso">');
            }
        }
    });
}
//
$('document').ready(function () {
    //
    //---------------------------------------------------------------------------------------------------------------------------------------------------//
    // Onde estou
    var ResponseURL = window.location.href;
    var domain = ResponseURL.split('/');
    var dir_local = domain[domain.length - 2];
    //
    //---------------------------------------------------------------------------------------------------------------------------------------------------//
    //
    //

    var SessionName = $("#SessionName").val();
    if (SessionName) {
        startVenon(SessionName);
    }
    var auto_refresh_qrcode = setInterval(
        function () {
            if (SessionName) {
                startVenon(SessionName);
            }

        }, 2000); // refresh every 1000 milliseconds

    //
    $('#starVenon').click(function (e) {
        var SessionName = $("#SessionName").val();
        startVenon(SessionName);
    });
    $('#restarVenon').click(function (e) {
        var SessionName = $("#SessionName").val();
        closeVenon(SessionName);
        startVenon(SessionName);
    });
    $('#closeVenon').click(function (e) {
        var SessionName = $("#SessionName").val();
        closeVenon(SessionName);
    });
    //
    //---------------------------------------------------------------------------------------------------------------------------------------------------//
    //
});