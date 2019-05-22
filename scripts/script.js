const address = "192.168.1.8";
const cursos = {
        
    1: "Engenharia Ambiental",
    2: "Engenharia Cívil",
    3: "Engenharia Elétrica",
    4: "Engenharia Eletrônica",
    5: "Engenharia Mecânica",
    6: "Engenharia de Energia",
    7: "Engenharia de Software",
    8: "Engenharia de Produção",
    9: "Análise e desenvolvimento de sistemas",
    10: "Outro"

};

$(function () {
    
    for (const i in cursos) {
        if (cursos.hasOwnProperty(i)) {
            const element = cursos[i];
            $("[name=cursos]").append('<option value="'+ i +'">'+ element +'</option>');
        }
    }

    $.get("http://" + address + "/api/log/", 'json')
        .done(data => {
            updateTables(data);
        });

    $("input[name=ra]").hide();
    
    $(".update-finger").click(event => {
        const id = $("input[name=id]").val();
        if (!id || id < 0) {
            showError('danger', "Informe um ID antes de inserir a digital");
            return;
        }
        $.post("http://" + address + "/api/abrircadastro/" + id,
            "json"
        ).done(data => {
            updateForms();
        });
    });

    /*
        Botao de cadastro
        Envia um POST
    */
    $(".cad").click(event => {
        $.post( "http://" + address + "/api/registrar/" + $("input[name=id]").val() 
                + "/" + $("input[name=name]").val() 
                + "/" + ($("input[name=ra]").val() ? $("input[name=ra]").val() : 0)
                + "/" + $("input[name=tipo]").prop("checked", true).val()
                + "/" + $("[name=cursos] option:selected").val(),"json")
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
                "http://" + address + "/api/cadastro/" +
                $("input[name=id]").val() +
                "?name=" +
                $("input[name=name]").val() +
                "&RA=" +
                ($("input[name=ra]").val() ? $("input[name=ra]").val() : 0) +
                "&aluno=" +
                ($("input[name=tipo]").prop("checked")) +
                "&curso=" +
                $("[name=cursos] option:selected").val(),
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

        updateForms();
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

function updateTables(data) {
    let arr = [];
    for(const key in data) {
        if (data.hasOwnProperty(key)) {
            arr.push(data[key]);
        }
    }

    data = arr.sort((a,b) => {
        return b.timestamp - a.timestamp;
    });

    for(const i in data) {
        const date = new Date(data[i].timestamp);
        const day = ("0" + date.getDay()).substr(-2);
        const month = ("0" + date.getMonth()).substr(-2);
        const year = date.getFullYear();
        $(".logs").append("<tr>");
        $(".logs").append('<th scope="row">' + data[i].id + '</th>');
        $(".logs").append('<td>' + date.getHours() + ":" + date.getMinutes() + " de " + day + "/" + month + "/" + year + '</td>');
        $(".logs").append("</tr>");
    }
}

function updateForms() {
    $.get(
        "http://" + address + "/api/cadastros/" + $("input[name=id]").val(),
        "json"
    )
        .done(data => {
            $("input[name=name]").val(data.name);
            $("[name=cursos]").val(data.curso);
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
}
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