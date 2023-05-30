const API_KEY = "3794e382-315b-4c4f-922c-b1e85f974331";
const API_URL_POPULAR =
	"https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=";
const API_URL_SEARCH =
	"https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";
const API_URL_MOVIE_DETAILS =
	"https://kinopoiskapiunofficial.tech/api/v2.2/films/";

getMovies(API_URL_POPULAR, 1);
pagination();

async function getMovies(url, page) {
	const resp = await fetch(url + page, {
		headers: {
			"Content-Type": "application/json",
			"X-API-KEY": API_KEY,
		},
	});
	const respData = await resp.json();
	showMovies(respData);
}

function getClassByRate(vote) {
	let convertedVote = convertToDecimal(vote);

	if (convertedVote >= 7) {
		return "green";
	} else if (convertedVote > 5) {
		return "orange";
	} else {
		return "red";
	}
}

function convertToDecimal(vote) {
	if (vote === null || vote === "undefined" || vote === "null") {
		return "0.0";
	} else if (vote.endsWith("%")) {
		let fixedVote = vote.slice(0, 2);
		if (fixedVote == 10) {
			return "10";
		} else {
			fixedVote = parseFloat(fixedVote.split("").join("."));
		}
		return fixedVote;
	} else {
		return vote;
	}
}

function showMovies(data) {
	const moviesEl = document.querySelector(".movies");

	// Очистка пред. фильмов
	document.querySelector(".movies").innerHTML = "";

	data.films.forEach((movie) => {
		const movieEl = document.createElement("div");
		movieEl.classList.add("movie");
		movieEl.innerHTML = `
            <div class="movie__cover-inner">
                <img src="${
					movie.posterUrlPreview
				}" class="movie__cover" alt="${movie.nameRu}">
                <div class="movie__cover--darkened"></div>
            </div>
            <div class="movie__info">
                <div class="movie__title">${movie.nameRu}</div>
                <div class="movie__category">${movie.genres.map(
					(genre) => ` ${genre.genre}`
				)}</div>
                <div class="movie__average movie__average--${getClassByRate(
					movie.rating
				)}">${convertToDecimal(movie.rating)}</div>
            </div>
        `;
		movieEl.addEventListener("click", () => openModal(movie.filmId));
		moviesEl.appendChild(movieEl);
	});
}

const form = document.querySelector("form");
const search = document.querySelector(".header__search");

form.addEventListener("submit", (e) => {
	e.preventDefault();

	const apiSearchUrl = `${API_URL_SEARCH}${search.value}`;
	if (search.value) {
		getMovies(apiSearchUrl);
		search.value = "";
	}
});

// Modal ----------------------------------------------------------------------------------------------------------------------
const modalEl = document.querySelector(".modal");

async function openModal(id) {
	const resp = await fetch(API_URL_MOVIE_DETAILS + id, {
		headers: {
			"Content-Type": "application/json",
			"X-API-KEY": API_KEY,
		},
	});
	const respData = await resp.json();

	modalEl.classList.add("modal--show");
	document.body.classList.add("stop-scrolling");

	modalEl.innerHTML = `
    <div class="modal__card">
        <img class="modal__movie-backdrop" src="${respData.posterUrl}" alt="">
        <h2>
            <span class="modal__movie-title">${respData.nameRu} - </span>
            <span class="modal__movie-release-year">${respData.year}</span>
        </h2>
        <ul class="modal__movie-info">
            <div class="loader"></div>
            <li class="modal__movie-genre">Жанр - ${respData.genres.map(
				(el) => `<span> ${el.genre}</span>`
			)}</li>
            ${
				respData.filmLength
					? `<li class="modal__movie-runtime">Время - ${respData.filmLength} мин.</li>`
					: `<li class="modal__movie-runtime">Время - не указано</li>`
			}
            <li>Официальный сайт: <a href="${
				respData.webUrl
			}" target="_blank" class="modal__movie-site">${
		respData.webUrl
	}</a></li>
            <li>Смотреть бесплатно: <a href="https://1ww.frkp.live/film/${
				respData.kinopoiskId
			}/" target="_blank" class="modal__movie-site">https://1ww.frkp.live/film/${
		respData.kinopoiskId
	}/</a></li>
            <li class="modal__movie-overview">Описание: ${
				respData.description
			}</li>
        </ul>
        <button class="modal__button-close">Закрыть</button>
    </div>
`;
	const btnClose = document.querySelector(".modal__button-close");
	btnClose.addEventListener("click", () => closeModal());
}

function closeModal() {
	modalEl.classList.remove("modal--show");
	document.body.classList.remove("stop-scrolling");
}

window.addEventListener("click", (e) => {
	if (e.target === modalEl) {
		closeModal();
	}
});

window.addEventListener("keydown", (e) => {
	if (e.key === "Escape") {
		closeModal();
	}
});

// Pagination ----------------------------------------------------------------------------------------------------------------------

function pagination() {
	let currentPage = 1;

	function displayPagination() {
		const paginationEl = document.querySelector(".pagination");
		const pagesCount = 5;
		const ulEl = document.createElement("ul");
		ulEl.classList.add("pagination__list");

		for (let i = 0; i < pagesCount; i++) {
			const liEl = displayPaginationBtn(i + 1);
			ulEl.appendChild(liEl);
		}

		paginationEl.appendChild(ulEl);
	}

	function displayPaginationBtn(pageNum) {
		const liEl = document.createElement("li");
		liEl.classList.add("pagination__item");
		liEl.innerText = pageNum;

		if (currentPage == pageNum)
			liEl.classList.add("pagination__item--active");
		liEl.addEventListener("click", () => {
			currentPage = pageNum;
			liEl.classList.add(".pagination__item--active");
			getMovies(API_URL_POPULAR, currentPage);

			let currentItemLi = document.querySelector(
				"li.pagination__item--active"
			);
			currentItemLi.classList.remove("pagination__item--active");

			liEl.classList.add("pagination__item--active");
		});
		return liEl;
	}

	displayPagination();
}


// SCROLL
const topScroll = document.querySelector(".top-scroll")
topScroll.addEventListener("click", () => {
    window.scrollTo(0,0)
})
const bottomScroll = document.querySelector(".bottom-scroll")
bottomScroll.addEventListener("click", () => {
    window.scrollTo(0, document.body.scrollHeight)
})