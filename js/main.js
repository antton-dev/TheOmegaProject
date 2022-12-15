

let str = document.location.href;
let url = new URL(str);
let lat = url.searchParams.get("lat")
let long = url.searchParams.get("long")
let tz = url.searchParams.get('tz')
let cityName = url.searchParams.get('ville')


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


fetch('https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + long + '&daily=weathercode,temperature_2m_max,temperature_2m_min&current_weather=true&timezone=' + tz + '&start_date=' + today + '&end_date=' + week)
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
    });
})




// CITY CARD 
document.querySelector('h2').innerHTML = cityName


// air quality
function air(code, element) {
    if (code >= 0 && code < 20) {
        element[0].setAttribute('class', 'v_good selected')
    } else if (code >= 20 && code < 40) {
        console.log('bien');
        element[1].setAttribute('class', 'good selected')
    } else if (code >= 40 && code < 60) {
        console.log('moyen');
        element[2].setAttribute('class', 'moderate selected')
    } else if (code >= 60 && code < 80) {
        console.log('mauvais');
        element[3].setAttribute('class', 'bad selected')
    } else if (code >=80 && code < 100) {
        console.log('tres mauvais');
        element[4].setAttribute('class', 'v_bad selected')
    } else if (euro_aqi >= 100) {
        console.log("danger");
        element[5].setAttribute('class', 'danger selected')
    } else {
        console.log('Qualité de l\' air inconnue')
    }
}

fetch('https://air-quality-api.open-meteo.com/v1/air-quality?latitude=' + lat + '&longitude=' + long + '&hourly=european_aqi,european_aqi_pm2_5,european_aqi_pm10&timezone=Europe%2FBerlin&start_date='+ today + '&end_date=' + today)
.then(res => res.json())
.then(data => {
    let hourly = data.hourly
    console.log(hourly);
    let euro_aqi = hourly.european_aqi[date.getHours()]
    console.log(euro_aqi);
    air(euro_aqi, document.querySelector('.general').children)
    
    let euro_aqi_pm2_5 = hourly.european_aqi_pm2_5[date.getHours()]
    console.log(euro_aqi_pm2_5);
    air(euro_aqi_pm2_5, document.querySelector('.pm2-5').children)
    
    let euro_aqi_pm10 = hourly.european_aqi_pm10[date.getHours()]
    console.log(euro_aqi_pm10);
    air(euro_aqi_pm10, document.querySelector('.pm10').children)
})
