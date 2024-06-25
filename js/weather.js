const defaultCity = 'Kyiv'
let WeatherApi = `https://api.weatherapi.com/v1/forecast.json?key=b7d554217a3c4c01a0f160353241906&q=${defaultCity}&days=3`

const fetchRequestLambda = async () => {
    try {
        const response = await fetch(WeatherApi)
        if (!response.ok) {
            throw new Error("response was not ok")
        }
        const data = await response.json()
        showHtml(data)
        console.log(data)
    } catch (error) {
        console.log("Response error: ", error)
        WeatherApi = `https://api.weatherapi.com/v1/forecast.json?key=b7d554217a3c4c01a0f160353241906&q=${defaultCity}&days=3`
        fetchRequestLambda()
    }
}

function showHtml(data) {
    showCity(data)
    showIcon(data)
    showDay(data)
    showIcons(data)
    getWind(data)
    getPrec(data)
    getHumidity(data)
}

function showCity(data) {
    const cityElements = ['city1', 'city2', 'city3'];

    cityElements.forEach((cityId) => {
        const cityElement = document.getElementById(cityId);
        let pCity = cityElement.querySelector('p');
        
        if (!pCity) {
            pCity = document.createElement('p');
            cityElement.appendChild(pCity);
        }
        
        pCity.innerText = data.location.name;
    });
}

function showIcon(data) {
    const iconElements = [
        { id: 'icon1', src: data.current.condition.icon },
        { id: 'icon2', src: data.forecast.forecastday[1].day.condition.icon },
        { id: 'icon3', src: data.forecast.forecastday[2].day.condition.icon }
    ];

    iconElements.forEach((iconData) => {
        const iconElement = document.getElementById(iconData.id);
        let img = iconElement.querySelector('img');
        
        if (!img) {
            img = document.createElement('img');
            iconElement.appendChild(img);
        }
        
        img.src = iconData.src;
    });
}

function showDay(data) {
    const dayElements = [
        { id: 'day1', date: data.forecast.forecastday[0].date },
        { id: 'day2', date: data.forecast.forecastday[1].date },
        { id: 'day3', date: data.forecast.forecastday[2].date }
    ];

    dayElements.forEach((dayData) => {
        const dayElement = document.getElementById(dayData.id);
        let h3 = dayElement.querySelector('h3');
        
        if (!h3) {
            h3 = document.createElement('h3');
            dayElement.appendChild(h3);
        }
        
        h3.innerText = dayData.date;
    });
}

function formatWeatherCondition(condition) {
    condition = condition.trim();
    let formatted = condition.toUpperCase().replace(/ /g, '_');
    formatted = formatted.charAt(0) + formatted.slice(1).toLowerCase();
    return formatted;
}

function showIcons(data) {
    const iconContainers = ['temps1', 'temps2', 'temps3'];
    
    iconContainers.forEach((containerId, index) => {
        const iconContainer = document.getElementById(containerId);
        iconContainer.innerHTML = ''; 

        const startHour = index * 24;
        const endHour = startHour + 24;

        for (let i = startHour; i < endHour; i++) {
            const infoDiv = document.createElement('div');
            infoDiv.className = 'info';

            const weat = data.forecast.forecastday[Math.floor(i / 24)].hour[i % 24].condition.text;
            let gif = formatWeatherCondition(weat);
            
            const iconDiv = document.createElement('div');
            iconDiv.className = 'icons';
            
            const img = document.createElement('img');
            img.src = data.forecast.forecastday[Math.floor(i / 24)].hour[i % 24].condition.icon;
            
            const tempDiv = document.createElement('div');
            tempDiv.className = 'temp';
            tempDiv.innerText = `${data.forecast.forecastday[Math.floor(i / 24)].hour[i % 24].temp_c}°C`;
            
            iconDiv.appendChild(img);
            infoDiv.appendChild(iconDiv);
            infoDiv.appendChild(tempDiv);
            
            iconContainer.appendChild(infoDiv);
        }
    });
    
    const gif_blocks = document.querySelectorAll('.row3');
    
    gif_blocks.forEach((gif_block, index) => {
        const weat = data.forecast.forecastday[index].day.condition.text;
        let gif = formatWeatherCondition(weat);
        gif_block.style.backgroundImage = `url(css/weathers/${gif}.gif)`;
        console.log(gif);
    });
}

function search() {
    const inputCity = document.getElementById('cities').value.trim()
    if (inputCity === '') {
        WeatherApi = `https://api.weatherapi.com/v1/forecast.json?key=b7d554217a3c4c01a0f160353241906&q=${defaultCity}&days=3`
        fetchRequestLambda()
    } else {
        try {
            WeatherApi = `https://api.weatherapi.com/v1/forecast.json?key=b7d554217a3c4c01a0f160353241906&q=${inputCity}&days=3`
            fetchRequestLambda()
        } catch (e) {
            console.log("Error in search: ", e)
            // If there's an error, revert to default city
            WeatherApi = `https://api.weatherapi.com/v1/forecast.json?key=b7d554217a3c4c01a0f160353241906&q=${defaultCity}&days=3`
            fetchRequestLambda()
        }
    }
}

function getWind(data){
    const winds = document.querySelectorAll('.wind')
    
    for(let i = 0; i < winds.length; i++){
        let wind = winds[i]
        wind.innerText = `${data.forecast.forecastday[i].day.maxwind_mph}mph`
    }
}

function getPrec(data){
    const precs = document.querySelectorAll('.prec')

    for(let i = 0; i < precs.length; i++){
        let prec = precs[i]
        prec.innerText = `${data.forecast.forecastday[i].day.totalprecip_mm}mm`
    }
}

function getHumidity(data){
    const humis = document.querySelectorAll('.pres')
    for(let i = 0; i < humis.length; i++){
        let humi = humis[i]
        humi.innerText = `${data.forecast.forecastday[i].day.avghumidity}`
    }
}

fetchRequestLambda()
