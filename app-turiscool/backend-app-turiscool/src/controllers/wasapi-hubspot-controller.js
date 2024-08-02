import fetch from 'node-fetch';
import dotenv from 'dotenv';

const hubspotToken = process.env.HUBSPOT_TOKEN;
const wasapiToken = process.env.WASAPI_TOKEN;

const hubspotConfig = {
  baseURL: 'https://api.hubapi.com',
  headers: { 'Authorization': hubspotToken }
};

const getWasapiContacts = async () => {
  let allContacts = [];
  let page = 1;

  try {
    while (true) {
      const response = await fetch(`https://api.wasapi.io/prod/api/v1/contacts?page=${page}`, {
        headers: {
          'Authorization': wasapiToken,
          'Content-Type': 'application/json'
        },
        method: 'GET'
      });

      const data = await response.json();
      if (data.data.data.length === 0) break;

      allContacts = allContacts.concat(data.data.data);
      page++;
      console.log(`Obteniendo página ${page - 1} de contactos de WASAPI...`);
    }

    return allContacts;
  } catch (error) {
    console.error('Error al obtener contactos de WASAPI:', error);
    return [];
  }
};

const getHubspotContacts = async () => {
  let allContacts = [];
  let after = null;
  const limit = 50;

  try {
    while (true) {
      const response = await fetch(`${hubspotConfig.baseURL}/crm/v3/objects/contacts?properties=email,phone&limit=${limit}${after ? `&after=${after}` : ''}`, {
        headers: hubspotConfig.headers
      });
      const data = await response.json();

      for (const contact of data.results) {
        allContacts.push(contact);
      }

      if (!data.paging || !data.paging.next) break;
      after = data.paging.next.after;
    }

    return allContacts;
  } catch (error) {
    console.error('Error al obtener contactos de HubSpot:', error);
    return [];
  }
};

const updateHubspotContact = async (contactId, phone) => {
  try {
    const response = await fetch(`${hubspotConfig.baseURL}/crm/v3/objects/contacts/${contactId}`, {
      method: 'PATCH',
      headers: {
        ...hubspotConfig.headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        properties: { phone: phone }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log(`Contacto ${contactId} actualizado con el número ${phone}`);
  } catch (error) {
    console.error(`Error al actualizar el contacto ${contactId}:`, error);
  }
};

export const updateContacts = async (req, res) => {
  const wasapiContacts = await getWasapiContacts();
  const hubspotContacts = await getHubspotContacts();
  console.log(hubspotContacts.length);

  let numero = 0;
  let contactosActualizados = [];
  console.log(numero);

  let numero2 = 0;
  for (const hubspotContact of hubspotContacts) {
    const email = hubspotContact.properties.email;
    const phone = hubspotContact.properties.phone;

    if (!phone) {
      const matchingWasapiContact = wasapiContacts.find(contact => contact.email === email);

      if (matchingWasapiContact && matchingWasapiContact.phone && email) {
        let phoneWasapi = "+" + matchingWasapiContact.phone;

        console.log("Hubspot ID: ", hubspotContact.id);
        console.log('Telefono de Hubspot:', phone);
        console.log('Telefono de Wasapi:', phoneWasapi);
        console.log(`Correo electrónico coincidente encontrado: ${email}`);

        let contact = {
          hubspotId: hubspotContact.id,
          email: email,
          phone: phoneWasapi
        };

        contactosActualizados.push(contact);

        numero2++;
        await updateHubspotContact(hubspotContact.id, phoneWasapi);
      }
    }
  }

  res.send(contactosActualizados);
};

