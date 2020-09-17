if (typeof(Storage) !== "undefined") {
    // o navegador suporta o Web Storage
    function indice() {
        var veiculos = localStorage.getItem("veiculos");
        return JSON.parse(veiculos) || {};
    }

    function obter(uuid) {
        var veiculos = indice();
        if (typeof uuid !== "string" || uuid === "" || !veiculos[uuid])
            throw("UUID inválida");
        
        return veiculos[uuid];
    }

    function armazenar(veiculo, uuid /* opcional */) {
        if (typeof veiculo !== "object" || !veiculo.modelo || !veiculo.marca || !veiculo.ano || !veiculo.preco || !veiculo.descricao || !veiculo.cor)
                throw("Preencha todos os dados do veículo.");

        var veiculos = indice();
        veiculos[uuid || gerarUUID()] = veiculo;
        localStorage.setItem("veiculos", JSON.stringify(veiculos));
    }

    function atualizar(uuid, dados) {
        var veiculo;
        try {
            veiculo = obter(uuid);
            for (let dado in dados) veiculo[dado] = dados[dado];
            armazenar(veiculo, uuid);
        } catch (erro) {
            console.log('Erro ao atualizar veiculo: ' + erro);
        }
    }

    function remover(uuid) {
        var veiculos = indice();
        if (typeof uuid !== "string" || uuid === "" || !veiculos[uuid])
            throw("UUID inválida");
        
        delete veiculos[uuid];
        localStorage.setItem("veiculos", JSON.stringify(veiculos));
    }

    function gerarUUID(){
        var dt = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (dt + Math.random()*16)%16 | 0;
            dt = Math.floor(dt/16);
            return (c=='x' ? r :(r&0x3|0x8)).toString(16);
        });
        return uuid;
    }
} else {
    // o navegador NÃO suporta o Web Storage
    console.log('Este navegador não suporta Web Storage');
}