const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');

dotenv.config();


const RouterSystem = require("./routes/index.route.js");

const { testConnection } = require('./configs/database');

const app = express();
const port = process.env.PORT;

testConnection()

// Flash
app.use(cookieParser('NDCNDTN'));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
// End Flash

app.set("views", `${__dirname}/views`);
app.set('view engine', 'pug');
app.use(express.static(`${__dirname}/public`))


app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

app.use(methodOverride('_method'))

app.use(bodyParser.urlencoded({ extended: false }));


RouterSystem(app)


app.listen(port, () => {
    console.log(`Chay tren cong ${port}`);
})