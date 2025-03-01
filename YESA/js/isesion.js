document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = loginForm.querySelector('input[type="email"]');
    const passwordInput = loginForm.querySelector('input[type="password"]');
    const googleBtn = document.querySelector('.google-btn');
    const registerBtn = document.querySelector('.register-btn');
    const forgotBtn = document.querySelector('.forgot-btn');

    // Manejar inicio de sesión regular
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = emailInput.value;
        const password = passwordInput.value;
        
        console.log('Intento de inicio de sesión:', { email, password });
        // Aquí iría la lógica de autenticación
    });

    // Manejar inicio de sesión con Google
    googleBtn.addEventListener('click', () => {
        console.log('Iniciando sesión con Google...');
        // Aquí iría la integración con Google
    });

    // Manejar registro
    registerBtn.addEventListener('click', () => {
        console.log('Redirigiendo a página de registro...');
        // Aquí iría la redirección al formulario de registro
    });

    // Manejar recuperación de contraseña
    forgotBtn.addEventListener('click', () => {
        console.log('Redirigiendo a recuperación de contraseña...');
        // Aquí iría la lógica de recuperación de contraseña
    });
});