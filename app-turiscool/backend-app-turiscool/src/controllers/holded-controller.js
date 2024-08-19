import holded from '@api/holded';

// Create a document
// crear data
let data = {
  "docType": "docType",
  "name": "name",
  "description": "description",
  "status": "status",
  "currency": "currency",
  "language": "language",
  "tags": [
    "tags"
  ],
  "customFields": {
    "customField1": "customField1",
    "customField2": "customField2"
  }
};

holded.auth('API KEY');
holded.createDocument({docType: 'docType'})
  .then(({ data }) => console.log(data))
  .catch(err => console.error(err));
  