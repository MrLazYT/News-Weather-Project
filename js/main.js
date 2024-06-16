let newsAPI =  "https://newsapi.org/v2/top-headlines?country=uk&apiKey=fed343d260de4e4795aeb4314c306d4c";
let weatheAPi = "";

const fetchRequestLambda = async() => {
    try {
        const response = await fetch(newsAPI);

        if (!response.ok) {
            throw new Error("response was not ok");
        }

        const data = await response.json();

        showHtml(data);
        
        console.log(data);
    } catch (error) {
        console.log("Response error: ", error);
    }
}

const showHtml = (data) => {
    for (let i = 0; i < data.articles.length; i++) {
        const item = data.articles[i];

        let card = document.createElement("a");

        const card_a = document.createElement("div");
        card.setAttribute("href", item.url);
        card.setAttribute("class", "card");

        const img = document.createElement("img");
        card_a.appendChild(img);

        if (item.urlToImage === null) {
            card.classList.add("card_none");
        }
        else {
            card.classList.add("card_img");
            img.setAttribute("src", item.urlToImage);
        }

        const title = document.createElement("h3");
        title.innerText = item.title;
        card_a.appendChild(title);

        const desc = document.createElement("p");
        desc.innerText = item.description;
        card_a.appendChild(desc)
        
        let publishedDiv = document.createElement("div");
        publishedDiv.classList.add("published");

        const date = document.createElement("p");
        date.setAttribute("class", "date");
        date.innerText = item.publishedAt;
        publishedDiv.appendChild(date);

        let publishedBy = document.createElement("p");
        publishedBy.innerText = item.author;
        publishedDiv.appendChild(publishedBy);

        card_a.appendChild(publishedDiv);
        // const detail = document.createElement("div");
        // detail.setAttribute("class", "detail");
        
        // const link = document.createElement("a");
        // link.setAttribute("href", item.url);
        // link.innerText = "Details";
        // detail.appendChild(link);

        //card.appendChild(detail);

        card.appendChild(card_a);

        const news = document.querySelector(".news");
        news.appendChild(card);
    }
}

fetchRequestLambda();