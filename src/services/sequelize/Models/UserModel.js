export const UserModelCreator = (sequelize, dataTypes) => {
  const User = sequelize.define('user', {
    userName: { type: dataTypes.STRING },
    password: { type: dataTypes.STRING },
    firstName: { type: dataTypes.STRING },
    lastName: { type: dataTypes.STRING },
  })

  return User
}
