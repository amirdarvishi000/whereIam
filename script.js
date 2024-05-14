'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
let lat, lng;
navigator.geolocation.getCurrentPosition(position => {
  lat = position.coords.latitude;
  lng = position.coords.longitude;
});

function renderCountry(data, classNanme = '') {
  const html = `<article class="country ${classNanme}">
 <img class="country__img" src="${data.flags.png}" />
 <div class="country__data">
   <h3 class="country__name">${data.name}</h3>
   <h4 class="country__region">${data.region}</h4>
   <p class="country__row"><span>👫</span>${(data.population / 1000000).toFixed(
     1
   )}</p>
   <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
   <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
 </div>
</article>`;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
}
///////////////////////////////////////
const renderError = function (msg) {
  countriesContainer.insertAdjacentText('afterend', msg);
  countriesContainer.style.opacity = 1;
};
const getCountryAndNeighbor = function (country) {
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.com/v2/name/${country}`);
  request.send();
  console.log(request.responseText);

  request.addEventListener('load', function () {
    const [data] = JSON.parse(this.responseText);
    console.log(data);
    renderCountry(data);

    const [neighbor] = data.borders;

    if (!neighbor) return;

    //ajax call country 2
    const request2 = new XMLHttpRequest();
    request2.open('GET', `https://restcountries.com/v2/alpha/${neighbor}`);
    request2.send();
    request2.addEventListener('load', function () {
      const data2 = JSON.parse(this.responseText);
      renderCountry(data2, 'neighbour');
    });
  });
};

// const request = fetch('https://restcountries.com/v2/name/usa');
// console.log(request);

// const request = new XMLHttpRequest();
//   request.open('GET', `https://restcountries.com/v2/name/${country}`);

const getCountryData = function (country) {
  fetch(`https://restcountries.com/v2/name/${country}`)
    .then(res => {
      console.log(res);
      if (!res.ok) {
        console.error(`country not found ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      renderCountry(data[0]);
      console.log(data[0]);
      const neighbor = data[0].borders[0];
      console.log(neighbor);
      if (!neighbor) return;
      console.log(data[0].borders[0], 'tests');
      //country 2
      return fetch(`https://restcountries.com/v2/alpha/${neighbor}`);
    })
    .then(res => {
      return res.json();
    })
    .then(data => {
      console.log(data, 'datadata');
      return renderCountry(data, 'neighbour');
    })
    .catch(err => renderError(err.message))
    .finally(() => console.log('finally'));
};
document.addEventListener('click', function () {
  whereIam(lat, lng);
});

// Coding Challenge #1

/* 
In this challenge you will build a function 'whereAmI' which renders a country ONLY based on GPS coordinates. For that, you will use a second API to geocode coordinates.

Here are your tasks:

PART 1
1. Create a function 'whereAmI' which takes as inputs a latitude value (lat) and a longitude value (lng) (these are GPS coordinates, examples are below).
2. Do 'reverse geocoding' of the provided coordinates. Reverse geocoding means to convert coordinates to a meaningful location, like a city and country name. Use this API to do reverse geocoding: https://geocode.xyz/api.
The AJAX call will be done to a URL with this format: https://geocode.xyz/52.508,13.381?geoit=json. Use the fetch API and promises to get the data. Do NOT use the getJSON function we created, that is cheating 😉
3. Once you have the data, take a look at it in the console to see all the attributes that you recieved about the provided location. Then, using this data, log a messsage like this to the console: 'You are in Berlin, Germany'
4. Chain a .catch method to the end of the promise chain and log errors to the console
5. This API allows you to make only 3 requests per second. If you reload fast, you will get this error with code 403. This is an error with the request. Remember, fetch() does NOT reject the promise in this case. So create an error to reject the promise yourself, with a meaningful error message.

PART 2
6. Now it's time to use the received data to render a country. So take the relevant attribute from the geocoding API result, and plug it into the countries API that we have been using.
7. Render the country and catch any errors, just like we have done in the last lecture (you can even copy this code, no need to type the same code)

TEST COORDINATES 1: 52.508, 13.381 (Latitude, Longitude)
TEST COORDINATES 2: 19.037, 72.873
TEST COORDINATES 2: -33.933, 18.474

GOOD LUCK 😀
*/

const whereIam = function (lat, lng) {
  fetch(
    `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=46f3eccdd7254666b899007f7b04e54a`
  )
    .then(res => res.json())
    .then(res => {
      console.log(res);
      const country = res.features[0].properties.country;
      console.log(country, 'tetstss');
      getCountryData(country);
      return country;
      console.log(res.features[0].properties.country);
      console.log(res);
    });
};

const lotteryPromise = new Promise(function (resolve, reject) {
  console.log('lottery draw is happening:');
  setTimeout(function () {
    if (Math.random() >= 0.5) {
      resolve('You win the lottery✈️');
    } else {
      reject('You lose🤷‍♂️');
    }
  }, 2000);
});
lotteryPromise.then(res => console.log(res)).catch(err => console.log(err));

const wait = function (seconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000);
  });
};

wait(1)
  .then(() => {
    console.log('done');
    return wait(1);
  })
  .then(() => {
    console.log('2 second pass');
    return wait(1);
  })
  .then(() => {
    console.log('3 second pass');
    return wait(1);
  })
  .then(() => {
    console.log('4 second pass');
    return wait(1);
  });

Promise.resolve('abc').then(res => console.log(res));
Promise.reject('test').catch(res => console.log(res));

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

getPosition().then(res => console.log(res));
const imgContainer = document.querySelector('.images');

const createImage = function (imgPath) {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img');
    img.src = imgPath;
    img.addEventListener('load', function () {
      imgContainer.append(img);
      resolve(img);
    });
  });
};

// createImage('./img/img-1.jpg')
//   .then(() => {
//     return wait(2);
//   })
//   .then(() => {
//     imgContainer.style.display = 'none';
//   })
//   .then(() => {
//     createImage('./img/img-2.jpg');
//     imgContainer.style.display = 'block';
//     return wait(2);
//   })
//   .then(() => {
//     createImage('./img/img-3.jpg');
//     imgContainer.style.display = 'block';
//   });

const whereI = async function () {
  try {
    //get geo location
    const { coords } = await getPosition();
    const { latitude: lat, longitude: lng } = coords;

    //reverse geo coding
    const countApi = await fetch(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=46f3eccdd7254666b899007f7b04e54a`
    );
    if (!countApi.ok) {
      throw new Error('problem getting from countApi');
    }
    const countName = await countApi.json();
    const { country, city } = countName.features[0].properties;

    const res = await fetch(`https://restcountries.com/v2/name/${country}`);
    const data = await res.json();
    renderCountry(data[0]);
    return `You are in ${city} , ${country}`;
  } catch (err) {
    console.log(err);
    renderError(err.message);
  }
};
// whereI().then(res => console.log(res));

// //get info about country with json

// const getJSON = async function (add) {
//   const fet = await fetch(add);
//   const [toJ] = await fet.json();
//   return toJ;
// };

// const get3Country = async function (c1, c2, c3) {
//   // const v1 = await getJSON(`https://restcountries.com/v2/name/${c1}`);
//   // const v2 = await getJSON(`https://restcountries.com/v2/name/${c2}`);
//   // const v3 = await getJSON(`https://restcountries.com/v2/name/${c3}`);
//   const data = await Promise.all([
//     getJSON(`https://restcountries.com/v2/name/${c1}`),
//     getJSON(`https://restcountries.com/v2/name/${c2}`),
//     getJSON(`https://restcountries.com/v2/name/${c3}`),
//   ]);
//   console.log(
//     data.map(res => {
//       return [res.name, res.capital];
//     })
//   );
// };
// get3Country('usa', 'netherland', 'swiss');

// // (async function () {
// //   const pRace = await Promise.all([
// //     getJSON(`https://restcountries.com/v2/name/italy`),
// //     getJSON(`https://restcountries.com/v2/name/usa`),
// //     getJSON(`https://restcountries.com/v2/name/egypt`),
// //   ]);
// //   console.log(pRace, 'promise race');
// // })();

// (async function () {
//   const anyP = await Promise.any([
//     Promise.resolve('d'),
//     Promise.reject('reject'),
//     Promise.resolve('also success'),
//   ]);
//   console.log(anyP, 'promise any');
// })();
