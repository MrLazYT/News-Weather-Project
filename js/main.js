let curPage = 1;
let curCountry = "ua";
let resPerPage = 20;
let apiKey = "56349878eb5b4a6db52ae07ffa2343cc";
let newsAPI =  `https://newsapi.org/v2/top-headlines?country=${curCountry}&page=${curPage}&pageSize=${resPerPage}&apiKey=${apiKey}`;
let weatherAPi = "";

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

const fetchRequest = async() => {
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
            //newsAPI = `https://newsapi.org/v2/everything?q=${}&page=${curPage}&pageSize=${resPerPage}&apiKey=${apiKey}`;
            fetchRequest();
        })

        pagination.appendChild(page_btn);
    }
}

async function loadLangs() {
    let langJson = "js/jsons/country_codes.json";

    try {
        let jsonString = await fetch(langJson);
        let json = await jsonString.json();
        let select = document.getElementById("lang");

        for (let i = 0; i < json.countries.length; i++) {
            let option = document.createElement("option");
            option.innerText = json.countries[i].country.name;
            option.value = json.countries[i].country.code;
            option.addEventListener("click", function() {
                curCountry = this.value;
                curPage = 1;
                newsAPI =  `https://newsapi.org/v2/top-headlines?country=${curCountry}&page=${curPage}&apiKey=${apiKey}`;
                fetchRequest();
            });

            select.appendChild(option);
        }

        select.selectedIndex = 48;
    } catch {
        console.log("Something went wrong!");
    }
}

fetchRequest();
loadLangs();

function search() {
    let search_input = document.getElementById("search").value;
    newsAPI =  `https://newsapi.org/v2/everything?q=${search_input}&page=${curPage}&apiKey=${apiKey}`;

    fetchRequest();
}

select = document.getElementById("lang");