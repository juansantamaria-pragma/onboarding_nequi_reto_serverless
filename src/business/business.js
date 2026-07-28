
const {
  service
} = require('../services/service')

module.exports = async function processBusiness (event) {
  return await callService(event)
}

const callService = async (event) => {
 
  return await service(event)
  
}

