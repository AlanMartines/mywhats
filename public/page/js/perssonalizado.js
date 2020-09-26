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
    //Celular
    jQuery.validator.addMethod('celular', function (value, element) {
        value = value.replace("(", "");
        value = value.replace(")", "");
        value = value.replace("-", "");
        value = value.replace(" ", "").trim();
        if (value == '0000000000') {
            return (this.optional(element) || false);
        } else if (value == '00000000000') {
            return (this.optional(element) || false);
        }
        if (["00", "01", "02", "03", , "04", , "05", , "06", , "07", , "08", "09", "10"].indexOf(value.substring(0, 2)) != -1) {
            return (this.optional(element) || false);
        }
        if (value.length < 9 || value.length > 12) {
            return (this.optional(element) || false);
        }
        if (["6", "7", "8", "9"].indexOf(value.substring(2, 3)) == -1) {
            return (this.optional(element) || false);
        }
        return (this.optional(element) || true);
    }, 'Informe um celular válido');

    //Telefone fixo
    jQuery.validator.addMethod('telefone', function (value, element) {
        value = value.replace("(", "");
        value = value.replace(")", "");
        value = value.replace("-", "");
        value = value.replace(" ", "").trim();
        if (value == '0000000000') {
            return (this.optional(element) || false);
        } else if (value == '00000000000') {
            return (this.optional(element) || false);
        }
        if (["00", "01", "02", "03", , "04", , "05", , "06", , "07", , "08", "09", "10"].indexOf(value.substring(0, 2)) != -1) {
            return (this.optional(element) || false);
        }
        if (value.length < 10 || value.length > 11) {
            return (this.optional(element) || false);
        }
        if (["1", "2", "3", "4", "5"].indexOf(value.substring(2, 3)) == -1) {
            return (this.optional(element) || false);
        }
        return (this.optional(element) || true);
    }, 'Informe um telefone válido!');

    //
    jQuery.validator.addMethod("filesize_max", function (value, element, param) {
        var isOptional = this.optional(element),
            file;

        if (isOptional) {
            return isOptional;
        }

        if ($(element).attr("type") === "file") {

            if (element.files && element.files.length) {

                file = element.files[0];
                return (file.size && file.size <= param);
            }
        }
        return false;
    }, "O arquivo deve ser de no máximo 10 MB!");
    //
    //---------------------------------------------------------------------------------------------------------------------------------------------------//
    //
    $("#login-form").validate({
        rules: {
            email: {
                required: true
            },
            pwd: {
                required: true
            }
        },
        messages: {
            email: {
                required: "Informe seu e-mail!"
            },
            pwd: {
                required: "Informe sua senha!"
            }
        },
        errorPlacement: function (error, element) {
            $(element).closest('.form-group').find('.help-block').html(error.html());
        },
        highlight: function (element) {
            $(element).closest('.form-control').removeClass('is-valid').addClass('is-invalid');
            $(element).closest('.custom-select').removeClass('is-valid').addClass('is-invalid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).closest('.form-group').find('.help-block').html('');
            $(element).closest('.form-control').removeClass('is-invalid').addClass('is-valid');
            $(element).closest('.custom-select').removeClass('is-invalid').addClass('is-valid');
        },
        submitHandler: function () {
            //event.preventDefault();
            var data = $("#login-form").serialize();
            $.ajax({
                type: 'POST',
                url: './login.php',
                data: data,
                dataType: 'json',
                beforeSend: function () {
                    $("#send_form").html('<i class="fas fa-spinner fa-spin"></i> Logando ...');
                },
                success: function (response) {
                    if (response.codigo == "1") {
                        $("#send_form").html('Logar');
                        $("#login-alert").css('display', 'none');
                        window.location.href = "../home/";
                    } else {
                        $("#send_form").html('Logar');
                        console.log('Menssagem: ' + response.mensagem);
                        console.log('Debug: ' + response.debug);
                        $("#mensagem").html('<center>' +
                            '<div class="panel-body padding-top-md" >' +
                            '<div id="login-alert" class="alert alert-' + response.alerta + ' col-sm-6">' +
                            response.iconem + '&#32;' + response.mensagem +
                            '</div>' +
                            '</div>' +
                            '</center>');
                        $("#login-alert").css('display', 'block');
                        window.scrollTo(0, 0);
                    }
                }
            });
        }
    });
    //
    //---------------------------------------------------------------------------------------------------------------------------------------------------//
    //
    $("#sendText-form").validate({
        rules: {
            numero: {
                required: true,
                celular: true
            },
            msg: {
                required: true,
                maxlength: 6700
            }
        },
        messages: {
            numero: {
                required: "Informe um numero de telefone!",
                celular: "Informe um celular válido!"
            },
            msg: {
                required: "Informe sua menssagem!",
                maxlength: "A mensagem deve conter no máximo 6.700 caracteres"
            }
        },
        errorPlacement: function (error, element) {
            $(element).closest('.form-group').find('.help-block').html(error.html());
        },
        highlight: function (element) {
            $(element).closest('.form-control').removeClass('is-valid').addClass('is-invalid');
            $(element).closest('.custom-select').removeClass('is-valid').addClass('is-invalid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).closest('.form-group').find('.help-block').html('');
            $(element).closest('.form-control').removeClass('is-invalid').addClass('is-valid');
            $(element).closest('.custom-select').removeClass('is-invalid').addClass('is-valid');
        },
        submitHandler: function () {
            event.preventDefault();
            var data = $("#sendText-form").serialize();
            $.ajax({
                type: 'POST',
                url: 'http://localhost:8081/sistem/sendText',
                data: data,
                dataType: 'json',
                beforeSend: function () {
                    $("#sendTexto").html('<i class="fas fa-spinner fa-spin"></i> Enviando...');
                },
                success: function (response) {
                    console.log("Erro:" + response.erro);
                    console.log("Status:" + response.status);
                    if (response.erro == false && response.status == 'OK') {
                        $("#sendTexto").html('<i class="fas fa-paper-plane"></i> Enviar');
                        //
                        Lobibox.notify('success', {
                            title: false,
                            soundPath: '/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: 'far fa-check-circle',
                            size: 'mini',
                            delay: 5000,
                            msg: 'Menssagem enviada com sucesso!'
                        });
                        //
                    } else if (response.erro == true && response.status == '404') {
                        $("#sendTexto").html('<i class="fas fa-paper-plane"></i> Enviar');
                        //
                        Lobibox.notify('error', {
                            title: false,
                            soundPath: '/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: 'fas fa-times-circle',
                            size: 'mini',
                            delay: 5000,
                            msg: 'Erro ao enviada menssagem!'
                        });
                        //
                    } else {
                        $("#sendTexto").html('<i class="fas fa-paper-plane"></i> Enviar');
                        //
                        Lobibox.notify('info', {
                            title: false,
                            soundPath: '/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: 'fas fa-info-circle',
                            size: 'mini',
                            delay: 5000,
                            msg: 'Erro interno, menssagem não enviada!'
                        });
                        //
                    }
                }
            });
        }
    });
    //
    //---------------------------------------------------------------------------------------------------------------------------------------------------//
    //
    $("#sendImage-form").validate({
        rules: {
            numeroimg: {
                required: true,
                celular: true
            },
            fileimg: {
                required: true,
                filesize_max: 10240000
            },
            msgimg: {
                required: true,
                maxlength: 6700
            }
        },
        messages: {
            numeroimg: {
                required: "Informe um numero de telefone!",
                celular: "Informe um celular válido!"
            },
            fileimg: {
                required: "Selecione o arquivo!",
                filesize_max: "O arquivo deve ser de no máximo 10 MB!"
            },
            msgimg: {
                required: "Informe sua menssagem!",
                maxlength: "A mensagem deve conter no máximo 6.700 caracteres"
            }
        },
        errorPlacement: function (error, element) {
            $(element).closest('.form-group').find('.help-block').html(error.html());
        },
        highlight: function (element) {
            $(element).closest('.form-control').removeClass('is-valid').addClass('is-invalid');
            $(element).closest('.custom-select').removeClass('is-valid').addClass('is-invalid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).closest('.form-group').find('.help-block').html('');
            $(element).closest('.form-control').removeClass('is-invalid').addClass('is-valid');
            $(element).closest('.custom-select').removeClass('is-invalid').addClass('is-valid');
        },
        submitHandler: function () {
            event.preventDefault();
            var form = $('#sendImage-form')[0];
            var data = new FormData(form);
            $.ajax({
                type: "POST",
                enctype: 'multipart/form-data',
                url: 'http://localhost:8081/sistem/sendImage',
                data: data,
                processData: false, //prevent jQuery from automatically transforming the data into a query string
                contentType: false,
                cache: false,
                beforeSend: function () {
                    $("#sendImage").html('<i class="fas fa-spinner fa-spin"></i> Enviando...');
                },
                success: function (response) {
                    console.log("Erro:" + response.erro);
                    console.log("Status:" + response.status);
                    if (response.erro == false && response.status == 'OK') {
                        $("#sendImage").html('<i class="fas fa-paper-plane"></i> Enviar');
                        //
                        Lobibox.notify('success', {
                            title: false,
                            soundPath: '/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: 'far fa-check-circle',
                            size: 'mini',
                            delay: 5000,
                            msg: 'Menssagem enviada com sucesso!'
                        });
                        //
                    } else if (response.erro == true && response.status == '404') {
                        $("#sendImage").html('<i class="fas fa-paper-plane"></i> Enviar');
                        //
                        Lobibox.notify('error', {
                            title: false,
                            soundPath: '/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: 'fas fa-times-circle',
                            size: 'mini',
                            delay: 5000,
                            msg: 'Erro ao enviada menssagem!'
                        });
                        //
                    } else {
                        $("#sendImage").html('<i class="fas fa-paper-plane"></i> Enviar');
                        //
                        Lobibox.notify('info', {
                            title: false,
                            soundPath: '/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: 'fas fa-info-circle',
                            size: 'mini',
                            delay: 5000,
                            msg: 'Erro interno, menssagem não enviada!'
                        });
                        //
                    }
                },
                error: (e) => {
                    console.log("Erro sendImagem");
                }

            });
        }
    });
    //
    //---------------------------------------------------------------------------------------------------------------------------------------------------//
    //
    $("#sendTextMassa-form").validate({
        rules: {
            sendTextMassaContato: {
                required: true
            },
            msgtxtmass: {
                required: true,
                maxlength: 6700
            }
        },
        messages: {
            sendTextMassaContato: {
                required: "Selecione o arquivo de contato!"
            },
            msgtxtmass: {
                required: "Informe sua menssagem!",
                maxlength: "A mensagem deve conter no máximo 6.700 caracteres"
            }
        },
        errorPlacement: function (error, element) {
            $(element).closest('.form-group').find('.help-block').html(error.html());
        },
        highlight: function (element) {
            $(element).closest('.form-control').removeClass('is-valid').addClass('is-invalid');
            $(element).closest('.custom-select').removeClass('is-valid').addClass('is-invalid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).closest('.form-group').find('.help-block').html('');
            $(element).closest('.form-control').removeClass('is-invalid').addClass('is-valid');
            $(element).closest('.custom-select').removeClass('is-invalid').addClass('is-valid');
        },
        submitHandler: function () {
            event.preventDefault();
            var data = new FormData(document.getElementById("sendTextMassa-form"));

            data.append('filesendTextMassaContato', $("#filesendTextMassaContato").val());
            data.append('sendTextMassaContato', $('#sendTextMassaContato').prop('files')[0]);
            data.append('msgtxtmass', $("#msgtxtmass").val());

            $.ajax({
                type: 'POST',
                url: './sendTextMassa.php',
                //dataType: 'text',
                dataType: 'json',
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                beforeSend: function () {
                    $("#sendTextMassa").html('<i class="fas fa-spinner fa-spin"></i> Enviando...');
                },
                success: function (response) {
                    if (response.codigo == "success") {
                        $("#sendTextMassa").html('<i class="fas fa-paper-plane"></i> Enviar');
                        //
                        Lobibox.notify(response.alerta, {
                            title: false,
                            soundPath: '../packages/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: response.iconem,
                            size: 'mini',
                            delay: 5000,
                            msg: response.mensagem
                        });
                        //$("#submittername").html('<pre>'+response.debug+'</pre>');
                        //
                    } else {
                        $("#sendTextMassa").html('<i class="fas fa-paper-plane"></i> Enviar');
                        //
                        Lobibox.notify(response.alerta, {
                            title: false,
                            soundPath: '../packages/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: response.iconem,
                            size: 'mini',
                            delay: 5000,
                            msg: response.mensagem
                        });
                        //
                    }
                }
            });
        }
    });
    //
    //---------------------------------------------------------------------------------------------------------------------------------------------------//
    //
    $("#sendFileImgMassa-form").validate({
        rules: {
            sendImageMassaContato: {
                required: true
            },
            FileImageMassa: {
                required: true,
                filesize_max: 10240000
            },
            msgimgmass: {
                required: true,
                maxlength: 6700
            }
        },
        messages: {
            sendImageMassaContato: {
                required: "Selecione o arquivo de contato!"
            },
            FileImageMassa: {
                required: "Selecione o arquivo!",
                filesize_max: "O arquivo deve ser de no máximo 10 MB!"
            },
            msgimgmass: {
                required: "Informe sua menssagem!",
                maxlength: "A mensagem deve conter no máximo 6.700 caracteres"
            }
        },
        errorPlacement: function (error, element) {
            $(element).closest('.form-group').find('.help-block').html(error.html());
        },
        highlight: function (element) {
            $(element).closest('.form-control').removeClass('is-valid').addClass('is-invalid');
            $(element).closest('.custom-select').removeClass('is-valid').addClass('is-invalid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).closest('.form-group').find('.help-block').html('');
            $(element).closest('.form-control').removeClass('is-invalid').addClass('is-valid');
            $(element).closest('.custom-select').removeClass('is-invalid').addClass('is-valid');
        },
        submitHandler: function () {
            event.preventDefault();
            var data = new FormData(document.getElementById("sendFileImgMassa-form"));

            data.append('sendImageMassaContato', $('#sendImageMassaContato').prop('files')[0]);
            data.append('fileNamesendImageMassaContato', $("#fileNamesendImageMassaContato").val());
            //
            data.append('FileImageMassa', $('#FileImageMassa').prop('files')[0]);
            data.append('FileNameImageMassa', $("#FileNameImageMassa").val());
            //
            data.append('msgimgmass', $("#msgimgmass").val());

            $.ajax({
                type: 'POST',
                url: './sendFileImgMassa.php',
                //dataType: 'text',
                dataType: 'json',
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                beforeSend: function () {
                    $("#sendFileImgMassa").html('<i class="fas fa-spinner fa-spin"></i> Enviando...');
                },
                success: function (response) {
                    if (response.codigo == "success") {
                        $("#sendFileImgMassa").html('<i class="fas fa-paper-plane"></i> Enviar');
                        //
                        Lobibox.notify(response.alerta, {
                            title: false,
                            soundPath: '../packages/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: response.iconem,
                            size: 'mini',
                            delay: 5000,
                            msg: response.mensagem
                        });
                        //$("#submittername").html('<pre>'+response.debug+'</pre>');
                        //
                    } else {
                        $("#sendFileImgMassa").html('<i class="fas fa-paper-plane"></i> Enviar');
                        //
                        Lobibox.notify(response.alerta, {
                            title: false,
                            soundPath: '../packages/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: response.iconem,
                            size: 'mini',
                            delay: 5000,
                            msg: response.mensagem
                        });
                        //
                    }
                }
            });
        }
    });
    //
    //---------------------------------------------------------------------------------------------------------------------------------------------------//
    //
    $("#sendTextGrupo-form").validate({
        rules: {
            TextGrupo: {
                required: true
            },
            TextGrupoMsg: {
                required: true,
                maxlength: 6700
            }
        },
        messages: {
            TextGrupo: {
                required: "Selecione um grupo!"
            },
            TextGrupoMsg: {
                required: "Informe sua menssagem!",
                maxlength: "A mensagem deve conter no máximo 6.700 caracteres"
            }
        },
        errorPlacement: function (error, element) {
            $(element).closest('.form-group').find('.help-block').html(error.html());
        },
        highlight: function (element) {
            $(element).closest('.form-control').removeClass('is-valid').addClass('is-invalid');
            $(element).closest('.custom-select').removeClass('is-valid').addClass('is-invalid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).closest('.form-group').find('.help-block').html('');
            $(element).closest('.form-control').removeClass('is-invalid').addClass('is-valid');
            $(element).closest('.custom-select').removeClass('is-invalid').addClass('is-valid');
        },
        submitHandler: function () {
            event.preventDefault();
            var data = $("#sendTextGrupo-form").serialize();
            $.ajax({
                type: 'POST',
                url: './sendTextGrupo.php',
                data: data,
                dataType: 'json',
                beforeSend: function () {
                    $("#sendTextGrupo").html('<i class="fas fa-spinner fa-spin"></i> Enviando...');
                },
                success: function (response) {
                    if (response.codigo == "success") {
                        $("#sendTextGrupo").html('<i class="fas fa-paper-plane"></i> Enviar');
                        //
                        Lobibox.notify(response.alerta, {
                            title: false,
                            soundPath: '../packages/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: response.iconem,
                            size: 'mini',
                            delay: 5000,
                            msg: response.mensagem
                        });
                        //
                    } else {
                        $("#sendTextGrupo").html('<i class="fas fa-paper-plane"></i> Enviar');
                        //
                        Lobibox.notify(response.alerta, {
                            title: false,
                            soundPath: '../packages/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: response.iconem,
                            size: 'mini',
                            delay: 5000,
                            msg: response.mensagem
                        });
                        //
                    }
                }
            });
        }
    });
    //
    //---------------------------------------------------------------------------------------------------------------------------------------------------//
    //
    $("#sendFileImgGrupo-form").validate({
        rules: {
            ImgGrupo: {
                required: true
            },
            FileImageGrupo: {
                required: true,
                filesize_max: 10240000
            },
            msgimggrupo: {
                required: true,
                maxlength: 6700
            }
        },
        messages: {
            ImgGrupo: {
                required: "Selecione um grupo!"
            },
            FileImageGrupo: {
                required: "Selecione o arquivo!",
                filesize_max: "O arquivo deve ser de no máximo 10 MB!"
            },
            msgimggrupo: {
                required: "Informe sua menssagem!",
                maxlength: "A mensagem deve conter no máximo 6.700 caracteres"
            }
        },
        errorPlacement: function (error, element) {
            $(element).closest('.form-group').find('.help-block').html(error.html());
        },
        highlight: function (element) {
            $(element).closest('.form-control').removeClass('is-valid').addClass('is-invalid');
            $(element).closest('.custom-select').removeClass('is-valid').addClass('is-invalid');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).closest('.form-group').find('.help-block').html('');
            $(element).closest('.form-control').removeClass('is-invalid').addClass('is-valid');
            $(element).closest('.custom-select').removeClass('is-invalid').addClass('is-valid');
        },
        submitHandler: function () {
            event.preventDefault();
            var data = new FormData(document.getElementById("sendFileImgGrupo-form"));

            data.append('ImgGrupo', $("#ImgGrupo").val());
            //
            data.append('FileImageGrupo', $('#FileImageGrupo').prop('files')[0]);
            data.append('FileNameImageGrupo', $("#FileNameImageGrupo").val());
            //
            data.append('msgimggrupo', $("#msgimggrupo").val());

            $.ajax({
                type: 'POST',
                url: './sendFileImgGrupo.php',
                //dataType: 'text',
                dataType: 'json',
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                beforeSend: function () {
                    $("#sendFileImgGrupo").html('<i class="fas fa-spinner fa-spin"></i> Enviando...');
                },
                success: function (response) {
                    if (response.codigo == "success") {
                        $("#sendFileImgGrupo").html('<i class="fas fa-paper-plane"></i> Enviar');
                        //
                        Lobibox.notify(response.alerta, {
                            title: false,
                            soundPath: '../packages/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: response.iconem,
                            size: 'mini',
                            delay: 5000,
                            msg: response.mensagem
                        });
                        //$("#submittername").html('<pre>'+response.debug+'</pre>');
                        //
                    } else {
                        $("#sendFileImgGrupo").html('<i class="fas fa-paper-plane"></i> Enviar');
                        //
                        Lobibox.notify(response.alerta, {
                            title: false,
                            soundPath: '../packages/lobibox/sounds/',
                            soundExt: '.ogg',
                            sound: true,
                            iconSource: "fontAwesome",
                            icon: response.iconem,
                            size: 'mini',
                            delay: 5000,
                            msg: response.mensagem
                        });
                        //
                    }
                }
            });
        }
    });
    //
    //---------------------------------------------------------------------------------------------------------------------------------------------------//
    //
    $("#fileimg").on("change", function () {
        var fileName = $(this).val().split("\\").pop();
        $(this).siblings("#fileName-labe").addClass("selected").html(fileName);
        $('#fileName').val(fileName);
    });
    //
    //---------------------------------------------------------------------------------------------------------------------------------------------------//
    //
    $("#sendTextMassaContato").on("change", function () {
        var fileName = $(this).val().split("\\").pop();
        $(this).siblings("#sendTextMassaContato-label").addClass("selected").html(fileName);
        $('#filesendTextMassaContato').val(fileName);
    });
    //
    //---------------------------------------------------------------------------------------------------------------------------------------------------//
    //
    $("#sendImageMassaContato").on("change", function () {
        var fileName = $(this).val().split("\\").pop();
        $(this).siblings("#sendImageMassaContato-label").addClass("selected").html(fileName);
        $('#fileNamesendImageMassaContato').val(fileName);
    });
    //
    //---------------------------------------------------------------------------------------------------------------------------------------------------//
    //
    $("#FileImageMassa").on("change", function () {
        var fileName = $(this).val().split("\\").pop();
        $(this).siblings("#FileImageMassa-label").addClass("selected").html(fileName);
        $('#FileNameImageMassa').val(fileName);
    });
    //
    //---------------------------------------------------------------------------------------------------------------------------------------------------//
    //
    $("#FileImageGrupo").on("change", function () {
        var fileName = $(this).val().split("\\").pop();
        $(this).siblings("#FileImageGrupo-label").addClass("selected").html(fileName);
        $('#FileNameImageGrupo').val(fileName);
    });
    //
    //---------------------------------------------------------------------------------------------------------------------------------------------------//
    //
    $("#BotaoGrupoText").on("click", function () {
        $.ajax({
            type: 'POST',
            url: './getAllGroups.php',
            beforeSend: function () {
                $("#BotaoGrupoText").html('<i class="fas fa-spinner fa-spin"></i> Carregando...');
            },
            success: function (response) {
                //
                $("#BotaoGrupoText").html('Carregar Grupos');
                //
                $("#TextGrupo").html(response);
                //
            }
        });
    });
    //
    $("#BotaoGrupoImg").on("click", function () {
        $.ajax({
            type: 'POST',
            url: './getAllGroups.php',
            beforeSend: function () {
                $("#BotaoGrupoImg").html('<i class="fas fa-spinner fa-spin"></i> Carregando...');
            },
            success: function (response) {
                //
                $("#BotaoGrupoImg").html('Carregar Grupos');
                //
                $("#ImgGrupo").html(response);
                //
            }
        });
    });
    //
    //
    //---------------------------------------------------------------------------------------------------------------------------------------------------//
    //

    //
    //---------------------------------------------------------------------------------------------------------------------------------------------------//
    //
});