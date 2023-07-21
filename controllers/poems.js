const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;
const db = require('../models');
const poem = db.poem;

// get all poems from database
const getAllPoems = async (req, res,) => {
  try {
    const result = await mongodb
      .getDb().db('').collection('poems')
      .find();
    result.toArray().then((poems) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(poems);
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get a single poem from database
const getPoemById = async (req, res) => {
  const poemId = new ObjectId(req.params.id);
  const result = await mongodb.getDb().db().collection('poems').find({ _id: poemId });
  result.toArray().then((poems) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(poems[0]);
  });
};


// create new poem
const createPoem = async (req, res) => {
  try {
    const poem = {
      poem_id: req.body.poem_id,
      title: req.body.title,
      content: req.body.content,
      author_id: req.body.author_id,
      author: req.body.author,
      date_created: req.body.date_created,
      tags: req.body.tags
    };

    const response = await mongodb.getDb().db().collection('poems').insertOne(poem);
    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res.status(500).json(response.error || 'Some error occurred while creating the poem.');
    }
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

// update poem by id in the database
const updatePoem = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      res.status(400).json('Must use a valid poem id to update a poem.');
    }
    const poemId = new ObjectId(req.params.id);
    const poem = {
      poem_id: req.body.poem_id,
      title: req.body.title,
      content: req.body.content,
      author_id: req.body.author_id,
      author: req.body.author,
      date_created: req.body.date_created,
      tags: req.body.tags
    };
    const response = await mongodb.getDb().db().collection('poems').replaceOne({ _id: poemId }, poem);
    console.log(response);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json(response.error || 'Some error occurred while updating the favorite poem.');
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

// delete poem by id in the database
const deletePoem = async (req, res) => {
  try {
    const poemId = new ObjectId(req.params.id);
    const response = await mongodb.getDb().db().collection('poems').remove({ _id: poemId }, true);
    console.log(response);
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json(response.error || 'Some error occurred while deleting the poem from the user favorite list.');
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

module.exports = {
  getAllPoems,
  getPoemById,
  createPoem,
  updatePoem,
  deletePoem
};


