import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import path from 'path';
import { fileURLToPath } from 'url';
import  mysql2  from 'mysql2';
import cors from 'cors';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create the connection pool. The pool-specific settings are the defaults
const poolCon = mysql2.createPool({
  host: "178.32.105.28",
  user: "bekxahzg_me",
  password: "kasaakbeliness",
  database: "bekxahzg_kahina",
  waitForConnections: true,
  connectionLimit: 100,
  //maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  //idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  //queueLimit: 0
});



/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

app.use(cors()); // Allows all origins (for development)
        // Or specific origins:
app.use(cors({ origin: 'http://localhost:4200' }));

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}


app.post('/page-data',(req, res) => {

  //angularApp
  console.log('page-data');

  console.log('dir : ' + __dirname)

  //res.send('page-one');
  //const items1 = [req.cookies.pseudo];
              //const [result1, fields1] = await poolCon.execute('SELECT * FROM Utilisateur WHERE Pseudo = ?', items1);
              poolCon.query("SELECT * FROM Utilisateur "
              , function (err, result, fields) {

                console.log(JSON.stringify(result));

                //res.sendFile(path.resolve('./../angularTest/src/app/page-one/page-one.html'));
                res.json(result);
              });


});






app.get('/page-one',(req, res) => {

      console.log('first-page');
      console.log('dir : ' + __dirname)
      res.sendFile(path.resolve('./src/app/page-one/page-one.html'));

});






app.post('/page-data',(req, res) => {

  //angularApp
  console.log('page-data');

  console.log('dir : ' + __dirname)

  //res.send('page-one');
  //const items1 = [req.cookies.pseudo];
              //const [result1, fields1] = await poolCon.execute('SELECT * FROM Utilisateur WHERE Pseudo = ?', items1);
              poolCon.query("SELECT * FROM Utilisateur "
              , function (err, result, fields) {

                console.log(JSON.stringify(result));

                //res.sendFile(path.resolve('./../angularTest/src/app/page-one/page-one.html'));
                res.json(result);
              });


});






app.get('/page-data',(req, res) => {

  //angularApp
  console.log('page-data');

  console.log('dir : ' + __dirname)

  //res.send('page-one');
  //const items1 = [req.cookies.pseudo];
              //const [result1, fields1] = await poolCon.execute('SELECT * FROM Utilisateur WHERE Pseudo = ?', items1);
              poolCon.query("SELECT * FROM Utilisateur "
              , function (err, result, fields) {

                console.log(JSON.stringify(result));

                //res.sendFile(path.resolve('./../angularTest/src/app/page-one/page-one.html'));
                res.json(result);
              });


});








app.get('/first-page',(req, res) => {

      console.log('first-page');
      console.log('dir : ' + __dirname)
      res.sendFile(path.resolve('./src/app/first-page/first-page.html'));

});



/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
