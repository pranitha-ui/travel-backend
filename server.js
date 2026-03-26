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

// ✅ OpenStreetMap API (FINAL STABLE VERSION 🔥)
app.get("/api/search", async (req, res) => {
  const location = req.query.location;

  if (!location || location.trim() === "") {
    return res.status(400).json({
      error: "Valid location required"
    });
  }

  try {
    // ⏳ small delay to avoid rate limit
    await new Promise(resolve => setTimeout(resolve, 1000));

    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: location,
          format: "json",
          limit: 1
        },
        headers: {
          "User-Agent": "travel-backend-app (rpranitha246@gmail.com)"
        }
      }
    );

    if (!response.data || response.data.length === 0) {
      return res.status(404).json({
        error: "Location not found"
      });
    }

    res.json({
      success: true,
      data: response.data
    });

  } catch (error) {
    console.log("OSM ERROR:", error.response?.status || error.message);

    if (error.response?.status === 429) {
      return res.status(429).json({
        error: "Too many requests. Please wait a few seconds and try again."
      });
    }

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

// ✅ IMPORTANT FOR RENDER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});