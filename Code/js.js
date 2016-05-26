$(document).ready(function () {

    $(".Accion").hide();
    $('.AccionTabla').hide();
    $('.AccionJ').hide();
    //LOGIN
    $('#login > .pie > button:nth-of-type(2)').click(function () {
        $('.Accion').animate({
            opacity: '1'
        }, 'slow');
        $('#login').animate({
            opacity: '0'
        }, 'slow', function () {
            $('#login').hide();
            $('.Accion').slideDown('slow');
        });
    });
    $('#login > .pie > button:nth-of-type(1)').click(function () {
        var login = {
            'nombre_usuario': $('#nom').val()
            , 'password': $('#pas').val()
        };
        console.log(login);
        $.ajax({
            url: 'http://proyectoservidor.herokuapp.com/contenido'
            , method: 'POST'
            , data: login
            , success: function (result, stuatus, xhr) {
                $('#body').children().remove();
                $('#body').append(result);
                $(".Accion").hide();
                $('.AccionTabla').hide();
                $('.AccionJ').hide();
                var j = 0;
                var respuesta;
                var di;
                var sc = 0;
                var comp = 0;
                var juegoPreguntas;
                function textOut() {
                    $('#jpregunta').empty();
                    $('#jcategoria').empty();
                    $('#res1').empty();
                    $('#res2').empty();
                    $('#res3').empty();
                    $('#res4').empty();
                };

                function score() {
                    $.ajax({
                        url: "http://proyectoservidor.herokuapp.com/preguntas"
                        , success: function (result, status, xhr) {
                            comp = result.length;
                            juegoPreguntas = result;
                            console.log(juegoPreguntas);
                            textOut();
                            di = juegoPreguntas[j].pregunta_id;
                            $('#jpregunta').text(juegoPreguntas[j].pregunta);
                            $('#jcategoria').text(juegoPreguntas[j].categoria);
                            $.ajax({
                                url: "http://proyectoservidor.herokuapp.com/juego"
                                , method: "POST"
                                , data: 'id=' + di
                                , success: function (result, status, xhr) {
                                    console.log(result);
                                    $('#res1').text(result[0].respuesta);
                                    $('#res2').text(result[1].respuesta);
                                    $('#res3').text(result[2].respuesta);
                                    $('#res4').text(result[3].respuesta);
                                }
                            });
                        }

                    });
                };

                function meterScore() {
                    var putScore = {
                        "nombre_usuario": login.nombre_usuario
                        , "score": sc
                    };
                    $.ajax({
                        url: "http://proyectoservidor.herokuapp.com/score"
                        , method: "PUT"
                        , data: putScore
                        , success: function (result, status, xhr) {
                            alert("tu score fue : " + sc);
                            $('#Juego').slideUp("slow", function () {
                                $('#Principal').animate({
                                    opacity: '1'
                                });
                            });
                        }
                    });
                };

                function preguntasUser() {
                    $.ajax({
                        url: "http://proyectoservidor.herokuapp.com/preguntasuser"
                        , success: function (result, status, xhr) {
                            var botonRechazar = $("<button id='rechazar'><i class='fa fa-trash fa-2x' aria-hidden='true'></i></button>");
                            var botonAceptar = $("<button id='aceptar'><i class='fa fa-check fa-2x' aria-hidden='true'></i></button>");
                            $("#preg").children().remove();
                            for (var i = 0; i < result.length; i++) {
                                $("#preg").append(
                                    "<tr><td>" + result[i].pregunta_usuario_id + "</td><td>" + result[i].pregunta + "</td><td>" + result[i].categoria + "</td><td>" + result[i].nombre_usuario + "</td><td class='respuesta'><button id='ver'>Ver Respuestas</td></td><td class='tdAceptar'></td><td class='tdRechazar'></td></tr>"
                                );
                            }
                            $(".tdAceptar").append(botonAceptar);
                            $(".tdRechazar").append(botonRechazar);
                        }
                    });
                };

                function topScores() {
                    $.ajax({
                        url: "http://proyectoservidor.herokuapp.com/score"
                        , success: function (result, status, xhr) {

                            $("tbody").children().remove();
                            for (var i = 0; i < result.length; i++) {
                                $("tbody").append(
                                    "<tr><td>" + (i + 1) + "</td><td>" + result[i].nombre_usuario + "</td><td>" + result[i].score + "</td></tr>"
                                );
                            }

                        }
                    });
                };
                //Juego

                $('#jgd > button:nth-of-type(1)').click(function () {
                    $('#Principal').animate({
                        opacity: "0"
                    }, "slow", function () {
                        $('.AccionJ').animate({
                            opacity: '1'
                        });
                        $('#Juego').slideDown("slow");
                        j = 0;
                        sc = 0;
                        $('#sc').empty();
                        $('#sc').text(sc);
                        score();
                    });
                });
                $('#Juego > #tab > button').click(function () {
                    respuesta = {
                        'pregunta_id': di
                        , 'respuesta': $(this).text()
                    };
                    console.log(respuesta.respuesta);
                    $.ajax({
                        url: "http://proyectoservidor.herokuapp.com/resultado"
                        , method: "POST"
                        , data: respuesta
                        , success: function (result, status, xhr) {


                        }
                        , statusCode: {
                            304: function () {
                                meterScore();
                            }
                            , 202: function () {
                                j++;
                                sc = sc + 10;
                                if (j == comp) {
                                    alert("Wow, contestaste todas");
                                    meterScore();
                                } else {
                                    textOut();
                            di = juegoPreguntas[j].pregunta_id;
                            $('#jpregunta').text(juegoPreguntas[j].pregunta);
                            $('#jcategoria').text(juegoPreguntas[j].categoria);
                            $.ajax({
                                url: "http://proyectoservidor.herokuapp.com/juego"
                                , method: "POST"
                                , data: 'id=' + di
                                , success: function (result, status, xhr) {
                                    console.log(result);
                                    $('#res1').text(result[0].respuesta);
                                    $('#res2').text(result[1].respuesta);
                                    $('#res3').text(result[2].respuesta);
                                    $('#res4').text(result[3].respuesta);
                                }
                            });
                                    $('#sc').empty();
                                    $('#sc').text(sc);
                                    console.log(sc);
                                }
                            }
                        }
                    });

                });
                $('#Juego > .pie > button').click(function () {
                    meterScore();
                });
                $('#jgd > button:nth-of-type(2)').click(function () {
                    $('#Principal').animate({
                        opacity: "0"
                    }, "slow", function () {
                        $('.Accion').animate({
                            opacity: '1'
                        });
                        $('#Insercion').slideDown("slow");
                    });
                });
                $('#Insercion > .cabezera > button').click(function () {
                    $('#Insercion').slideUp('slow', function () {
                        $('#Principal').animate({
                            opacity: '1'
                        });
                    });
                });
                $('#Insercion > .pie > button').click(function () {
                    var pregunta = {
                        'pregunta': $('input[name*=Pregunta]').val()
                        , 'categoria': $('input[name*=Categoria]').val()
                        , 'nombre_usuario': login.nombre_usuario
                        , 'respuestaF1': $('input[name*=RespuestaF1]').val()
                        , 'respuestaF2': $('input[name*=RespuestaF2]').val()
                        , 'respuestaF3': $('input[name*=RespuestaF3]').val()
                        , 'respuestaV': $('input[name*=RespuestaV]').val()
                    };
                    if (pregunta.pregunta == '' || pregunta.categoria == '' || pregunta.respuestaF1 == '' || pregunta.respuestaF2 == '' || pregunta.respuestaF3 == '' || pregunta.respuestaV == '') {
                        alert("No debe haber espacion en blanco");
                    } else {
                        console.log(pregunta);
                        $.ajax({
                            url: 'http://proyectoservidor.herokuapp.com/preguntasuser'
                            , method: 'POST'
                            , data: pregunta
                            , success: function (result, status, xhr) {
                                alert('Pregunta insertada con exito');
                            }
                        });
                    }

                });
                $('#jgd > button:nth-of-type(3)').click(function () {
                    topScores();
                    $('#Principal').animate({
                        opacity: "0"
                    }, "slow", function () {
                        $('.AccionJ').animate({
                            opacity: '1'
                        });
                        $('#TopScores').slideDown("slow");
                    });
                });
                $('#TopScores > .cabezera > button').click(function () {
                    $('#TopScores').slideUp('slow', function () {
                        $('#Principal').animate({
                            opacity: '1'
                        });
                    });
                });
                $('#jgd > button:nth-of-type(4)').click(function(){
                    $('#Principal').animate({
                        opacity: "0"
                    }, "slow", function () {
                        $('.Accion').animate({
                            opacity: '1'
                        });
                        $('#Ayuda').slideDown("slow");
                    });
                });
                
                //Admin
                $('#adm > button:nth-of-type(1)').click(function () {
                    preguntasUser();
                    $('.AccionTabla').animate({
                        opacity: '1'
                    });
                    $('#Principal').animate({
                        opacity: '0'
                    }, 'slow', function () {
                        $('#Principal').hide();
                        $('.AccionTabla').slideDown('slow');
                    });
                });
                $('#adm > button:nth-of-type(2)').click(function () {
                    $('.Accion').animate({
                        opacity: '1'
                    });
                    $('#Principal').animate({
                        opacity: '0'
                    }, 'slow', function () {
                        $('#Principal').hide();
                        $('#addAdmin').slideDown('slow');
                    });
                });
                $('#adm > button:nth-of-type(3)').click(function () {
                    $('.Accion').animate({
                        opacity: '1'
                    });
                    $('#Principal').animate({
                        opacity: '0'
                    }, 'slow', function () {
                        $('#Principal').hide();
                        $('#Ayuda').slideDown('slow');
                    });
                });
                $('#addAdmin > .pie > button').click(function () {
                    var usuario = {
                        'nombre_usuario': $('input[name*=Nombre]').val()
                        , 'password': $('input[name*=Contrasena]').val()
                    };
                    console.log(usuario);
                    if (usuario.nombre_usuario == '' || usuario.password == '') {
                        alert("No debe haber espacion en blanco");
                    } else {
                        $.ajax({
                            url: 'http://proyectoservidor.herokuapp.com/registro/admin'
                            , method: 'POST'
                            , data: usuario
                            , success: function (result, status, xhr) {
                                alert('Usuario creado con exito');  
                            }
                        });
                    }
                });
                $('#cbz > button').click(function () {
                    $('.AccionTabla').slideUp('slow', function () {
                        $('#Principal').show();
                        $('#Principal').animate({
                            opacity: '1'
                        }, 'slow');
                    });
                });
                $('tbody').on('click', '#rechazar', function () {
                    var id = {
                        'id': parseInt($(this).parent().prev().prev().prev().prev().prev().prev().text())
                    };
                    console.log(id.id);
                    $.ajax({
                        url: 'http://proyectoservidor.herokuapp.com/preguntasuser'
                        , method: 'DELETE'
                        , data: id
                        , success: function (result, status, xhr) {
                            preguntasUser();
                        }
                    });
                });
                $('tbody').on('click', '#aceptar', function () {
                    var id = {
                        'id': parseInt($(this).parent().siblings(1).text())
                    };
                    var idRes = parseInt($('#idPre').text());
                    if(id.id == idRes){
                    var pregunta = {
                        'pregunta': $('#preg').children().children().first().next().text()
                        , 'categoria': $('#preg').children().children().first().next().next().text()
                        , 'nombre_usuario': login.nombre_usuario
                        , 'respuestaF1': $('#0').text()
                        , 'respuestaF2': $('#1').text()
                        , 'respuestaF3': $('#2').text()
                        , 'respuestaV': $('#3').text()
                    };
                    console.log(pregunta);
                    $.ajax({
                        url: 'http://proyectoservidor.herokuapp.com/preguntas'
                        , method: 'POST'
                        , data: pregunta
                        , success: function (result, status, xhr) {
                            alert('Pregunta insertada con exito');
                            $.ajax({
                                url: 'http://proyectoservidor.herokuapp.com/preguntasuser'
                                , method: 'DELETE'
                                , data: id
                                , success: function (result, status, xhr) {
                                    preguntasUser();
                                    $('#res').children().remove();
                                }
                            });
                        }
                    });
                    } else { alert('Debes ver las respuestas de la pregunta correspondiente');}
                });
                $('#addAdmin > .cabezera > button').click(function () {
                    $('.Accion').slideUp('slow', function () {
                        $('#Principal').show();
                        $('#Principal').animate({
                            opacity: '1'
                        }, 'slow');
                    });
                });
                $('#Ayuda > .cabezera > button').click(function () {
                    $('.Accion').slideUp('slow', function () {
                        $('#Principal').show();
                        $('#Principal').animate({
                            opacity: '1'
                        }, 'slow');
                    });
                });
                $('tbody').on('click', '#ver', function () {
                    var id = {
                        'id': parseInt($(this).parent().siblings(1).text())
                    };
                    console.log(id);
                    $.ajax({
                        url: "http://proyectoservidor.herokuapp.com/respuestasuser"
                        , method: 'POST'
                        , data: id
                        , success: function (result, status, xhr) {
                            $("#res").children().remove();
                            for (var i = 0; i < result.length; i++) {
                                $('#res').append(
                                    "<tr><td id='idPre'>" + result[i].pregunta_usuario_id + "</td><td id=" + i + ">" + result[i].respuesta + "<td>" + result[i].tipo + "</td></tr>"
                                );
                            }
                        }
                    });
                });
            }
            , statusCode: {
                400: function () {
                    alert("Asegurate de introducir bien tus credenciales");
                }
            }
        });
    });
    $('.cabezera > button').click(function () {
        $('.Accion').slideUp('slow', function () {
            $('#login').show();
            $('#login').animate({
                opacity: '1'
            }, 'slow');
        });
    });
    $('.Accion > .pie > button').click(function () {
        var usuario = {
            'nombre_usuario': $('input[name*=Nombre]').val()
            , 'password': $('input[name*=Contrasena]').val()
            , 'correo': $('input[name*=Correo]').val()
        };
        if (usuario.nombre_usuario == '' || usuario.password == '') {
            alert("No debe haber espacion en blanco");
        } else {
            console.log(usuario);
            $.ajax({
                url: 'http://proyectoservidor.herokuapp.com/registro'
                , method: 'POST'
                , data: usuario
                , success: function (result, status, xhr) {
                    alert('Usuario creado con exito');
                    $('.Accion').slideUp('slow', function () {
                        $('#login').show();
                        $('#login').animate({
                            opacity: '1'
                        }, 'slow');
                    });
                }
            });
        }

    });

});