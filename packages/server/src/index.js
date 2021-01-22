const express = require("express")
const { auth } = require('express-openid-connect')
const morgan = require("morgan")
const apollo = require("./apollo")
const path = require("path")

require("dotenv").config()
const app = express()
app.use(morgan("common"))
app.use(express.json())
app.use(auth({
  required: false,
  authorizationParams: {
    response_type: 'code'
  },
  idpLogout: true
}))

const buildPath = path.resolve(__dirname, '../node_modules/armadillo-auth-ui/dist')
app.use(express.static(buildPath))

apollo.applyMiddleware({ app, cors: {credentials: true, origin: true} })
const port =  process.env.SERVER_PORT || 4000
app.listen(port, () => {
  console.log(`🚀 Listening on port ${port}`)
})