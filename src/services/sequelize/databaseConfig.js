import Sequelize from 'sequelize'

import databaseCredential from '../../dbCredential'

export const database = new Sequelize(
  'black_and_white',
  databaseCredential.userName,
  databaseCredential.password,
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
  }
)

database
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })
