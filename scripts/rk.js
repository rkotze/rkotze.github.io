(function () {
  document.addEventListener(
    "DOMContentLoaded",
    async function () {
      const postSearch = document.getElementById("PostSearch");
      const searchData = await fetchSearchData();
      postSearch.addEventListener("keyup", debounce(handlePostSearch(searchData), 500), false);
      postSearch.addEventListener("click", gaClickSearch, false);

      const menuCheckbox = document.getElementById("menu-checkbox");
      menuCheckbox.addEventListener("click", toggleMainMenu);
      menuCheckbox.addEventListener("touchstart", toggleMainMenu);
      articleProgressBar();
      headerLinking();
    },
    false
  );
})();

function gaClickSearch(){
  typeof ga !== 'undefined' && ga('send', 'event', "SearchInput", "click");
}

function gaSearchText(input){
  typeof ga !== 'undefined' && ga('send', 'event', "SearchInput", "Key", input);
}

function headerLinking(){
  var postContent = document.getElementById("postContent");
  if(postContent){
    var headings = postContent.querySelectorAll("h1, h2, h3, h4");
    for(var h of headings) {
      var link = headerLink('#' + h.id);
      h.insertAdjacentElement('afterbegin', link);
    }
  }
}

function headerLink(href){
  var a = document.createElement('a');
  a.textContent = "#";
  a.href = href;
  a.classList.add('heading-link');
  return a;
}

function toggleMainMenu(e) {
  const rkNav = document.getElementById("rk-nav");
  rkNav.classList.toggle("open");
}

function handlePostSearch(searchData) {
  return function (e) {
    const text = e.target.value;
    if (text) {
      gaSearchText(text);
      const results = search(text.trim(), searchData);
      const mainContentArea = mainContentElement("Search: " + text);
      updateList(mainContentArea, results.map((result) => ({
        url: result.item.url,
        title: result.item.title,
        excerpt: result.item.excerpt
      })));
    } else {
      const mainContentArea = mainContentElement("");
      updateList(mainContentArea, searchData.posts.slice(0, 10));
    }
  };
}

function updateList(mainContentArea, results) {
  for (let result of results) {
    const article = articleElement([
      titleElement(
        linkElement({ url: result.url, text: result.title })
      ),
      excerptElement({ excerpt: result.excerpt }),
    ]);
    mainContentArea.appendChild(article);
  }
}

function mainContentElement(text){
  const mainContentArea = document.getElementById("MainContentArea");
  mainContentArea.innerHTML = "";
  if(text){
    mainContentArea.appendChild(
      articleElement([titleElement(text)])
    );
  }

  return mainContentArea;
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

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

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
