const endpointUrl = 'https://restcountries.com/v3.1/';
const fields = '?fields=name,flags,region,area,capital,borders,maps';

const countriesContainer = document.getElementById("countries-container");
const searchForm = document.getElementById("search-form");
const searchFilter = document.getElementById("search-filter")
const searchInput = document.getElementById("search-input");

function renderCountries(countries) {

    countriesContainer.innerHTML = "";
    console.log(countries.length);

    countries.forEach(country => {
        const countryCard = document.createElement("div");
        countryCard.classList.add("country-card");

        const area = country.area?.toLocaleString() ?? 'N/A';
        const capital = country.capital ? country.capital[0] : "N/A";
        const borders = country.borders || [];

        countryCard.innerHTML = `
    <div class="country-card">
        <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" class="card-image">
        <div class="card-body">
            <h2 class="card-title">${country.name.common}</h2>
            <ul class="card-details">
                <li><strong>Region:</strong> <span>${country.region}</span></li>
                <li><strong>Area:</strong> <span>${area}</span></li>
                <li><strong>Capital:</strong> <span>${capital}</span></li>
                ${borders.length > 0 ?
                `<li><strong>Neighbours:</strong> 
                    <div class="neighbours-list">
                    ${borders.map(border => `<span>${border}</span>`).join("").split(",")}
                    </div> 
                </li>` : ""}
            </ul>
        </div>
        <div class="card-footer">
            <a href="${country.maps.googleMaps}" target="_blank">View on Google Maps</a>
        </div>
    </div>
    `
        countriesContainer.appendChild(countryCard);
    });
}


async function fetchData(url) {
    countriesContainer.innerHTML = '<p class="loading-message">Loading countries...</p>';
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        renderCountries(data);

    } catch (error) {
        console.error('Fetch error:', error);
        countriesContainer.innerHTML = `<p class="error-message">Failed to fetch data. Please check your connection and try again.</p>`;
    }
}

// remove the console.log(), testing is no longer needed
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value.trim();
    const filterType = searchFilter.value;
    if (filterType === "all") {
        fetchData(`${endpointUrl}${filterType}${fields}`);
        console.log(`${endpointUrl}${filterType}${fields}`);
    } else if (filterType === "language") {
        fetchData(`${endpointUrl}lang/${searchTerm}${fields}`);
        console.log(`${endpointUrl}${filterType}/${searchTerm}${fields}`);
    } 
    else {
        fetchData(`${endpointUrl}${filterType}/${searchTerm}${fields}`);
        console.log(`${endpointUrl}${filterType}/${searchTerm}${fields}`);
    }
    searchInput.value = "";
});

searchFilter.addEventListener('change', (e) => {
    e.preventDefault();
    const region = e.target.value;
    if (region === "All") {
        searchInput.placeholder = "Type All";
    } else {
        searchInput.placeholder = `Search by ${region}`;
    }
});

fetchData(`${endpointUrl}all/${fields}`);

