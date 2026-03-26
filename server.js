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

// ✅ FINAL STABLE SEARCH API (NO FAIL VERSION 🔥)
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
          format: "json",
          limit: 1
        },
        headers: {
          "User-Agent": "travel-backend-app (rpranitha246@gmail.com)"
        }
      }
    );

    if (response.data && response.data.length > 0) {
      return res.json({
        success: true,
        data: response.data
      });
    }

  } catch (error) {
    console.log("OSM blocked, using fallback...");
  }

  // 🔥 FALLBACK DATA (ALWAYS WORKS)
  const fallback = {
    bangalore: { lat: "12.9716", lon: "77.5946" },
    delhi: { lat: "28.6139", lon: "77.2090" },
    hyderabad: { lat: "17.3850", lon: "78.4867" },
    mumbai: { lat: "19.0760", lon: "72.8777" },
    chennai: { lat: "13.0827", lon: "80.2707" }
  };

  const key = location.toLowerCase();

  if (fallback[key]) {
    return res.json({
      success: true,
      data: [
        {
          lat: fallback[key].lat,
          lon: fallback[key].lon,
          display_name: key
        }
      ]
    });
  }

  res.status(500).json({
    error: "Location not available right now"
  });
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