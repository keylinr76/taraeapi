'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class RecursoNoEncontradoException extends LogicalException {
  /**
   * @param {*} error - El error que se produjo
   * @param {*} ctx - El contexto de la solicitud y la respuesta
   */
  handle (error, { response }) {
    return response.status(404).json({
      error: 'El recurso no existe'
    });
  }
}

module.exports = RecursoNoEncontradoException
