// ATENÇÃO, Insira seu script aqui

//Nome do aluno: Mateus Mello
//----------------------------------------------------------------------------------------------------------------


if (localStorage.getItem('prestadores') === null) {
    window.localStorage.setItem('prestadores', '[]');
}

let prestadores = [];
let id = 0;

carregarPrestadores();

const campoEmail = document.querySelector('#email');
const campoNome = document.querySelector('#nome');
const formulario = document.forms[0];

document.getElementsByName('regiao').forEach(regiao => {
    regiao.addEventListener('change', evento => {
        validarRegiao(evento.target);
    });
})



formulario.addEventListener('submit', evento => {
    let temErro = false;
    if (!validarNome(campoNome.value)) {
        escreveErro(campoNome, 'Nome tem que ter mais de 3 caracteres');
        temErro = true;
    }
    if (!validarEmail(campoEmail.value)) {
        escreveErro(campoEmail, 'Email inválido');
        temErro = true;
    }

    const campoSobrenome = document.querySelector('#sobrenome');
    if (!validarSobrenome(campoSobrenome.value)) {
        escreveErro(campoSobrenome, 'Sobrenome inválido');
        temErro = true;
    }

    const campoSite = document.querySelector('#website');
    if (!validarWebsite(campoSite.value)) {
        escreveErro(campoSite, 'Informe um endereço no formato http[x]://www.exemplo.com');
        temErro = true;
    }

    const habilidades = document.getElementsByName('habilidade');
    if (!validarHabilidades(habilidades)) {
        document.querySelector('.erro-regiao').textContent = 'Informe no mínimo 1 e no máximo 3 habilidades';
        temErro = true;
    }



    if (temErro) {
        evento.preventDefault();
    }
    else {
        if (document.getElementById('acao').name == 'adicionar') {
            adicionarPrestador();
        } else {
            alterarPrestador();
        }
    }



});


campoNome.addEventListener('blur', (evento) => {
    if (!validarNome(evento.target.value)) {
        escreveErro(evento.target, 'Nome tem que ter mais de 3 caracteres');
    }
});

campoEmail.addEventListener('blur', (evento) => {
    if (!validarEmail(evento.target.value)) {
        escreveErro(evento.target, 'Email inválido');
    }
});

function escreveErro(elemento, mensagem) {
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

    let elNome = document.querySelector('#nome');
    let elSobrenome = document.querySelector('#sobrenome');
    let elEmail = document.querySelector('#email');
    let elWebsite = document.querySelector('#website');
    let elRegiao = '';
    let elDisponibilidade = document.querySelector('#data-inicial').value + ' - ' + document.querySelector('#data-final').value;

    for (let i = 0; i < document.getElementsByName('regiao').length; i++) {
        if (document.getElementsByName('regiao')[i].checked) {
            elRegiao = document.getElementsByName('regiao')[i].id.slice(7);
        }
    }

    elHabilidades = '';

    for (let i = 0; i < document.getElementsByName('habilidade').length; i++) {
        if (elHabilidades == '' && document.getElementsByName('habilidade')[i].checked) {
            elHabilidades += document.getElementsByName('habilidade')[i].id.slice(11);
        }
        else if (document.getElementsByName('habilidade')[i].checked) {
            elHabilidades += ', ' + document.getElementsByName('habilidade')[i].id.slice(11);
        }
    }

    let prestador = {
        nome: elNome.value,
        sobrenome: elSobrenome.value,
        email: elEmail.value,
        website: elWebsite.value,
        disponibilidade: elDisponibilidade,
        regiao: elRegiao,
        habilidades: elHabilidades
    };
    novoPrestador(prestador);

}


function novoPrestador(prestador) {
    let id = prestadores.push(prestador);
    let prestradoresTexto = JSON.stringify(prestadores);
    window.localStorage.setItem('prestadores', prestradoresTexto);
    adicionarItemTabela(prestador, id);
}


function carregarPrestadores() {
    let prestadores = JSON.parse(window.localStorage.getItem('prestadores'));
    for (let x = 0; x < prestadores.length; x++) {
        let prestador = prestadores[x];
        if (prestador != null) {
            novoPrestador(prestador);
        }
    }
}

function adicionarItemTabela(prestador, id) {
    let tabela = document.querySelector('#tabela-agenda');
    let linha = tabela.tBodies[0].insertRow();
    let celulaNome = linha.insertCell();
    let celulaSobrenome = linha.insertCell();
    let celulaEmail = linha.insertCell();
    let celulaWebsite = linha.insertCell();
    let celulaDisponibilidade = linha.insertCell();
    let celulaRegiao = linha.insertCell();
    let celulaHabilidades = linha.insertCell();
    let celulaAcao = linha.insertCell();
    let celulaAlteracao = linha.insertCell();
    celulaNome.textContent = prestador.nome;
    celulaSobrenome.textContent = prestador.sobrenome;
    celulaEmail.textContent = prestador.email;
    celulaWebsite.textContent = prestador.website;
    celulaDisponibilidade.textContent = prestador.disponibilidade;
    celulaRegiao.textContent = prestador.regiao;
    celulaHabilidades.textContent = prestador.habilidades;
    let botao = document.createElement('button');
    botao.className = 'btn btn-danger';
    botao.innerText = 'Excluir';
    botao.dataset.prestadorid = Number(id) - 1;
    celulaAcao.appendChild(botao);
    botao.addEventListener('click', (evento) => {
        removerPrestador(evento.target);
    });
    let alterar = document.createElement('button');
    alterar.className = 'btn btn-info';
    alterar.innerText = 'Alterar';
    alterar.dataset.prestadorid = Number(id) - 1;
    celulaAlteracao.appendChild(alterar);
    alterar.addEventListener('click', (evento) => {
        receberPrestadorDaTabela(evento.target);
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

function receberPrestadorDaTabela(alterar) {
    id = alterar.dataset.prestadorid;
    let prestadores = window.localStorage.getItem('prestadores');
    let prestador = JSON.parse(prestadores);
    document.getElementById("nome").value = prestador[id].nome;
    document.getElementById("sobrenome").value = prestador[id].sobrenome;
    document.getElementById("email").value = prestador[id].email;
    document.getElementById("website").value = prestador[id].website;
    document.getElementById("data-inicial").value = prestador[id].disponibilidade.slice(0,10);
    document.getElementById("data-final").value = prestador[id].disponibilidade.slice(13);
    if(prestador[id].regiao.includes('sul')){
        document.getElementsByName('regiao')[0].checked = true
    }
    if(prestador[id].regiao.includes('sudeste')){
        document.getElementsByName('regiao')[1].checked = true
    }
    let elProgramador = document.querySelector('#habilidade-programador');
    let elDBA = document.querySelector('#habilidade-dba');
    if (prestador[id].regiao.includes('coeste')) {
        document.getElementsByName('regiao')[2].checked = true
        elProgramador.disabled = true;
        elProgramador.checked = false;
        elDBA.disabled = true;
        elDBA.checked = false;
    } else {
        elProgramador.disabled = false;
        elDBA.disabled = false;
    }
    if(prestador[id].regiao.includes('nordeste')){
        document.getElementsByName('regiao')[3].checked = true
    }
    if(prestador[id].regiao.includes('norte')){
        document.getElementsByName('regiao')[4].checked = true
    }
    document.getElementsByName('habilidade').forEach(element => {
        element.checked = false;
    });
    if(prestador[id].habilidades.includes('analista')){
        document.getElementsByName('habilidade')[0].checked = true
    }
    if(prestador[id].habilidades.includes('programador')){
        document.getElementsByName('habilidade')[1].checked = true
    }
    if(prestador[id].habilidades.includes('webdes')){
        document.getElementsByName('habilidade')[2].checked = true
    }
    if(prestador[id].habilidades.includes('dba')){
        document.getElementsByName('habilidade')[3].checked = true
    }
    if(prestador[id].habilidades.includes('rede')){
        document.getElementsByName('habilidade')[4].checked = true
    }

    document.getElementById('acao').classList.add('btn-info');
    document.getElementById('acao').setAttribute("name","alterar");
    document.getElementById('acao').innerText = 'Alterar prestador de serviço';
    document.getElementById('nome').focus();
    
}

function alterarPrestador(){
    let elNome = document.querySelector('#nome');
    let elSobrenome = document.querySelector('#sobrenome');
    let elEmail = document.querySelector('#email');
    let elWebsite = document.querySelector('#website');
    let elRegiao = '';
    let elDisponibilidade = document.querySelector('#data-inicial').value + ' - ' + document.querySelector('#data-final').value;

    for (let i = 0; i < document.getElementsByName('regiao').length; i++) {
        if (document.getElementsByName('regiao')[i].checked) {
            elRegiao = document.getElementsByName('regiao')[i].id.slice(7);
        }
    }

    elHabilidades = '';

    for (let i = 0; i < document.getElementsByName('habilidade').length; i++) {
        if (elHabilidades == '' && document.getElementsByName('habilidade')[i].checked) {
            elHabilidades += document.getElementsByName('habilidade')[i].id.slice(11);
        }
        else if (document.getElementsByName('habilidade')[i].checked) {
            elHabilidades += ', ' + document.getElementsByName('habilidade')[i].id.slice(11);
        }
    }

    let prestadores = window.localStorage.getItem('prestadores');
    let prestador = JSON.parse(prestadores);
    prestador[id].nome = elNome.value;
    prestador[id].sobrenome = elSobrenome.value;
    prestador[id].email = elEmail.value;
    prestador[id].website = elWebsite.value;
    prestador[id].disponibilidade = elDisponibilidade;
    prestador[id].regiao = elRegiao;
    prestador[id].habilidades = elHabilidades;
    window.localStorage.setItem('prestadores', JSON.stringify(prestador));

    
}