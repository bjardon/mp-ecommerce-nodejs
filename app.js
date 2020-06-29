var express = require('express');
var exphbs  = require('express-handlebars');
var mercadopago = require('mercadopago');

var app = express();
const port = process.env.PORT || 3000;

mercadopago.configure({access_token: 'APP_USR-8058997674329963-062418-89271e2424bb1955bc05b1d7dd0977a8-592190948'});

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.render('home');
});

app.get('/detail', function (req, res) {
  const product = {
    id: '1234',
    title: req.query.title,
    currency_id: 'MXN',
    picture_url: req.query.img,
    description: 'Dispositivo móvil de Tienda e-commerce​',
    category_id: 'phones',
    quantity: parseInt(req.query.unit),
    unit_price: parseFloat(req.query.price),
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
  };
  
  mercadopago.preferences.create(preference).then((response) => {
    const data = {
      product: product,
      init_point: response.body.init_point
    };

    console.log(response.body);
    
    res.render('detail', data);
  });
});

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
  console.log(req.body);

  res.sendStatus(200);
});

app.use(express.static('assets'));

app.use('/assets', express.static(__dirname + '/assets'));

app.listen(port);