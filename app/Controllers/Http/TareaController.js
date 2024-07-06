'use strict'


const Proyecto = use('App/Models/Proyecto');
const Tarea = use('App/Models/Tarea');

const AutorizacionService = use('App/Services/AutorizacionService');

class TareaController {
  // Método para obtener todas las tareas de un proyecto
  async index({ auth, request, params }) {
    // Obtener el usuario autenticado
    const user = await auth.getUser();
 
    const { id } = params;
    // Buscar el proyecto por su ID
    const proyecto = await Proyecto.find(id);
  
    AutorizacionService.verificarPermiso(proyecto, user);
    // Retornar todas las tareas del proyecto
    return await proyecto.tareas().fetch();
  }

  // Método para crear una nueva tarea en un proyecto
  async create({ auth, request, params }) {
    // Obtener el usuario autenticado
    const user = await auth.getUser();
    // Obtener la descripción de la tarea desde la solicitud
    const { descripcion } = request.all();
  
    const { id } = params;
    // Buscar el proyecto por su ID
    const proyecto = await Proyecto.find(id);
    // Verificar si el usuario tiene permisos para acceder al proyecto
    AutorizacionService.verificarPermiso(proyecto, user);
    // Crear una nueva instancia de Tarea
    const tarea = new Tarea();
    // Llenar el modelo de tarea con los datos proporcionados
    tarea.fill({
      descripcion
    });
    // Guardar la tarea asociada al proyecto
    await proyecto.tareas().save(tarea);
    // Retornar la tarea creada
    return tarea;
  }

  // Método para actualizar una tarea
  async update({ auth, params, request }) {
    // Obtener el usuario autenticado
    const user = await auth.getUser();
    // Obtener el ID de la tarea desde los parámetros de la solicitud
    const { id } = params;
    // Buscar la tarea por su ID
    const tarea = await Tarea.find(id);
    // Obtener el proyecto al que pertenece la tarea
    const proyecto = await tarea.proyecto().fetch();
    // Verificar si el usuario tiene permisos para acceder al proyecto
    AutorizacionService.verificarPermiso(proyecto, user);
    // Actualizar los datos de la tarea con los proporcionados en la solicitud
    tarea.merge(request.only([
      'descripcion',
      'completada'
    ]));
    // Guardar los cambios en la tarea
    await tarea.save();
    // Retornar la tarea actualizada
    return tarea;
  }

  // Método para eliminar una tarea
  async destroy({ auth, params }) {
    // Obtener el usuario autenticado
    const user = await auth.getUser();
    // Obtener el ID de la tarea desde los parámetros de la solicitud
    const { id } = params;
    // Buscar la tarea por su ID
    const tarea = await Tarea.find(id);
    // Obtener el proyecto al que pertenece la tarea
    const proyecto = await tarea.proyecto().fetch();
    // Verificar si el usuario tiene permisos para acceder al proyecto
    AutorizacionService.verificarPermiso(proyecto, user);
    // Eliminar la tarea
    await tarea.delete();
    // Retornar la tarea eliminada
    return tarea;
  }
}

module.exports = TareaController
