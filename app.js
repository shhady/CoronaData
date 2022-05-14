let buttons = document.querySelector(".buttons");
let continentsBtns = document.querySelectorAll(".continentsBtn");
let statsBtns = document.querySelectorAll(".statsBtn");
let countryDiv = document.querySelector(".countries");
const continents = {};
let select = document.querySelector(".select");
let chosenStat = "";
let chosenConti = "";
let eachContinent = [];

async function fetchContinents() {
  let countries = await fetch(
    `https://nameless-citadel-58066.herokuapp.com/https://restcountries.herokuapp.com/api/v1/`
  );
  let data = await countries.json();
  for (let i = 0; i < data.length; i++) {
    if (!continents[data[i].region]) {
      continents[data[i].region] = [];
    } else {
      continents[data[i].region].push({ name: data[i].name.common });
    }
  }
}

async function coronaData() {
  await fetchContinents();
  let corona = await fetch(
    " https://nameless-citadel-58066.herokuapp.com/http://corona-api.com/countries"
  );
  let data = await corona.json();
  console.log(data);
  const continentsNames = ["Asia", "Africa", "Oceania", "Americas", "Europe"];
  data.data.forEach((country) => {
    let flag = false;
    for (let continentName of continentsNames) {
      for (let countryObj of continents[continentName]) {
        let temp = country.name;
        if (country.name[-1] === " ") {
          country.name = country.name.slice(0, -1);
        }
        if (countryObj.name === temp) {
          countryObj.confirmed = country.latest_data.confirmed;
          countryObj.deaths = country.latest_data.deaths;
          countryObj.critical = country.latest_data.critical;
          countryObj.recovered = country.latest_data.recovered;
          countryObj.newCases = country.today.confirmed;
          countryObj.newDeaths = country.today.deaths;
          flag = true;
          break;
        }
      }
      if (flag) break;
    }
  });
  // console.log(Object.keys(continents));
}
coronaData();

function continentsListeners() {
  continentsBtns.forEach((continent) => {
    continent.addEventListener("click", (event) => {
      // const xlabels = [];
      // let continents = await fetch(
      //   `https://nameless-citadel-58066.herokuapp.com/https://restcountries.herokuapp.com/api/v1/region/${event.target.innerText}`
      // );
      // let data = await continents.json();
      // for (let i = 0; i < data.length; i++) {
      //   xlabels.push(data[i].name.common);
      // }
      chosenConti = event.target.innerText;
      const countryNames = continents[event.target.innerText].map(
        (countryObj) => countryObj.name
      );
      chartObj.data.labels = countryNames;
      myChart.update();
      setSelect(countryNames);
      const countriesBasedOnClick = Object.values(
        continents[event.target.innerText]
      );
      if (eachContinent.length < 1) {
        eachContinent.push(countriesBasedOnClick);
      } else {
        eachContinent.pop();
        eachContinent.push(countriesBasedOnClick);
      }
      console.log(eachContinent);
      // for (let i = 0; i < eachContinent.length; i++) {
      //   var index = eachContinent[0].findIndex(function (person) {
      //     return person.name == "Angola";
      //   });
      //   console.log(eachContinent[i][index]);
      // }
    });
  });
}

function statsListener() {
  statsBtns.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      countryTitle.innerHTML = "";
      chosenStat = btn.getAttribute("data-stat");
      const statsArr = continents[chosenConti].map(
        (countryObj) => countryObj[chosenStat]
      );
      const filteredStatsArr = statsArr.filter((val) => val !== undefined);
      console.log(filteredStatsArr);

      countryTitle.append(chosenStat);
      chartObj.data.datasets[0].data = filteredStatsArr;
      myChart.update();
    });
  });
}
let countryTitle = document.querySelector(".countryTitle");
function setSelect(countryNames) {
  select.innerHTML = "";
  for (let i = 0; i < countryNames.length; i++) {
    let countryOption = document.createElement("option");
    countryOption.setAttribute("class", "chooseCountry");
    countryOption.innerHTML = countryNames[i];
    select.append(countryOption);
  }

  select.addEventListener(
    "change",
    function () {
      var eachCountryFullData = eachContinent[0].find(function (person) {
        return person.name == select.value;
      });
      //       let objKeys = [];
      // let objValues = [];
      // if (eachCountryFullData.length < 1) {
      //   eachCountryFullData.push(eachContinent[i][index]);
      // } else {
      // }
      delete eachCountryFullData.name;
      let objKeys = Object.keys(eachCountryFullData);
      let objValues = Object.values(eachCountryFullData);
      // console.log(eachCountryFullData);
      // console.log(objKeys);
      chartObj.data.labels = objKeys;
      chartObj.data.datasets[0].data = objValues;
      myChart.update();
      countryTitle.innerHTML = "";
      countryTitle.innerText = select.value;
    },

    false
  );
}

// continentButtons1();

// console.log(xlabels);

// async function continentButtons() {
//   button.forEach((continent) => {
//     continent.addEventListener("click", async (event) => {
//       let continents = await fetch(
//         `https://nameless-citadel-58066.herokuapp.com/https://restcountries.herokuapp.com/api/v1/region/${event.target.innerText}`
//       );
//       let data = await continents.json();
//       select.innerHTML = "";
//       // xlabels.innerHTML = "";
//       for (let i = 0; i < data.length; i++) {
//         let countryOption = document.createElement("option");
//         countryOption.setAttribute("class", "chooseCountry");
//         countryOption.innerHTML = data[i].name.common;
//         select.append(countryOption);
//         // xlabels.push(data[i].name.common);
//         // console.log(data[i].name.common);
//       }
//       let allOptions = document.querySelector("select");
//       let countryTitle = document.querySelector(".countryTitle");
//       // xlabels.push(countryOption);
//       // let choosingCountry = allOptions.innerText; // gets all counrtries to use in the chart.js
//       // console.log(allOptions.innerText);
//       allOptions.addEventListener(
//         "change",
//         function () {
//           countryTitle.innerHTML = "";
//           countryTitle.append(select.value);
//         },
//         false
//       );
//     });
//   });
// }

const ctx = document.getElementById("myChart").getContext("2d");

continentsListeners();
statsListener();
// continentButtons();
// const ctx = document.getElementById("myChart").getContext("2d");
const chartObj = {
  type: "bar",
  data: {
    labels: [],
    datasets: [
      {
        label: chosenStat,
        data: [],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: ["rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        type: "logarithmic",
        min: 0,
        grid: {
          display: false,
        },
      },
    },
  },
};
const myChart = new Chart(ctx, chartObj);
