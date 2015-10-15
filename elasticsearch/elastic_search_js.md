## Using Elasticsearch with Nodejs

1. Create a javascript file eg. es.js  

2. In the es.js file:
 - require elasticsearch
 - create client
 - export client 
 
```
var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

module.exports = client;
```
[Read more](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/quick-start.html)

3. Create or update a document

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

index - name of your database (i.e. blog)

type - name of yur document (i.e. posts)

body - could be any field that you wish (i.e. title, description, date etc...)

[Index API](https://www.elastic.co/guide/en/elasticsearch/reference/2.0/docs-index_.html) 

Basic example with Hapi framework  

![create](https://github.com/heron2014/databases-workshop/blob/master/elasticsearch/img/create.png)

4. Basic search 

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

5. Remember to run elasticsearch on another terminal


#### If you prefer more visual effects add Sense extension for ES to Chrome

What is [Sense](https://www.elastic.co/blog/found-sense-a-cool-json-aware-interface-to-elasticsearch)?  

GUI for ES looks like this:

![gui](https://github.com/heron2014/databases-workshop/blob/master/elasticsearch/img/overlook.png)

Follow these simple steps to install Gui plugin: 

* stop your server
* navigate to your installation directory and then to /bin
  * ```elasticsearch1.7.4/bin/plugin -install mobz/elasticsearch-head``` 
* run your server
* ```open http://localhost:9200/_plugin/head/```

[More about GUI here](https://github.com/mobz/elasticsearch-head)

### RESOURCES:

* Official [API](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference-2-0.html#api-search-2-0)
* ElasticSearch Node.js client [esta](https://github.com/dwyl/esta)
