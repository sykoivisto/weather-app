//user inputs
let zip = 86404;
let units = 'imperial';

//values from positionstack w/ fetch
let lat;
let lon;

//for html
let unitsText = 'F';
let locationText;


//round lat and lon
function coord(num) {
    return Math.round(num * 100) / 100;
}

async function getWeather() {
    await fetch(`https://api.geoapify.com/v1/geocode/search?text=${zip}&lang=en&limit=1&filter=countrycode:us,ca&format=json&apiKey=18ab753013ec4a6a8595d1af54b256e7`)
    .then(res => {
        if (res.ok) {
            console.log('geoapify - fetch success');
            return res.json();
        } else {
            console.log('geoapify - fetch failure');
        }
    })
    .then(data => {
        lat = data.results['0'].lat;
        lon = data.results['0'].lon;
        locationText = data.results['0'].address_line1;
    })
    .catch(error => console.log(error))

    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${coord(lat)}&lon=${coord(lon)}&units=${units}&appid=60b983b065bdf116489ef3914a0ae103`)
    .then(res => {
        if (res.ok) {
            console.log('openweather - fetch success');
            return res.json();
        } else {
            console.log('openweather - fetch failure');
        }
    })
    .then(data => {
        //current weather
        let currentDate = new Date(data.current.dt*1000);

        let currentWeather = {
            date: currentDate.toLocaleString('en-US', {
                weekday: 'short',
                day: 'numeric',
                month: 'short'
            }),
            temp: data.current.temp,
            icon: data.current.weather['0'].icon
        }

        document.getElementById('current-date').innerHTML = `${currentWeather.date}`;
        document.getElementById('current-temp').innerHTML = `${Math.round(currentWeather.temp)}<span id="units">&deg;${unitsText}`;
        document.getElementById('current-location-text').innerHTML = `${locationText}`;
        document.getElementById('current-icon').src=`images/${currentWeather.icon}.png`;

        //hourly forecast 18hrs
        document.getElementById('hour-weather').innerHTML = '';//clear old content before getting started
        for (let i = 1; i < 19; i++){
            let dateHour = new Date(data.hourly[i].dt*1000);
    
            let hourlyWeather = {
                date: dateHour.toLocaleString('en-US', {
                    hour: 'numeric'
                }),
                temp: data.hourly[i].temp,
                icon: data.hourly[i].weather['0'].icon
            }

            document.getElementById('hour-weather').innerHTML += `
            <div class=small-card>
                <div class="row">
                    <img class="small-icon" src="images/${hourlyWeather.icon}.png">
                </div>
                <div class="row">
                    <p class="small-time">${hourlyWeather.date}</p>
                </div>
                <div class="row">
                    <p class="small-temp">${Math.round(hourlyWeather.temp)}<span id="units">&deg;${unitsText}</span></p>
                </div>
            </div>
            `;
        }

        //tomorrows forecast
        let tomorrowsDate = new Date(data.daily['1'].dt*1000);

        let tomorrowsWeather = {
            date: tomorrowsDate.toLocaleString('en-US', {
                weekday: 'short',
                day: 'numeric',
                month: 'short'
            }),
            tempD: data.daily['1'].temp.day,
            tempN: data.daily['1'].temp.night,
            icon: data.daily['1'].weather['0'].icon
        }

        document.getElementById('tomorrow-date').innerHTML = `${tomorrowsWeather.date}`;
        document.getElementById('tomorrow-DT').innerHTML = `${Math.round(tomorrowsWeather.tempD)}<span id="units">&deg;${unitsText}`;
        document.getElementById('tomorrow-NT').innerHTML = `${Math.round(tomorrowsWeather.tempN)}<span id="units">&deg;${unitsText}`;
        document.getElementById('tomorrow-icon').src = `images/${tomorrowsWeather.icon}.png`;

        //7 day forecast
        document.getElementById('7-day-weather').innerHTML = '';//clear old content before getting started
        for (let i = 1; i < 8; i++) {
            let dateDaily = new Date(data.daily[i].dt*1000);

            let dayWeather = {
                date: dateDaily.toLocaleString('en-US', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short'
                }),
                temp: data.daily[i].temp.day,
                icon: data.daily[i].weather['0'].icon
            }

            document.getElementById('7-day-weather').innerHTML += `
            <div class=small-card>
                <div class="row">
                    <img class="small-icon" src="images/${dayWeather.icon}.png">
                </div>
                <div class="row">
                    <p class="small-time">${dayWeather.date}</p>
                </div>
                <div class="row">
                    <p class="small-temp">${Math.round(dayWeather.temp)}<span id="units">&deg;${unitsText}</span></p>
                </div>
            </div>
            `;
        }
    })
    .catch(error => console.log(error))
}
getWeather();
function updateSettings(){
    zip = document.getElementById('zip').value;
    
    if ( document.getElementById('unitsF').checked ){
        units = 'imperial';
    } else {
        units = 'metric';
    }
    
    if ( units === 'imperial' ) {
        unitsText = 'F';
    } else {
        unitsText = 'C';
    }

    getWeather();
}
