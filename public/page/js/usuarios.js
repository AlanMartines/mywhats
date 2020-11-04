//<!-- Validação do forumlário -->
$('document').ready(function() {
    //
    var action = $('#action').val();
    //
    brdocs = {

        cpfcnpj: {
            "CPF": 1,
            "CNPJ": 2,
            "AMBOS": 3
        },

        cpfcnpjValidator: function(value, element, params) {
            //params = (typeof params === 'undefined' || (typeof params === 'boolean' && params) ) ? brdocs.cpfcnpj.AMBOS : params;
            value = value.replace(/[^\d]+/g, ''); //Remove todos os cacteres que exceto [0-9]
            var isCNPJ = false;

            if (value.length != 11 && value.length != 14) return false;

            switch (params) {
                case brdocs.cpfcnpj.CPF:
                    if (value.length != 11) return false;
                    isCNPJ = false;
                    break;
                case brdocs.cpfcnpj.CNPJ:
                    if (value.length != 14) return false;
                    isCNPJ = true;
                    break;
                default:
                    isCNPJ = (value.length === 14)
                    break;
            }

            if (/^(\d)\1+$/.test(value)) return false; //falso se se todos os digitos forem iguais, os digitos verificadores estão corretos, mas o documento não é válido.

            if (brdocs.calculaDigito(value, value.length - 3, isCNPJ) != parseInt(value.charAt(value.length - 2))) return false;
            if (brdocs.calculaDigito(value, value.length - 2, isCNPJ) != parseInt(value.charAt(value.length - 1))) return false;

            return true;
        },

        calculaDigito: function(doc, start, isCNPJ) {
            if (doc.length === 0) return false;

            start = (typeof start === 'undefined') ? doc.length - 1 : start;

            if (start >= doc.length)
                return false;

            if (isNaN(doc))
                return false;

            isCNPJ = (typeof isCNPJ === 'undefined') ? false : isCNPJ;

            var add = 0
            var multi = 2;

            for (i = start; i >= 0; i--) {
                add += parseInt(doc.charAt(i)) * multi++
                if (isCNPJ && multi > 9) multi = 2;
            }
            var resultado = 11 - add % 11;

            return resultado < 9 ? resultado : 0;;
        }
    };
    if (Object.freeze) {
        Object.freeze(brdocs);
    }
    //
    //
    // name validation
    var nameregex = /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/;

    jQuery.validator.addMethod("validname", function(value, element) {
        return this.optional(element) || nameregex.test(value);
    });

    // valid email pattern
    var eregex = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

    jQuery.validator.addMethod("validemail", function(value, element) {
        return this.optional(element) || eregex.test(value);
    });

    // valid password pattern
    var pwregex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/;

    jQuery.validator.addMethod("validpassword", function(value, element) {
        return this.optional(element) || pwregex.test(value);
    });

    // valid email pattern
    jQuery.validator.addMethod("verificaCPF", function(cpf, element) {
        cpf = jQuery.trim(cpf);

        cpf = cpf.replace('.', '');
        cpf = cpf.replace('.', '');
        cpf = cpf.replace('-', '');

        while (cpf.length < 11) cpf = "0" + cpf;
        var expReg = /(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%])/;
        var a = [];
        var b = new Number;
        var c = 11;
        for (i = 0; i < 11; i++) {
            a[i] = cpf.charAt(i);
            if (i < 9) b += (a[i] * --c);
        }
        if ((x = b % 11) < 2) {
            a[9] = 0
        } else {
            a[9] = 11 - x
        }
        b = 0;
        c = 11;
        for (y = 0; y < 10; y++) b += (a[y] * c--);
        if ((x = b % 11) < 2) {
            a[10] = 0;
        } else {
            a[10] = 11 - x;
        }

        var retorno = true;
        if ((cpf.charAt(9) != a[9]) || (cpf.charAt(10) != a[10]) || cpf.match(expReg)) retorno = false;

        return this.optional(element) || retorno;

    }, "Informe um CPF válido."); // Mensagem padrão

    jQuery.validator.addMethod("verificaCNPJ", function(cnpj, element) {
        cnpj = jQuery.trim(cnpj);

        // DEIXA APENAS OS NÚMEROS
        cnpj = cnpj.replace('/', '');
        cnpj = cnpj.replace('.', '');
        cnpj = cnpj.replace('.', '');
        cnpj = cnpj.replace('-', '');

        var numeros, digitos, soma, i, resultado, pos, tamanho, digitos_iguais;
        digitos_iguais = 1;

        if (cnpj.length < 14 && cnpj.length < 15) {
            return this.optional(element) || false;
        }
        for (i = 0; i < cnpj.length - 1; i++) {
            if (cnpj.charAt(i) != cnpj.charAt(i + 1)) {
                digitos_iguais = 0;
                break;
            }
        }

        if (!digitos_iguais) {
            tamanho = cnpj.length - 2
            numeros = cnpj.substring(0, tamanho);
            digitos = cnpj.substring(tamanho);
            soma = 0;
            pos = tamanho - 7;

            for (i = tamanho; i >= 1; i--) {
                soma += numeros.charAt(tamanho - i) * pos--;
                if (pos < 2) {
                    pos = 9;
                }
            }
            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if (resultado != digitos.charAt(0)) {
                return this.optional(element) || false;
            }
            tamanho = tamanho + 1;
            numeros = cnpj.substring(0, tamanho);
            soma = 0;
            pos = tamanho - 7;
            for (i = tamanho; i >= 1; i--) {
                soma += numeros.charAt(tamanho - i) * pos--;
                if (pos < 2) {
                    pos = 9;
                }
            }
            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if (resultado != digitos.charAt(1)) {
                return this.optional(element) || false;
            }
            return this.optional(element) || true;
        } else {
            return this.optional(element) || false;
        }
    }, "Informe um CNPJ válido."); // Mensagem padrão

    jQuery.validator.addMethod('numtel', function(telefone, element) {
        //retira todos os caracteres menos os numeros
        telefone = telefone.replace(/\D/g, '');

        //verifica se tem a qtde de numero correto
        if (!(telefone.length >= 10 && telefone.length <= 11)) return false;

        //Se tiver 11 caracteres, verificar se começa com 9 o celular
        if (telefone.length == 11 && parseInt(telefone.substring(2, 3)) != 9) return false;

        //verifica se não é nenhum numero digitado errado (propositalmente)
        for (var n = 0; n < 10; n++) {
            //um for de 0 a 9.
            //estou utilizando o metodo Array(q+1).join(n) onde "q" é a quantidade e n é o
            //caractere a ser repetido
            if (telefone == new Array(11).join(n) || telefone == new Array(12).join(n)) return false;
        }
        //DDDs validos
        var codigosDDD = [11, 12, 13, 14, 15, 16, 17, 18, 19,
            21, 22, 24, 27, 28, 31, 32, 33, 34,
            35, 37, 38, 41, 42, 43, 44, 45, 46,
            47, 48, 49, 51, 53, 54, 55, 61, 62,
            64, 63, 65, 66, 67, 68, 69, 71, 73,
            74, 75, 77, 79, 81, 82, 83, 84, 85,
            86, 87, 88, 89, 91, 92, 93, 94, 95,
            96, 97, 98, 99
        ];
        //verifica se o DDD é valido (sim, da pra verificar rsrsrs)
        if (codigosDDD.indexOf(parseInt(telefone.substring(0, 2))) == -1) return false;

        //  E por ultimo verificar se o numero é realmente válido. Até 2016 um celular pode
        //ter 8 caracteres, após isso somente numeros de telefone e radios (ex. Nextel)
        //vão poder ter numeros de 8 digitos (fora o DDD), então esta função ficará inativa
        //até o fim de 2016, e se a ANATEL realmente cumprir o combinado, os numeros serão
        //validados corretamente após esse período.
        //NÃO ADICIONEI A VALIDAÇÂO DE QUAIS ESTADOS TEM NONO DIGITO, PQ DEPOIS DE 2016 ISSO NÃO FARÁ DIFERENÇA
        //Não se preocupe, o código irá ativar e desativar esta opção automaticamente.
        //Caso queira, em 2017, é só tirar o if.
        if (new Date().getFullYear() < 2017) return true;
        if (telefone.length == 10 && [2, 3, 4, 5, 7].indexOf(parseInt(telefone.substring(2, 3))) == -1) return false;

        //se passar por todas as validações acima, então está tudo certo
        return true;
    }, 'Informe um número de telefone celular válido!');

    jQuery.validator.addMethod("dateBR", function(data, element) {
        //contando chars
        if (data.length != 10) return false;
        // verificando data
        var data = data;
        var dia = data.substr(0, 2);
        var barra1 = data.substr(2, 1);
        var mes = data.substr(3, 2);
        var barra2 = data.substr(5, 1);
        var ano = data.substr(6, 4);
        if (data.length != 10 || barra1 != "/" || barra2 != "/" || isNaN(dia) || isNaN(mes) || isNaN(ano) || dia > 31 || mes > 12) return false;
        if ((mes == 4 || mes == 6 || mes == 9 || mes == 11) && dia == 31) return false;
        if (mes == 2 && (dia > 29 || (dia == 29 && ano % 4 != 0))) return false;
        if (ano < 1900) return false;
        return true;
    }, "Informe uma data válida"); // Mensagem padrão

    jQuery.validator.addMethod("uniqueCPFCNPJ", function(cpfcnpj, element) {
        var cpfcnpjUrl = "../sql/usuarios/check_cpfcnpj.php";
        //let result = false;
        $.ajax({
            type: "POST",
            url: cpfcnpjUrl,
            data: {
                cpfcnpj: cpfcnpj
            },
            dataType: "JSON",
            dataFilter: function(data) {
                console.log(data);
                var json = JSON.parse(data);
                if (json.isError == false) {
                    console.log(json.isError + ': Este CPF/CNPJ existe.');
                    result = false;
                } else {
                    console.log(json.isError + ': Este CPF/CNPJ não existe.');
                    result = true;
                }
            },
            async: false
        });
        console.log(result);
        return result;
    }, "");

    jQuery.validator.addMethod("uniqueRG", function(rg, element) {
        var rgUrl = "../sql/usuarios/check_rg.php";
        //let result = false;
        $.ajax({
            type: "POST",
            url: rgUrl,
            data: {
                rg: rg
            },
            dataType: "JSON",
            dataFilter: function(data) {
                console.log(data);
                var json = JSON.parse(data);
                if (json.isError == false) {
                    console.log(json.isError + ': Este rg existe.');
                    result = false;
                } else {
                    console.log(json.isError + ': Este rg não existe.');
                    result = true;
                }
            },
            async: false
        });
        console.log(result);
        return result;
    }, "CPF já está registrado.");

    jQuery.validator.addMethod("uniqueOAB", function(oab, element) {
        var oabUrl = "../sql/usuarios/check_oab.php";
        //let result = false;
        $.ajax({
            type: "POST",
            url: oabUrl,
            data: {
                oab: oab
            },
            dataType: "JSON",
            dataFilter: function(data) {
                console.log(data);
                var json = JSON.parse(data);
                if (json.isError == false) {
                    console.log(json.isError + ': Este OAB existe.');
                    result = false;
                } else {
                    console.log(json.isError + ': Este OAB não existe.');
                    result = true;
                }
            },
            async: false
        });
        console.log(result);
        return result;
    }, "OAB já está registrado.");

    jQuery.validator.addMethod("verificaCPFCNPJ", brdocs.cpfcnpjValidator, "Informe um CPF/CNPJ válido.");

    jQuery.validator.addMethod("uniqueEMAIL", function(email, element) {
        var emailUrl = "../sql/usuarios/check_email.php";
        //let result = false;
        $.ajax({
            type: "POST",
            url: emailUrl,
            data: {
                email: email
            },
            dataType: "JSON",
            dataFilter: function(data) {
                console.log(data);
                var json = JSON.parse(data);
                if (json.isError == false) {
                    console.log(json.isError + ': Este rg existe.');
                    result = false;
                } else {
                    console.log(json.isError + ': Este rg não existe.');
                    result = true;
                }
            },
            async: false
        });
        console.log(result);
        return result;
    }, "E-MAIL já está registrado.");

    $("#usuarios-form").validate({
        ignore: ".ignore",
        rules: {
            nome: {
                required: true,
                validname: true,
                minlength: 4
            },
            cpfcnpj: {
                required: true,
                minlength: 11,
                verificaCPFCNPJ: brdocs.cpfcnpj.AMBOS,
                uniqueCPFCNPJ: true
            },
            rg: {
                required: true,
                minlength: 10,
                uniqueRG: true
            },
            org_emissor: {
                required: true
            },
            oab: {
                required: true,
                uniqueOAB: true
            },
            cep: {
                required: true
            },
            uf: {
                required: true
            },
            cidade: {
                required: true
            },
            rua: {
                required: true
            },
            numero_home: {
                required: true
            },
            bairro: {
                required: true
            },
            email: {
                required: true,
                validemail: true,
                uniqueEMAIL: true
            },
            cemail: {
                required: true,
                validemail: true,
                equalTo: '#email'
            },
            senha: {
                required: true,
                minlength: 8,
                validpassword: true
            },
            old_senha: {
                required: true
            },
            csenha: {
                required: true,
                equalTo: '#senha'
            },
            celular: {
                required: true,
                numtel: true
            },
            perfil: {
                required: true
            },
            active: {
                required: true
            },
            nivel: {
                required: true
            }
        },
        messages: {
            nome: {
                required: "Informe um nome.",
                validname: "O nome deve conter apenas letras e espaço.",
                minlength: "Seu nome é muito curto."
            },
            cpfcnpj: {
                required: "Informe o CPF/CNPJ.",
                minlength: "Deve conter pelo menos 11 digitos",
                verificaCPFCNPJ: "Informe um CPF/CNPJ válido.",
                uniqueCPFCNPJ: "CPF/CNPJ já está registrado."
            },
            rg: {
                required: "Informe o RG",
                minlength: "Deve conter pelo menos 10 digitos.",
                uniqueRG: "RG já está registrado."
            },
            org_emissor: {
                required: "Informe o Orgão Emissor."
            },
            oab: {
                required: "Informe seu registro da OAB.",
                uniqueOAB: "Registro da OAB já está registrado."
            },
            cep: {
                required: "Informe o CEP."
            },
            uf: {
                required: "Informe o estado."
            },
            cidade: {
                required: "Informe a cidade."
            },
            rua: {
                required: "Informe o endereço."
            },
            numero_home: {
                required: "Informe o numero."
            },
            bairro: {
                required: "Informe o bairro."
            },
            email: {
                required: "Informe um endereço de e-mail.",
                validemail: "Informe um endereço de e-mail válido.",
                uniqueEMAIL: "E-mail já está registrado."
            },
            cemail: {
                required: "Por favor, confirme o endereço de e-mail.",
                equalTo: "O e-mail não corresponde!"
            },
            old_senha: {
                required: "Informe a senha atual."
            },
            senha: {
                required: "Informe a senha.",
                minlength: "A senha tem pelo menos 8 caracteres.",
                validpassword: "Deve conter letras maiúsculas, minúsculas, números e caractere especial."
            },
            csenha: {
                required: "Por favor, confirme sua senha.",
                equalTo: "A senha não corresponde!"
            },
            celular: {
                required: "Informe numero de celular.",
                numtel: "Informe um número válido!"
            },
            perfil: {
                required: "Selecione um perfil."
            },
            active: {
                required: "Selecione um opção."
            },
            nivel: {
                required: "Selecione um nivel."
            }
        },
        errorPlacement: function(error, element) {
            $(element).closest('.form-group').find('.help-block').html(error.html());
        },
        highlight: function(element) {
            $(element).closest('.form-control').removeClass('is-valid').addClass('is-invalid');
            $(element).closest('.custom-select').removeClass('is-valid').addClass('is-invalid');
        },
        unhighlight: function(element, errorClass, validClass) {
            $(element).closest('.form-group').find('.help-block').html('');
            $(element).closest('.form-control').removeClass('is-invalid').addClass('is-valid');
            $(element).closest('.custom-select').removeClass('is-invalid').addClass('is-valid');
        },
        submitHandler: function() {
            //
            //event.preventDefault();
            grecaptcha.ready(function() {
                grecaptcha.execute('6LfzeuoUAAAAANo1UtxxIU3n4yiO8YdP9rVHV003', {
                    action: 'clientes'
                }).then(function(token) {
                    //$('#login-form').prepend('<input type="hidden" name="recaptchaResponse" value="' + token + '">');
                    //$('#login-form').prepend('<input type="hidden" name="action" value="login">');
                    var recaptchaResponse = document.getElementById('recaptchaResponse');
                    recaptchaResponse.value = token;
                    console.log('Token: ' + token);

                    var action = $('#acao').val();
                    switch (action) {
                        case "Adicionar": {
                            var data = $("#usuarios-form").serialize();
                            $.ajax({
                                type: 'POST',
                                url: '../usuarios/insert.php',
                                data: data,
                                dataType: 'json',
                                beforeSend: function() {
                                    $("#send_form").html('<i class="fas fa-spinner fa-spin"></i> Cadastrando...');
                                    console.log("Cadastrando...");
                                },
                                success: function(response) {
                                    //var json = JSON.parse(response);
                                    //if (json.isError == false) {
                                    if (response.codigo == "1") {
                                        $("#send_form").html('Cadastrar');
                                        $("#login-alert").css('display', 'none');
                                        console.log(response.mensagem);
                                    } else {
                                        $("#send_form").html('Cadastrar');
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
                            break;
                        }
                        case "Atualizar": {
                            var data = $("#usuarios-form").serialize();
                            $.ajax({
                                type: 'POST',
                                url: '../usuarios/update.php',
                                data: data,
                                dataType: 'json',
                                beforeSend: function() {
                                    $("#send_form").html('<i class="fas fa-spinner fa-spin"></i> Atualizando...');
                                    console.log("Atualizando...");
                                },
                                success: function(response) {
                                    if (response.codigo == "1") {
                                        $("#send_form").html('Atualizar');
                                        $("#login-alert").css('display', 'none');
                                        console.log(response.mensagem);
                                    } else {
                                        $("#send_form").html('Atualizar');
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
                            break;
                        }
                        case "TrocarSenha": {
                            var data = $("#usuarios-form").serialize();
                            $.ajax({
                                type: 'POST',
                                url: '../usuarios/update_senha.php',
                                data: data,
                                dataType: 'json',
                                beforeSend: function() {
                                    $("#send_form").html('<i class="fas fa-spinner fa-spin"></i> Alterando ...');
                                },
                                success: function(response) {
                                    if (response.codigo == "1") {
                                        $("#send_form").html('Alterar senha');
                                        $("#login-alert").css('display', 'none')
                                        window.location.href = "../home/";
                                    } else {
                                        $("#send_form").html('Alterar senha');
                                        //$("#mensagem").html('<strong>Erro! </strong>' + response.mensagem);
                                        console.log(response.mensagem);
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
                            break;
                        }
                        case "TrocarEmail": {
                            var data = $("#usuarios-form").serialize();
                            $.ajax({
                                type: 'POST',
                                url: '../usuarios/update_email.php',
                                data: data,
                                dataType: 'json',
                                beforeSend: function() {
                                    $("#send_form").html('<i class="fas fa-spinner fa-spin"></i> Alterando ...');
                                },
                                success: function(response) {
                                    if (response.codigo == "1") {
                                        $("#send_form").html('Alterar email');
                                        $("#login-alert").css('display', 'none')
                                        window.location.href = "../home/";
                                    } else {
                                        $("#send_form").html('Alterar email');
                                        //$("#mensagem").html('<strong>Erro! </strong>' + response.mensagem);
                                        console.log(response.mensagem);
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
                            break;
                        }
                    }
                });
            });
            //  
        }
    });
});