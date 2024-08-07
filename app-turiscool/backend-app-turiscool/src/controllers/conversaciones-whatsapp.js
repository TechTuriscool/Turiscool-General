import { BigQuery } from '@google-cloud/bigquery';
import { fileURLToPath } from 'url';
import path from 'path';

// Obtener la ruta del archivo actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear una instancia de BigQuery utilizando la ruta al archivo de clave JSON
const bigquery = new BigQuery({
  projectId: 'form-satisfaction-ci-cd',
  keyFilename: path.join(__dirname, 'form-satisfaction-ci-cd-6e13b585dfd4.json'), // Actualiza esta ruta a donde se encuentra tu archivo JSON
});

// Definir una ruta que realice una consulta a BigQuery
export const DataDB = async (req, res) => {
  // Escribir tu consulta SQL aquí
  const query = `
    SELECT *
    FROM \`form-satisfaction-ci-cd.WASAPI_DATA.contactos\`
  `;

  try {
    // Ejecutar la consulta
    const [rows] = await bigquery.query({ query });

    // Agrupar los resultados por conversation_id
    const groupedData = rows.reduce((acc, row) => {
      const {
        conversation_id,
        first_name,
        last_name,
        phone,
        email,
        tags,
        message_id,
        type,
        message,
        reactions,
        created_at,
        status
      } = row;

      // Si el conversation_id no existe en el acumulador, lo creamos
      if (!acc[conversation_id]) {
        acc[conversation_id] = {
          first_name,
          last_name,
          phone,
          email,
          tags,
          conversacion: []
        };
      }

      // Añadir el mensaje al array de conversacion
      acc[conversation_id].conversacion.push({
        id: message_id,
        type,
        message,
        reactions,
        created_at: created_at.value, // extraer el valor del campo de fecha
        status
      });

      return acc;
    }, {});

    // Convertir el objeto agrupado en un array
    const result = Object.values(groupedData);

    console.log(result);

    // Enviar los resultados como respuesta
    res.status(200).json(result);
  } catch (error) {
    // Manejar errores
    console.error(error);
    res.status(500).send('Error al realizar la consulta');
  }
};
