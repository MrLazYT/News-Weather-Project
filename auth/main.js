let selectedLang = "en";
let toggleLog = true;


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
                if (cookies.confirmPassword)
                    {
                    setCookie('confirmPassword', cookies.confirmPassword, 7);
                }
            }
            alert('Успішний вхід!');
            window.location.href = '/';
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
    const confirmPassword = document.getElementById('confirmPassword').value;
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
    if (!confirmPassword)
        {
        alert('Будь ласка, введіть номер телефону.');
        return;
    }
    if (!validatePassword(password))
        {
        alert('Пароль повинен містити щонайменше одну цифру, одну велику літеру, один спеціальний символ і бути від 8 до 20 символів.');
        return;
    }

    if (userName && email && confirmPassword && password)
        {
        if (rememberMe)
            {
            setCookie('userName', userName, 7);
            setCookie('email', email, 7);
            setCookie('confirmPassword', confirmPassword, 7);
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
    const authButton = document.getElementById('logRegButton');
    const registrationFields = document.getElementById('registrationFields');
    const authReg = document.getElementById('authReg');
    const circle1 = document.getElementById("circle");
    const circle2 = document.getElementById("circle_small");
    const forgotPass = document.getElementById("forgotPassword");

    if (toggleLog)
    {
        registrationFields.setAttribute("class", "active");
        forgotPass.classList.add("hidden");
        forgotPass.classList.remove("active");
        authButton.setAttribute('onclick', 'register()');
        toggleLog = false;
        circle1.setAttribute("class", "circle_move");
        circle2.setAttribute("class", "circle_small_move");
    }
    else
    {
        registrationFields.setAttribute("class", "hidden");
        forgotPass.classList.add("active");
        forgotPass.classList.remove("hidden");
        authButton.setAttribute('onclick', 'authenticate()');
        toggleLog = true;
        circle1.setAttribute("class", "circle");
        circle2.setAttribute("class", "circle_small");
    }

    loadLanguage(selectedLang);
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
            selectedLang = link.getAttribute('data-lang');
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

    // Optional: Load default language on page load
    loadLanguage(selectedLang);
});

// Function to load language translations
function loadLanguage(language)
{
    fetch(`languages/${language}.json`)
        .then(response => response.json())
        .then(translations =>
            {
                if (toggleLog) {
                    document.getElementById('logRegTitlePage').innerHTML = translations.loginTitlePage;
                    document.getElementById('logRegTitle').innerHTML = translations.loginTitle;
                    document.getElementById('logRegButton').innerHTML = translations.authButton;
                    document.getElementById('authReg').innerText = translations.reg;
                    document.getElementById('toggleAuth').innerHTML = translations.toggleAuthL;
                }
                else {
                    document.getElementById('logRegTitlePage').innerHTML = translations.regTitlePage;
                    document.getElementById('logRegTitle').innerHTML = translations.regTitle;
                    document.getElementById('userName').placeholder = translations.userName;
                    document.getElementById('confirmPassword').placeholder = translations.confirmPassword;
                    document.getElementById('logRegButton').innerHTML = translations.regButton;
                    document.getElementById('authReg').innerHTML = translations.auth;
                    document.getElementById('toggleAuth').innerHTML = translations.toggleAuth;
                }
                
                document.getElementById('email').placeholder = translations.email;
                document.getElementById('password').placeholder = translations.password;
                document.getElementById('reMe').innerText = translations.reMe;
                document.getElementById('forgotPassword').innerText = translations.forgotPassword;
                document.getElementById('or').innerText = translations.or;
        })
        .catch(error => console.error('Error loading language file:', error));
}