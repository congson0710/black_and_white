export const AuthorModel = (sequelize, DataTypes) => {
  const Author = sequelize.define(
    'author',
    {
      first_name: { type: DataTypes.STRING },
      last_name: { type: DataTypes.STRING },
    },
    {
      underscored: true,
      freezeTableName: true,
    }
  )

  Author.associate = function(models) {
    Author.hasMany(models.book)
  }

  return Author
}
