const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3000;
const WINDOW_SIZE = 10;

let numberWindow = [];

app.use(express.json());


app.get("/numbers/:numberid", async (req, res) => {
  const { numberid } = req.params;

  try {
  
    const numbers = await fetchNumbers(numberid);

   
    numbers.forEach((num) => {
      if (!numberWindow.includes(num)) {
        numberWindow.push(num);
      }
    });

    
    if (numberWindow.length > WINDOW_SIZE) {
      numberWindow = numberWindow.slice(-WINDOW_SIZE);
    }

    // Calculate average of numbers in the window
    const avg = calculateAverage(numberWindow);

    const response = {
      windowPrevState: numberWindow.slice(0, -numbers.length),
      windowCurrState: numberWindow,
      numbers,
      avg,
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching numbers:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

async function fetchNumbers(numberid) {
  const baseUrl = getBaseUrl(numberid);
  const response = await axios.get(baseUrl);
  return response.data.numbers;
}

function getBaseUrl(numberid) {
  switch (numberid) {
    case "p":
      return "http://20.244.56.144/test/primes";
    case "f":
      return "http://28.244.56-144/test/fibo";
    case "e":
      return "http://20.244.56.144/test/even";
    case "r":
      return "http://20.244.56.144/test/random";
    default:
      throw new Error("Invalid numberid");
  }
}

function calculateAverage(numbers) {
  if (numbers.length === 0) {
    return 0;
  }
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum / numbers.length;
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
