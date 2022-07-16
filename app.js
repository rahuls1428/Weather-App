import express from "express";
const app = express();

// Dotenv is a zero-dependency module that loads environment variables from a
// .env file into process.env variable
// NOTE: traditionally we use ALL CAPS for .env variables, check the file
// Check this out for understanding: www.twilio.com/blog/working-with-environment-variables-in-node-js-html
import * as dotenv from "dotenv";
dotenv.config();

//to check it out: try, console.log(process.env);
//so to access api key, we can do "process.env.API_KEY"
const myAPIKey = process.env.API_KEY;

//in order for our server, to show/serve static files, we use a special function
//of express module of node.js called .static()
//enable express to access static files in folder called "Public"
//To serve static files such as images, CSS files, and JavaScript files, we use below
app.use(express.static("Public"));

//for ES module - https://flaviocopes.com/fix-dirname-not-defined-es-module-scope/
//you need to import the Node.js path module
// and the fileURLToPath function from the url module
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//GET request
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/weather-index.html");
});

//The express.json() function is a built-in middleware function in Express.
// It parses incoming requests with JSON payloads and is based on body-parser.
//see this for understanding: -
// https://stackoverflow.com/questions/23259168/what-are-express-json-and-express-urlencoded
app.use(express.json());

// NOTE we use below for: https.get(), ___.write() fn AND ___.on() is an event of http module
import https from "node:https";

//POST request
//here we take the input city given by user, AND add make the complete url link with:
// user's city, other parameters(like units), and our api id key
app.post("/city", function (req, res) {
  let url, city, latitude, longitude;
  if (req.body.cityName) city = req.body.cityName;
  else {
    latitude = req.body.lat;
    longitude = reg.body.lng;
  }
  const units = "metric";
  console.log(req.body);
  //console.log(req.body.cityName);
  if (city)
    url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${myAPIKey}`;
  else
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${unit}&appid=${myAPIKey}`;
  https.get(url, function (response) {
    //console.log(response);
    response.on("data", function (dataFromResponse) {
      //will display data in long lines which is not in json format
      console.log("The data is: " + dataFromResponse);

      //will display data in a neat spaced out json format
      let weatherData = JSON.parse(dataFromResponse);
      console.log(weatherData);
      res.json(weatherData);
    });
  });
});

//use express app to listen on port 3000 and log when it's working
//for heroku deployment, we use process.env.PORT
let port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log(`Server is running on port: ${port}.`);
});
