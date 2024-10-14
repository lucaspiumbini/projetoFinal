async function fetchUsuarios() {
    const ALL_USUARIOS_ENDPOINT = 'http://127.0.0.1:5000/api/usuarios';
    try {
        const response = await fetch(ALL_USUARIOS_ENDPOINT);
        if (!response.ok) {
            throw new Error('Erro na requisição');
        }
        const usuarios = await response.json();
        return usuarios;
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        return [];
    }
}

async function entrar() {
    const usuarioInput = document.querySelector('#usuario');
    const senhaInput = document.querySelector('#senha');
    const msgError = document.querySelector('#msgError');

    try {
        const listaUser = await fetchUsuarios();

        for (const item of listaUser) {
            if (usuarioInput.value === item.usuario && senhaInput.value === item.senha) {
                window.location.href = 'recursos.html';

                let token = Math.random().toString(16).substring(2) + Math.random().toString(16).substring(2)

                const userJson = JSON.stringify(item);
                localStorage.setItem('token', token);
                localStorage.setItem('user', userJson);
                return;
            }
        }

        usuarioInput.setAttribute('style', 'color:red; border-color:red;');
        senhaInput.setAttribute('style', 'color:red; border-color:red;');
        msgError.setAttribute('style', 'display:block');
        msgError.innerHTML = 'Usuário ou senha incorretos';
        usuarioInput.focus();
    } catch (error) {
        console.error('Erro ao entrar:', error);
        msgError.setAttribute('style', 'display:block');
        msgError.innerHTML = 'Ocorreu um erro ao tentar entrar';
    }
}

