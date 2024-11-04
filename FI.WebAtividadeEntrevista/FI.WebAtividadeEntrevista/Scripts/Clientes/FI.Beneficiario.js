
$(document).ready(function () {       
    $('#btnBeneficiarios').click(function () {
        console.log("Botão Beneficiários clicado"); 
        $('#popupBeneficiarios').show(); 
        LimparBeneficiario(); 
    });

});

function LimparBeneficiario() {
    $('#cpf').val('');
    $('#nome').val('');  
}
function BeneficiarioGrid(beneficiarios) {
    const grid = $('#gridBeneficiarios');
    grid.empty(); 

    beneficiarios.forEach(beneficiario => {
        const row = $('<div>').css({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' });
        const info = $('<span>').text(`${beneficiario.Nome} - ${beneficiario.CPF}`);

        const editButton = $('<button>')
            .text('Alterar')
            .addClass('btn btn-warning btn-sm')
            .click(function () {
                $('#cpf').val(beneficiario.CPF);
                $('#nome').val(beneficiario.Nome);
                currentBeneficiaryId = beneficiario.ID; // Armazena o ID do beneficiário para atualização
            });

        const deleteButton = $('<button>')
            .text('Excluir')
            .addClass('btn btn-danger btn-sm')
            .click(function () {
                Excluir(beneficiario.ID);
            });

        row.append(info).append(editButton).append(deleteButton);
        grid.append(row);
    });
}
function Excluir(id) {
    $.ajax({
        url: `/beneficiarios/${id}`, // Supondo que a rota DELETE seja configurada assim
        method: "DELETE",
        success: function () {
            ModalDialog("Sucesso!", "Beneficiário excluído com sucesso.");
        
            BeneficiarioGrid();
        },
        error: function (r) {
            ModalDialog("Erro", "Não foi possível excluir o beneficiário.");
        }
    });
}
function validarCPF(cpf) {

    cpf = cpf.replace(/\D/g, ''); 
    if (cpf.length !== 11) return false;

    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
        sum += parseInt(cpf.charAt(i - 1)) * (11 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) {
        sum += parseInt(cpf.charAt(i - 1)) * (12 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    return remainder === parseInt(cpf.charAt(10));
}
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

