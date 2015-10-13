# Quick start with Elasticsearch [API](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference-2-0.html#api-search-2-0)


#### Create a client [read more](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/quick-start.html)

```
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});
```

### Create or update a document 

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

#### Create document 

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

#### Search 

```client.search([params, [callback]])```

Search with a simple query string query
 
```
client.search({
  index: 'myindex',
  q: 'title:test'
}, function (error, response) {
  // ...
});
```