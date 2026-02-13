const fs = require('fs');
const path = require('path');
const https = require('https');

const images = [
    { name: 'steak_final.jpg', url: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { name: 'risotto_final.jpg', url: 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { name: 'lobster_final.jpg', url: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { name: 'lava_cake_final.jpg', url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }, // Reliable Chocolate Cake
    { name: 'tiramisu_final.jpg', url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { name: 'cheese_final.jpg', url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }, // Reliable Cheese
    { name: 'wagyu_final.jpg', url: 'https://images.unsplash.com/photo-1558030006-450675393462?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { name: 'sushi_final.jpg', url: 'https://images.unsplash.com/photo-1553621042-f6e147245754?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
];

const downloadImage = (url, filename) => {
    const file = fs.createWriteStream(path.join(__dirname, 'public', 'images', filename));
    const request = https.get(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    }, (response) => {
        if (response.statusCode === 200) {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`Downloaded ${filename}`);
            });
        } else if (response.statusCode === 302 || response.statusCode === 301) {
            // Handle redirects if any (Unsplash sometimes redirects)
            downloadImage(response.headers.location, filename);
        } else {
            console.error(`Failed to download ${filename}: StatusCode ${response.statusCode}`);
            file.close();
            fs.unlink(path.join(__dirname, 'public', 'images', filename), () => { }); // Delete empty file
        }
    }).on('error', (err) => {
        fs.unlink(path.join(__dirname, 'public', 'images', filename), () => { });
        console.error(`Error downloading ${filename}: ${err.message}`);
    });
};

images.forEach(img => downloadImage(img.url, img.name));
