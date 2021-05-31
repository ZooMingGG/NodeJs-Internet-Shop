const { Schema, model } = require('mongoose');

const user = new Schema({
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  cart: {
    items: [
      {
        count: {
          type: Number,
          required: true,
          default: 1
        },
        courseId: {
          type: Schema.Types.ObjectId,
          ref: 'Course',
          required: true
        }
      }
    ]
  }
});

user.methods.addToCart = function(course) {
  const items = [...this.cart.items];
  const idx = items.findIndex(c => {
    return c.courseId.toString() === course._id.toString();
  });

  if (items[idx]) {
    items[idx].count = items[idx].count + 1;
  } else {
    items.push({
      courseId: course._id,
      count: 1
    })
  }

  this.cart = {items};

  return this.save();
}

user.methods.removeFromCart = function(courseId) {
  let items = [...this.cart.items];
  const idx = items.findIndex(course => course.courseId.toString() === courseId.toString());

  if (items[idx].count === 1) {
    items = items.filter(course => course.courseId.toString() !== courseId.toString());
    this.cart = {items};
  } else {
    items[idx].count--;
    this.cart = {items};
  }

  return this.save();
};

user.methods.clearCart = function() {
  this.cart = {items: []};

  return this.save();
}

module.exports = model('User', user);
