document.addEventListener("DOMContentLoaded", () => {
  const newsContainer = document.getElementById("news-container");
  const loadMoreButton = document.getElementById("load-more");

  let newsIds = [];
  let start = 0;
  const limit = 10;

  const fetchNewsIds = async () => {
    try {
      const response = await fetch(
        "https://hacker-news.firebaseio.com/v0/newstories.json"
      );
      newsIds = await response.json();
      loadNews();
    } catch (error) {
      console.error("Error fetching news IDs:", error);
    }
  };

  const fetchNewsDetails = async (id) => {
    try {
      const response = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`
      );
      return await response.json();
    } catch (error) {
      console.error(`Error fetching news details for ID ${id}:`, error);
    }
  };

  const loadNews = async () => {
    const end = start + limit;
    const newsToLoad = newsIds.slice(start, end);
    const newsPromises = newsToLoad.map((id) => fetchNewsDetails(id));
    const newsDetails = await Promise.all(newsPromises);

    newsDetails.forEach((news) => {
      if (news) {
        const newsItem = document.createElement("div");
        newsItem.classList.add("news-item");

        newsItem.innerHTML = `
                    <h2>${news.title}</h2>
                    <p>${new Date(news.time * 1000).toLocaleString()}</p>
                    <button onclick="window.open('${
                      news.url
                    }', '_blank')">Read more</button>
                `;

        newsContainer.appendChild(newsItem);
      }
    });

    start += limit;

    if (start >= newsIds.length) {
      loadMoreButton.style.display = "none";
    }
  };

  loadMoreButton.addEventListener("click", loadNews);

  fetchNewsIds();
});
