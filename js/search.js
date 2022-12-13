var str = document.location.href;
var url = new URL(str);
var q_city = url.searchParams.get("q_city");
console.log(q_city);

if (q_city) {

    fetch("https://geocoding-api.open-meteo.com/v1/search?name=" + q_city + "&language=fr")
    .then(res => res.json())
    .then(data => {
        console.log(data);
        data.results.forEach(city => {
            console.log(city.name, city.admin2, city.country )
            
            let resultsUl = document.querySelector('ul')
            const content = `
<<<<<<< HEAD
            <li><a href="app.html?ville=${city.name}&lat=${city.latitude}&long=${city.longitude}&tz=${city.timezone}">${city.name}, ${city.admin2}, ${city.country}</a></li>
=======
            <li><a href="results.html?lat=${city.latitude}&long=${city.longitude}&tz=${city.timezone}">${city.name}, ${city.admin2}, ${city.country}</a></li>
>>>>>>> d534278d9cb5c4f57a80b1b560fe768558838ef3
            `
            resultsUl.insertAdjacentHTML('beforeend', content)
        });
    });
}

alert("test")