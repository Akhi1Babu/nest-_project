const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

// Set up server-side rendering with EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Load menu data
const menuData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'menu.json'), 'utf8'));
console.log('Loaded Menu Items:', menuData.menu.map(m => m.name));

// Home Page Route
app.get('/', (req, res) => {
  // Pass dynamic title and menu data (for specials section) to the view
  res.render('index', {
    title: 'Saffran | Modern Kinetic Dining',
    specials: menuData.specials
  });
});

// Menu Page Route
app.get('/menu', (req, res) => {
  // Prepare data for rendering
  res.render('menu', {
    title: 'Menu | Saffran',
    menu: menuData.menu
  });
});

// About / Contact Page Route
app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Us | Saffran',
    page: 'about'
  });
});

// Cart Page Route
app.get('/cart', (req, res) => {
  res.render('cart', {
    title: 'My Plate | Saffran',
    page: 'cart'
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
