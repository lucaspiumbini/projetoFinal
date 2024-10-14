
    // Função para exibir recursos
    async function fetchRecursos() {
        const ALL_RECURSOS_ENDPOINT = 'http://127.0.0.1:5000/api/recursos';
        const response = await fetch(ALL_RECURSOS_ENDPOINT);
        const recursos = await response.json();
        renderRecursos(recursos);
        return recursos;
    }

    // Função para renderizar recursos da página
    function renderRecursos(recursos) {
        const groupedRecurso = groupByTypeResource(recursos);
        Object.entries(groupedRecurso).forEach(([type, resources]) => {
            switch(type.trim()) {
                case 'equipamentos':
                    renderTable(resources, 'tbody-inventory', 'codigo', 'descricao', 'quantidade');
                    break;
                case 'veículos':
                    renderTable(resources, 'tbody-vehicles', 'codigo', 'modelo', 'ano');
                    break;
                case 'dispositivo de segurança':
                    renderTable(resources, 'tbody-security', 'codigo', 'descricao', 'status');
                    break;
                case 'equipamento de segurança':
                    renderTable(resources, 'tbody-securityequip', 'codigo', 'descricao', 'status');
                    break;                    
            }
        });
    }

    function renderTable(resources, containerId, col1, col2, col3) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';

        resources.forEach(resource => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${resource[col1]}</td>
                <td>${resource[col2]}</td>
                <td>${resource[col3]}</td>
                <td>
                    <button onclick="editarRecurso('${resource[col1]}')">Edit</button>
                    <button onclick="excluirRecurso('${resource[col1]}')">Delete</button>
                </td>
            `;
            container.appendChild(tr);
        });
    }


    // Função para mapear os produtos por "tipo_recurso"
    function groupByTypeResource(recursos) {
        const groupedRecurso = {};
    
        recursos.forEach(recurso => {
            const typeResource = recurso.tipo_recurso;
    
            if (!groupedRecurso[typeResource]) {
                groupedRecurso[typeResource] = [];
            }
    
            groupedRecurso[typeResource].push({
                codigo: recurso.codigo,
                descricao: recurso.descricao,
                modelo: recurso.modelo,
                tipo: recurso.tipo,
                quantidade: recurso.quantidade,
                ano: recurso.ano,
                status: recurso.status
            });
        });
    
        return groupedRecurso;
    }

    // Função para quantidade de usuarios
    async function fetchUsuarios() {
        const ALL_USUARIOS_ENDPOINT = 'http://127.0.0.1:5000/api/usuarios';
        const response = await fetch(ALL_USUARIOS_ENDPOINT);
        const usuarios = await response.json();
        renderUsuarios(usuarios)
        return usuarios;
    }

    // Função para contar funcionários
    function renderUsuarios(usuarios){

        const container = document.getElementById('usuarios');
        const quantidadeUsuarios = usuarios.filter(pessoa => pessoa).length
        container.innerHTML = quantidadeUsuarios;
    }

    async function fetchRecursoCod(codigo) {
        const ALL_RECURSOSCOD_ENDPOINT = `http://127.0.0.1:5000/api/recursos?codigo=${codigo}`;
        try {
            const response = await fetch(ALL_RECURSOSCOD_ENDPOINT);
            if (!response.ok) {
                throw new Error('Requisição falhou');
            }
            const recursoCod = await response.json();
            return recursoCod;
        } catch (error) {
            console.error("Erro ao buscar recurso:", error);
            throw error; 
        }
    }

    async function excluirRecurso(recurso) {
        if(userLogado.cargo === "gerente" || userLogado.cargo === "administrador de segurança"){
            try {
                const codigoRec = await fetchRecursoCod(recurso);
        
                if (confirm(`Você tem certeza que deseja excluir o item "${codigoRec.descricao}"?`)) {
                    const response = await fetch(`http://127.0.0.1:5000/api/recursos/${codigoRec.codigo}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });
        
                    if (response.ok) {
                        console.log("Recurso excluído com sucesso");
                        fetchRecursos(); 
                    } else {
                        throw new Error('Falha ao excluir recurso');
                    }
                } else {
                    console.log("Operação cancelada pelo usuário");
                }
            } catch (error) {
                console.error("Erro ao excluir recurso:", error);
            }
        } else {
            alert('Você não tem acesso para realizar alterações.')
        }
    }

    async function editarRecurso(recurso) {
        if(userLogado.cargo === "gerente" || userLogado.cargo === "administrador de segurança"){
            try {
                const codigoRec = await fetchRecursoCod(recurso);
                    window.open(`edita-recurso.html?codigo=${codigoRec.codigo}&descricao=${encodeURIComponent(codigoRec.descricao)}&modelo=${codigoRec.modelo}&tipo=${codigoRec.tipo}&quantidade=${codigoRec.quantidade}&ano=${codigoRec.ano}&status=${codigoRec.status}&tipo_recurso=${codigoRec.tipo_recurso}`, '_blank', 'width=500,height=600');
                    fetchRecursos()
                } catch (error) {
                    console.error("Erro ao excluir recurso:", error);
                }
        } else {
            alert('Você não tem acesso para realizar alterações.')
        }
    }

    //conferência login
    let userLogado = JSON.parse(localStorage.getItem('user'));
    let logado = document.querySelector('#olauser');
    
    if (userLogado) {
        logado.innerHTML = `Olá, ${userLogado.nome}`;
    } else {
        alert('Você precisa estar logado.');
        window.location.href = 'index.html';
    }
    
    const token = localStorage.getItem('token');

    function sair() {
        localStorage.removeItem('token')
        localStorage.removeItem('userLogado')
        window.location.href = 'index.html';
    }

    async function perfilUser() {
        window.open(`perfil.html`, '_blank', 'width=500,height=600');
    }

    function adicionarRecurso(){
        if(userLogado.cargo === "gerente" || userLogado.cargo === "administrador de segurança"){
            window.open(`adcionar-recurso.html`, '_blank', 'width=500,height=600');
            fetchRecursos()
        } else {
            alert('Você não tem acesso para realizar alterações.')
        }
    }

    fetchRecursos();