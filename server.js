const express = require("express")
const path = require("path")
const app = express()

// Serve static files from React build
app.use(express.static(path.join(__dirname, "build")))

// Handle React routing - IMPORTANT: This catches ALL routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build/index.html"))
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
