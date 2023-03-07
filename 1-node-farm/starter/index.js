const fs = require('fs');
const http = require('http');
const path = require('path');

// File System

// Blocking Synchronous way

const textInput = fs.readFileSync(path.join(__dirname, 'txt/input.txt'), 'utf-8');

//console.log(textInput);

fs.writeFileSync(path.join(__dirname, 'txt/output.txt'), textInput);


// Non-blocking Asynchronous way

// read file name from start.txt, read text from file name, read text from append.txt, put both text into new file final.txt

fs.readFile(path.join(__dirname, 'txt/start.txt'), 'utf-8', (err, fileName) => {
  //console.log('FILENAME ==>', fileName);
  fs.readFile(path.join(__dirname, `txt/${fileName}.txt`), 'utf-8', (err, data1) => {
    //console.log('DATA1 ==>', data1);
    fs.readFile(path.join(__dirname, 'txt/append.txt'), 'utf-8', (err, data2) => {
      //console.log('DATA2 ==>', data2)
      fs.writeFile(path.join(__dirname, 'txt/final.txt'), `${data1}\n ${data2}`, (err) => {
        //console.log(`ERROR ==>`, err);
      })
    })
  })
})

// Create Server
const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');

  return output
}

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const pathName = req.url;

  // Overview page
  if (pathName === '/' || pathName === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });

    const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');

    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml)
    
    res.end(output);

  // Product page
  } else if (pathName === '/product') {
    res.end('This is the PRODUCT');

  // API
  } else if (pathName === '/api') {
      res.writeHead(200, { 'Content-type': 'application/json' });
      res.end(data);

  // Not found
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world'
    });
    res.end('<h1>Page not found!</h1>');
  }
});

// localhost same as 127.0.0.1
server.listen(3000, 'localhost', () => {
  console.log('Listening to requests on port 3000');
});