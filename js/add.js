let str = document.location.href;
let url = new URL(str);


let city = url.searchParams.get('title')
console.log(city);

if (city) {
    fetch("https://geocoding-api.open-meteo.com/v1/search?name=" + city + "&language=fr")
    .then(res => res.json())
    .then(data => {
        console.log(data);
        data.results.forEach(city => {
            document.querySelector('#results').insertAdjacentHTML('beforeend', '<li><a href="add-form.html?id=' + city.id + '&ville=' + city.name + '&country=' + city.country + '">' + city.name + ' (' + city.country + ') - ' + city.id + '</a></li>')
            console.log(city.name + ' - ' + city.id);
        });
    })
}

