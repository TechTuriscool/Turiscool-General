import { BigQuery } from '@google-cloud/bigquery';
import { fileURLToPath } from 'url';
import path, { parse } from 'path';

// Obtener la ruta del archivo actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const hubspotToken = process.env.HUBSPOT_TOKEN;



// Crear una instancia de BigQuery utilizando la ruta al archivo de clave JSON
const bigquery = new BigQuery({
  projectId: 'form-satisfaction-ci-cd',
  keyFilename: path.join(__dirname, '../config/form-satisfaction-ci-cd-6e13b585dfd4.json'), // Actualiza esta ruta a donde se encuentra tu archivo JSON
});

// Definir una función que realice una consulta a BigQuery y devuelva los datos
export const fetchDataFromBigQuery = async () => {
  const query = `
    SELECT *
    FROM \`form-satisfaction-ci-cd.HUBSPOT.USUARIOS\`
  `;
  try {
    // Ejecutar la consulta
    const [rows] = await bigquery.query({ query });
    let newData = [];
    for (let i = 0; i < rows.length; i++) {
      let data = rows[i].json_contact;
      data = JSON.parse(data);
      newData.push(data);
    }
    console.log('Datos obtenidos de BigQuery:', newData);
    return newData;
  } catch (error) {
    console.error('Error al obtener datos de BigQuery:', error);
    throw new Error('Error al obtener datos de BigQuery');
  }
};

// Controlador de ruta para obtener los datos
export const getUsers = async (req, res) => {
  try {
    const data = await fetchDataFromBigQuery();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send('Error al obtener datos de BigQuery');
  }
};

// Eliminar un usuario por su ID de contacto en HubSpot
export const deleteUser = async (req, res) => {
  const { contactId } = req.params;

  try {
    const response = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `${hubspotToken}`,
        'Content-Type': 'application/json',
      }
    });

    //Eliminar de BIGQUERY]
    /*const query = `DELETE FROM \`form-satisfaction-ci-cd.HUBSPOT.USUARIOS\` WHERE json_contact LIKE '%${contactId}%'`;

    try {
      const [job] = await bigquery.createQueryJob({ query });
      console.log('Esperando a que el trabajo de eliminación termine...');
      await job.promise();
      console.log('Datos eliminados de la tabla.');
    } catch (error) {
      console.error('Error al eliminar datos de la tabla:', error);
      throw new Error('Error al eliminar datos de la tabla');
    }

    if (!response.ok) {
      // HubSpot devuelve un error
      const errorText = await response.text();
      console.error('Error from HubSpot:', errorText);
      return res.status(response.status).json({ error: 'Error deleting user from HubSpot', details: errorText });
    }
    

    // Si la eliminación fue exitosa
    return res.status(204).send(); // No content
   */
  } catch (error) {
    console.error('Error during fetch:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};