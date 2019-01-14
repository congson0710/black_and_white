import Sequelize from 'sequelize';
import casual from 'casual';
import times from 'lodash/fp/times';

import dbCredential from './dbCredential';

const db = new Sequelize(
  'black_and_white',
  dbCredential.userName,
  dbCredential.password,
  {
    host: 'localhost',
    dialect: 'postgres',
    operatorsAliases: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
);

db.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// define models
const AuthorModel = db.define('author', {
  first_name: {type: Sequelize.STRING},
  last_name: {type: Sequelize.STRING},
});

const BookModel = db.define('book', {
  title: {type: Sequelize.STRING},
  cover_image_url: {type: Sequelize.STRING},
  average_rating: {type: Sequelize.STRING},
});

// define associations
AuthorModel.hasMany(BookModel);
BookModel.belongsTo(AuthorModel);

// create mock data with a seed, so we always get the same
casual.seed(123);
db.sync({force: true}).then(() => {
  times(() => {
    return AuthorModel.create({
      first_name: casual.first_name,
      last_name: casual.last_name,
    }).then(author => {
      return author.createBook({
        title: casual.title,
        cover_image_url: casual.url,
        average_rating: casual.integer(10, -10),
      });
    });
  });
});

const Author = db.models.author;
const Book = db.models.book;

export {Author, Book};
