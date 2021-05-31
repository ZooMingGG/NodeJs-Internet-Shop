const { Router } = require('express');
const Order = require('../models/order');

const router = Router();

const mapOrders = orders => {
  return orders.map(order => ({
    ...order._doc,
    price: order.courses.reduce((total, c) => {
      return total += c.count * c.course.price;
    }, 0)
  }));
}

router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({'user.userId': req.user._id})
      .populate('user.userId');

    res.render('orders', {
      isOrder: true,
      title: 'Orders',
      orders: mapOrders(orders)
    });
  } catch (error) {
    console.error(error);
  }
});

router.post('/', async (req, res) => {
  try {
    const user = await req.user
      .populate('cart.items.courseId')
      .execPopulate();

    const courses = user.cart.items.map(c => ({
      count: c.count,
      course: {...c.courseId._doc}
    }));

    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user
      },
      courses
    });

    await order.save();
    await req.user.clearCart();

    res.redirect('/orders');
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
