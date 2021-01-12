const { RESTDataSource } = require('apollo-datasource-rest')

class FusionAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = `${process.env.ISSUER_BASE_URL}api/`
  }

  async searchUsers(queryString) {
    return this.get('user/search', {queryString})
  }

  async getUser(userId) {
    const response = await this.get(`user/${userId}`)
    console.log(response)
    return response.user
  }

  async getApplication(applicationId) {
    const response = await this.get(`application/${applicationId}`)
    return response
  }

  async updateUser(userId, roles) {
    const response = await this.post(`user/`)
  }

  async getRegistration(userId, applicationId) {
    return this.get(`user/registration/${userId}/${applicationId}`)
  }

  async updateRegistration(userId, applicationId, roles) {
    return this.patch(`user/registration/${userId}`, {
      registration: {
        applicationId,
        roles
      }})
  }

  async getApplication(applicationId) {
    const response = await this.get(`application/${applicationId}`)
    return response.application
  }

  async createRole(name, applicationId) {
    const response = await this.post(`application/${applicationId}/role`,{ role: {name} })
    return response.role
  }

  async deleteRole(roleId, applicationId) {
    await this.delete(`application/${applicationId}/role/${roleId}`)
    return roleId
  }

  async register(userId, applicationId) {
    return this.post(`user/registration/${userId}`, {
      registration: {
        applicationId
      }
  })
  }

  async unregister(userId, applicationId) {
    return this.delete(`user/registration/${userId}/${applicationId}`)
  }

  willSendRequest(request) {
    request.headers.set('Authorization', this.context.token)
  }
}

module.exports = FusionAPI