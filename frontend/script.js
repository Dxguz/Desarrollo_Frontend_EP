document.addEventListener('DOMContentLoaded', () => {
    const agregarForm = document.getElementById('agregar-agricultor-form');
    const consultarForm = document.getElementById('consultar-agricultor-form');
    const actualizarForm = document.getElementById('actualizar-agricultor-form');
    const eliminarForm = document.getElementById('eliminar-agricultor-form');
    const mostrarRegistroBtn = document.getElementById('mostrar-registro');
    const listaAgricultores = document.getElementById('lista-agricultores');
    const resultadoConsultaDiv = document.getElementById('resultado-consulta');
    const agregarMensajeDiv = document.getElementById('agregar-mensaje');
    const actualizarMensajeDiv = document.getElementById('actualizar-mensaje');
    const eliminarMensajeDiv = document.getElementById('eliminar-mensaje');

    const API_ENDPOINT = '/.netlify/functions/agricultores'; // Endpoint de la función de Netlify

    // --- Funciones de Utilidad ---
    const displayMessage = (element, message, isError = false) => {
        element.textContent = message;
        element.style.color = isError ? 'red' : 'green';
        element.style.display = 'block';
        setTimeout(() => {
            element.style.display = 'none';
        }, 3000);
    };

    const clearForm = (form) => {
        form.querySelectorAll('input[type="text"], input[type="email"], select').forEach(input => {
            input.value = '';
        });
    };

    // --- Agregar Agricultor (POST) ---
    agregarForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(agregarForm);
        const nuevoAgricultor = {
            nombre: formData.get('nombre'),
            cedula: formData.get('cedula'),
            email: formData.get('email'),
            tipo_cultivo: formData.get('tipo_cultivo'),
            municipio: formData.get('municipio')
        };

        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(nuevoAgricultor),
            });

            if (response.ok) {
                const data = await response.json();
                displayMessage(agregarMensajeDiv, data.message || 'Agricultor agregado exitosamente.');
                clearForm(agregarForm);
            } else {
                const error = await response.json();
                displayMessage(agregarMensajeDiv, error.message || 'Error al agregar el agricultor.', true);
            }
        } catch (error) {
            console.error('Error:', error);
            displayMessage(agregarMensajeDiv, 'Error de conexión con el servidor.', true);
        }
    });

    // --- Consultar Agricultor (GET) ---
    consultarForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const cedula = document.getElementById('cedula-consultar').value;

        try {
            const response = await fetch(`${API_ENDPOINT}/${cedula}`, {
                method: 'GET',
            });

            if (response.ok) {
                const agricultor = await response.json();
                resultadoConsultaDiv.innerHTML = `<p><strong>Nombre:</strong> ${agricultor.nombre || 'N/A'}</p>
                                                   <p><strong>Cédula:</strong> ${agricultor.cedula || 'N/A'}</p>
                                                   <p><strong>Email:</strong> ${agricultor.email || 'N/A'}</p>
                                                   <p><strong>Cultivo:</strong> ${agricultor.tipo_cultivo || 'N/A'}</p>
                                                   <p><strong>Municipio:</strong> ${agricultor.municipio || 'N/A'}</p>`;
            } else if (response.status === 404) {
                resultadoConsultaDiv.textContent = 'No se encontró ningún agricultor con esa cédula.';
            } else {
                const error = await response.json();
                resultadoConsultaDiv.textContent = error.message || 'Error al consultar el agricultor.';
            }
        } catch (error) {
            console.error('Error:', error);
            resultadoConsultaDiv.textContent = 'Error de conexión con el servidor.';
        }
    });

    // --- Actualizar Agricultor (PUT) ---
    actualizarForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const cedula = document.getElementById('cedula-actualizar').value;
        const formData = new FormData(actualizarForm);
        const datosActualizados = {};
        if (formData.get('nombre-actualizar')) datosActualizados.nombre = formData.get('nombre-actualizar');
        if (formData.get('email-actualizar')) datosActualizados.email = formData.get('email-actualizar');
        if (formData.get('tipo_cultivo-actualizar')) datosActualizados.tipo_cultivo = formData.get('tipo_cultivo-actualizar');
        if (formData.get('municipio-actualizar')) datosActualizados.municipio = formData.get('municipio-actualizar');

        if (Object.keys(datosActualizados).length === 0) {
            displayMessage(actualizarMensajeDiv, 'Por favor, ingrese al menos un dato para actualizar.', true);
            return;
        }

        try {
            const response = await fetch(`${API_ENDPOINT}/${cedula}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(datosActualizados),
            });

            if (response.ok) {
                const data = await response.json();
                displayMessage(actualizarMensajeDiv, data.message || 'Agricultor actualizado exitosamente.');
                clearForm(actualizarForm);
            } else if (response.status === 404) {
                const error = await response.json();
                displayMessage(actualizarMensajeDiv, error.message || 'No se encontró ningún agricultor con esa cédula.', true);
            } else {
                const error = await response.json();
                displayMessage(actualizarMensajeDiv, error.message || 'Error al actualizar el agricultor.', true);
            }
        } catch (error) {
            console.error('Error:', error);
            displayMessage(actualizarMensajeDiv, 'Error de conexión con el servidor.', true);
        }
    });

    // --- Eliminar Agricultor (DELETE) ---
    eliminarForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const cedula = document.getElementById('cedula-eliminar').value;

        try {
            const response = await fetch(`${API_ENDPOINT}/${cedula}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                const data = await response.json();
                displayMessage(eliminarMensajeDiv, data.message || 'Agricultor eliminado exitosamente.');
                clearForm(eliminarForm);
            } else if (response.status === 404) {
                const error = await response.json();
                displayMessage(eliminarMensajeDiv, error.message || 'No se encontró ningún agricultor con esa cédula.', true);
            } else {
                const error = await response.json();
                displayMessage(eliminarMensajeDiv, error.message || 'Error al eliminar el agricultor.', true);
            }
        } catch (error) {
            console.error('Error:', error);
            displayMessage(eliminarMensajeDiv, 'Error de conexión con el servidor.', true);
        }
    });

    // --- Mostrar Registro de Agricultores (GET all) ---
    mostrarRegistroBtn.addEventListener('click', async () => {
        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'GET',
            });

            if (response.ok) {
                const agricultores = await response.json();
                listaAgricultores.innerHTML = '';
                if (agricultores && agricultores.length > 0) {
                    agricultores.forEach(agricultor => {
                        const listItem = document.createElement('li');
                        listItem.innerHTML = `
                            ${agricultor.nombre} (Cédula: ${agricultor.cedula}) - ${agricultor.municipio}
                            <div class="accion-buttons">
                                <button class="consultar-btn" data-cedula="${agricultor.cedula}">Consultar</button>
                                <button class="eliminar-btn" data-cedula="${agricultor.cedula}">Eliminar</button>
                            </div>
                        `;
                        listaAgricultores.appendChild(listItem);
                    });

                    // Agregar event listeners a los botones dinámicos
                    listaAgricultores.querySelectorAll('.consultar-btn').forEach(button => {
                        button.addEventListener('click', function() {
                            document.getElementById('cedula-consultar').value = this.dataset.cedula;
                            document.getElementById('consultar-agricultor-form').dispatchEvent(new Event('submit'));
                        });
                    });

                    listaAgricultores.querySelectorAll('.eliminar-btn').forEach(button => {
                        button.addEventListener('click', function() {
                            document.getElementById('cedula-eliminar').value = this.dataset.cedula;
                            document.getElementById('eliminar-agricultor-form').dispatchEvent(new Event('submit'));
                        });
                    });

                } else {
                    listaAgricultores.innerHTML = '<p>No hay agricultores registrados.</p>';
                }
            } else {
                const error = await response.json();
                listaAgricultores.innerHTML = `<p class="error-message">${error.message || 'Error al obtener el registro de agricultores.'}</p>`;
            }
        } catch (error) {
            console.error('Error:', error);
            listaAgricultores.innerHTML = '<p class="error-message">Error de conexión con el servidor.</p>';
        }
    });
});