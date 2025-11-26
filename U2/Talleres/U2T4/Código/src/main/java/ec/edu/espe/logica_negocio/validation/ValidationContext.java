package ec.edu.espe.logica_negocio.validation;

import ec.edu.espe.datos.model.Estudiante;
import java.util.ArrayList;
import java.util.List;

/**
 * ValidationContext - Contexto para ejecutar múltiples estrategias de validación
 * Permite combinar varias estrategias y validar un estudiante completamente
 */
public class ValidationContext {
    private List<ValidationStrategy> strategies;
    
    public ValidationContext() {
        this.strategies = new ArrayList<>();
    }
    
    /**
     * Agrega una estrategia de validación
     * @param strategy Estrategia a agregar
     */
    public void addStrategy(ValidationStrategy strategy) {
        strategies.add(strategy);
    }
    
    /**
     * Valida un estudiante usando todas las estrategias configuradas
     * @param estudiante Estudiante a validar
     * @return null si todas las validaciones pasan, mensaje de error del primer fallo
     */
    public String validate(Estudiante estudiante) {
        for (ValidationStrategy strategy : strategies) {
            String resultado = strategy.validate(estudiante);
            if (resultado != null) {
                return resultado; // Retorna el primer error encontrado
            }
        }
        return null; // Todas las validaciones pasaron
    }
    
    /**
     * Limpia todas las estrategias
     */
    public void clearStrategies() {
        strategies.clear();
    }
}
