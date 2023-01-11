let str = document.location.href;
let url = new URL(str);


let id = url.searchParams.get('id')
let city = url.searchParams.get('ville')
let country = url.searchParams.get('country')

document.querySelector('#title').value = '[contribution] ' + city + ' (' + country + ') - ' + id


document.querySelector('#cityTitle').innerHTML = city + ' (' + country + ')'