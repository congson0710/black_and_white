import Sequelize from 'Sequelize'
import times from 'lodash/fp/times'

import { database as sequelize } from './databaseConfig'
import { AuthorModel as AuthorModelCreator } from './Models/AuthorModel'
import { BookModel as BookModelCreator } from './Models/BookModel'
import { UserModelCreator } from './Models/UserModel'

const AuthorModel = AuthorModelCreator(sequelize, Sequelize)
const BookModel = BookModelCreator(sequelize, Sequelize)
const UserModel = UserModelCreator(sequelize, Sequelize)

sequelize.sync({ force: true }).then(() => {
  times(() => {
    return AuthorModel.create({
      first_name: casual.first_name,
      last_name: casual.last_name,
    }).then(author => {
      return author.createBook({
        title: casual.title,
        cover_image_url: casual.url,
        average_rating: casual.integer(10, -10),
      })
    })
  })
})

const Author = sequelize.models.author
const Book = sequelize.models.book

export { Author, Book, UserModel }
