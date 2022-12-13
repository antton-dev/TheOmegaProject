

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
        return "fas fa-question-circle"
    }
}

fetch('https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + long + '&hourly=temperature_2m,weathercode&timezone=' + tz + '&start_date=' + today + '&end_date=' + tomorrow)
.then(res => res.json())

.then(data => {
    let hourly = data.hourly
    
    const nextHours = hourly.temperature_2m.filter((temperature, index) => index >= date.getHours())
    const nextHoursCode = hourly.weathercode.filter((weathercode, index) => index >= date.getHours())

    let i = 0

    console.log(nextHours);
    nextHours.forEach((temperature, index) => {
        const content = `
            <div class="hour">
                <span class="time">${date.getHours()+index >= 24 ? date.getHours()+index-24 : date.getHours()+index }</span>
                <img class="icon" src="images/weather/${dayNight(date.getHours() + index)}/${iconWeather(nextHoursCode[index])}.svg">
                <span class="temperature">${temperature}°</span>
            </div>
            `
        if (i < 7) {    
            hours.insertAdjacentHTML('beforeend', content)
            i += 1
        }
    });
    

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
            <span class="temperature">${temperatureMin}°</span>
            <span class="temperature">${temperatureMax[index]}°</span>
        </div>
        `

        days.insertAdjacentHTML('beforeend', content)
    });
})