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

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const pathName = req.url;

  if (pathName === '/' || pathName === '/overview') {
    res.end('This is the OVERVIEW');
  } else if (pathName === '/product') {
    res.end('This is the PRODUCT');
  } else if (pathName === '/api') {
      res.writeHead(200, { 'Content-type': 'application/json' });
      res.end(data);
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