const API_KEY = "f2d46185";
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const resultsSection = document.getElementById("results");
const loading = document.getElementById("loading");
const typeFilter = document.getElementById("typeFilter");
const yearFilter = document.getElementById("yearFilter");

// Populate year filter (1980–2026)
for (let year = 2026; year >= 1980; year--) {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    yearFilter.appendChild(option);
}

// Fetch movies from OMDb API
async function fetchMovies(searchTerm) {
    loading.style.display = "block";
    resultsSection.innerHTML = "";

    try {
        const response = await fetch(
            `https://www.omdbapi.com/?apikey=${API_KEY}&s=${searchTerm}`
        );

        const data = await response.json();
        loading.style.display = "none";

        if (data.Response === "False") {
            resultsSection.innerHTML = `<p>No results found.</p>`;
            return;
        }

        displayMovies(data.Search);

    } catch (error) {
        loading.style.display = "none";
        resultsSection.innerHTML = `<p>Error fetching data.</p>`;
    }
}

// Display movie cards
function displayMovies(movies) {
    resultsSection.innerHTML = "";

    const selectedType = typeFilter.value;
    const selectedYear = yearFilter.value;

    const filtered = movies.filter(movie => {
        const matchesType = selectedType ? movie.Type === selectedType : true;
        const matchesYear = selectedYear ? movie.Year === selectedYear : true;
        return matchesType && matchesYear;
    });

    filtered.forEach(movie => {
        const card = document.createElement("div");
        card.classList.add("movie-card");

        card.innerHTML = `
            <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300"}" alt="${movie.Title}">
            <h3>${movie.Title}</h3>
            <p>${movie.Year} • ${movie.Type}</p>
        `;

        resultsSection.appendChild(card);
    });
}

// Search button click
searchBtn.addEventListener("click", () => {
    const term = searchInput.value.trim();
    if (term !== "") {
        fetchMovies(term);
    }
});

// Enter key triggers search
searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        const term = searchInput.value.trim();
        if (term !== "") {
            fetchMovies(term);
        }
    }
});

// Filters update results dynamically
typeFilter.addEventListener("change", () => {
    const term = searchInput.value.trim();
    if (term !== "") fetchMovies(term);
});

yearFilter.addEventListener("change", () => {
    const term = searchInput.value.trim();
    if (term !== "") fetchMovies(term);
});

