package ec.edu.espe.logica_negocio;

import ec.edu.espe.datos.model.Estudiante;
import ec.edu.espe.datos.repository.EstudianteRepository;
import ec.edu.espe.logica_negocio.validation.*;
import java.util.List;
import java.util.Optional;

/**
 * EstudianteService - Capa de Lógica de Negocio
 * Aplica reglas de negocio y validaciones antes de delegar al repositorio
 * Implementa el patrón Strategy para validaciones
 */
public class EstudianteService {
    private EstudianteRepository repository;
    private ValidationContext validationContext;

    /**
     * Constructor que inicializa el servicio con el repositorio
     */
    public EstudianteService() {
        this.repository = EstudianteRepository.getInstance();
        this.validationContext = new ValidationContext();
        configurarValidaciones();
    }
    
    /**
     * Configura las estrategias de validación
     */
    private void configurarValidaciones() {
        validationContext.addStrategy(new IdValidationStrategy());
        validationContext.addStrategy(new NombresValidationStrategy());
        validationContext.addStrategy(new EdadValidationStrategy());
    }

    /**
     * Agrega un nuevo estudiante aplicando validaciones de negocio
     * @param estudiante Estudiante a agregar
     * @return Mensaje con el resultado de la operación
     */
    public String agregarEstudiante(Estudiante estudiante) {
        // Aplicar todas las estrategias de validación
        String errorValidacion = validationContext.validate(estudiante);
        if (errorValidacion != null) {
            return errorValidacion;
        }

        // Validar que el ID no esté repetido
        if (repository.existePorId(estudiante.getId())) {
            return "Error: Ya existe un estudiante con el ID: " + estudiante.getId();
        }

        // Si todas las validaciones pasan, agregar al repositorio
        boolean resultado = repository.agregar(estudiante);
        if (resultado) {
            return "Estudiante agregado exitosamente";
        } else {
            return "Error al agregar el estudiante";
        }
    }

    /**
     * Edita un estudiante existente aplicando validaciones
     * @param estudiante Estudiante con los datos actualizados
     * @return Mensaje con el resultado de la operación
     */
    public String editarEstudiante(Estudiante estudiante) {
        // Aplicar todas las estrategias de validación
        String errorValidacion = validationContext.validate(estudiante);
        if (errorValidacion != null) {
            return errorValidacion;
        }

        // Validar que el estudiante exista
        if (!repository.existePorId(estudiante.getId())) {
            return "Error: No existe un estudiante con el ID: " + estudiante.getId();
        }

        // Si todas las validaciones pasan, editar en el repositorio
        boolean resultado = repository.editar(estudiante);
        if (resultado) {
            return "Estudiante editado exitosamente";
        } else {
            return "Error al editar el estudiante";
        }
    }

    /**
     * Elimina un estudiante por su ID
     * @param id Identificador del estudiante a eliminar
     * @return Mensaje con el resultado de la operación
     */
    public String eliminarEstudiante(String id) {
        // Validar ID
        if (id == null || id.trim().isEmpty()) {
            return "Error: El ID no puede estar vacío";
        }

        // Validar que el estudiante exista
        if (!repository.existePorId(id)) {
            return "Error: No existe un estudiante con el ID: " + id;
        }

        // Eliminar del repositorio
        boolean resultado = repository.eliminar(id);
        if (resultado) {
            return "Estudiante eliminado exitosamente";
        } else {
            return "Error al eliminar el estudiante";
        }
    }

    /**
     * Lista todos los estudiantes
     * @return Lista de estudiantes
     */
    public List<Estudiante> listarEstudiantes() {
        return repository.listar();
    }

    /**
     * Busca un estudiante por su ID
     * @param id Identificador del estudiante
     * @return Optional con el estudiante si existe
     */
    public Optional<Estudiante> buscarEstudiantePorId(String id) {
        if (id == null || id.trim().isEmpty()) {
            return Optional.empty();
        }
        return repository.buscarPorId(id);
    }
}
