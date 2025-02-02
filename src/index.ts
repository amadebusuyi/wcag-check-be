import app from './app';
import config from './config';

const port = config.port || 3000;
app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);
});
