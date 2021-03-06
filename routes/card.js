const { Router } = require('express');
const Course = require('../models/course');

const router = Router();

const mapCartItems = cart => {
  return cart.items.map(course => ({
    ...course.courseId._doc, count: course.count
  }));
};

const calculateTotalPrice = courses => {
  return courses.reduce((total, course) => {
    return total += course.price * course.count;
  }, 0);
};

router.post('/add', async (req, res) => {
  const course = await Course.findById(req.body.id);
  await req.user.addToCart(course);
  res.redirect('/card');
});

router.delete('/remove/:id', async (req, res) => {
  await req.user.removeFromCart(req.params.id);
  const user = await req.user.populate('cart.items.courseId').execPopulate();

  const courses = mapCartItems(user.cart);

  const cart = {
    courses,
    price: calculateTotalPrice(courses)
  };

  res.status(200).json(cart);
});

router.get('/', async (req, res) => {
  const user = await req.user
    .populate('cart.items.courseId')
    .execPopulate();

  const courses = mapCartItems(user.cart);

  res.render('card', {
    title: 'Shopping Card',
    isCard: true,
    courses: courses,
    totalPrice: calculateTotalPrice(courses)
  });
});

module.exports = router;
