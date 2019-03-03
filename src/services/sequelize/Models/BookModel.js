export const BookModel = (sequelize, DataTypes) => {
  const Book = sequelize.define(
    'book',
    {
      first_name: { type: DataTypes.STRING },
      last_name: { type: DataTypes.STRING },
    },
    {
      underscored: true,
      freezeTableName: true,
    }
  )

  Book.associate = function(models) {
    Book.belongsTo(models.author)
  }

  return Book
}
