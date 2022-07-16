const wrapper = document.querySelector(".wrapper"),
  inputPart = document.querySelector(".input-part"),
  infoTxt = inputPart.querySelector(".info-txt"),
  inputField = inputPart.querySelector("input"),
  locationBtn = inputPart.querySelector("button"),
  weatherPart = wrapper.querySelector(".weather-part"),
  wIcon = weatherPart.querySelector("img"),
  arrowBack = wrapper.querySelector("header i");

let wData;

inputField.addEventListener("keyup", (e) => {
  if (e.key == "Enter" && inputField.value != "") {
    requestApi(inputField.value);
  }
});

locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert("Your browser not support geolocation api");
  }
});

function requestApi(city) {
  // https://learn.co/lessons/fewpjs-sending-data-with-fetch#:~:text=You%20tell%20fetch()%20to,callback%20function%20as%20its%20argument.
  // go to "Construct a POST Request Using fetch()" section
  async function start() {
    try {
      const response = await fetch("/city", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          cityName: city,
        }),
      });
      console.log(response);

      // Parsing it to JSON format
      wData = await response.json();
      console.log(wData);
      weatherDetails(wData);
    } catch (err) {
      console.log(err.status);
    }
  }
  infoTxt.innerText = "Getting weather details...";
  infoTxt.classList.add("pending");
  start();
}

function onSuccess(position) {
  const { latitude, longitude } = position.coords;
  async function start() {
    try {
      const response = await fetch("/city", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          lat: latitude,
          lng: longitude,
        }),
      });
      console.log(response);

      // Parsing it to JSON format
      wData = await response.json();
      console.log(wData);
      weatherDetails(wData);
    } catch (err) {
      console.log(err.status);
    }
  }
  infoTxt.innerText = "Getting weather details...";
  infoTxt.classList.add("pending");
  start();
}

function onError(error) {
  infoTxt.innerText = error.message;
  infoTxt.classList.add("error");
}

function weatherDetails(info) {
  if (info.cod == "404") {
    infoTxt.classList.replace("pending", "error");
    infoTxt.innerText = `${inputField.value} isn't a valid city name`;
  } else if (info.cod == "401") {
    infoTxt.innerText = "Something went wrong";
    infoTxt.classList.replace("pending", "error");
  } else {
    const city = info.name;
    const country = info.sys.country;
    const { description, id } = info.weather[0];
    const { temp, feels_like, humidity } = info.main;
    const windSpeed = info.wind.speed;

    if (id == 800) {
      wIcon.src = "images/clear.svg";
    } else if (id >= 200 && id <= 232) {
      wIcon.src = "images/storm.svg";
    } else if (id >= 600 && id <= 622) {
      wIcon.src = "images/snow.svg";
    } else if (id >= 701 && id <= 781) {
      wIcon.src = "images/haze.svg";
    } else if (id >= 801 && id <= 804) {
      wIcon.src = "images/cloud.svg";
    } else if ((id >= 500 && id <= 531) || (id >= 300 && id <= 321)) {
      wIcon.src = "images/rain.svg";
    }

    weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp);
    weatherPart.querySelector(".weather").innerText = description;
    weatherPart.querySelector(
      ".location span"
    ).innerText = `${city}, ${country}`;
    weatherPart.querySelector(".temp .numb-2").innerText =
      Math.floor(feels_like);
    weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;
    weatherPart.querySelector(".windspeed span").innerText = `${windSpeed}m/s`;
    infoTxt.classList.remove("pending", "error");
    infoTxt.innerText = "";
    inputField.value = "";
    wrapper.classList.add("active");
  }
}

arrowBack.addEventListener("click", () => {
  wrapper.classList.remove("active");
});
