const express = require('express');
const fs = require('fs'); // Only reason to import fs to mimic DATABASE

const stars = require('./stars.json'); // ITS OUR array of stars

// Creating server
const app = express();

// Middleware
app.use(express.json()); // Just to parse the body "req.body"

const port = 9000;

//` Get all stars in our database
app.get('/', (req, res) => {
  // Javascript Code

  //! CHECK
  stars.forEach((star) => {
    delete star.email;
    delete star.code;
    return star;
  });

  res.status(200).json({
    message: 'Here are the stars',
    data: stars,
  });
});

// ` Get a star by email and code
app.get('/my_stars', (req, res) => {
  const { email, code } = req.body;

  const star = stars.filter((star) => {
    return (
      star.email === email &&
      star.code === code
    );
  });

  if (!star) {
    return res.status(404).json({
      status: 'fail',
      message: 'Stars not found',
    });
  }

  res.status(200).json({
    status: 'success',
    data: star,
    message: `Here is your star ${star.length}`,
  });
});

// ` Add a new star to our database
app.post('/', (req, res) => {
  const { name, email, code, person } =
    req.body;

  if (
    !name ||
    !email ||
    !code ||
    !person
  ) {
    return res.status(400).json({
      status: 'fail',
      message:
        'Please fill out all fields',
    });
  }

  // Check if star already exists // Basic javascript
  const starExists = stars.find(
    (star) => star.name === name
  );

  if (starExists) {
    return res.status(405).json({
      status: 'fail',
      message:
        'Star already exists, Please choose a different name',
    });
  }

  const newStar = {
    name,
    email,
    code,
    person,
  };

  stars.push(newStar);

  fs.writeFile(
    './stars.json',
    JSON.stringify(stars),
    (err) => {
      if (err) {
        res.status(500).json({
          message:
            'Interval Server Error',
        });
      }
    }
  );

  res.status(201).json({
    message: 'Star added successfully',
    data: newStar,
  });
});

// ` Update a star in our database
app.put('/:name', (req, res) => {
  const { name } = req.params;

  const starExists = stars.find(
    (star) => star.name === name
  );

  if (!starExists) {
    return res.status(404).json({
      status: 'fail',
      message:
        'Star does not exist , Please add a new star',
    });
  }

  const { email, code, newName } =
    req.body;

  if (
    starExists.email !== email ||
    starExists.code !== code
  ) {
    return res.status(401).json({
      status: 'fail',
      message:
        'You are not authorized to update this star',
    });
  }

  starExists.name = newName;

  fs.writeFile(
    './stars.json',
    JSON.stringify(stars),
    (err) => {
      if (err) {
        res.status(500).json({
          message:
            'Interval Server Error',
        });
      }
    }
  );

  res.status(200).json({
    data: starExists,
    message:
      'Star updated successfully',
  });
});

// ` Delete a star in our database
app.delete('/:name', (req, res) => {
  const { name } = req.params;

  const starExists = stars.find(
    (star) => star.name === name
  );

  if (!starExists) {
    return res.status(404).json({
      status: 'fail',
      message: 'Star does not exist',
    });
  }

  const { email, code } = req.body;

  if (
    starExists.email !== email ||
    starExists.code !== code
  ) {
    return res.status(401).json({
      status: 'fail',
      message:
        'You are not authorized to delete this star',
    });
  }

  const index =
    stars.indexOf(starExists);
  stars.splice(index, 1);

  fs.writeFile(
    './stars.json',
    JSON.stringify(stars),
    (err) => {
      if (err) {
        res.status(500).json({
          message:
            'Interval Server Error',
        });
      }
    }
  );

  res.status(200).json({
    message:
      'Star deleted successfully',
  });
});

// Found the star
app.put('/found/:name', (req, res) => {
  const { name } = req.params;

  const starExists = stars.find(
    (star) => star.name === name
  );

  if (!starExists) {
    return res.status(404).json({
      status: 'fail',
      message: 'Star does not exist',
    });
  }

  const {
    secret,
    distance,
    size,
    color,
    constellation,
  } = req.body;

  if (secret !== 'key') {
    return res.status(401).json({
      status: 'fail',
      message:
        'You are not authorized to perform this action',
    });
  }

  starExists.found = true;
  starExists.distance = distance;
  starExists.size = size;
  starExists.color = color;
  starExists.constellation =
    constellation;

  fs.writeFile(
    './stars.json',
    JSON.stringify(stars),
    (err) => {
      if (err) {
        res.status(500).json({
          message:
            'Interval Server Error',
        });
      }
    }
  );

  res.status(200).json({
    message: 'Star found successfully',
    data: starExists,
  });
});

app.listen(port, () => {
  console.log(
    'Star are twinkling in the night sky @.\n' +
      port
  );
});
