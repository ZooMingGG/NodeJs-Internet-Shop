const { Router } = require('express');
const Course = require('../models/course');

const router = Router();

router.get('/', (req, res) => {
  res.render('add', {
    title: 'Add Course',
    isAdd: true
  });
});

router.post('/', async (req, res) => {
  const course = new Course({
    title: req.body.title,
    price: req.body.price,
    imageUrl: req.body.imageUrl,
    userId: req.user
  });

  try {
    await course.save();

    res.redirect('/courses');
  } catch (error) {
    console.error('Error during saving new course', error);
  }

});

module.exports = router;
