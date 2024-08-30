import { BigQuery } from '@google-cloud/bigquery';
import { fileURLToPath } from 'url';
import path from 'path';

// Obtener la ruta del archivo actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const hubspotToken = process.env.HUBSPOT_TOKEN;

// Crear una instancia de BigQuery utilizando la ruta al archivo de clave JSON
const bigquery = new BigQuery({
  projectId: 'form-satisfaction-ci-cd',
  keyFilename: path.join(__dirname, '../config/form-satisfaction-ci-cd-6e13b585dfd4.json'), // Actualiza esta ruta a donde se encuentra tu archivo JSON
});

export const fetchDataFromBigQuery = async (offset = 0, limit = 1000) => {
  const query = `
    SELECT *
    FROM \`form-satisfaction-ci-cd.HUBSPOT.USUARIOS\`
    LIMIT ${limit} OFFSET ${offset}
  `;
  try {
    // Ejecutar la consulta
    const [rows] = await bigquery.query({ query });
    let newData = [];

    // Función para eliminar propiedades nulas o undefined
    const cleanObject = (obj) => {
      for (const key in obj) {
        if (obj[key] === null || obj[key] === undefined) {
          delete obj[key];
        } else if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
          cleanObject(obj[key]); // Recursivamente limpiar objetos anidados
        }
      }
    };

    for (let i = 0; i < rows.length; i++) {
      let data = rows[i].json_contact;
      data = JSON.parse(data);

      // Limpiar el objeto de propiedades nulas
      cleanObject(data);

      newData.push(data);
    }

    //console.log('Datos obtenidos de BigQuery:', newData);
    return newData;
  } catch (error) {
    console.error('Error al obtener datos de BigQuery:', error);
    throw new Error('Error al obtener datos de BigQuery');
  }
};

export const fetchAllData = async () => {
  let allData = [];
  let offset = 0;
  const limit = 1000;
  let moreData = true;

  while (moreData) {
    const data = await fetchDataFromBigQuery(offset, limit);
    allData = allData.concat(data);
    if (data.length < limit) {
      moreData = false; // Si la cantidad de datos devueltos es menor que el límite, no hay más datos
    } else {
      offset += limit; // Incrementa el offset para obtener la siguiente página
    }
  }

  //console.log('Todos los datos obtenidos:', allData);
  return allData;
};

// Uso de la función para obtener todos los datos
fetchAllData().then((allData) => {
  // Aquí puedes procesar o almacenar todos los datos
  //console.log('Cantidad total de registros obtenidos:', allData.length);
}).catch((error) => {
  console.error('Error al obtener todos los datos:', error);
});


export const getUsers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 500; // Obtener el límite de registros desde los query params
    const offset = parseInt(req.query.offset) || 0; // Obtener el offset desde los query params
    const data = await fetchDataFromBigQuery(offset, limit); // Usar los valores de limit y offset
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

// Actualizar un usuario por su ID de contacto en HubSpot
export const updateUser = async (req, res) => {
  const { contactId } = req.params;
  const { properties, originalUser } = req.body;

  console.log('Updating user with properties:', originalUser);

  try {
    const response = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `${hubspotToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ properties })
    });

    if (!response.ok) {
      // HubSpot devuelve un error
      const errorText = await response.text();
      console.error('Error from HubSpot:', errorText);
      return res.status(response.status).json({ error: 'Error updating user in HubSpot', details: errorText });
    }

    // Si la actualización fue exitosa
    updateBigQueryData(originalUser, properties);
    return res.status(204).send(); // No content
  } catch (error) {
    console.error('Error during fetch:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Actualizar la consulta de BigQuery con el originalUser y las propiedades actualizadas
export const updateBigQueryData = async (originalUser, newData) => {
  // Construir las condiciones de búsqueda dinámicamente
  let conditions = `WHERE json_contact LIKE '%${originalUser.contactId}%'`; 

  console.log(newData);
  
  if (originalUser.properties.email) {
    conditions += ` AND json_contact LIKE '%${originalUser.properties.email}%'`;
  }
  if (originalUser.properties.firstname) {
    conditions += ` AND json_contact LIKE '%${originalUser.properties.firstname}%'`;
  }
  if (originalUser.properties.lastname) {
    conditions += ` AND json_contact LIKE '%${originalUser.properties.lastname}%'`;
  }
  if (originalUser.properties.phone) {
    conditions += ` AND json_contact LIKE '%${originalUser.properties.phone}%'`;
  }

  // Construir el query SQL con las condiciones dinámicas
  const query = `
    UPDATE \`form-satisfaction-ci-cd.HUBSPOT.USUARIOS\`
    SET json_contact = '${JSON.stringify({newData})}'
    ${conditions};
  `;

  try {
    //const [job] = await bigquery.createQueryJob({ query });
    console.log('Esperando a que el trabajo de actualización termine...');
    //await job.promise();
    console.log('Datos actualizados en la tabla.');
  } catch (error) {
    console.error('Error al actualizar datos en la tabla:', error);
    throw new Error('Error al actualizar datos en la tabla');
  }
};
