(function () {
  document.addEventListener(
    "DOMContentLoaded",
    async function () {
      const postSearch = document.getElementById("PostSearch");
      const searchData = await fetchSearchData();
      postSearch.addEventListener("keyup", handlePostSearch(searchData), false);

      const menuCheckbox = document.getElementById("menu-checkbox");
      menuCheckbox.addEventListener("click", toggleMainMenu);
      menuCheckbox.addEventListener("touchstart", toggleMainMenu);
      articleProgressBar();
    },
    false
  );
})();

function toggleMainMenu(e) {
  const rkNav = document.getElementById("rk-nav");
  rkNav.classList.toggle("open");
}

function handlePostSearch(searchData) {
  return function (e) {
    const text = e.target.value;
    if (text && text.length > 2) {
      const results = search(text.trim(), searchData);
      updateList(text, results);
    }
  };
}

function updateList(searchText, results) {
  const mainContentArea = document.getElementById("MainContentArea");
  mainContentArea.innerHTML = "";
  mainContentArea.appendChild(
    articleElement([titleElement("Search: " + searchText)])
  );

  for (let result of results) {
    const article = articleElement([
      titleElement(
        linkElement({ url: result.item.url, text: result.item.title })
      ),
      excerptElement({ excerpt: result.item.excerpt }),
    ]);
    mainContentArea.appendChild(article);
  }
}

function articleElement(elementList) {
  const article = document.createElement("article");
  article.classList.add("listing");
  for (let el of elementList) {
    article.appendChild(el);
  }
  return article;
}

function titleElement(textElement) {
  const title = document.createElement("h2");
  if (typeof textElement === "string") {
    title.textContent = textElement;
  } else {
    title.appendChild(textElement);
  }
  return title;
}

function linkElement({ url, text }) {
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.textContent = text;
  return link;
}

function excerptElement({ excerpt }) {
  const p = document.createElement("p");
  p.textContent = excerpt;
  return p;
}

function search(text, searchData) {
  const options = {
    tokenize: true,
    matchAllTokens: true,
    threshold: 0,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    includeMatches: true,
    keys: ["title", "excerpt", "tags"],
  };
  const fuse = new Fuse(searchData.posts, options);
  return fuse.search(text);
}

async function fetchSearchData() {
  const response = await fetch("/article-data.json");
  return response.json();
}

function articleProgressBar() {
  var getMax = function () {
    var windowHeight = window.innerHeight;
    var docHeight = document.body.clientHeight;
    return docHeight - windowHeight;
  };

  var scrollProgress = function () {
    return window.pageYOffset;
  };

  if ("max" in document.createElement("progress")) {
    var progressBar = document.getElementById("progressBar");
    if (progressBar) {
      progressBar.setAttribute("max", getMax());
      progressBar.setAttribute("value", scrollProgress());

      document.addEventListener("scroll", function () {
        progressBar.setAttribute("value", scrollProgress());
      });

      window.addEventListener("resize", function () {
        progressBar.setAttribute("max", getMax());
        progressBar.setAttribute("value", scrollProgress());
      });
    }
  } else {
    var progressBar = document.getElementById("progressBarBackup"),
      max = getMax(),
      value,
      width;
    if (progressBar) {
      var getWidth = function () {
        value = scrollProgress();
        width = (value / max) * 100;
        width = width + "%";
        return width;
      };

      var setWidth = function () {
        progressBar.style.width = getWidth();
      };

      document.addEventListener("scroll", setWidth);
      window.addEventListener("resize", function () {
        max = getMax();
        setWidth();
      });
    }
  }
}
