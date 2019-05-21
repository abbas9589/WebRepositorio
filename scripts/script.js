$(function () {

    $("input[name=ra]").hide();

    $(".update-finger").click(event => {
        if (!$("input[name=id]").val()) {
            showError('danger', "Informe um ID antes de inserir a digital");
            return;
        }
        $.post("http://localhost/api/abrircadastro/" + $("input[name=id]").val(),
            "json"
        ).done(data => {
            console.log(data);
        });
    });

    /*
        Botao de cadastro
        Envia um POST
    */
    $(".cad").click(event => {
        $.post( "http://localhost/api/registrar/" + $("input[name=id]").val() + "/" + $("input[name=name]").val() + "/" + ($("input[name=ra]").val() ? $("input[name=ra]").val() : 0),"json")
            .done(data => {
                console.log(data);
            })
            .fail(data => {
                console.log(data);
            });
    });
    /*
        Botao de alteração de cadastro
        Envia um PUT
    */
    $(".alt").click(event => {
        $.ajax({
            url:
                "http://localhost/api/cadastro/" +
                $("input[name=id]").val() +
                "?name=" +
                $("input[name=name]").val() +
                "&RA=" +
                ($("input[name=ra]").val() ? $("input[name=ra]").val() : 0),
            method: "PUT"
        })
            .done(data => {
                showError('success', "Cadastro alterado");
                console.log(data);
            })
            .fail(data => {
                showError('danger', 'Falha ao alterar o cadastro');
                console.log(data);
            });
    });

    /*
        Listener que carrega o cadastro
        comforme o usuário digita o ID
    */
    $("input[name=id]").keyup(event => {
        if (!$("input[name=id]").val()) {
            $(".alt").attr("disabled", "disabled");
            $(".cad").attr("disabled", "disabled");
            return;
        }

        $.get(
            "http://localhost/api/cadastros/" + $("input[name=id]").val(),
            "json"
        )
            .done(data => {
                $("input[name=name]").val(data.name);
                if(!data.ra || data.ra == 0){
                    $("input[name=ra]").hide();
                    $("input[id=professor-radio]").prop("checked", true);
                } else {
                    $("input[name=ra]").show();
                    $("input[name=ra]").val(data.ra);
                    $("input[id=aluno-radio]").prop("checked", true);
                }
                $(".alt").removeAttr("disabled");
                $(".cad").attr("disabled", "disabled");
            })
            .fail(data => {
                showError('danger', "Cadastro não encontrado");
                console.log("cadastro nao existe");
                $("input[name=name]").val("");
                $("input[name=ra]").val("");
                $(".alt").attr("disabled", "disabled");
                $(".cad").removeAttr("disabled");
            });
    });

    /*
        Atualização de botões RADIO.
    */
    $("input[name=tipo]").on('change', () => {
        if($("input[name=tipo]:checked", ".radios").val() === 'professor') {
            $("input[name=ra]").hide();
            return;
        } else {
            $("input[name=ra]").show();
            return;
        }
    });
});
function showError(alertType, msg) {
    const alert = $(".alert");
    let classToAdd;
    alert.show();
    if (alertType === 'danger') {
        classToAdd = 'alert-danger';
    } else if (alertType === 'success') {
        classToAdd = 'alert-success';
    }
    alert.addClass(classToAdd);
    alert.text(msg);
    setTimeout(() => {
        alert.removeClass(classToAdd);
        alert.hide();
    }, 3000);
}