function startVenon(SessionName) {
    $.ajax({
        method: "POST",
        url: 'http://localhost:9000/sistem/Start',
        data: {
            SessionName: SessionName
        },
        contentType: "application/json",
        dataType: 'json',
        async: false,
        cache: false,
        beforeSend: function () {

        },
        success: function (response) {
            console.log(response);
            if (response.result == "info" && response.state == "STARTING") {
                $("#qrcodeVenon").html('<img src="/images/whatsapp-bot.png" class="img-fluid" width="120px" alt="Sucesso">');
                $("#startVenom").html("Iniciando");
                $("#statusVenon").html("Off-line");
            } else if (response.result == "warning" && response.state == "QRCODE" || response.status == "notLogged") {
                qrcodeVenon(SessionName);
                $("#qrcodeVenon").html('<img src="/images/whatsapp-logo-off.png" class="img-fluid" width="120px" alt="Erro">');
                $("#startVenom").html("Ler QR-Code");
                $("#statusVenon").html("Off-line");
            } else if (response.result == "success" && response.state == "CONNECTED" ) {
                $("#qrcodeVenon").html('<img src="/images/whatsapp-bot.png" class="img-fluid" width="120px" alt="Sucesso">');
                $("#startVenom").html("Conectado");
                $("#statusVenon").html("On-line");
            } else if (response.result == "success" && response.state == "CONNECTED"  && response.status == "desconnectedMobile") {
                closeVenon(SessionName);
                $("#qrcodeVenon").html('<img src="/images/whatsapp-logo-off.png" class="img-fluid" width="120px" alt="Erro">');
                $("#startVenom").html("Desonectado");
                $("#statusVenon").html("Off-line");
            } else if (response.result == "error" && response.state == "UNPAIRED" || response.state == "UNPAIRED_IDLE" || response.status == "notLogged") {
                $("#qrcodeVenon").html('<img src="/images/whatsapp-logo-off.png" class="img-fluid" width="120px" alt="Erro">');
                $("#startVenom").html("Desonectado");
                $("#statusVenon").html("Off-line");
            } else if (response.result == "success" && response.state == "CLOSED") {
                $("#qrcodeVenon").html('<img src="/images/whatsapp-logo-off.png" class="img-fluid" width="120px" alt="Erro">');
                $("#startVenom").html("Saindo...");
                $("#statusVenon").html("Off-line");
            } else {
                $("#qrcodeVenon").html('<img src="/images/whatsapp-logo-off.png" class="img-fluid" width="120px" alt="Erro">');
                $("#startVenom").html("Desonectado");
                $("#statusVenon").html("Off-line");
            }
        }
    }).fail(function (jqXHR, textStatus, msg) {
        $("#qrcodeVenon").html('<img src="/images/whatsapp-logo-off.png" class="img-fluid" width="120px" alt="Sucesso">');
        $("#startVenom").html("Desonectado");
        $("#statusVenon").html("Off-line");
    });
}
//
function statusVenon(SessionName) {
    $.ajax({
        method: "POST",
        url: 'http://localhost:9000/sistem/Status',
        data: {
            SessionName: SessionName
        },
        contentType: "application/json",
        dataType: 'json',
        async: false,
        cache: false,
        beforeSend: function () {

        },
        success: function (response) {
            if (response.result == "success" && response.state == "CLOSED") {
                $("#qrcodeVenon").html('<img src="/images/whatsapp-logo-off.png" class="img-fluid" width="120px" alt="Erro">');
                $("#statusVenon").html("Off-line");
            } else {
                $("#qrcodeVenon").html('<img src="/images/whatsapp-bot.png" class="img-fluid" width="120px" alt="Sucesso">');
                $("#statusVenon").html(response.state);
            }
        }
    });
}
//
function closeVenon(SessionName) {
    $.ajax({
        method: "POST",
        url: 'http://localhost:9000/sistem/Close/',
        data: {
            SessionName: SessionName
        },
        contentType: "application/json",
        dataType: 'json',
        async: false,
        cache: false,
        beforeSend: function () {

        },
        success: function (response) {
            if (response.result == "success" && response.state == "CLOSED") {
                $("#qrcodeVenon").html('<img src="/images/whatsapp-logo-off.png" class="img-fluid" width="150px" alt="Erro">');
                $("#startVenom").html("Saindo...");
            } else {
                $("#qrcodeVenon").html('<img src="/images/whatsapp-bot.png" class="img-fluid" width="150px" alt="Sucesso">');
                $("#startVenom").html(response.state);
            }
        }
    }).fail(function (jqXHR, textStatus, msg) {
        $("#qrcodeVenon").html('<img src="/images/whatsapp-logo-off.png" class="img-fluid" width="120px" alt="Erro">');
        $("#startVenom").html("Desonectado");
        $("#statusVenon").html("Off-line");
    });
}
//
function qrcodeVenon(SessionName) {
    $.ajax({
        method: "POST",
        url: 'http://localhost:9000/sistem/QRCode/',
        data: {
            SessionName: SessionName,
            View: false
        },
        contentType: "application/json",
        dataType: 'json',
        async: false,
        cache: false,
        beforeSend: function () {

        },
        success: function (response) {
            if (response.result == "warning" && response.state == "QRCODE" || response.state == "UNPAIRED" || response.state == "UNPAIRED_IDLE") {
                $("#qrcodeVenon").html('<img src="' + response.qrcode + '" class="img-fluid" width="120px" alt="QR-Code">');
            } else {
                $("#qrcodeVenon").html('<img src="../images/whatsapp-bot.png" class="img-fluid" width="120px" alt="Sucesso">');
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