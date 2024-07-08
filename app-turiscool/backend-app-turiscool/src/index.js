import app from './app/app.js';
import { init } from './loaders/index.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    }
);

init(app);
