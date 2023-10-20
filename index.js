import express from 'express';
import bodyParser from "body-parser";
import axios from 'axios';
import moment from 'moment';

const app = express(); 
const PORT = 3000; 
const apikey= "openuv-5tol7rlnxhk44e-io"
const API_URL="https://api.openuv.io/api/v1/forecast?"

const config= { headers: {
    'x-access-token': apikey
  }}
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public'))

app.listen(PORT, (error) =>{ 
    if(!error) 
        console.log("Server is Successfully Running,and App is listening on port "+ PORT) 
    else 
        console.log("Error occurred, server can't start", error); 
    } 
);


app.get('/', (req, res) => {
    res.render('index.ejs')

  });



  app.post("/get-result", async (req, res) => {
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    const date = req.body.date;
    const id = req.body.id;

function incrementdate(datee) {
 

const dateStr = datee;

// Parse the date string using Moment.js
const date = moment(dateStr, 'YYYY-MM-DD');

// Increment the day by 1
const incrementedDate = date.add(1, 'day');

// Format the incremented date as a string
const incrementedDateStr = incrementedDate.format('YYYY-MM-DD');


return incrementedDateStr
    }

    const finaldate= incrementdate(date);


    console.log(finaldate)
    

    

    try {
      const result = await axios.get(API_URL + `lat=${latitude}&lng=${longitude}&dt=${finaldate}`, config);

      console.log( API_URL + `lat=${latitude}&lng=${longitude}&dt=${finaldate}`)

      const length = Object.keys(result.data.result).length;

      res.render("index.ejs",{ length: length , data: result.data.result } )

     

      

    } 
    catch (error) {
      

      console.log(error.response.data.error)

      if (error.response.data.error === "Date should be in ISO-8601 format")
      {

        res.render('invalid-date.ejs')
      }

      else if (error.response.data.error.message === 'Cast to Number failed for value "NaN" (type string) at path "__QueryCasting__" for model "Ozone"' ){
        res.render('invalid-values.ejs')

      }
    }
  });