const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;
const db = require('../models');
const favorite = db.favorite;

//Get the list of all favorite poems for the users.
const getAllFavoritePoems = async (req, res) => {
  const result = await mongodb.getDb().db().collection('favorites').find();
  result.toArray().then((favorites) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(favorites);
  });
};

// Get the favorite poem for the user.
const getFavoritePoem = async (req, res) => {
  const poemId = new ObjectId(req.params.id);
  const result = await mongodb.getDb().db().collection('favorites').find({ _id: poemId });
  result.toArray().then((favorites) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(favorites[0]);
  });
};

// Add a favorite poem for the user.
const addFavoritePoem = async (req, res) => {
  const poem = {
    favorite_id: req.body.favorite_id,
    user_id: req.body.user_id,
    poem_id: req.body.poem_id,
    date_added: req.body.date_added
  };

  const response = await mongodb.getDb().db().collection('favorites').insertOne(poem);
  if (response.acknowledged) {
    res.status(201).json(response);
  } else {
    res.status(500).json(response.error || 'Some error occurred while creating the poem.');
  }
};

//Remove the user favorite poem.
const deleteFavorite = async (req, res) => {
  const poemId = new ObjectId(req.params.id);
  const response = await mongodb.getDb().db().collection('favorites').remove({ _id: poemId }, true);
  console.log(response);
  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while deleting the poem from the user favorite list.');
  }
};

// Update the favorite poem for the authenticated user.
const updateFavorite = async (req, res) => {
  const poemId = new ObjectId(req.params.id);
  const poem = {
    favorite_id: req.body.favorite_id,
    user_id: req.body.user_id,
    poem_id: req.body.poem_id,
    date_added: req.body.date_added
  };
  const response = await mongodb.getDb().db().collection('favorites').replaceOne({ _id: poemId }, poem);
  console.log(response);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while updating the favorite poem.');
  }
};

module.exports = {
  getAllFavoritePoems,
  getFavoritePoem,
  addFavoritePoem,
  deleteFavorite,
  updateFavorite
};
