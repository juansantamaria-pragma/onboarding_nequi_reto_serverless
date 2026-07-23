'use strict'
/**
 * @module reto_serverless
 * @description OnboardingNequi
 * @author JuanMiguelSantamaríaMúnera <jumsanta@nequi.com>
 * @version 1.0.0
 * @since 2026-07-22
 * @lastModified 2026-07-22
 */

require('dotenv').config()
const srcHandler = require('./src/handler/handler')

exports.handler = async (event, context) => {
  return await srcHandler(event, context)
}
