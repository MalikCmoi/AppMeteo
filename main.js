const geoLoc = navigator.geolocation.getCurrentPosition(success, error);
const apiKey = 'fe8121a29084755377792492d0144fa3';
const currentTemp = document.querySelector('.meteo-temp');
const localisation = document.querySelector('.meteo-origine').querySelector('p');
const meteoImg = document.querySelector('.img-meteo');

const prevHours = document.querySelector('.hour');
const tabPrevHours = document.querySelectorAll('.hour .temp-object');

const prevDays =  document.querySelector('.days');
const tabPrevDays = document.querySelectorAll('.days .temp-object');
console.log(tabPrevDays)

const btnHour = document.querySelector('.btn-hour');
const btnDay = document.querySelector('.btn-day');


frenchDays =[ 'Dim','Lun', 'Mar','Mer','Jeu','Ven','Sam']


btnHour.addEventListener('click', ()=>{
    console.log('ok');
    btnHour.classList.add('select');
    btnDay.classList.remove('select');
    prevHours.classList.add('select');
    prevDays.classList.remove('select');
});

btnDay.addEventListener('click', ()=>{
    btnHour.classList.remove('select');
    btnDay.classList.add('select');
    prevHours.classList.remove('select');
    prevDays.classList.add('select');
});

function error() {
    console.log('Pas de localisations');
}

function success(position) {
    const latitude  = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log(latitude,longitude);
    fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&exclude=alerts,minutely&lon=${longitude}&appid=${apiKey}&units=metric&lang=fr`)
        .then(reponse => reponse = reponse.json())
        .then(data => {
            console.log(data);
            current = data.current;
            currentTemp.innerText = Math.round(current.temp);
            localisation.innerText = data.timezone;
            let img = document.createElement('img');
            meteoImg.appendChild(img);
            let imgRessource = data.current.weather[0].icon;
            let dayNight = imgRessource[2] 
            img.setAttribute('alt','icon');
            if(dayNight === 'n'){
                img = img.setAttribute('src',`/ressources/nuit/${imgRessource}.svg`);
            }else{
                img = img.setAttribute('src',`/ressources/jour/${imgRessource}.svg`);
            }
            
            let tempHourly = data.hourly;
            let hourIndex = 0;
            for (let i = 0; i < tabPrevHours.length; i++) {
                const element = tabPrevHours[i];
                let prevHour = element.querySelector('.heur');
                hourIndex = hourIndex + 3;
                let hour = new Date(tempHourly[hourIndex].dt * 1000);
                prevHour.innerText = hour.getHours()+'h';
                let prevTemp = element.querySelector('.temp-prev span');
                prevTemp.innerText = Math.round(tempHourly[hourIndex].temp)
            }

            let tempDay = data.daily
            for (let i = 0; i < tabPrevDays.length; i++) {
                const element = tabPrevDays[i];
                let nodeDay = element.querySelector('.heur');
                let day = new Date(tempDay[i+1].dt * 1000);
                nodeDay.innerText = frenchDays[day.getDay()];
                let nodeDayTemp = element.querySelector('.temp-prev span');
                nodeDayTemp.innerText = Math.round(tempDay[i+1].temp.day);
            }

        })

}