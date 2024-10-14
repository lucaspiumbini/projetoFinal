function preencherDados(recurso) {
    document.getElementById('codigo').value = recurso.codigo;
    document.getElementById('descricao').value = recurso.descricao;
    document.getElementById('modelo').value = recurso.modelo;
    document.getElementById('tipo').value = recurso.tipo;
    document.getElementById('quantidade').value = recurso.quantidade;
    document.getElementById('ano').value = recurso.ano;
    document.getElementById('status').value = recurso.status;
    document.getElementById('tipo_recurso').value = recurso.tipo_recurso;
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

window.addEventListener('load', function() {
    const params = new URLSearchParams(window.location.search);
    const codigo = params.get('codigo');
    const descricao = decodeURIComponent(params.get('descricao'));
    const modelo = params.get('modelo');
    const tipo = params.get('tipo');
    const quantidade = parseInt(params.get('quantidade')) || 0;
    const ano = parseInt(params.get('ano')) || 0;
    const status = params.get('status');
    const tipoRecurso = params.get('tipo_recurso');

    const recurso = {
        codigo,
        descricao,
        modelo,
        tipo,
        quantidade,
        ano,
        status,
        tipo_recurso: tipoRecurso
    };

    preencherDados(recurso);
});

async function salvarAlteracoes() {
    const dadosCod = coletarDadosFormulario().codigo;
    console.log(dadosCod)
    
    try {      
        const response = await fetch(`http://127.0.0.1:5000/api/recursos/${dadosCod}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(coletarDadosFormulario()),
        });

        if (!response.ok) {
            throw new Error('Erro ao salvar alterações');
        }

        const data = await response.json();
        console.log('Alterações salvas com sucesso!');
        window.close();
        opener.location.reload();
    } catch (error) {
        console.error('Erro ao salvar alterações:', error);
        alert('Ocorreu um erro ao salvar as alterações. Detalhes do erro: ' + error.message);
    }
}

document.getElementById('formulario').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    try {
        const dadosFormulario = coletarDadosFormulario();
        
        if (dadosFormulario !== null) {
            await salvarAlteracoes();
            
            if (confirm('Tem certeza de que deseja fechar a janela após salvar as alterações?')) {
                alert('Alterações salvas com sucesso!');
            }
        }
    } catch (error) {
        console.error('Erro ao salvar alterações:', error);
        alert('Ocorreu um erro ao salvar as alterações. Detalhes do erro: ' + error.message);
    }
});

let userLogado = JSON.parse(localStorage.getItem('user'));

if (userLogado) {
} else {
    alert('Você precisa estar logado.');
    window.location.href = 'index.html';
}
