const path = require("path")
const express = require("express")
const dotenv = require("dotenv")
const morgan = require("morgan")
require("colors")
const { notFound, errorHandler } = require("./middleware/errorMidlleware")
const connectDB = require("./config/db")

const productRoutes = require("./routes/productRoutes")
const userRoutes = require("./routes/userRoutes")
const orderRoutes = require("./routes/orderRoutes")
const uploadRoutes = require("./routes/uploadRoutes")

dotenv.config()
connectDB()

const app = express()
const PORT = process.env.PORT || 5000

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}

app.use(express.json())

app.use("/api/products", productRoutes)
app.use("/api/users", userRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/upload", uploadRoutes)

app.get("/api/config/paypal", (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
)

app.use("/uploads", express.static("uploads"))

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")))
} else {
  app.get("/", (req, res) => {
    res.send("API is running...")
  })
}

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
})
