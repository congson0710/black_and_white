import Sequelize from 'Sequelize'
import times from 'lodash/fp/times'

import { database as sequelize } from './databaseConfig'
import { UserModelCreator } from './Models/UserModel'

UserModelCreator(sequelize, Sequelize)

// sequelize.sync({ force: true })

const Author = sequelize.models.author
const Book = sequelize.models.book
const User = sequelize.models.user

export { Author, Book, User }
