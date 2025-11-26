package ec.edu.espe.datos.repository.observer;

/**
 * RepositoryObserver - Patrón Observer
 * Define el contrato para los observadores del repositorio
 * Los objetos que implementen esta interfaz serán notificados cuando cambien los datos
 */
public interface RepositoryObserver {
    /**
     * Método llamado cuando los datos del repositorio cambian
     */
    void onDataChanged();
}
