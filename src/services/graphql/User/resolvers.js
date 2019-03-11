import crypto from 'crypto'

const resolvers = {
  Mutation: {
    signUp: async (_, args) => {
      const hash = crypto.createHash('sha256')

      try {
        const result = await new Promise((resolve, reject) => {
          User.findOrCreate({
            where: {
              email: get('email')(args),
              password: hash.update(get('password')(args)).digest('hex'),
            },
          }).spread((user, created) => {
            return created
              ? resolve(user)
              : reject(new Error('account nay co roi!'))
          })
        })
        return result
      } catch (error) {
        throw error
      }
    },
    login: async (_, args) => {
      const hash = crypto.createHash('sha256')
      try {
        const result = await User.findOne({
          where: {
            email: get('email')(args),
            password: hash.update(get('password')(args)).digest('hex'),
          },
        })
        if (result) {
          return result
        }
      } catch (error) {
        throw new Error('Can not login!')
      }
    },
  },
}

export default resolvers
