package ec.edu.espe.datos.repository;

import ec.edu.espe.datos.model.Estudiante;
import ec.edu.espe.datos.repository.observer.RepositoryObserver;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * EstudianteRepository - Capa de Acceso a Datos
 * Gestiona las operaciones CRUD utilizando una colección interna (ArrayList)
 * Implementado como Singleton para garantizar una única instancia
 * Implementa el patrón Observer para notificar cambios a los suscriptores
 */
public class EstudianteRepository {
    private static EstudianteRepository instance;
    private List<Estudiante> estudiantes;
    private List<RepositoryObserver> observers;

    /**
     * Constructor privado para patrón Singleton
     */
    private EstudianteRepository() {
        this.estudiantes = new ArrayList<>();
        this.observers = new ArrayList<>();
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
        boolean resultado = estudiantes.add(estudiante);
        if (resultado) {
            notifyObservers(); // Notificar a los observadores
        }
        return resultado;
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
                notifyObservers(); // Notificar a los observadores
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
        boolean resultado = estudiantes.removeIf(e -> e.getId().equals(id));
        if (resultado) {
            notifyObservers(); // Notificar a los observadores
        }
        return resultado;
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
    
    /**
     * Agrega un observador al repositorio
     * @param observer Observador a agregar
     */
    public void addObserver(RepositoryObserver observer) {
        if (observer != null && !observers.contains(observer)) {
            observers.add(observer);
        }
    }
    
    /**
     * Elimina un observador del repositorio
     * @param observer Observador a eliminar
     */
    public void removeObserver(RepositoryObserver observer) {
        observers.remove(observer);
    }
    
    /**
     * Notifica a todos los observadores sobre cambios en los datos
     */
    private void notifyObservers() {
        for (RepositoryObserver observer : observers) {
            observer.onDataChanged();
        }
    }
}
