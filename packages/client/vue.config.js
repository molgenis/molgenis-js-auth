module.exports = {
  // Other options...
  pluginOptions: {
    // Apollo-related options
    apollo: {
      // Enable ESLint for `.gql` files
      lintGQL: true
    }
  },
  devServer: {
    proxy: process.env.NODE_ENV === 'production' ? undefined : {
      '^/login': {
        'target': 'http://localhost:4000'
      },
      '^/logout': {
        'target': 'http://localhost:4000'
      },
      '^/graphql': {
        'target': 'http://localhost:4000'
      }
    }
  }
}
