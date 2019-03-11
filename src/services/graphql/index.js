import { mergeSchemas } from 'graphql-tools'

import { userSchema } from './User'

export default mergeSchemas({
  schemas: [userSchema],
})
