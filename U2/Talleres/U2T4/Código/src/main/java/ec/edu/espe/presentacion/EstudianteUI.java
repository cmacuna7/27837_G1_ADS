package ec.edu.espe.presentacion;

import ec.edu.espe.datos.model.Estudiante;
import ec.edu.espe.datos.repository.EstudianteRepository;
import ec.edu.espe.datos.repository.observer.RepositoryObserver;
import ec.edu.espe.logica_negocio.EstudianteService;
import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.util.List;

/**
 * EstudianteUI - Capa de Presentación (Vista y Controlador)
 * Interfaz gráfica para la gestión de estudiantes
 * Implementa el patrón Observer para actualizaciones automáticas
 */
public class EstudianteUI extends JFrame implements RepositoryObserver {
    private EstudianteService service;
    
    // Componentes del formulario
    private JTextField txtId;
    private JTextField txtNombres;
    private JTextField txtEdad;
    
    // Botones CRUD
    private JButton btnGuardar;
    private JButton btnEditar;
    private JButton btnEliminar;
    private JButton btnNuevo;
    
    // Tabla para mostrar estudiantes
    private JTable tableEstudiantes;
    private DefaultTableModel tableModel;
    
    /**
     * Constructor que inicializa la interfaz
     */
    public EstudianteUI() {
        this.service = new EstudianteService();
        
        // Registrar esta UI como observador del repositorio
        EstudianteRepository.getInstance().addObserver(this);
        
        initComponents();
        actualizarTabla();
    }
    
    /**
     * Implementación del patrón Observer
     * Este método es llamado automáticamente cuando cambian los datos en el repositorio
     */
    @Override
    public void onDataChanged() {
        // Actualizar la tabla automáticamente cuando hay cambios
        SwingUtilities.invokeLater(() -> actualizarTabla());
    }
    
    /**
     * Inicializa y configura los componentes de la interfaz
     */
    private void initComponents() {
        setTitle("Gestión de Estudiantes - CRUD");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(800, 600);
        setLocationRelativeTo(null);
        setLayout(new BorderLayout(10, 10));
        
        // Panel superior con el formulario
        JPanel panelFormulario = crearPanelFormulario();
        add(panelFormulario, BorderLayout.NORTH);
        
        // Panel central con la tabla
        JPanel panelTabla = crearPanelTabla();
        add(panelTabla, BorderLayout.CENTER);
        
        // Panel inferior con los botones
        JPanel panelBotones = crearPanelBotones();
        add(panelBotones, BorderLayout.SOUTH);
    }
    
    /**
     * Crea el panel del formulario con los campos de entrada
     */
    private JPanel crearPanelFormulario() {
        JPanel panel = new JPanel();
        panel.setBorder(BorderFactory.createTitledBorder("Datos del Estudiante"));
        panel.setLayout(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(5, 5, 5, 5);
        gbc.fill = GridBagConstraints.HORIZONTAL;
        
        // Campo ID
        gbc.gridx = 0;
        gbc.gridy = 0;
        panel.add(new JLabel("ID:"), gbc);
        
        gbc.gridx = 1;
        txtId = new JTextField(20);
        panel.add(txtId, gbc);
        
        // Campo Nombres
        gbc.gridx = 0;
        gbc.gridy = 1;
        panel.add(new JLabel("Nombres:"), gbc);
        
        gbc.gridx = 1;
        txtNombres = new JTextField(20);
        panel.add(txtNombres, gbc);
        
        // Campo Edad
        gbc.gridx = 0;
        gbc.gridy = 2;
        panel.add(new JLabel("Edad:"), gbc);
        
        gbc.gridx = 1;
        txtEdad = new JTextField(20);
        panel.add(txtEdad, gbc);
        
        return panel;
    }
    
    /**
     * Crea el panel con la tabla de estudiantes
     */
    private JPanel crearPanelTabla() {
        JPanel panel = new JPanel(new BorderLayout());
        panel.setBorder(BorderFactory.createTitledBorder("Lista de Estudiantes"));
        
        // Crear modelo de tabla
        String[] columnas = {"ID", "Nombres", "Edad"};
        tableModel = new DefaultTableModel(columnas, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false; // Hacer la tabla no editable
            }
        };
        
        // Crear tabla
        tableEstudiantes = new JTable(tableModel);
        tableEstudiantes.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        
        // Agregar listener para selección de filas
        tableEstudiantes.getSelectionModel().addListSelectionListener(e -> {
            if (!e.getValueIsAdjusting()) {
                cargarEstudianteSeleccionado();
            }
        });
        
        JScrollPane scrollPane = new JScrollPane(tableEstudiantes);
        panel.add(scrollPane, BorderLayout.CENTER);
        
        return panel;
    }
    
    /**
     * Crea el panel con los botones de acción
     */
    private JPanel crearPanelBotones() {
        JPanel panel = new JPanel(new FlowLayout(FlowLayout.CENTER, 10, 10));
        
        // Botón Nuevo
        btnNuevo = new JButton("Nuevo");
        btnNuevo.addActionListener(e -> limpiarFormulario());
        panel.add(btnNuevo);
        
        // Botón Guardar
        btnGuardar = new JButton("Guardar");
        btnGuardar.addActionListener(e -> guardarEstudiante());
        panel.add(btnGuardar);
        
        // Botón Editar
        btnEditar = new JButton("Editar");
        btnEditar.addActionListener(e -> editarEstudiante());
        panel.add(btnEditar);
        
        // Botón Eliminar
        btnEliminar = new JButton("Eliminar");
        btnEliminar.addActionListener(e -> eliminarEstudiante());
        panel.add(btnEliminar);
        
        return panel;
    }
    
    /**
     * Guarda un nuevo estudiante
     */
    private void guardarEstudiante() {
        try {
            // Obtener datos del formulario
            String id = txtId.getText().trim();
            String nombres = txtNombres.getText().trim();
            int edad = Integer.parseInt(txtEdad.getText().trim());
            
            // Crear estudiante
            Estudiante estudiante = new Estudiante(id, nombres, edad);
            
            // Llamar al servicio
            String resultado = service.agregarEstudiante(estudiante);
            
            // Mostrar resultado
            if (resultado.contains("exitosamente")) {
                JOptionPane.showMessageDialog(this, resultado, "Éxito", JOptionPane.INFORMATION_MESSAGE);
                limpiarFormulario();
                // La tabla se actualiza automáticamente vía Observer
            } else {
                JOptionPane.showMessageDialog(this, resultado, "Error", JOptionPane.ERROR_MESSAGE);
            }
        } catch (NumberFormatException ex) {
            JOptionPane.showMessageDialog(this, "Error: La edad debe ser un número válido", "Error", JOptionPane.ERROR_MESSAGE);
        }
    }
    
    /**
     * Edita un estudiante existente
     */
    private void editarEstudiante() {
        try {
            // Obtener datos del formulario
            String id = txtId.getText().trim();
            String nombres = txtNombres.getText().trim();
            int edad = Integer.parseInt(txtEdad.getText().trim());
            
            // Crear estudiante
            Estudiante estudiante = new Estudiante(id, nombres, edad);
            
            // Llamar al servicio
            String resultado = service.editarEstudiante(estudiante);
            
            // Mostrar resultado
            if (resultado.contains("exitosamente")) {
                JOptionPane.showMessageDialog(this, resultado, "Éxito", JOptionPane.INFORMATION_MESSAGE);
                limpiarFormulario();
                // La tabla se actualiza automáticamente vía Observer
            } else {
                JOptionPane.showMessageDialog(this, resultado, "Error", JOptionPane.ERROR_MESSAGE);
            }
        } catch (NumberFormatException ex) {
            JOptionPane.showMessageDialog(this, "Error: La edad debe ser un número válido", "Error", JOptionPane.ERROR_MESSAGE);
        }
    }
    
    /**
     * Elimina un estudiante
     */
    private void eliminarEstudiante() {
        String id = txtId.getText().trim();
        
        if (id.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Debe seleccionar un estudiante para eliminar", "Advertencia", JOptionPane.WARNING_MESSAGE);
            return;
        }
        
        // Confirmar eliminación
        int confirmacion = JOptionPane.showConfirmDialog(this, 
                "¿Está seguro de eliminar el estudiante con ID: " + id + "?", 
                "Confirmar eliminación", 
                JOptionPane.YES_NO_OPTION);
        
        if (confirmacion == JOptionPane.YES_OPTION) {
            String resultado = service.eliminarEstudiante(id);
            
            if (resultado.contains("exitosamente")) {
                JOptionPane.showMessageDialog(this, resultado, "Éxito", JOptionPane.INFORMATION_MESSAGE);
                limpiarFormulario();
                // La tabla se actualiza automáticamente vía Observer
            } else {
                JOptionPane.showMessageDialog(this, resultado, "Error", JOptionPane.ERROR_MESSAGE);
            }
        }
    }
    
    /**
     * Actualiza la tabla con los datos del servicio
     */
    private void actualizarTabla() {
        // Limpiar tabla
        tableModel.setRowCount(0);
        
        // Obtener estudiantes del servicio
        List<Estudiante> estudiantes = service.listarEstudiantes();
        
        // Agregar estudiantes a la tabla
        for (Estudiante estudiante : estudiantes) {
            Object[] fila = {
                estudiante.getId(),
                estudiante.getNombres(),
                estudiante.getEdad()
            };
            tableModel.addRow(fila);
        }
    }
    
    /**
     * Carga los datos del estudiante seleccionado en el formulario
     */
    private void cargarEstudianteSeleccionado() {
        int filaSeleccionada = tableEstudiantes.getSelectedRow();
        
        if (filaSeleccionada >= 0) {
            txtId.setText(tableModel.getValueAt(filaSeleccionada, 0).toString());
            txtNombres.setText(tableModel.getValueAt(filaSeleccionada, 1).toString());
            txtEdad.setText(tableModel.getValueAt(filaSeleccionada, 2).toString());
            
            // Deshabilitar el campo ID al cargar un estudiante
            txtId.setEnabled(false);
        }
    }
    
    /**
     * Limpia el formulario
     */
    private void limpiarFormulario() {
        txtId.setText("");
        txtNombres.setText("");
        txtEdad.setText("");
        txtId.setEnabled(true);
        tableEstudiantes.clearSelection();
    }
}
