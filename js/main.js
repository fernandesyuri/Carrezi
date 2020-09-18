if (typeof (Storage) !== "undefined") {
    // o navegador suporta o Web Storage
    function indice() {
        var veiculos = localStorage.getItem("veiculos");
        return JSON.parse(veiculos) || {};
    }

    function obter(uuid) {
        var veiculos = indice();
        if (typeof uuid !== "string" || uuid === "" || !veiculos[uuid])
            throw ("UUID inválida");

        return veiculos[uuid];
    }

    function armazenar(veiculo, atualizarListaVeiculos = false, uuid /* opcional */) {
        if (typeof veiculo !== "object" || !veiculo.modelo || !veiculo.marca || !veiculo.ano || !veiculo.preco || !veiculo.descricao || !veiculo.cor)
            throw ("Preencha todos os dados do veículo.");

        var veiculos = indice();
        veiculos[uuid || gerarUUID()] = veiculo;
        localStorage.setItem("veiculos", JSON.stringify(veiculos));
        if (atualizarListaVeiculos)
            atualizarListaVeiculos();
    }

    function atualizar(uuid, dados) {
        var veiculo;
        try {
            veiculo = obter(uuid);
            for (let dado in dados) veiculo[dado] = dados[dado];
            armazenar(veiculo, false, uuid);
        } catch (erro) {
            console.log('Erro ao atualizar veiculo: ' + erro);
        }
    }

    function remover(uuid) {
        var veiculos = indice();
        if (typeof uuid !== "string" || uuid === "" || !veiculos[uuid])
            throw ("UUID inválida");

        delete veiculos[uuid];
        localStorage.setItem("veiculos", JSON.stringify(veiculos));
        atualizarListaVeiculos();
    }

    function gerarUUID() {
        var dt = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }

    function btnEditClickHandler(event) {
        localStorage.setItem("veiculoEmEdicao", event.target.dataset.uuid);
        window.location.href = "cadastro.html";
    }

    function btnDeleteClickHandler(event) {
        uuidVeiculoARemover = event.target.dataset.uuid;
        $('#modalConfirmacao').modal('show');
    }

    function confirmaRemocao() {
        $('#modalConfirmacao').modal('hide');
        remover(uuidVeiculoARemover);
        $('#modalSucesso').modal('show');
    }

    var uuidVeiculoARemover = "";

    function atualizarListaVeiculos() {
        let listaVeiculos = document.getElementById('itens-listagem');
        listaVeiculos.innerHTML = '';
        let veiculos = indice();
        for (let uuid in veiculos) {

            let itemRow = document.createElement('div');
            itemRow.className = 'row mb-3';

            let itemCol = document.createElement('div');
            itemCol.className = 'col-12 px-1';
            itemRow.appendChild(itemCol);

            let card = document.createElement('div');
            card.className = 'card';
            itemCol.appendChild(card);

            let cardBody = document.createElement('div');
            cardBody.className = 'card-body';
            card.appendChild(cardBody);

            let outerContainer = document.createElement('div');
            outerContainer.className = 'container-fluid';
            cardBody.appendChild(outerContainer);

            let outerRow = document.createElement('div');
            outerRow.className = 'row';
            outerContainer.appendChild(outerRow);

            let imageCol = document.createElement('div');
            imageCol.className = 'col-12 col-lg-5';
            outerRow.appendChild(imageCol);

            let image = document.createElement('img');
            image.className = 'carImage';
            image.src = veiculos[uuid].foto ? `img/${veiculos[uuid].foto}` : '';
            imageCol.appendChild(image);

            let dataCol = document.createElement('div');
            dataCol.className = 'col-12 col-lg-7';
            outerRow.appendChild(dataCol);

            let innerContainer = document.createElement('div');
            innerContainer.className = 'container-fluid';
            dataCol.appendChild(innerContainer);

            let modeloRow = document.createElement('div');
            modeloRow.className = 'row';
            innerContainer.appendChild(modeloRow);

            let modeloCol = document.createElement('div');
            modeloCol.className = 'col-12 px-0';
            modeloRow.appendChild(modeloCol);

            let modeloSpan = document.createElement('span');
            modeloSpan.className = 'modeloVeiculo';
            modeloSpan.innerText = veiculos[uuid].modelo;
            modeloCol.appendChild(modeloSpan);

            let props = ['marca - Marca', 'preco - Preço', 'cor - Cor', 'descricao'];
            for (let prop of props) {

                let splited = prop.split(' - ');
                propName = splited[0];
                propLabel = splited[1];

                let propRow = document.createElement('div');
                propRow.className = propName !== 'descricao' ? 'row' : 'row mt-3';
                innerContainer.appendChild(propRow);

                let propCol = document.createElement('div');
                propCol.className = 'col-12 px-0';
                propRow.appendChild(propCol);

                let propTitle = document.createElement('b');
                propTitle.innerText = propLabel ? `${propLabel}: ` : '';
                propCol.appendChild(propTitle);

                let propSpan = document.createElement('span');
                propSpan.className = `${propName}Veiculo`;
                propSpan.innerText = propName !== 'preco' ? veiculos[uuid][propName] : parseFloat(veiculos[uuid][propName]).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });
                propCol.appendChild(propSpan);
            }

            let buttonRow = document.createElement('div');
            buttonRow.className = 'row mt-2';
            innerContainer.appendChild(buttonRow);

            let buttonCol = document.createElement('div');
            buttonCol.className = 'col-12 px-0 d-flex justify-content-end';
            buttonRow.appendChild(buttonCol);

            let buttonEdit = document.createElement('button');
            buttonEdit.type = 'button';
            buttonEdit.className = 'btn btn-primary mr-1';
            buttonEdit.innerText = 'Editar';
            buttonEdit.setAttribute('data-uuid', uuid);
            buttonEdit.addEventListener('click', btnEditClickHandler);
            buttonCol.appendChild(buttonEdit);

            let buttonDelete = document.createElement('button');
            buttonDelete.type = 'button';
            buttonDelete.className = 'btn btn-danger';
            buttonDelete.innerText = 'Remover';
            buttonDelete.setAttribute('data-uuid', uuid);
            buttonDelete.addEventListener('click', btnDeleteClickHandler);
            buttonCol.appendChild(buttonDelete);

            listaVeiculos.appendChild(itemRow);
        }
    }

    if (window.location.pathname === '/listagem.html')
        atualizarListaVeiculos();


} else {
    // o navegador NÃO suporta o Web Storage
    console.log('Este navegador não suporta Web Storage');
}