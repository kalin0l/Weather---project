const cityContainer = document.querySelector('.cities');
const btn = document.querySelector('.city__button');
const btnInput = document.querySelector('.city__search--btn');
const inputVal = document.querySelector('input');



const renderCountry = function (data) {
    const iconCode = data.weather[0].icon;
    const html = `
    <article class="city">
            <div class="city__data">
                <h3 class="city__name">${data.name}</h3>
                <p class="city__row">Temperature: ${Math.trunc(data.main.temp - 273.15)}°C</p> 
                <p class="city__row">Feels like: ${Math.trunc(data.main.feels_like - 273.15)}°C</p>
                <p class="city__row"><span>Weather: </span>${data.weather[0].main}<img src="http://openweathermap.org/img/wn/${iconCode}.png"> </p>
                <p class="city__row">Wind speed: ${data.wind.speed}km/h</p>
            </div>
        </article>`;

    cityContainer.insertAdjacentHTML('afterbegin', html)
    cityContainer.style.opacity = 1;
}
const JSON = function () {
    fetch(`https://community-open-weather-map.p.rapidapi.com/weather?q=${inputVal.value}%2Cbg&lat=0&lon=0&id=2172797&lang=null&units=%22metric%22%20or%20%22imperial%22`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "e188076ae0msha1822f57c981c74p1d721fjsnfd365b8ac058",
            "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com"
        }
    }).then(res => {
        if (!res.ok)
            throw new Error(`City not found (${res.status})`);
        console.log(res);
        return res.json();
    }).then(function (data) {
        console.log(data);
        renderCountry(data);
    })
}
// JSON('Sofia', 'bg');

const getPosition = function () {
    return new Promise(function (resolved, rejected) {
        navigator.geolocation.getCurrentPosition(resolved, rejected)
    })
}
getPosition().then(pos => console.log(pos))

const whereAmI = function () {

    getPosition().then(pos => {
        const { latitude: lat, longitude: lnt } = pos.coords;
        return fetch(`https://geocode.xyz/${lat},${lnt}?geoit=json`)
    })
        .then(response => {
            // console.log(response);
            if (!response.ok) throw new Error(`Too fast reloading ${response.status}`);
            return response.json();
        })
        .then(data => {
            console.log(data);
            console.log(`You are in ${data.city}, ${data.country}`);
            return fetch(`https://community-open-weather-map.p.rapidapi.com/weather?q=${data.city}%2C${data.state}&lat=0&lon=0&id=2172797&lang=null&units=%22metric%22%20or%20%22imperial%22`, {
                "method": "GET",
                "headers": {
                    "x-rapidapi-key": "e188076ae0msha1822f57c981c74p1d721fjsnfd365b8ac058",
                    "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com"
                }
            })
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    console.log(data)
                    renderCountry(data)
                })
                .catch(err => console.error(`${err.message}`))
        })
}
btn.addEventListener('click', whereAmI);
btnInput.addEventListener('click', JSON);





