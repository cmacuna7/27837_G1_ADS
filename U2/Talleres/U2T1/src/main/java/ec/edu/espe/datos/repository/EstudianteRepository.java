package ec.edu.espe.datos.repository;

import ec.edu.espe.datos.model.Estudiante;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * EstudianteRepository - Capa de Acceso a Datos
 * Gestiona las operaciones CRUD utilizando una colección interna (ArrayList)
 * Implementado como Singleton para garantizar una única instancia
 */
public class EstudianteRepository {
    private static EstudianteRepository instance;
    private List<Estudiante> estudiantes;

    /**
     * Constructor privado para patrón Singleton
     */
    private EstudianteRepository() {
        this.estudiantes = new ArrayList<>();
    }

    /**
     * Obtiene la instancia única del repositorio
     * @return Instancia de EstudianteRepository
     */
    public static EstudianteRepository getInstance() {
        if (instance == null) {
            instance = new EstudianteRepository();
        }
        return instance;
    }

    /**
     * Agrega un nuevo estudiante al repositorio
     * @param estudiante Estudiante a agregar
     * @return true si se agregó correctamente, false en caso contrario
     */
    public boolean agregar(Estudiante estudiante) {
        if (estudiante == null || buscarPorId(estudiante.getId()).isPresent()) {
            return false;
        }
        return estudiantes.add(estudiante);
    }

    /**
     * Edita un estudiante existente
     * @param estudiante Estudiante con los datos actualizados
     * @return true si se editó correctamente, false si no existe
     */
    public boolean editar(Estudiante estudiante) {
        if (estudiante == null) {
            return false;
        }
        
        for (int i = 0; i < estudiantes.size(); i++) {
            if (estudiantes.get(i).getId().equals(estudiante.getId())) {
                estudiantes.set(i, estudiante);
                return true;
            }
        }
        return false;
    }

    /**
     * Elimina un estudiante por su ID
     * @param id Identificador del estudiante a eliminar
     * @return true si se eliminó correctamente, false si no existe
     */
    public boolean eliminar(String id) {
        return estudiantes.removeIf(e -> e.getId().equals(id));
    }

    /**
     * Lista todos los estudiantes
     * @return Lista de todos los estudiantes
     */
    public List<Estudiante> listar() {
        return new ArrayList<>(estudiantes);
    }

    /**
     * Busca un estudiante por su ID
     * @param id Identificador del estudiante
     * @return Optional con el estudiante si existe, vacío en caso contrario
     */
    public Optional<Estudiante> buscarPorId(String id) {
        return estudiantes.stream()
                .filter(e -> e.getId().equals(id))
                .findFirst();
    }

    /**
     * Verifica si existe un estudiante con el ID especificado
     * @param id Identificador a verificar
     * @return true si existe, false en caso contrario
     */
    public boolean existePorId(String id) {
        return buscarPorId(id).isPresent();
    }
}
