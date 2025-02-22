const path = require('path')
const express = require('express')
const session = require('express-session')
const dotenv = require ('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const passport = require('passport')
const connectDB = require('./config/db')
const MongoStore = require('connect-mongo')
const methodOverride = require('method-override')
const { swaggerUi, specs } = require("./config/swagger");

dotenv.config({ path: './config/config.env' })

require('./config/passport')(passport)

connectDB()

const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(methodOverride(function (req, res) {
    if(req.body && typeof req.body === 'object' && '_method' in req.body) {
        var method = req.body._method
        delete req.body._method
        return method
    }
}))

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

const { editIcon, deleteIcon, select } = require('./helpers/hbs')

app.engine('.hbs', exphbs.engine({ helpers: {editIcon, deleteIcon, select}, defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', '.hbs')

app.use(
    session({
      secret: "keyboard cat",
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
      }),
      cookie: { maxAge: 60 * 1000 }, // Sesja ważna 1 minuta
    })
  )

app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1]; // "Bearer accessToken"
      if (token === req.session.accessToken) {
        return next();
      } else {
        return res.status(401).json({ message: "Unauthorized" });
      }
    }
    next();
  });

app.use(function(req, res, next) {
    res.locals.user = req.user || null
    next()
})

app.use(express.static(path.join(__dirname, "node_modules/bootstrap/dist/")));
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/visits', require('./routes/visits'))

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))