const express = require("express");
const https = require("https");
const app = express();

app.get("/", function (req, res) {
  const url = "https://v2.jokeapi.dev/joke/Any";

  // Make a GET request to the joke API
  https
    .get(url, function (response) {
      // Log the status code of the response
      console.log(response.statusCode);

      // Create a variable to store the data received
      let responseData = "";

      // Collect the data received from the response
      response.on("data", function (data) {
        responseData += data;
      });

      // When all data is received
      response.on("end", function () {
        // Check if the response was successful
        if (response.statusCode === 200) {
          // Parse the JSON data
          const jokeData = JSON.parse(responseData);

          // Access the joke from the parsed data
          const typeOfJoke = jokeData.type;
          let joke = "";

          if (typeOfJoke === "twopart") {
            const setup = jokeData.setup;
            const delivery = jokeData.delivery;
            joke =
              "<h3>" + setup + "</h3>" + "<h3><br>" + delivery + "</h3><br>";
          } else {
            joke = "<h3>" + jokeData.joke + "</h3>";
          }

          // Send the joke as a response to the client
          res.send(joke);
        } else {
          // Send an error message if the response was not successful
          res.status(response.statusCode).send("Error: Failed to fetch joke");
        }
      });
    })
    .on("error", function (err) {
      // Handle errors in the HTTPS request
      console.error("Error in HTTPS request:", err);
      res.status(500).send("Error: Failed to fetch joke");
    });
});

// Start the server listening on port 3000
app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
