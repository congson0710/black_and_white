export const UserModelCreator = (sequelize, dataTypes) => {
  const User = sequelize.define('user', {
    user_name: { type: dataTypes.STRING },
    email: { type: dataTypes.STRING },
    password: { type: dataTypes.STRING },
  })

  return User
}
