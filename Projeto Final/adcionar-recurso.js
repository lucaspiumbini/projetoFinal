function preencherDados(recurso) {
    document.getElementById('codigo').value = recurso.codigo;
}

function coletarDadosFormulario() {
    const codigo = document.getElementById('codigo').value;
    const descricao = document.getElementById('descricao').value;
    const modelo = document.getElementById('modelo').value;
    const tipo = document.getElementById('tipo').value;
    const quantidade = document.getElementById('quantidade').value;
    const ano = document.getElementById('ano').value;
    const status = document.getElementById('status').value;
    const tipoRecurso = document.getElementById('tipo_recurso').value;

    return {
        codigo,
        descricao,
        modelo,
        tipo,
        quantidade,
        ano,
        status,
        tipo_recurso: tipoRecurso
    };
}

async function salvarAlteracoes() {
    const dadosCod = coletarDadosFormulario().codigo;
    console.log(dadosCod)
    
    try {      
        const response = await fetch(`http://127.0.0.1:5000/api/recursos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(coletarDadosFormulario()),
        });

        if (!response.ok) {
            throw new Error('Erro ao adcionar recurso');
        }

        const data = await response.json();
        console.log('Recurso adcionado com sucesso!');
        window.close();
        opener.location.reload();
    } catch (error) {
        console.error('Erro ao adcionar recurso:', error);
        alert('Ocorreu um erro ao adcionar recurso. Detalhes do erro: ' + error.message);
    }
}

document.getElementById('formulario').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    try {
        const dadosFormulario = coletarDadosFormulario();
        
        if (dadosFormulario !== null) {
            await salvarAlteracoes();
            
            if (confirm('Tem certeza de que deseja fechar a janela após criar o recurso?')) {
                alert('Recurso salva com sucesso!');
            }
        }
    } catch (error) {
        console.error('Erro ao adcionar recurso:', error);
        alert('Ocorreu um erro ao adcionar recurso. Detalhes do erro: ' + error.message);
    }
});

window.addEventListener('load', async function() {
    const newCode = await getNextCode();

    async function getNextCode() {
        const produtos = await fetchRecursos();
        const lastProduct = produtos[produtos.length - 1];
        const lastCode = parseInt(lastProduct.codigo.replace('A', ''));
        return 'A' + (lastCode + 1).toString().padStart(3, '0');
    }

    const recurso = {
        codigo: newCode
    };
    console.log(recurso)

    preencherDados(recurso);
});

// Função para exibir recursos
async function fetchRecursos() {
    const ALL_RECURSOS_ENDPOINT = 'http://127.0.0.1:5000/api/recursos';
    const response = await fetch(ALL_RECURSOS_ENDPOINT);
    const recursos = await response.json();
    return recursos;
}

let userLogado = JSON.parse(localStorage.getItem('user'));

if (userLogado) {
} else {
    alert('Você precisa estar logado.');
    window.location.href = 'index.html';
}