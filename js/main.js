let curPage = 1;
let newsAPI =  `https://newsapi.org/v2/top-headlines?country=ua&page=${curPage}&apiKey=fed343d260de4e4795aeb4314c306d4c`;
let weatheAPi = "";

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
            throw new Error("Something went wrong <=__=>");
        }

        let data = await response.json();

        showHtml(data);
        
        console.log(data);
    } catch (error) {
        console.log("Response error: ", error);
    }
}

const showHtml = (data) => {
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

        if (titleString.length > 40) {
            titleString = `${titleString.substring(0, 40)}...`;
        }

        title.innerText = titleString;
        card.appendChild(title);

        let desc = document.createElement("p");
        let descString = item.description;

        if (descString != null && descString.length > 60) {
            descString = `${descString.substring(0, 60)}...`;
        }

        desc.innerText = descString;
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

        let news = document.querySelector(".news");
        news.appendChild(card_a);
    }
}

fetchRequest();