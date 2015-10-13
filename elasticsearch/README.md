# This tutorial aim is to give a taste of what you can do with [Elasticsearch](https://www.elastic.co/) 

## What is ES?
Elasticsearch is a real-time distributed search and analytics engine. It allows you to explore your data at a speed 
and at a scale never before possible. It is used for [full-text search](#text-search), structured search, analytics,
and all three in combination.

## Who is using ES?
Wikipedia, The Guardian, Stack Overflow, GitHub

## What ES can do and why is it so great?
* **perform full-text search**
* **handle synonyms**
* [**score documents by relevance**](#text-search)
* **generate analytics and aggregations from the same data**
* **all above in real time**
 
 Elasticsearch encourages you to explore and utilize your data, rather than letting it rot in a warehouse
 because it is too difficult to query. [read more](https://www.elastic.co/guide/en/elasticsearch/guide/current/intro.html)
 
 Elasticsearch is a different kind of beast, especially if you come from the world of SQL. 
 It's great for : performance, scale, near real-time search, and analytics across massive amounts of data.
 And it is easy to get going!
 
### Installation guide [here](https://www.elastic.co/guide/en/elasticsearch/guide/current/_installing_elasticsearch.html)
### Running ES [here](https://www.elastic.co/guide/en/elasticsearch/guide/current/running-elasticsearch.html)

## Talking to ES

A request to Elasticsearch consists of the same parts as any HTTP request:

```curl -X<VERB> '<PROTOCOL>://<HOST>:<PORT>/<PATH>?<QUERY_STRING>' -d '<BODY>'```

**VERB** - HTTP methods: GET, POST, PUT, HEAD, DELETE

**PROTOCOL** - http or https

**HOST** - The hostname of any node in your Elasticsearch cluster, or localhost for a node on your local machine

**PORT** - default is 9200

**PATH** - API Endpoint (i.e. _count or multiple components, such as _cluster/stats)

**QUERY_STRING**  - Any optional query-string parameters (i.e ?pretty will pretty-print the JSON response)

**BODY** - A JSON-encoded request body

-d  - run it in the background as a daemon.

## Workshop (following the official tutorial [here](https://www.elastic.co/guide/en/elasticsearch/guide/current/_finding_your_feet.html))
Building employer directory with following functionalities:
* Retrieve the full details of any employee

* Allow structured search, such as finding employees over the age of 30

* Allow simple full-text search and more-complex phrase searches

* Return highlighted search snippets from the text in the matching documents

* Enable management to build analytic dashboards over the data 

### Guide to workshop
* [How to store data in ES based on our example above](#store)
* [ES versus Relational DB](#es-versus-rel)
* [Difference between Index(noun) and Index (verb)](#index-differ)
* [Index a document](#indexDoc)
* [Retrieve a document](#retrieve)
* [Basic search (_search endpoint)](#basic-search)
* [Query-string search](#query-string)
* [Search with query DSL](#queryDSL)
* [More complicated searches](#complicated)
* [Full text search](#text-search)
* [Phrase search](#phrase)
* [Highlighting our searches](#highlight)
* [Analytics](#analytics)

<a name="store"/>
#### How to store data in ES based on our example above
Storing data in Elasticsearch is called indexing (Index a document  === Store a document ) 

Document represent a single employee (in our example)

Documents belongs to => types => types lives in index.

<a name="es-versus-rel"/>
#### ES versus Relational DB
<span style="background-color:#E1E0EA">
**Relational DB  ⇒ Databases ⇒ Tables ⇒ Rows      ⇒ Columns**
</span>

<span style="background-color:#E1E0EA">
**Elasticsearch  ⇒ Indices   ⇒ Types  ⇒ Documents ⇒ Fields**
</span>

**An Elasticsearch cluster can contain multiple indices (databases), which in turn contain multiple types (tables). 
These types hold multiple documents (rows), and each document has multiple fields (columns).**

<a name="index-differ"/>
#### Difference between Index(noun) and Index (verb)
**Index(noun)** is like a database in a traditional relational database. It is the place to store related documents. 
Plural – indices or indexes.

**Index(verb)** is used to store a document in an index (noun) so that it can be retrieved and queried. 
It is much like the INSERT keyword in SQL. 

<a name="indexDoc"/>
### Index a document
* Index a document per employee, with all the details of a single employee
* Each document will be of type employee
* That type will live in the megacorp index
* That index will reside within our ES cluster

```
PUT /megacorp/employee/1
{
    "first_name" : "John",
    "last_name" :  "Smith",
    "age" :        25,
    "about" :      "I love to go rock climbing",
    "interests": [ "sports", "music" ]
}
```

Using curl :

```
curl -XPUT "http://localhost:9200/megacorp/employee/1" -d'
{
    "first_name" : "John",
    "last_name" :  "Smith",
    "age" :        25,
    "about" :      "I love to go rock climbing",
    "interests": [ "sports", "music" ]
}'
```

megacorp - index

document - single employee details

employee - type

1 - id

<a name="retrieve"/>
#### Retrieve a document
```GET /megacorp/employee/1```

or using curl:

```curl -XGET "http://localhost:9200/megacorp/employee/1"```

response: 

```json
{
   "_index": "megacorp",
   "_type": "employee",
   "_id": "1",
   "_version": 1,
   "found": true,
   "_source": {
      "first_name": "John",
      "last_name": "Smith",
      "age": 25,
      "about": "I love to go rock climbing",
      "interests": [
         "sports",
         "music"
      ]
   }
}
```

#### Search 

<a name="basic-search"/>
##### Basic search (_search endpoint)

```GET /megacorp/employee/_search```

using curl :

```curl -XGET "http://localhost:9200/megacorp/employee/_search"```

We use index/type/_search endpoint. By default, a search will return the top 10 results in hits array.

Note! The response not only tells us which documents matched, but also includes the whole document itself. 

[See full response object](https://www.elastic.co/guide/en/elasticsearch/guide/current/_search_lite.html)

<a name="query-string"/>
##### Query-string search

Search for all employees in the megacorp index who have "Smith" in the last_name field.
   
```GET /megacorp/employee/_search?q=last_name:Smith```

<a name="queryDSL"/>
##### Search with query DSL [read more](https://www.elastic.co/guide/en/elasticsearch/guide/current/_search_with_query_dsl.html)

Elasticsearch provides a rich, flexible, query language called the query DSL,
which allows us to build much more complicated, robust queries.

Same query as above, but using the Query DSL

```
GET /megacorp/employee/_search
{
  "query": {
    "match": {
      "last_name": "smith"
    }
  }
}
```

using curl:

```
curl -XGET "http://localhost:9200/megacorp/employee/_search" -d'
{
  "query": {
    "match": {
      "last_name": "smith"
    }
  }
}'
```

**What is a difference?**

For one, we are no longer using query-string parameters, but instead a request body. 
This request body is built with JSON, and uses a match query.

<a name="complicated"/>
#### More complicated searches

Find all employees whose "last_name" is Smith and who are older than 30.

```
GET /megacorp/employee/_search
{
    "query" : {
        "filtered" : {
            "filter" : {
                "range" : {
                    "age" : { "gt" : 30 }
                }
            },
            "query" : {
                "match" : {
                    "last_name" : "smith"
                }
            }
        }
    }
}
```

We added `filter` that performs `range` search. `gt` - stands for `greater than`. We used the same match query as before.

<a name="text-search"/>
#### Full text search (Es is great with text search where traditional databases are really struggle with)


Find all employees who enjoy "rock climbing"

```
GET /megacorp/employee/_search
{
    "query" : {
        "match" : {
            "about" : "rock climbing"
        }
    }
}
```

By default ES sorts matching results by their **relevance score**. The first and highest-scoring result is:

when, i.e John Smith’s about field clearly says “rock climbing” in it;

second result could be:

when, i.e Jane's about field only mention "rock"

**Conclusion:**

**Because only “rock” was mentioned, and not “climbing,” her _score is lower than John’s.**

**Elasticsearch can search within full-text fields and return the most relevant results first.**

**This concept is completely foreign to traditional relational databases, in which a record either matches or it doesn’t.**

<a name="phrase"/>
#### Phrase search

Find all employees who enjoy "rock climbing"

```
GET /megacorp/employee/_search
{
    "query" : {
        "match_phrase" : {
            "about" : "rock climbing"
        }
    }
}
```
<a name="highlight"/>
#### Highlighting our searches [read more](https://www.elastic.co/guide/en/elasticsearch/guide/current/highlighting-intro.html)

Find all employees who enjoy "rock climbing" and highlight the matches.

```
GET /megacorp/employee/_search
{
    "query" : {
        "match_phrase" : {
            "about" : "rock climbing"
        }
    },
    "highlight": {
        "fields" : {
            "about" : {}
        }
    }
}
```
<a name="analytics"/>
#### Analytics [read more](https://www.elastic.co/guide/en/elasticsearch/guide/current/_analytics.html)

 Elasticsearch has functionality called aggregations, which allow you to generate sophisticated analytics over your data.
 It is similar to GROUP BY in SQL, but much more powerful.
 
 Calculate the most popular interests for all employees
 
 ```
 GET /megacorp/employee/_search
 {
   "aggs": {
     "all_interests": {
       "terms": {
         "field": "interests"
       }
     }
   }
 }
 ```
 
Calculate the most popular interests for employees named "Smith"


```
 GET /megacorp/employee/_search
 {
   "query": {
     "match": {
       "last_name": "smith"
     }
   },
   "aggs": {
     "all_interests": {
       "terms": {
         "field": "interests"
       }
     }
   }
 }
 ```

