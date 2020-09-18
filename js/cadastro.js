VMasker(document.querySelector(".numeroApenas")).maskNumber();

(function () {
    'use strict';
    window.addEventListener('load', function () {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.getElementsByClassName('needs-validation');
        // Loop over them and prevent submission
        var validation = Array.prototype.filter.call(forms, function (form) {
            form.addEventListener('submit', function (event) {
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);
        });
    }, false);
})();

var veiculoEmEdicao = localStorage.getItem("veiculoEmEdicao");
if (veiculoEmEdicao) {
    let veiculo = obter(veiculoEmEdicao);

    document.getElementById('inputMarca').value = veiculo.marca;
    document.getElementById('inputModelo').value = veiculo.modelo;
    document.getElementById('inputAno').value = veiculo.ano;
    document.getElementById('inputPreco').value = veiculo.preco;
    document.getElementById('inputFoto').value = veiculo.foto;
    document.getElementById('inputCor').value = veiculo.cor;
    document.getElementById('inputDescricao').innerHTML = veiculo.descricao;

    document.getElementById('btnCadastrar').innerText = 'Salvar Edição';
}

function salvarVeiculo() {

    let veiculo = {
        marca: document.getElementById('inputMarca').value,
        modelo: document.getElementById('inputModelo').value,
        ano: document.getElementById('inputAno').value,
        preco: document.getElementById('inputPreco').value,
        foto: document.getElementById('inputFoto').value,
        cor: document.getElementById('inputCor').value,
        descricao: document.getElementById('inputDescricao').value
    }

    if (veiculo.marca && veiculo.modelo.length > 1 && veiculo.ano >= 1900 &&
        veiculo.preco > 1 && veiculo.preco < 100000000 && veiculo.cor && veiculo.descricao) {

        if (veiculoEmEdicao) {
            atualizar(veiculoEmEdicao, veiculo);
        } else {
            armazenar(veiculo);
        }
        localStorage.setItem("veiculoEmEdicao", "");
        window.location.href = "listagem.html";
    }
}