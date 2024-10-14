let userLogado = JSON.parse(localStorage.getItem('user'));

window.addEventListener('load', function() {
    console.log(userLogado)
    preencherDados();
});


function preencherDados() {
    const nomeCompleto = document.getElementById('nome')
    nomeCompleto.innerHTML += `${userLogado.nome} ${userLogado.sobrenome}`
    const usuario = document.getElementById('usuario')
    usuario.innerHTML += `${userLogado.usuario}`
    const cargo = document.getElementById('cargo')
    cargo.innerHTML += `${userLogado.cargo}`
    const data = document.getElementById('dataNascimento')
    data.innerHTML += `${userLogado.dataNascimento}`
}

if (userLogado) {
} else {
    alert('Você precisa estar logado.');
    window.location.href = 'index.html';
}