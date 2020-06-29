var express = require('express');
var exphbs  = require('express-handlebars');
var mercadopago = require('mercadopago');

var app = express();
const port = process.env.PORT || 3000;

mercadopago.configure({
  access_token: 'APP_USR-8058997674329963-062418-89271e2424bb1955bc05b1d7dd0977a8-592190948',
  integrator_id: 'dev_24c65fb163bf11ea96500242ac130004'
});

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', function (req, res) {
  res.render('home');
});

app.get('/detail', function (req, res) {
  const product = {
    title: req.query.title,
    picture_url: req.query.img,
    quantity: parseInt(req.query.unit),
    unit_price: parseFloat(req.query.price),
  };

  const data = { product: product };
  res.render('detail', data);
});

app.post('/purchase', function(req, res) {
  const product = {
    id: '1234',
    title: req.body.title,
    currency_id: 'MXN',
    picture_url: `https://bjardon-mp-ecommerce-nodejs.herokuapp.com/${req.body.picture_url.replace('./', '')}`,
    description: 'Dispositivo móvil de Tienda e-commerce​',
    category_id: 'phones',
    quantity: parseInt(req.body.quantity),
    unit_price: parseFloat(req.body.unit_price),
  };
  
  const preference = {
    items: [ product ],
    payer: {
      name: 'Lalo',
      surname: 'Landa',
      email: 'test_user_58295862@testuser.com',
      phone: {
        area_code: '52',
        number: 5549737300
      },
      address: {
        street_name: 'Insurgentes Sur',
        street_number: 1602,
        zip_code: '0394​0'
      }
    },
    payment_methods: {
      excluded_payment_methods: [
        { id: 'amex' }
      ],
      excluded_payment_types: [
        { id: 'atm' }
      ],
      installments: 6
    },
    external_reference: "bjardon97@gmail.com",
    back_urls: {
      success: 'https://bjardon-mp-ecommerce-nodejs.herokuapp.com/success',
      failure: 'https://bjardon-mp-ecommerce-nodejs.herokuapp.com/failure',
      pending: 'https://bjardon-mp-ecommerce-nodejs.herokuapp.com/pending'
    },
    auto_return: 'approved',
    notification_url: 'https://bjardon-mp-ecommerce-nodejs.herokuapp.com/notificate'
  };

  mercadopago.preferences.create(preference).then((response) => {
    console.log(`The preference_id is: ${response.body.id}`);
    res.redirect(response.body.init_point);
  });
})

app.get('/success', function(req, res) {
  res.render('success', req.query);
});

app.get('/failure', function(req, res) {
  res.render('failure');
});

app.get('/pending', function(req, res) {
  res.render('pending');
});

app.post('/notificate', function(req, res) {
  console.log('Notification received! ---------------------------------');
  console.log(req.body);

  res.sendStatus(200);
});

app.use(express.static('assets'));

app.use('/assets', express.static(__dirname + '/assets'));

app.listen(port);