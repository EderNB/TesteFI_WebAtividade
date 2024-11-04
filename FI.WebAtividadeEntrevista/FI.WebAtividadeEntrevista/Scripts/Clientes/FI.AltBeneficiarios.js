$(document).ready(function () {
    // Verifica se um objeto de beneficiário foi passado (para edição)
    if (obj) {
        $('#popupBeneficiarios #nome').val(obj.Nome);
        $('#popupBeneficiarios #cpf').val(obj.CPF);
    }

    // Evento de submissão do formulário para salvar as alterações do beneficiário
    $('#saveBeneficiario').click(function () {
        const cpf = $('#popupBeneficiarios #cpf').val();
        const nome = $('#popupBeneficiarios #nome').val();

        if (validateCPF(cpf)) {
            // Realiza a chamada AJAX para salvar as alterações
            $.ajax({
                url: '/beneficiarios', // URL para a chamada de salvar
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({ cpf, nome, idCliente: /* ID do cliente atual */ }),
                success: function (response) {
                    ModalDialog("Sucesso!", "Beneficiário salvo com sucesso.");
                    BeneficiarioGrid(response.beneficiarios); // Atualiza o grid
                    LimpaBeneficiario(); // Limpa os campos
                },
                error: function (r) {
                    if (r.status === 400) {
                        ModalDialog("Erro", r.responseJSON.message);
                    } else {
                        ModalDialog("Erro", "Ocorreu um erro interno no servidor.");
                    }
                }
            });
        } else {
            alert('CPF inválido!');
        }
    });

    // Função para limpar os campos do pop-up
    function LimpaBeneficiario() {
        $('#popupBeneficiarios #cpf').val('');
        $('#popupBeneficiarios #nome').val('');
        $('#popupBeneficiarios').hide(); // Fecha o pop-up
    }
});

// Função para validar o CPF
function validateCPF(cpf) {
    // Implementar a lógica de validação do CPF
    cpf = cpf.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (cpf.length !== 11) return false;

    // Lógica de cálculo do dígito verificador do CPF
    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    return remainder === parseInt(cpf.substring(10, 11));
}

// Função para atualizar o grid de beneficiários
function BeneficiarioGrid(beneficiarios) {
    const grid = $('#gridBeneficiarios');
    grid.empty(); // Limpa o grid atual

    beneficiarios.forEach(beneficiario => {
        const row = $('<div>').text(`${beneficiario.Nome} - ${beneficiario.CPF}`);
        // Aqui você pode adicionar botões de editar e excluir, se necessário
        grid.append(row);
    });
}

// Função para exibir diálogos de modal
function ModalDialog(titulo, texto) {
    const randomId = Math.random().toString().replace('.', '');
    const dialogHtml = `
        <div id="${randomId}" class="modal fade">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                        <h4 class="modal-title">${titulo}</h4>
                    </div>
                    <div class="modal-body">
                        <p>${texto}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>
                    </div>
                </div><!-- /.modal-content -->
            </div><!-- /.modal-dialog -->
        </div><!-- /.modal -->
    `;

    $('body').append(dialogHtml);
    $('#' + randomId).modal('show');
}