const express = require("express")
const path = require("path")
const app = express()
const PORT = process.env.PORT || 10000

// Middleware pour servir les fichiers statiques
app.use(express.static(path.join(__dirname, "build")))

// Middleware pour les logs
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`)
  next()
})

// Headers de sécurité
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff")
  res.setHeader("X-Frame-Options", "DENY")
  res.setHeader("X-XSS-Protection", "1; mode=block")
  next()
})

// Route de santé pour Render
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() })
})

// Toutes les routes (y compris /login) doivent servir index.html
app.get("*", (req, res) => {
  const indexPath = path.join(__dirname, "build", "index.html")
  console.log(`Serving index.html for route: ${req.url}`)
  console.log(`Index path: ${indexPath}`)

  // Vérifier si le fichier index.html existe
  const fs = require("fs")
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath)
  } else {
    console.error("index.html not found!")
    res.status(404).send("Application not built properly")
  }
})

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Build directory: ${path.join(__dirname, "build")}`)
})
