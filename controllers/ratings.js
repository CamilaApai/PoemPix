const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;
const db = require('../models');
const rating = db.rating;

//  Get the list of poem ratings.
const getAllRatings = async (req, res) => {
  const result = await mongodb.getDb().db().collection('ratings').find();
  result.toArray().then((ratings) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(ratings);
  });
};

// Get the rating for a specific poem.
const getSingleRating = async (req, res) => {
  const poemId = new ObjectId(req.params.id);
  const result = await mongodb.getDb().db().collection('ratings').find({ _id: poemId });
  result.toArray().then((ratings) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(ratings[0]);
  });
};

//Remove the user rating for the poem.
const deleteRating = async (req, res) => {
  const poemId = new ObjectId(req.params.id);
  const response = await mongodb.getDb().db().collection('ratings').remove({ _id: poemId }, true);
  console.log(response);
  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while deleting rating for the poem.');
  }
};

// Update the ranking of the list of poems.
const updateRating = async (req, res) => {
  const poemId = new ObjectId(req.params.id);
  const poem = {
    rating_id: req.body.rating_id, 
    user_id: req.body.user_id,
    poem_id: req.body.poem_id, 
    rating_value: req.body.rating_value,
    timestamp: req.body.timestamp
  };
  const response = await mongodb.getDb().db().collection('ratings').replaceOne({ _id: poemId }, poem);
  console.log(response);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while updating the rating for the poem.');
  }
};

// Add or update the rating for a specific poem.
module.exports = {
  getAllRatings,
  getSingleRating,
  deleteRating,
  updateRating
};
