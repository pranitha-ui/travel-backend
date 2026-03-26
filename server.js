const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Home route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// ✅ Test route
app.get("/api/test", (req, res) => {
  res.json({
    message: "API working 🎉"
  });
});

// ✅ Places API
app.get("/api/places", (req, res) => {
  const location = req.query.location;

  if (!location || location.trim() === "") {
    return res.status(400).json({
      error: "Valid location is required"
    });
  }

  res.json({
    success: true,
    location,
    places: [`Top places in ${location}`]
  });
});

// ✅ OpenStreetMap API (FIXED 🔥)
app.get("/api/search", async (req, res) => {
  const location = req.query.location;

  if (!location || location.trim() === "") {
    return res.status(400).json({
      error: "Valid location required"
    });
  }

  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: location,
          format: "json"
        },
        headers: {
          "User-Agent": "travel-app"
        }
      }
    );

    res.json({
      success: true,
      data: response.data
    });

  } catch (error) {
    console.log(error.message); // 🔍 debug
    res.status(500).json({
      error: "Failed to fetch location"
    });
  }
});

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found"
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});