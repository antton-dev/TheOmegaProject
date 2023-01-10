

let str = document.location.href;
let url = new URL(str);
let lat = url.searchParams.get("lat")
let long = url.searchParams.get("long")
let tz = url.searchParams.get('tz')
let cityName = url.searchParams.get('ville')
let cityCountry = url.searchParams.get('country')


const hours = document.querySelector('.hours')
const days = document.querySelector('.days')


let date = new Date()


let dateISO = new Date().toISOString()

let today = dateISO.slice(0,10)

let dateTomorrow = date.getTime() + 3600000*24
dateTomorrow = new Date(dateTomorrow).toISOString()
let tomorrow = dateTomorrow.slice(0,10)


if (date.getDate() <= 9) {
    var getdate = "0" + date.getDate()
} else {
    var getdate = date.getDate()
}
if (date.getMonth() <= 8) {
    var getmonth = "0" + (date.getMonth()+1)
} else {
    var getmonth = (date.getMonth()+1)
}

function dayNight(hour) {
    if (hour >= 7 && hour <= 20) {
        return "day"
    } else {
        return "night"
    }
}
function iconWeather(code) {
    if (code == 0 || code == 1) {
        return "113"
    } else if (code == 2) {
        return "116"
    } else if (code == 3) {
        return "122"
    } else if (code == 45 || code == 48) {
        return "248"
    } else if(code == 61 || code == 63 || code == 80 || code == 81 || code == 51 || code == 53 || code == 55 || code == 56 || code == 57) {
        return "302"
    } else if (code == 65 || code == 66 || code == 67 || code == 82) {
        return "308"
    } else if (code == 71 || code == 73 || code == 85 ||code == 75 || code == 77 || code == 86) {
        return "326"
    } else if (code == 95) {
        return "389"
    } else if (code == 96 || code == 99) {
        return "351"
    } else {
        console.log("Une erreur s'est produite, contactez le développeur")
        return "warning"
    }
}

fetch('https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + long + '&hourly=temperature_2m,weathercode&timezone=' + tz + '&start_date=' + today + '&end_date=' + tomorrow)
.then(res => res.json())

.then(data => {
    let hourly = data.hourly
    
    const nextHours = hourly.temperature_2m.filter((temperature, index) => index >= date.getHours())
    const nextHoursCode = hourly.weathercode.filter((weathercode, index) => index >= date.getHours())

    let i = 0

    console.log(nextHours[0]);
    nextHours.forEach((temperature, index) => {
        const content = `
            <div class="hour">
                <span class="time">${date.getHours()+index >= 24 ? date.getHours()+index-24 : date.getHours()+index }:00</span>
                <img class="icon" src="images/weather/${dayNight(date.getHours() + index)}/${iconWeather(nextHoursCode[index])}.svg">
                <span class="temperature">${temperature}°C</span>
            </div>
            `
        if (i < 17) {    
            hours.insertAdjacentHTML('beforeend', content)
            i += 1
        }
    });

    let thumbmail = document.querySelector('.thumbmail')
    console.log(iconWeather(nextHoursCode[0]));
    if (iconWeather(nextHoursCode[0]) == 248) {
        thumbmail.style.backgroundImage = 'url("./images/thumbmail/122.png")'
    } else if (iconWeather(nextHoursCode[0] == 308)) {
        thumbmail.style.backgroundImage = 'url("./images/thumbmail/122.png")'
    }

    thumbmail.style.backgroundImage = 'url("./images/thumbmail/' + iconWeather(nextHoursCode[0]) + '.png")'
    document.querySelector('.thumbmail-temperature').innerHTML = Math.floor(nextHours[0]) + '°C'
    
})




let date7days = date.getTime() + 3600000*168
date7days = new Date(date7days).toISOString()
let week = date7days.slice(0,10)

console.log(week);


fetch('https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + long + '&daily=weathercode,temperature_2m_max,temperature_2m_min,sunset,sunrise&current_weather=true&timezone=' + tz + '&start_date=' + today + '&end_date=' + week)
.then(res => res.json())

.then(data => {
    let daily = data.daily
    console.log(daily)

    let temperatureMax = daily.temperature_2m_max
    let weathercode = daily.weathercode    
    daily.temperature_2m_min.forEach((temperatureMin, index) => {
        const Day = new Date(daily.time[index])
        // console.log(daily.time[index])
        const dictDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
        const content = `
        <div class="hour">
            <span class="time">${dictDays[Day.getDay()]}.${Day.getDate()}</span>
            <img class="icon" src="images/weather/day/${iconWeather(weathercode[index])}.svg">
            <span class="temperature">${temperatureMin}°C</span>
            <span class="temperature">${temperatureMax[index]}°C</span>
        </div>
        `

        days.insertAdjacentHTML('beforeend', content)

        const sunsetD = new Date(daily.sunset[0])
        const sunriseD = new Date(daily.sunrise[0])

        function zero(time) {
            if (time < 10) {
                return "0" + time
            } else {
                return time
            }
        }

        let sunset = zero(sunsetD.getHours()) + ':' + zero(sunsetD.getMinutes()) 
        let sunrise= zero(sunriseD.getHours()) + ':' + zero(sunriseD.getMinutes()) 
        // let sunrise = daily.sunrise[0]
        // let sunset = daily.sunset[0]
        console.log('sunrise / sunset :' + sunrise + " / " + sunset);
        document.querySelector('.time-sunrise').innerHTML = sunrise
        document.querySelector('.time-sunset').innerHTML = sunset
    });
})




// CITY CARD 
document.querySelector('h2').innerHTML = cityName + " - " + cityCountry


// air quality
function air(code, element) {
    if (code >= 0 && code <= 50) {
        element[0].setAttribute('class', 'v_good selected')
        console.log('tres bien');
        return "La qualité de l'air est satisfaisante et pose peu ou pas de risque pour la santé."
        
    } else if (code >= 51 && code <= 100) {
        console.log('bien');
        element[1].setAttribute('class', 'good selected')
        return "La qualité de l'air est acceptable.  Cependant, il peut y avoir un risque pour certaines personnes, en particulier celles qui sont particulièrement sensibles à la pollution de l'air."
        
    } else if (code >= 101 && code <= 150) {
        console.log('moyen');
        element[2].setAttribute('class', 'moderate selected')
        return "Les membres des groupes sensibles peuvent ressentir des effets sur la santé.  Le grand public est moins susceptible d'être touché."
        
    } else if (code >= 151 && code <= 200) {
        console.log('mauvais');
        element[3].setAttribute('class', 'bad selected')
        return "Certains membres du grand public peuvent éprouver des effets sur la santé;  les membres des groupes sensibles peuvent subir des effets plus graves sur leur santé."
        
    } else if (code >=201 && code <= 300) {
        console.log('tres mauvais');
        element[4].setAttribute('class', 'v_bad selected')
        return "Le risque d'effets sur la santé est accru pour tout le monde."
        
    } else if (code >= 301) {
        console.log("danger");
        element[5].setAttribute('class', 'danger selected')
        return "Alerte sanitaire : La qualité de l'air est extrêmement mauvaise et présente une risque majeur pour la santé. Toute la population est plus susceptible d'être touché."
    } else {
        console.log('Qualité de l\' air inconnue')
    }
}


const apiKey = process.env.API_KEY;

// fetch('https://air-quality-api.open-meteo.com/v1/air-quality?latitude=' + lat + '&longitude=' + long + '&hourly=european_aqi,european_aqi_pm2_5,european_aqi_pm10&timezone=Europe%2FBerlin&start_date='+ today + '&end_date=' + today)
fetch('https://api.airvisual.com/v2/nearest_city?lat=' + lat + '&lon=' + long + '&key=' + apiKey)
.then(res => res.json())
.then(data => {
    console.log(data)
    if (data.status == "fail") {
        document.querySelectorAll('.general p').forEach(p => {
            p.innerHTML = "La qualité de l'air à " + cityName +" n'est pas disponible pour le moment."
        })

        document.querySelectorAll('.general span').forEach(span => {
            span.style.display = 'none'
        }); 
    } else {

        let aqius = data.data.current.pollution.aqius
        console.log(aqius);
        let text = air(aqius, document.querySelector('.general').children)
        document.querySelectorAll('.general p').forEach(p => {
            p.innerHTML = text
        })
    }
})


// City description
String.prototype.truncateBySent = function(sentCount = 3, moreText = "") {
    //match ".","!","?" - english ending sentence punctuation
    var sentences = this.match(/[^\.!\?]+[\.!\?]+/g);
    if (sentences) {
        console.log(sentences.length);
        if (sentences.length >= sentCount && sentences.length > sentCount) {
        //has enough sentences
        return sentences.slice(0, sentCount).join(" ") + moreText;
        }
    }
    //return full text if nothing else
    return this;
};

if (cityCountry == "FR") {

    fetch("https://fr.wikipedia.org/w/api.php?origin=*&action=query&titles=" + cityName + "&prop=extracts&format=json&explaintext=1&exintro=1")
    .then(res => res.json())
    .then(data => {
        let pages = data.query.pages
        console.log(pages);
        let intro = Object.values(pages)[0].extract.replace(/ *\([^)]*\) */g, " ")
        
        document.querySelector('.thumbmail p').innerHTML = intro.truncateBySent(2)
    })
}
    
    
    
    document.querySelector('#mode').addEventListener('click', function (){
    document.querySelector('body').style.backgroundColor = '#220b50';
    document.querySelector('body').style.color = '#fff';
    document.querySelector('.thumbmail').style.backgroundColor = '#220b5166';
})
