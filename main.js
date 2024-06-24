
function getCookies()
{
    return document.cookie.split(';').reduce((cookies, cookie) =>
        {
        const [name, value] = cookie.split('=').map(c => c.trim());
        cookies[name] = value;
        return cookies;
    }, {});
}

document.addEventListener('DOMContentLoaded', () =>
    {
    const cookies = getCookies();
    console.log('Load cockie:', cookies);

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rememberMeCheckbox = document.getElementById('rememberMe');

    if (cookies.email && cookies.password)
        {
        emailInput.value = cookies.email;
        passwordInput.value = cookies.password;
        rememberMeCheckbox.checked = true;
    }
});

function setCookie(name, value, days)
{
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    const cookieString = `${name}=${value};${expires};path=/`;
    document.cookie = cookieString;
    console.log(`Load cockie: ${document.cookie}`);

    const cookies = getCookies();
    console.log('Load cockie:', cookies);
}

function authenticate()
{
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    if (!validateEmail(email))
        {
        alert('Будь ласка, введіть дійсну адресу електронної пошти.');
        return;
    }
    if (!validatePassword(password))
        {
        alert('Пароль повинен містити щонайменше одну цифру, одну велику літеру, один спеціальний символ і бути від 8 до 20 символів.');
        return;
    }

    const cookies = getCookies();
    console.log('Load cockie:', cookies);

    if (email && password)
        {
        if (cookies.email === email && cookies.password === password)
            {
            if (rememberMe) {
                if (cookies.userName)
                    {
                    setCookie('userName', cookies.userName, 7);
                }
                if (cookies.phone)
                    {
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

function register()
{
    const userName = document.getElementById('userName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    if (!userName)
        {
        alert('Будь ласка, введіть повне ім’я.');
        return;
    }
    if (!validateEmail(email))
        {
        alert('Будь ласка, введіть дійсну адресу електронної пошти.');
        return;
    }
    if (!phone)
        {
        alert('Будь ласка, введіть номер телефону.');
        return;
    }
    if (!validatePassword(password))
        {
        alert('Пароль повинен містити щонайменше одну цифру, одну велику літеру, один спеціальний символ і бути від 8 до 20 символів.');
        return;
    }

    if (userName && email && phone && password)
        {
        if (rememberMe)
            {
            setCookie('userName', userName, 7);
            setCookie('email', email, 7);
            setCookie('phone', phone, 7);
            setCookie('password', password, 7);
            console.log(userName)
        }
        alert('Успішна реєстрація!');
        toggleAuthMode();
        document.getElementById('email').value = email;
        document.getElementById('password').value = password;
        document.getElementById('rememberMe').checked = rememberMe;
    }
    else
    {
        alert('Будь ласка, заповніть всі поля.');
    }
}

function toggleAuthMode()
{
    const authTitle = document.getElementById('loginTitle');
    const authButton = document.getElementById('authButton');
    const reg = document.getElementById('reg');
    const registrationFields = document.getElementById('registrationFields');

    if (authTitle.textContent === 'Login')
        {
        authTitle.textContent = 'Registration';
        authButton.textContent = 'Register';
        reg.id='reg'
        reg.textContent = 'Sign Up';
        registrationFields.style.display = 'block';
        authButton.setAttribute('onclick', 'register()');
    }
    else
    {
        authTitle.textContent = 'Login';
        authButton.textContent = 'Sign in';
        reg.id="auth"
        reg.textContent = 'Sign up';
        registrationFields.style.display = 'none';
        authButton.setAttribute('onclick', 'authenticate()');
    }
}

function validateEmail(email)
{
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password)
{
    const re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
    return re.test(password);
}








document.addEventListener('DOMContentLoaded', function()
{
    const languageSelector = document.querySelector('.language-selector');
    const dropbtn = document.querySelector('.dropbtn');
    const dropdownLinks = document.querySelectorAll('.dropdown-content a');

    // Toggle dropdown menu
    dropbtn.addEventListener('click', function()
    {
        languageSelector.classList.toggle('show');
    });

    // Close dropdown if clicking outside of it
    window.addEventListener('click', function(event)
    {
        if (!event.target.closest('.language-selector'))
            {
            languageSelector.classList.remove('show');
        }
    });

    dropdownLinks.forEach(link =>
        {
        link.addEventListener('click', function(event)
        {
            event.preventDefault();
            const selectedLang = link.getAttribute('data-lang');
            const selectedText = link.textContent.trim();
            const selectedImg = link.querySelector('img').src;

            // Update the button with the selected language
            dropbtn.innerHTML = `<img src="${selectedImg}" alt="Language">`;

            // Close the dropdown after selection
            languageSelector.classList.remove('show');

            // Call the function to load the translations
            loadLanguage(selectedLang);
        });
    });

    // Function to load language translations
    function loadLanguage(language)
    {
        fetch(`languages/${language}.json`)
            .then(response => response.json())
            .then(translations =>
                {
                document.getElementById('loginTitle').innerHTML = translations.loginTitle;
                document.getElementById('loginTitle').innerHTML = translations.loginTitle;
                document.getElementById('userName').placeholder = translations.userName;
                document.getElementById('email').placeholder = translations.email;
                document.getElementById('password').placeholder = translations.password;
                // document.getElementById('confirmPassword').placeholder = translations.confirmPassword;
                document.getElementById('or').innerHTML = translations.or;
                document.getElementById('reg').innerHTML = translations.reg;
                document.getElementById('authButton').innerHTML = translations.auth;
            })
            .catch(error => console.error('Error loading language file:', error));
    }

    // Optional: Load default language on page load
    const defaultLanguage = 'en';
    loadLanguage(defaultLanguage);
});