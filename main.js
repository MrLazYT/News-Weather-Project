
function getCookies() {
    return document.cookie.split(';').reduce((cookies, cookie) => {
        const [name, value] = cookie.split('=').map(c => c.trim());
        cookies[name] = value;
        return cookies;
    }, {});
}

document.addEventListener('DOMContentLoaded', () => {
    const cookies = getCookies();
    console.log('Load cockie:', cookies);

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rememberMeCheckbox = document.getElementById('rememberMe');

    if (cookies.email && cookies.password) {
        emailInput.value = cookies.email;
        passwordInput.value = cookies.password;
        rememberMeCheckbox.checked = true;
    }
});

function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    const cookieString = `${name}=${value};${expires};path=/`;
    document.cookie = cookieString;
    console.log(`Load cockie: ${document.cookie}`);

    const cookies = getCookies();
    console.log('Load cockie:', cookies);
}

function authenticate() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    if (!validateEmail(email)) {
        alert('Будь ласка, введіть дійсну адресу електронної пошти.');
        return;
    }
    if (!validatePassword(password)) {
        alert('Пароль повинен містити щонайменше одну цифру, одну велику літеру, один спеціальний символ і бути від 8 до 20 символів.');
        return;
    }

    const cookies = getCookies();
    console.log('Load cockie:', cookies);

    if (email && password) {
        if (cookies.email === email && cookies.password === password) {
            if (rememberMe) {
                if (cookies.fullName) {
                    setCookie('fullName', cookies.fullName, 7);
                }
                if (cookies.phone) {
                    setCookie('phone', cookies.phone, 7);
                }
            }
            alert('Успішний вхід!');
            window.location.href = 'index.html';
        } else {
            alert('Невірна адреса електронної пошти або пароль.');
        }
    } else {
        alert('Будь ласка, введіть адресу електронної пошти і пароль.');
    }
}

function register() {
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    if (!fullName) {
        alert('Будь ласка, введіть повне ім’я.');
        return;
    }
    if (!validateEmail(email)) {
        alert('Будь ласка, введіть дійсну адресу електронної пошти.');
        return;
    }
    if (!phone) {
        alert('Будь ласка, введіть номер телефону.');
        return;
    }
    if (!validatePassword(password)) {
        alert('Пароль повинен містити щонайменше одну цифру, одну велику літеру, один спеціальний символ і бути від 8 до 20 символів.');
        return;
    }

    if (fullName && email && phone && password) {
        if (rememberMe) {
            setCookie('fullName', fullName, 7);
            setCookie('email', email, 7);
            setCookie('phone', phone, 7);
            setCookie('password', password, 7);
            console.log(fullName)
        }
        alert('Успішна реєстрація!');
        toggleAuthMode();
        document.getElementById('email').value = email;
        document.getElementById('password').value = password;
        document.getElementById('rememberMe').checked = rememberMe;
    } else {
        alert('Будь ласка, заповніть всі поля.');
    }
}

function toggleAuthMode() {
    const authTitle = document.getElementById('loginTitle');
    const authButton = document.getElementById('authButton');
    const toggleAuth = document.getElementById('toggleAuth');
    const registrationFields = document.getElementById('registrationFields');

    if (authTitle.textContent === 'Login') {
        authTitle.textContent = 'Registration';
        authButton.textContent = 'Register';
        toggleAuth.textContent = 'Sign In';
        registrationFields.style.display = 'block';
        authButton.setAttribute('onclick', 'register()');
    } else {
        authTitle.textContent = 'Login';
        authButton.textContent = 'Sign in';
        toggleAuth.textContent = 'Sign up';
        registrationFields.style.display = 'none';
        authButton.setAttribute('onclick', 'authenticate()');
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    const re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
    return re.test(password);
}