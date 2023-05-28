const API_KEY = "3794e382-315b-4c4f-922c-b1e85f974331";
const API_URL_POPULAR =
	"https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1";
const API_URL_SEARCH =
	"https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";

getMovies(API_URL_POPULAR);

async function getMovies(url) {
	const resp = await fetch(url, {
		headers: {
			"Content-Type": "application/json",
			"X-API-KEY": API_KEY,
		},
	});
	const respData = await resp.json();
    console.log(respData)
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
	if (vote === "null" || vote === "undefined") {
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
    document.querySelector(".movies").innerHTML = ""

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
		moviesEl.appendChild(movieEl);
	});
}

const form = document.querySelector("form")
const search = document.querySelector(".header__search");

form.addEventListener("submit", (e) => {
    e.preventDefault()

    const apiSearchUrl = `${API_URL_SEARCH}${search.value}`
    if(search.value) {
        getMovies(apiSearchUrl)
        search.value = ""
    }
})