package ec.edu.espe.datos.model;

/**
 * Clase Estudiante - Modelo de dominio
 * Representa un estudiante con sus atributos básicos
 */
public class Estudiante {
    private String id;
    private String nombres;
    private int edad;

    /**
     * Constructor vacío
     */
    public Estudiante() {
    }

    /**
     * Constructor con parámetros
     * @param id Identificador único del estudiante
     * @param nombres Nombres completos del estudiante
     * @param edad Edad del estudiante
     */
    public Estudiante(String id, String nombres, int edad) {
        this.id = id;
        this.nombres = nombres;
        this.edad = edad;
    }

    // Getters y Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNombres() {
        return nombres;
    }

    public void setNombres(String nombres) {
        this.nombres = nombres;
    }

    public int getEdad() {
        return edad;
    }

    public void setEdad(int edad) {
        this.edad = edad;
    }

    @Override
    public String toString() {
        return "Estudiante{" +
                "id='" + id + '\'' +
                ", nombres='" + nombres + '\'' +
                ", edad=" + edad +
                '}';
    }
}
