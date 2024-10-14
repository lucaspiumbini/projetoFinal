
    // Função para exibir recursos
    async function fetchRecursos() {
        const ALL_RECURSOS_ENDPOINT = 'http://127.0.0.1:5000/api/recursos';
        const response = await fetch(ALL_RECURSOS_ENDPOINT);
        const recursos = await response.json();
        recursosDisponveis(recursos)
        nivelSeguranca(recursos)
        renderQtdeRecursos(recursos)
        itensEmManutenção(recursos)
        return recursos;
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

    // Função para renderizar recursos no dash
    function renderQtdeRecursos(recursos) {
        const groupedRecurso = groupByTypeResource(recursos);
        console.log(groupedRecurso)

        Object.entries(groupedRecurso).forEach(([type, resources]) => {
            switch(type.trim()) {
                case 'equipamentos':
                    const quantidadeEqui = resources.length;
                    const equiUso = resources.filter(equip => equip.status === "Em uso").length;
                    const percentualEquipUso = ((equiUso / quantidadeEqui) * 100).toFixed(2);
                    console.log(type);
                    renderTableValores('valores-dash', type, quantidadeEqui, percentualEquipUso);
                    break;
                case 'veículos':
                    const quantidadeVehicle = resources.length;
                    const vehiUso = resources.filter(equip => equip.status === "Em uso").length;
                    const percentualVehiUso = ((vehiUso / quantidadeVehicle) * 100).toFixed(2);
                    renderTableValores('valores-dash', type, quantidadeVehicle, percentualVehiUso);
                    break;
                case 'equipamento de segurança':
                    const quantidadeEquipSegu = resources.length;
                    const equipSegUso = resources.filter(equip => equip.status === "Em uso").length;
                    const percentualEquipSegupUso = ((equipSegUso / quantidadeEquipSegu) * 100).toFixed(2);
                    renderTableValores('valores-dash', type, quantidadeEquipSegu, percentualEquipSegupUso);
                    break;
                case 'dispositivo de segurança':
                    const quantidadeDispSeg = resources.length;
                    const dispUso = resources.filter(equip => equip.status === "Em uso").length;
                    const percentualDispUso = ((dispUso / quantidadeDispSeg) * 100).toFixed(2);
                    renderTableValores('valores-dash', type, quantidadeDispSeg, percentualDispUso);
                    break;                    
            }
        });
    }

    function renderTableValores(containerId, coluna1, coluna2, coluna3) {
        const container = document.getElementById(containerId);

        const tr = document.createElement('tr');
        tr.innerHTML += `
            <td>${coluna1.toUpperCase()}</td>
            <td>${coluna2}</td>
            <td>${coluna3}</td>
        `;
        container.appendChild(tr);
    }

    function recursosDisponveis(recursos) {
        const container = document.getElementById('recursos-disponiveis');
        const recursosDisponiveis = recursos.filter(recurso => recurso.status === "Em uso").length;
        container.innerHTML = recursosDisponiveis;

        const recursosTotais = recursos.filter(recurso => recurso.status).length;

        const containerbar = document.getElementById('recursos-bar');
        containerbar.innerHTML = `
        <progress class="progress" value="${recursosDisponiveis}" max="${recursosTotais}"></progress>
        `;

    }

    function nivelSeguranca(recursos) {
        const groupedRecurso = groupByTypeResource(recursos);

        Object.entries(groupedRecurso).forEach(([type, resources]) => {
            switch(type.trim()) {
                case 'dispositivo de segurança':
                    const container = document.getElementById('nivel-seguranca');
                    const quantidadeEquipSegu = resources.length;
                    const equipSegUso = resources.filter(equip => equip.status === "Em uso").length;

                    container.innerHTML = `${((equipSegUso / quantidadeEquipSegu) * 100).toFixed(0)}%`;
            
                    const containerbar = document.getElementById('seguranca-bar');
                    containerbar.innerHTML = `
                    <progress class="progress" value="${equipSegUso}" max="${quantidadeEquipSegu    }"></progress>
                    `;
                    break; 
                }
            })

    }

    function itensEmManutenção(recursos) {
        const container = document.getElementById('alertas');       
        const recursosManutencao = recursos.filter(recurso => recurso.status === "Em manutenção").length;
        
        if (recursosManutencao > 0) {
            container.innerText = `Temos ${recursosManutencao} recurso(s) em manutenção, realizar o acompanhamento.`;
        } else {
            container.innerText = 'Não há recursos em manutenção.';
        }
    }

    //conferência login
    let userLogado = JSON.parse(localStorage.getItem('user'));
    let logado = document.querySelector('#olauser');
    
    if (userLogado) {
        logado.innerHTML = `Olá, ${userLogado.nome}`;
        console.log(userLogado);
    } else {
        alert('Você precisa estar logado.');
        window.location.href = 'index.html';
    }
    
    // Verificar se o token está presente
    const token = localStorage.getItem('token');
    console.log('Token:', token);

    function sair() {
        localStorage.removeItem('token')
        localStorage.removeItem('userLogado')
        window.location.href = 'index.html';
    }
    
    async function perfilUser() {
        window.open(`perfil.html?nome=${userLogado.nome}&sobrenome=${userLogado.sobrenome}&usuario=${userLogado.usuario}&dataNascimento=${userLogado.dataNascimento}&cargo=${userLogado.cargo}`, '_blank', 'width=500,height=600');
    }
    
    
    fetchUsuarios();
    fetchRecursos();