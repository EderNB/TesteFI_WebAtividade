
$(document).ready(function () {
      
    $('#formCadastro').submit(function (e) {
        e.preventDefault();

        const nr_cpf = $(this).find("#CPF")[0]; 
        const vlcpf = nr_cpf.value;
       
        if (!verificaCPF(vlcpf)) {
            ModalDialog("Validação do CPF", "CPF inválido.");
            return; 
        }

        verificarCpfCadastrado(vlcpf, $(this));

        $.ajax({
            url: urlPost,
            method: "POST",
            data: {
                "NOME": $(this).find("#Nome").val(),
                "CEP": $(this).find("#CEP").val(),
                "Email": $(this).find("#Email").val(),
                "Sobrenome": $(this).find("#Sobrenome").val(),
                "Nacionalidade": $(this).find("#Nacionalidade").val(),
                "Estado": $(this).find("#Estado").val(),
                "Cidade": $(this).find("#Cidade").val(),
                "Logradouro": $(this).find("#Logradouro").val(),
                "Telefone": $(this).find("#Telefone").val(),
                "cpf": $(this).find("#CPF").val()
            },
            error:
            function (r) {
                if (r.status == 400)
                    ModalDialog("Ocorreu um erro", r.responseJSON);
                else if (r.status == 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            },
            success:
            function (r) {
                ModalDialog("Sucesso!", r)
                $("#formCadastro")[0].reset();
            }
        });
    })
    
})
function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(texto);
    $('#' + random).modal('show');
}
function verificaCPF(nr_cpf) {
   
    nr_cpf = nr_cpf.replace(/\D/g, '');
    
    if (nr_cpf.length !== 11 || /^(.)\1{10}$/.test(cpf)) {
        return false;
    }
   
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(nr_cpf[i]) * (10 - i);
    }
    let resto = (soma * 10) % 11;
    let digito1 = (resto === 10 || resto === 11) ? 0 : resto;
    
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(nr_cpf[i]) * (11 - i);
    }
    resto = (soma * 10) % 11;
    let digito2 = (resto === 10 || resto === 11) ? 0 : resto;
    
    return nr_cpf[9] == digito1 && nr_cpf[10] == digito2;
}
function verificarCpfCadastrado(cpf, form) {
    $.ajax({
        url: '/Cliente/VerificarExistencia',
        method: "POST",
        data: { "cpf": cpf },
        success: function (response) {
            if (response.existe) {
                ModalDialog("Consulta de CPF", "CPF cadastrado!");
            } else {
                // Se o CPF não está cadastrado, chama a função para enviar o formulário
                enviarFormulario(form);
            }
        },
        error: function (r) {
            ModalDialog("Erro", "Ocorreu um erro ao verificar o CPF. Tente novamente.");
        }
    });
}
