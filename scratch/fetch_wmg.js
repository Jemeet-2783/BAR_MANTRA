import https from 'https';
import fs from 'fs';

const url = 'https://www.wedmegood.com/profile/Barmantra-1146941/portfolio';

const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9'
  }
};

https.get(url, options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const imgRegex = /https:\/\/image\.wedmegood\.com\/[^\s"'\>\)]+uploads\/member\/1146941\/[^\s"'\>\)]+/g;
    const matches = data.match(imgRegex) || [];
    const cleanUrls = Array.from(new Set(matches)).map(u => {
      // Convert to 1000X high resolution
      return u.replace(/\/resized\/[0-9]+X\//, '/resized/1000X/').replace(/['"\)]+$/, '');
    });
    console.log(`Extracted ${cleanUrls.length} WedMeGood Barmantra portfolio images:`);
    console.log(JSON.stringify(cleanUrls, null, 2));
    fs.writeFileSync('scratch/wmg_urls.json', JSON.stringify(cleanUrls, null, 2));
  });
});
