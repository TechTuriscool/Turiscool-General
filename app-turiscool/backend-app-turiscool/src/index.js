import app from './app/app.js';
import { init } from './loaders/index.js';
import fileUpload from 'express-fileupload';

const PORT = process.env.PORT || 3000;

app.use(fileUpload());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    }
);

init(app);
