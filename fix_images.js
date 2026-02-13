const fs = require('fs');
const path = require('path');

const menuPath = path.join(__dirname, 'data', 'menu.json');
const lavaPath = path.join(__dirname, 'public', 'images', 'lava_cake_final.jpg');
const cheesePath = path.join(__dirname, 'public', 'images', 'cheese_final.jpg');

// Function to convert file to base64
const getBase64 = (filePath) => {
    try {
        const fileData = fs.readFileSync(filePath);
        return `data:image/jpeg;base64,${fileData.toString('base64')}`;
    } catch (err) {
        console.error(`Error reading ${filePath}:`, err);
        return null; // Return null if file read fails
    }
};

const lavaBase64 = getBase64(lavaPath);
const cheeseBase64 = getBase64(cheesePath);

const menuData = JSON.parse(fs.readFileSync(menuPath, 'utf8'));

// Update Lava Cake
const lavaCake = menuData.menu.find(item => item.id === 4);
if (lavaCake && lavaBase64) {
    lavaCake.image = lavaBase64;
    console.log('Updated Lava Cake with Base64 image');
}

// Update Cheese Platter
const cheese = menuData.menu.find(item => item.id === 6);
if (cheese && cheeseBase64) {
    cheese.image = cheeseBase64;
    console.log('Updated Cheese Platter with Base64 image');
}

fs.writeFileSync(menuPath, JSON.stringify(menuData, null, 2));
console.log('menu.json has been updated.');
