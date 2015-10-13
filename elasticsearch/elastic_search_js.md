# [Quick start with Elasticsearch](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/quick-start.html) 

#### Create a client

```
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});
```

#### Send a HEAD request to "/?hello=elasticsearch" and allow up to 1 second for it to complete. 

```js
client.ping({
  // ping usually has a 100ms timeout
  requestTimeout: 1000,

  // undocumented params are appended to the query string
  hello: "elasticsearch!"
}, function (error) {
  if (error) {
    console.trace('elasticsearch cluster is down!');
  } else {
    console.log('All is well');
  }
});
```

### Create or update a document [read more](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference-2-0.html#api-index-2-0)

```client.index([params, [callback]])```

Stores a typed JSON document in an index, making it searchable.
When the id param is not set, a unique id will be auto-generated.

```
client.index({
  index: 'myindex',
  type: 'mytype',
  id: '1',
  body: {
    title: 'Test 1',
    tags: ['y', 'z'],
    published: true,
  }
}, function (error, response) {

});
```
[Index API](https://www.elastic.co/guide/en/elasticsearch/reference/2.0/docs-index_.html) 

#### Create document [read more](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference-2-0.html#api-create-2-0)

```client.create([params, [callback]])```

Adds a typed JSON document in a specific index, making it searchable. 
If a document with the same index, type, and id already exists, an error will occur.

```
client.create({
  index: 'myindex',
  type: 'mytype',
  id: '1',
  body: {
    title: 'Test 1',
    tags: ['y', 'z'],
    published: true,
    published_at: '2013-01-01',
    counter: 1
  }
}, function (error, response) {
  // ...
});
```