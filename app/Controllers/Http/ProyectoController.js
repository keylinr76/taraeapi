'use strict'

// Importar el modelo de Proyecto
const Proyecto = use('App/Models/Proyecto');
// Importar el servicio de autorización
const AutorizacionService = use('App/Services/AutorizacionService');

class ProyectoController {
 
  async index({ auth }) {
    // Obtener el usuario autenticado
    const user = await auth.getUser();
    // Retornar todos los proyectos del usuario
    return await user.proyectos().fetch();
  }

  // Método para crear un nuevo proyecto
  async create({ auth, request }) {
    // Obtener el usuario autenticado
    const user = await auth.getUser();
  
    const { nombre } = request.all();
    // Crear una nueva instancia de Proyecto
    const proyecto = new Proyecto();
    // Llenar el modelo de proyecto con los datos proporcionados
    proyecto.fill({
      nombre
    });
    // Guardar el proyecto asociado al usuario
    await user.proyectos().save(proyecto);
    // Retornar el proyecto creado
    return proyecto;
  }

  async destroy({ auth, params }) {
    // Obtener el usuario autenticado
    const user = await auth.getUser();
    // Obtener el ID del proyecto desde los parámetros de la solicitud
    const { id } = params;
    // Buscar el proyecto por su ID
    const proyecto = await Proyecto.find(id);
  
    AutorizacionService.verificarPermiso(proyecto, user);
    // Eliminar el proyecto
    await proyecto.delete();
    // Retornar el proyecto eliminado
    return proyecto;
  }

 
  async update ({ auth, params, request}) {
    // Obtener el usuario autenticado
    const user = await auth.getUser();

    const { id } = params;
    // Buscar el proyecto por su ID
    const proyecto = await Proyecto.find(id);
    // Verificar si el usuario tiene permisos para actualizar el proyecto
    AutorizacionService.verificarPermiso(proyecto, user);
 
    proyecto.merge(request.only('nombre'));
    // Guardar los cambios en el proyecto
    await proyecto.save();
 
    return proyecto;
  }
}

module.exports = ProyectoController
