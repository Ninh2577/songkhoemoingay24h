const fetch = require('node:fetch');
const url = 'https://ap-south-1.cdn.hygraph.com/content/cmrezpq25018t07walir17znu/master';
const query = '{ baiViets { id title danhmuc } }';
fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query }) })
  .then(res => res.json())
  .then(data => console.log(JSON.stringify(data, null, 2)))
  .catch(console.error);
