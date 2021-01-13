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
    return response.user
  }

  async getApplication(applicationId) {
    const response = await this.get(`application/${applicationId}`)
    return response
  }

  async getRegistration(userId, applicationId) {
    return this.get(`user/registration/${userId}/${applicationId}`)
  }

  async updateRegistration(userId, applicationId, roles) {
    const registration = await this.getRegistration(userId, applicationId)
    return await this.put(`user/registration/${userId}`, {
      registration: {
        ...registration,
        roles,
        applicationId
      }  
    })
  }

  async getApplication(applicationId) {
    const response = await this.get(`application/${applicationId}`)
    return response.application
  }

  async createRole(name, isSuperRole, applicationId) {
    const response = await this.post(`application/${applicationId}/role`,{ role: {name, isSuperRole} })
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