const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;
const db = require('../models');
const User = db.user;

const getAllUsers = async (req, res) => {
  const result = await mongodb.getDb().db().collection('users').find();
  result.toArray().then((users) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(users);
  });
};

const getSingleUser = async (req, res) => {
  const userId = new ObjectId(req.params.id);
  
  try {
    const user = await mongodb.getDb().db().collection('users').findOne({ _id: userId });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const authorName = user.name;
    const poems = await mongodb
      .getDb()
      .db()
      .collection('poems')
      .find({ author_id: user.user_id })
      .toArray();

    const userData = {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      age: user.age,
      location: user.location,
      content: poems
    };

    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const createUser = async (req, res) => {
  const user = {
    user_id: req.body.user_id,
    name: req.body.name,
    email: req.body.email,
    age: req.body.age,
    location: req.body.location
  };

  const response = await mongodb.getDb().db().collection('users').insertOne(user);
  if (response.acknowledged) {
    res.status(201).json(response);
  } else {
    res.status(500).json(response.error || 'Some error occurred while creating the user.');
  }
};

const updateUser = async (req, res) => {
  const userId = new ObjectId(req.params.id);
  const user = {
    user_id: req.body.user_id,
    name: req.body.name,
    email: req.body.email,
    age: req.body.age,
    location: req.body.location
  };
  const response = await mongodb
    .getDb()
    .db()
    .collection('users')
    .replaceOne({ _id: userId }, user);
  console.log(response);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while updating the user.');
  }
};

const deleteUser= async (req, res) => {
  const userId = new ObjectId(req.params.id);
  const response = await mongodb.getDb().db().collection('users').remove({ _id: userId }, true);
  console.log(response);
  if (response.deletedCount > 0) {
    res.status(200).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while deleting the user.');
  }
};

module.exports = {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser
};