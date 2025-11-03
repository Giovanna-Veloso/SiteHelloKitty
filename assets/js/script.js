const email = document.getElementById('email');
const senha = document.getElementById('senha');
const button = document.getElementById('btn');

button.addEventListener('click', function(event) {
    // Prever as informações a serem digitadas;
    event.preventDefault();

    const emailValue = email.value;
    const senhaValue = senha.value;

    if (emailValue === "admin123@gmail.com" && senhaValue === "admin123") {
        window.location.href = "assets/inicio.html";
    } else {
        alert("E-mail ou senha errados");
    }
});
