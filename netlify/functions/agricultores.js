const data = []; // Simulación de una base de datos en memoria

exports.handler = async (event, context) => {
    const { httpMethod, path, body } = event;
    const parts = path.split('/').filter(Boolean);
    const cedula = parts.length > 1 ? parts[1] : null;

    switch (httpMethod) {
        case 'GET':
            if (cedula) {
                const agricultor = data.find(a => a.cedula === cedula);
                return {
                    statusCode: agricultor ? 200 : 404,
                    body: agricultor ? JSON.stringify(agricultor) : JSON.stringify({ message: 'Agricultor no encontrado.' }),
                };
            } else {
                return {
                    statusCode: 200,
                    body: JSON.stringify(data),
                };
            }
        case 'POST':
            try {
                const nuevoAgricultor = JSON.parse(body);
                data.push(nuevoAgricultor);
                return {
                    statusCode: 201,
                    body: JSON.stringify({ message: 'Agricultor agregado correctamente.', agricultor: nuevoAgricultor }),
                };
            } catch (error) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ message: 'Error al procesar la solicitud POST.' }),
                };
            }
        case 'PUT':
            if (!cedula) {
                return { statusCode: 400, body: JSON.stringify({ message: 'Se requiere la cédula para actualizar.' }) };
            }
            try {
                const datosActualizados = JSON.parse(body);
                const index = data.findIndex(a => a.cedula === cedula);
                if (index !== -1) {
                    data[index] = { ...data[index], ...datosActualizados };
                    return {
                        statusCode: 200,
                        body: JSON.stringify({ message: 'Agricultor actualizado correctamente.' }),
                    };
                } else {
                    return { statusCode: 404, body: JSON.stringify({ message: 'Agricultor no encontrado.' }) };
                }
            } catch (error) {
                return { statusCode: 400, body: JSON.stringify({ message: 'Error al procesar la solicitud PUT.' }) };
            }
        case 'DELETE':
            if (!cedula) {
                return { statusCode: 400, body: JSON.stringify({ message: 'Se requiere la cédula para eliminar.' }) };
            }
            const initialLength = data.length;
            data = data.filter(a => a.cedula !== cedula);
            return {
                statusCode: data.length < initialLength ? 200 : 404,
                body: JSON.stringify({ message: data.length < initialLength ? 'Agricultor eliminado correctamente.' : 'Agricultor no encontrado.' }),
            };
        default:
            return {
                statusCode: 405,
                body: JSON.stringify({ message: 'Método no permitido.' }),
            };
    }
};