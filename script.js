// ATENÇÃO, Insira seu script aqui

//Nome do aluno: COLOQUE SEU NOME
//----------------------------------------------------------------------------------------------------------------


let campoEmail = document.querySelector('#email');
let campoNome = document.querySelector('#nome');
let campoSobrenome = document.querySelector('#sobrenome');
let campoSite = document.querySelector('#website');
let habilidades = document.getElementsByName('habilidade');
let campoDataInicial = document.querySelector('#data-inicial');
let campoDataFinal = document.querySelector('#data-final');
let formulario = document.forms[0];

let prestadores = [];


document.getElementsByName('regiao').forEach(regiao => {
    regiao.addEventListener('change', evento => {
        validarRegiao(evento.target);
    });
})
carregarPrestadores();

formulario.addEventListener('submit', evento => {
    let temErro = false;
    if (!validarNome(campoNome.value)) {
        //evento.target.className = 'form-control is-invalid';
        escreveErro(campoNome, 'Nome tem que ter mais de 3 caracteres');
        temErro = true;
    }
    if (!validarEmail(campoEmail.value)) {
        escreveErro(campoEmail, 'Email inválido');
        temErro = true;
    }


    if (!validarSobrenome(campoSobrenome.value)) {
        escreveErro(campoSobrenome, 'Sobrenome inválido');
        temErro = true;
    }


    if (!validarWebsite(campoSite.value)) {
        escreveErro(campoSite, 'Informe um endereço no formato http[x]://www.exemplo.com');
        temErro = true;
    }


    if (!validarHabilidades(habilidades)) {
        document.querySelector('.erro-regiao').textContent = 'Informe no mínimo 1 e no máximo 3 habilidades';
        temErro = true;
    }


    if (!validarData(campoDataInicial.value, campoDataFinal.value)) {
        escreveErro(campoDataFinal, 'Informe datas válidas');
        temErro = true;
    }

    if (temErro) {
        evento.preventDefault();
    }
    else {
        adicionarPrestador();
    }



});


campoNome.addEventListener('blur', (evento) => {
    if (!validarNome(evento.target.value)) {
        //evento.target.className = 'form-control is-invalid';
        escreveErro(evento.target, 'Nome tem que ter mais de 3 caracteres');
    }
});

campoEmail.addEventListener('blur', (evento) => {
    if (!validarEmail(evento.target.value)) {
        escreveErro(evento.target, 'Email inválido');
    }
});

function escreveErro(elemento, mensagem) {
    //elemento.className = 'form-control is-invalid';
    elemento.classList.add('is-invalid');
    let elMsg = elemento.parentNode.querySelector('.invalid-feedback');
    elMsg.textContent = mensagem;
}


function validarNome(nome) {
    return nome.trim().length >= 3;
}

function validarSobrenome(sobrenome) {
    return sobrenome.trim().length > 0;
}

function validarEmail(email) {
    let partes = email.split('@');

    if (partes.length != 2) {
        return false;
    }

    let segundaParte = partes[1];

    return segundaParte.indexOf('.') >= 0;
}

function validarData(dataInicial, dataFinal) {
    let vetorDataInicial = dataInicial.split('/');
    let objDataInicial = new Date(
        vetorDataInicial[2],
        vetorDataInicial[1] - 1,
        vetorDataInicial[0]
    );

    let vetorDataFinal = dataFinal.split('/');
    let objDataFinal = new Date(
        vetorDataFinal[2],
        vetorDataFinal[1] - 1,
        vetorDataFinal[0]
    );

    let objDataAtual = new Date();

    if (objDataFinal < objDataInicial) {
        return false;
    }

    if (objDataInicial < objDataAtual) {
        return false;
    }

    return true;

}


function validarWebsite(site) {
    if (site.trim().length == 0) {
        return true;
    }

    if (!(site.startsWith('http://') || site.startsWith('https://'))) {
        return false;
    }

    return site.indexOf('.') > 0;
}

function validarHabilidades(habilidades) {
    let total = 0;
    habilidades.forEach(habilidade => {
        if (habilidade.checked) {
            total++;
        }
    })
    return total > 0 && total < 4;
}

function validarRegiao(regiao) {
    let elProgramador = document.querySelector('#habilidade-programador');
    let elDBA = document.querySelector('#habilidade-dba');
    if (regiao.id == 'regiao-coeste') {
        elProgramador.disabled = true;
        elProgramador.checked = false;
        elDBA.disabled = true;
        elDBA.checked = false;
    } else {
        elProgramador.disabled = false;
        elDBA.disabled = false;
    }
}

function adicionarPrestador() {
    let elRegiao = '';
    for (let i = 0; i < document.getElementsByName('regiao').length; i++) {
        if (document.getElementsByName('regiao')[i].checked) {
            elRegiao = document.getElementsByName('regiao')[i].id.slice(7);
        }
    }

    let elHabilidades = '';
    for (let i = 0; i < habilidades.length; i++) {
        if (habilidades[i].checked) {
            elHabilidades += habilidades[i].id.slice(11) + ' ';
        }
    }

    let prestador = {
        nome: campoNome.value,
        sobrenome: campoSobrenome.value,
        email: campoEmail.value,
        website: campoSite.value,
        regiao: elRegiao,
        habilidades: elHabilidades,
        disponibilidade: campoDataInicial.value + ' - ' + campoDataFinal.value
    };
    novoPrestador(prestador);
}

function novoPrestador(prestador) {
    let id = prestadores.push(prestador);
    let prestadoresTexto = JSON.stringify(prestadores);
    window.localStorage.setItem('prestadores', prestadoresTexto);
    adicionarItemTabela(prestador, id);
}

function adicionarItemTabela(prestador, id) {
    let tabela = document.querySelector('#tabela-agenda');
    let linha = tabela.tBodies[0].insertRow();
    let celulaNome = linha.insertCell();
    let celulaEmail = linha.insertCell();
    let celulaWebsite = linha.insertCell();
    let celulaDisponibilidade = linha.insertCell();
    let celulaRegiao = linha.insertCell();
    let celulaHabilidades = linha.insertCell();
    let celulaAcao = linha.insertCell();
    celulaNome.textContent = prestador.nome + ' ' + prestador.sobrenome;
    celulaEmail.textContent = prestador.email;
    celulaWebsite.textContent = prestador.website;
    celulaDisponibilidade.textContent = prestador.disponibilidade;
    celulaRegiao.textContent = prestador.regiao;
    celulaHabilidades.textContent = prestador.habilidades;
    let botao = document.createElement('button');
    botao.className = 'btn btn-danger';
    botao.innerText = 'Excluir';
    botao.dataset.prestadorid = Number(id-1);
    celulaAcao.appendChild(botao);
    botao.addEventListener('click', (evento) => {
        removerPrestador(evento.target);
    });
}

function removerPrestador(botao) {
    let id = botao.dataset.prestadorid;
    delete prestadores[id];
    window.localStorage.setItem('prestadores', JSON.stringify(prestadores));
    let tabela = document.querySelector('#tabela-agenda');
    let linhaParaRemover = botao.parentNode.parentNode;
    tabela.tBodies[0].removeChild(linhaParaRemover);
}

function carregarPrestadores() {
    if (localStorage.getItem('prestadores')) {
        let prestadores = JSON.parse(window.localStorage.getItem('prestadores'));
        for (let i = 0; i < prestadores.length; i++) {
            let prestador = prestadores[i];
            if (prestador != null) {
                novoPrestador(prestador);
            }
        }
    }
    else{
        window.localStorage.setItem('prestadores', JSON.stringify(prestadores));
    }

}