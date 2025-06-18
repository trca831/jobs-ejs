const express = require("express");
require("express-async-errors");
require("dotenv").config(); // Load environment variables

const app = express();

// View engine
app.set("view engine", "ejs");

// Middleware
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

// Session store
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "mySessions",
});
store.on("error", function (error) {
  console.log(error);
});

// Session settings
const sessionParms = {
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: store,
  cookie: { secure: false, sameSite: "strict" },
};

const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');

app.use(helmet());
app.use(xss());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP
});
app.use(limiter);

if (app.get("env") === "production") {
  app.set("trust proxy", 1);
  sessionParms.cookie.secure = true;
}

// Middleware order matters
app.use(cookieParser(process.env.SESSION_SECRET)); // 1. cookie parser
app.use(session(sessionParms));                    // 2. session
app.use(bodyParser.urlencoded({ extended: true })); // 3. body parser
app.use(csrf({ cookie: true }));                   // 4. csrf middleware

// Make CSRF token available to EJS views
app.use((req, res, next) => {
  res.locals._csrf = req.csrfToken();
  next();
});

// Passport authentication setup
const passport = require("passport");
const passportInit = require("./passport/passportInit");
passportInit();
app.use(passport.initialize());
app.use(passport.session());

const jobsRouter = require('./routes/jobs');
const auth = require('./middleware/auth'); // if applicable

app.use('/jobs', auth, jobsRouter);

// Flash messages (depends on session)
app.use(require("connect-flash")());

// Store flash messages and user info in res.locals
app.use(require("./middleware/storeLocals"));

// Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.use("/sessions", require("./routes/sessionRoutes"));

const secretWordRouter = require("./routes/secretWord");
// const auth = require("./middleware/auth");
app.use("/secretWord", auth, secretWordRouter);

// Handle 404
app.use((req, res) => {
  res.status(404).send(`That page (${req.url}) was not found.`);
});

// Error handler
app.use((err, req, res, next) => {
  res.status(500).send(err.message);
  console.error(err);
});

// Connect to MongoDB and start server
const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await require("./db/connect")(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();