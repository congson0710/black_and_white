import jwt from 'jsonwebtoken'
import fs from 'fs'
import crypto from 'crypto'
import get from 'lodash/fp/get'
import flow from 'lodash/fp/flow'
import isNil from 'lodash/fp/isNil'

import { User } from '../../sequelize'

const resolvers = {
  Mutation: {
    signUp: async (_, args) => {
      const hash = crypto.createHash('sha256')
      const hashPassword = password => hash.update(password).digest('hex')
      const parseSignUpParams = args => ({
        userName: get('userName'),
        password: flow(
          get('password'),
          hashPassword
        ),
        firstName: get('firstName'),
        lastName: get('lastName'),
      })

      try {
        const result = await new Promise((resolve, reject) => {
          User.findOrCreate({
            where: parseSignUpParams(args),
          }).spread((user, created) => {
            if (created) {
              resolve(user)
            }
            reject(new Error('This account already in use!'))
          })
        })
        if (!isNil(result)) {
          return result
        }
      } catch (error) {
        throw error
      }
    },
    login: async (_, args) => {
      const hash = crypto.createHash('sha256')
      const hashPassword = password => hash.update(password).digest('hex')

      try {
        const userName = get('userName')(args)
        const password = get('password')(args)

        const result = await User.findOne({
          where: {
            userName,
            password: hashPassword(password),
          },
        })
        if (!isNil(result)) {
          const prepareJwtPayload = data => ({
            userName: get('userName')(data),
            password: get('password')(data),
          })

          // The readFileSync not works, i dont know why @@
          // will investigate later
          //
          // const privateKey = fs.readFileSync('private.key', 'utf8')
          // const signOptions = {
          //   expiresIn: '1h',
          //   algorithm: 'RS256',
          // }

          const payload = flow(
            get('dataValues'),
            prepareJwtPayload
          )(result)

          const token = jwt.sign(payload, 'shhhhh')
          return {
            token,
            userName: get('dataValues.userName')(result),
          }
        }
      } catch (error) {
        throw new Error('Can not login!')
      }
    },
  },
}

export default resolvers
