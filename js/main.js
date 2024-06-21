let curPage = 1;
let curCountry = "ua";
let isSearching = false;
let search_input = "";
let category = "general";
const resPerPage = 20;
const apiKey = "04e208e9b03e4199892d320ada574970";
let city = "Kyiv";
let newsAPI =  `https://newsapi.org/v2/top-headlines?country=${curCountry}&category=${category}&page=${curPage}&pageSize=${resPerPage}&apiKey=${apiKey}`;
let weatherAPI = `https://api.weatherapi.com/v1/forecast.json?key=b7d554217a3c4c01a0f160353241906&q=${city}&days=3`;
let ipInfoAPI = "https://ipinfo.io/46.211.248.180/json?token=67f494f196d6c9";

class DateUK {
    constructor(dateString) {
        this.dateCollection = dateString.split(" ");
    }

    convert() {
        let newDate = "";

        newDate += `${this.convertDay()} `;
        newDate += `${this.dateCollection[2]} `;
        newDate += `${this.convertMonth()} `;
        newDate += `${this.dateCollection[3]}`;

        return newDate;
    }

    convertDay() {
        if (this.dateCollection[0] == "Mon") {
            return "Пн";
        } else if (this.dateCollection[0] == "Tue") {
            return "Вт";
        } else if (this.dateCollection[0] == "Wed") {
            return "Ср";
        } else if (this.dateCollection[0] == "Thu") {
            return "Чт";
        } else if (this.dateCollection[0] == "Fri") {
            return "Пт";
        } else if (this.dateCollection[0] == "Sat") {
            return "Сб";
        } else if (this.dateCollection[0] == "Sun") {
            return "Нд";
        }
    }

    convertMonth() {
        if (this.dateCollection[1] == "Jan") {
            return "Січ";
        } else if (this.dateCollection[1] == "Feb") {
            return "Лют";
        } else if (this.dateCollection[1] == "Mar") {
            return "Бер";
        } else if (this.dateCollection[1] == "Apr") {
            return "Кві";
        } else if (this.dateCollection[1] == "May") {
            return "Тра";
        } else if (this.dateCollection[1] == "Jun") {
            return "Чер";
        } else if (this.dateCollection[1] == "Jul") {
            return "Лип";
        } else if (this.dateCollection[1] == "Aug") {
            return "Сер";
        } else if (this.dateCollection[1] == "Sep") {
            return "Вер";
        } else if (this.dateCollection[1] == "Oct") {
            return "Жов";
        } else if (this.dateCollection[1] == "Nov") {
            return "Лис";
        } else if (this.dateCollection[1] == "Dec") {
            return "Гру";
        }
    }
}

const fetchNews = async() => {
    try {
        let response = await fetch(newsAPI);

        if (!response.ok) {
            throw new Error("Something went wrong <=__=>", response.status);
        }

        let data = await response.json();

        showHtml(data);
        showPagination(data.totalResults);
        
        console.log(data);
    } catch (error) {
        console.log("Response error: ", error);
    }
}

const showHtml = (data) => {
    let news = document.querySelector(".news");
    news.innerText = "";
    
    for (let i = 0; i < data.articles.length; i++) {
        let item = data.articles[i];

        let card_a = document.createElement("a");

        let card = document.createElement("div");
        card_a.setAttribute("href", item.url);
        card_a.setAttribute("class", "card");

        let img = document.createElement("img");
        card.appendChild(img);

        if (item.urlToImage === null) {
            card_a.classList.add("card_none");
        }
        else {
            card_a.classList.add("card_img");
            img.setAttribute("src", item.urlToImage);
        }

        let title = document.createElement("h3");
        let titleString = item.title;
        let desc = document.createElement("p");
        let descString = item.description;

        
        if (titleString.length > 40) {
            titleString = `${titleString.substring(0, 40)}...`;
        }
        
        if (descString != null && descString.length > 60) {
            descString = `${descString.substring(0, 60)}...`;
        }

        let toSkip = false;

        if (titleString.includes("[Removed]")) {
            toSkip = true;
        }

        if (!toSkip) {
            title.innerText = titleString;
            desc.innerText = descString;
            
            card.appendChild(title);
            card.appendChild(desc)
            
            let publishedDiv = document.createElement("div");
            publishedDiv.classList.add("published");

            let date_p = document.createElement("p");
            date_p.setAttribute("class", "date");
            
            let dateString = item.publishedAt;
            let date = new Date(dateString);
            let dateUk = new DateUK(date.toDateString());
            
            date_p.innerText = dateUk.convert();
            publishedDiv.appendChild(date_p);

            card.appendChild(publishedDiv);
            card_a.appendChild(card);

            news.appendChild(card_a);
        }
    }
}

function showPagination(totalResults) {
    let pagination = document.querySelector(".pagination");
    pagination.innerText = "";

    let pages = Math.ceil(totalResults / resPerPage);
    
    for (let i = 0; i < pages; i++) {
        let page_btn = document.createElement("button");
        page_btn.innerText = i + 1;
        page_btn.addEventListener("click", function() {
            curPage = this.innerText;

            if (isSearching) {
                newsAPI =  `https://newsapi.org/v2/everything?q=${search_input}&page=${curPage}&apiKey=${apiKey}`;
            }
            else {
                newsAPI =  `https://newsapi.org/v2/top-headlines?country=${curCountry}&page=${curPage}&pageSize=${resPerPage}&apiKey=${apiKey}`;
            }
            fetchNews();
        })

        pagination.appendChild(page_btn);
    }
}

async function loadCountries() {
    let transJson = "js/jsons/country_codes.json";

    try {
        let jsonString = await fetch(transJson);
        let json = await jsonString.json();
        let select = document.getElementById("lang");

        for (let i = 0; i < json.countries.length; i++) {
            let option = document.createElement("option");
            option.innerText = json.countries[i].country.name;
            option.value = json.countries[i].country.code;
            option.addEventListener("click", function() {
                curCountry = this.value;
                isSearching = false;
                search_input = "";
                curPage = 1;
                newsAPI =  `https://newsapi.org/v2/top-headlines?country=${curCountry}&page=${curPage}&apiKey=${apiKey}`;
                fetchNews();
            });

            select.appendChild(option);
        }

        select.selectedIndex = 48;
    } catch {
        console.log("Something went wrong!");
    }
}

async function fetchShortWeather() {
    try {
        let response = await fetch(ipInfoAPI)

        if (!response.ok) {
            throw new Error("Something went wrong <=__=>", response.status);
        }

        let data = await response.json();
        city = data.city;

        let city_p = document.getElementById("city");
        city_p.innerText = await Transliterate(city);


        weatherAPI = `https://api.weatherapi.com/v1/forecast.json?key=b7d554217a3c4c01a0f160353241906&q=${city}&days=3`;

        response = await fetch(weatherAPI);

        if (!response.ok) {
            throw new Error("Something went wrong <=__=>", response.status);
        }

        data = await response.json();

        let weatherImg = document.getElementById("weather_icon");
        weatherImg["src"] = data.current.condition.icon;

        let temp = document.getElementById("temp");
        temp.innerText = `${data.current.temp_c}°C`;
    } catch (error) {
        console.log("Response error: ", error);
    }
}

async function Transliterate(text) {
    let transJson = "js/jsons/transliteration.json";
    let res = "";
    text = text.toLowerCase();

    try {
        let jsonString = await fetch(transJson);
        let json = await jsonString.json();

        for (let s = 0; s < text.length; ) {
            let matchFound = false;

            for (let i = 0; i < json.letters.length; i++) {
                for (let j = 0; j < json.letters[i].letter.lat.length; j++) {
                    let latSequence = json.letters[i].letter.lat[j];

                    if (text.startsWith(latSequence, s)) {
                        res += json.letters[i].letter.cyr;
                        s += latSequence.length;
                        matchFound = true;
                        break;
                    }
                }
                if (matchFound) break;
            }

            if (!matchFound) {
                res += text[s];
                s++;
            }
        }

        select.selectedIndex = 48;
    } catch {
        console.log("Something went wrong!");
    }

    return capitalize(res);
}

function capitalize(text) {
    return text[0].toUpperCase() + text.substring(1, text.length);
}

loadCountries();
fetchShortWeather();
fetchNews();

function categoryHandler(e) {
    e.preventDefault();
    category = e.target.id;

    newsAPI = `https://newsapi.org/v2/top-headlines?country=${curCountry}&category=${category}&page=${curPage}&pageSize=${resPerPage}&apiKey=${apiKey}`;
    fetchNews();
}

function search() {
    search_input = document.getElementById("search").value;
    newsAPI =  `https://newsapi.org/v2/everything?q=${search_input}&page=${curPage}&apiKey=${apiKey}`;

    fetchNews();
}

select = document.getElementById("lang");