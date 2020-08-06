import express from 'express';
import routes from './routes';
import cors from 'cors';

const app = express();
//Each address is a route
//User requisition and response

//Convert of request.body to json
app.use(cors());
app.use(express.json())
app.use(routes);
app.use(routes);
//Comunication between the front-end and back-end
app.listen(3333); //localhost:3333


//GET: Search or list an information
//POST: Create some new information
//PUT: Refresh some information
//DELETE: Delete some information

//Body (Request Body): Data for creating or updating a record
//Route Params: Identify the recourse that i want to refresh or delete
//Query Params: Page, filters, orders EX: http://localhost:3333/users >>>>>>>> ?page=2&sort=name <<<<<<<<