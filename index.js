const express = require('express');
const path = require('path');
const Handlebars = require('handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const homeRoutes = require('./routes/home');
const coursesRoutes = require('./routes/courses');
const addRoutes = require('./routes/add');
const cardRoutes = require('./routes/card');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const User = require('./models/user');

const app = express();

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars)
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(async (req, res, next) => {
  try {
    const user = await User.findById('60b387a00438556060cf3402');
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
  };
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));

app.use('/', homeRoutes);
app.use('/courses', coursesRoutes);
app.use('/add', addRoutes);
app.use('/card', cardRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    const dbUrl = 'mongodb+srv://ZooM:1234VoVa4321@nodeinternetshop.frktu.mongodb.net/NodeJsInternetShop';
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useFindAndModify: false
    });

    const candidate = await User.findOne();

    if (!candidate) {
      const user = new User({
        email: 'vova@gmail.com',
        name: 'ZooM',
        cart: {items: []}
      });

      await user.save();
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}...`);
    });
  } catch (error) {
    console.error(error);
  }
};

start();
