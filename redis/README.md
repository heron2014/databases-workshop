## What is Redis?

It's a "NoSQL" key-value data store. More precisely, it is a data structure server,
since values can contain ```strings, hashes, lists, sets and sorted sets```

## Installation 

Follow official tutorial [click here](http://redis.io/topics/quickstart)

## When to use Redis? 

1. **Show latest items listings in your home page.** This is a live in-memory cache and is very fast. 
LPUSH is used to insert a content ID at the head of the list stored at a key. 
LTRIM is used to limit the number of items in the list to 5000. 
If the user needs to page beyond this cache only then are they sent to the database.
2. **Deletion and filtering.** If a cached article is deleted it can be removed from the cache using LREM.
3. **Leaderboards and related problems.** A leader board is a set sorted by score. 
The ZADD commands implements this directly and the ZREVRANGE command can be used to get the top 100 users by score and ZRANK can be used to get a users rank. 
Very direct and easy.
4. **Order by user votes and time.** This is a leaderboard like Reddit where the score is formula the changes over time.
LPUSH + LTRIM are used to add an article to a list. A background task polls the list and recomputes the order of the list and 
ZADD is used to populate the list in the new order. This list can be retrieved very fast by even a heavily loaded site. 
This should be easier, the need for the polling code isn't elegant.
5. **Implement expires on items.** To keep a sorted list by time then use unix time as the key. 
The difficult task of expiring items is implemented by indexing current_time+time_to_live. 
Another background worker is used to make queries using ZRANGE ... with SCORES and delete timed out entries.
6. **Counting stuff.** Keeping stats of all kinds is common, say you want to know when to block an IP addresss.
The INCRBY command makes it easy to atomically keep counters; 
GETSET to atomically clear the counter; 
the expire attribute can be used to tell when an key should be deleted.
7. **Unique N items in a given amount of time.** This is the unique visitors problem and can be solved using SADD for each pageview. SADD won't add a member to a set if it already exists.
8. **Real time analysis of what is happening, for stats, anti spam, or whatever.**
Using Redis primitives it's much simpler to implement a spam filtering system or other real-time tracking system.
9. **Pub/Sub. Keeping a map of who is interested in updates to what data is a common task in systems.** Redis has a pub/sub feature 
to make this easy using commands like ```SUBSCRIBE, UNSUBSCRIBE, and PUBLISH.```
10. **Queues.** Queues are everywhere in programming. In addition to the push and pop type commands, 
Redis has blocking queue commands so a program can wait on work being added to the queue by another program. You can also do interesting things implement a rotating queue of RSS feeds to update.
11. **Caching.** Redis can be used in the same manner as memcache.

## Who uses Redis? 

* Instagram uses Redis to run their main feed, activity feed and session store
* Github is using Redis for exception handling and queue management.
* Stack Overflow uses Redis as a caching layer for their entire network.
* Pinterest uses Redis for their follower model, which is their graph of who is following whom.
* Tumblr uses Redis to power dashboard notifications for their tens of millions of 

## Redis data types

### Keys

* it is possible to use any binary sequence as a key from a string like "foo" to the content of a JPEG file.
* The empty string is also a valid key
* Too long keys are not a good idea
* Too short keys are often also not a good idea  ("u:1000:pwd " versus "user:1000:password ")
* Nice idea is to use some kind of schema, like:  ```"object-type:id:field"```

 For instance "object-type:id" is a good idea, as in "user:1000". Dots or dashes are often used for multi-word fields, 
 as in ```"comment:1234:reply.to"``` or ```"comment:1234:reply-to"```

### Strings
* is the simplest type
* since Redis keys are strings, when we use the string type as a value too, we are mapping a string to another string. 

Example: 

1. via redis-cli

* create a key and assign it a value:

```redis>set username tom```

```redis>set server:name anita```

```redis>get username```

```redis>get server:name```

2. via Node-redis

```client.set('framework', 'AngularJS');``` or ```client.set(['framework', 'AngularJS']);```

2a. Retrieve 'framework' key via Node-redis

```
client.get("framework", function(err, reply) {
  // reply is null when the key is missing
  console.log(reply);
}); 
```
##### Other useful strings commands

* ```set connections```
* ```INCR connections``` This increases the value of connections by 1 --> result=11
* ```DECR connections``` This decreases the value of connections by 1

If you want your value to expire after a set period of time, you can use the following:

* ```SET resource:lock "redis Demo"```

* ```EXPIRE resource:lock 120``` This causes resource:lock to be deleted in 120 secs

* ```TTL resource:lock``` This shows you how much time is left before "redis Demo" is deleted from resource:lock 

* You can append to strings with the ```APPEND``` command
* You can use Strings as random access vectors with ```GETRANGE``` and ```SETRANGE```
* ```GETBIT``` and ```SETBIT```
* ```EXISTS mykey```

### Lists

* Collections of strings, sorted by insertion order
* Add elements to a Redis List is:
    - pushing new elements on the head (on the left) or on the tail (on the right) of the list
* Lists are great for: 
    - remembering the latest updates posted by users into a social network
* Format:
    - ```{ 1: A, 2: B, 3: B} or [A, B, B]```

Example: 

1. via Node-redis; the following code creates a list called frameworks and pushes two elements to it

```
client.rpush(['frameworks', 'angularjs', 'backbone'], function(err, reply) {
    console.log(reply); //prints 2
});
```

2. To retrieve the elements of the list you can use the lrange() 

```
client.lrange('frameworks', 0, -1, function(err, reply) {
    console.log(reply); // ['angularjs', 'backbone']
});
```
##### Useful lists commands
* ```RPUSH``` puts the new value at the end of the list e.g. ```RPUSH friends "Alice"```
* Model a timeline in a social network using ```LPUSH``` to add new elements at the start of the list,
*  ```LRANGE``` in order to retrieve recent items
* Use ```LPUSH``` together with ```LTRIM``` to create a list that never exceeds a given number of elements
* ```LLEN``` returns current length of the list
* ```LPOP``` - removes the first element from the list and returns it
* ```RPOP``` - removes the last element from the list and returns it
* ```BLPOP```

### Sets

* Sets are similar to lists, but the difference is that they don’t allow duplicates. 
    So, if you don’t want any duplicate elements in your list you can use a sets
* Sets are great for: 
    - **tracking unique things** Want to know all the **unique IP addresses visiting** a given blog post?
    Simply use ```SADD``` every time you process a page view. You are sure repeated IPs will not be inserted.

    - **representing relations.** You can create a **tagging system** with Redis using a Set to represent every tag. 
    Then you can add all the IDs of all the objects having a given tag into a Set representing this particular tag, using the ```SADD``` command.

* Format: 

```key - { Member *(unique)* }```

Example:

1. via redis-cli

```redis>  SADD myset "Hello"```

``` redis>  SADD myset "World"```

``` 
redis>  SMEMBERS myset
   
   1) "World"
   2) "Hello"
   
```
  
2. The sadd() function creates a new set with the specified elements.

```
client.sadd(['tags', 'angularjs', 'backbonejs', 'emberjs'], function(err, reply) {
    console.log(reply); // 3
});
```

3. To retrieve the members of the set, use the smembers() function

```
client.smembers('tags', function(err, reply) {
    console.log(reply);
});
```

##### Sets commands [full list click here](http://redis.io/commands#set)

* ```SADD``` adds given value to the set e.g. ```SADD superpowers "flight"```
* ```SREM``` removes the given value from the set e.g. ```SREM superpowers "reflexes"```
* ```SISMEMBER``` - tests is the given value is in the set. 1 --> is there. 0--> not there e.g. ```SISMEMBER superpowers "flight"```
* ```SMEMBERS``` returns a list of all the members of this set, e.g. ```SMEMBERS superpowers```
* ```SUNION``` combines 2/more sets and returns the list of all elements e.g. ```SUNION superpowers birdpowers```

### Sorted Sets

* Probably the most advanced Redis data type
* Every member of a Sorted Set is associated with **score**
* **Score** is a floating number value, that is used to **ordered** Sorted Sets, from the smallest to the greatest score 
    - for example: give me the top 10, or the bottom 10
* Uses of Sorted Sets:
    - Type of **leader board (scoreboard)** in a online game, where every time a new score is submitted you update it using ```ZADD```.
    - Sorted Sets are often used in order to **index data that is stored inside Redis**. 
    For instance if you have many hashes representing users, you can use a sorted set with elements having the age of the user as the score and the ID of the user as the value.
* Format :
```Key - { Score (floating point/number) : Member (unique) }```


##### Sorted Sets commands [full list click here](http://redis.io/commands#sorted_set)

* ```ZADD hackers 1940 "Alan Key"``` 1940 is a score 'Alan Key' is a value 
* ```ZADD hackers 1906 "Grace Hopper"```
* ```ZRANGE e.g. ZRANGE 0 1``` --> Grace Hopper, Alan Key

### Hashes

* Many times storing simple values won’t solve your problem. 
You will need to store hashes (objects) in Redis.
* Hashes are great for representing objects, because the number of fields (e.g. ‘name’, ‘surname’, ‘age’) you can put inside a hash are unlimited! 

* Format: 
```Key - { Field: value }```

Example:

1. via Nodis-redis; Below command stores a hash in Redis that maps each technology to its framework.
The first argument to ```hmset()``` is the name of the key. Subsequent arguments represent key-value pairs. 

```
client.hmset('frameworks', 'javascript', 'AngularJS', 'css', 'Bootstrap', 'node', 'Express');
```

or 

```
client.hmset('frameworks', {
    'javascript': 'AngularJS',
    'css': 'Bootstrap',
    'node': 'Express'
})
```

2. Similarly, hgetall() is used to retrieve the value of the key

```
client.hgetall('frameworks', function(err, object) {
    console.log(object);
});
```

**Note that Redis doesn’t support nested objects.
 All the property values in the object will be coerced into strings before getting stored.**
 
##### Hashes commands
* ```HMSET``` can be used to set multiple fields of the hash
* ```HGET``` can be used to retrieve a single field
* ```HMGET``` can be used to return an array of values 

## Useful commands

- run redis-server ```redis-server```

- run redis client ```redis-cli```

- print all keys ```keys *```

- deleting key ``` del key1``` or deleting many keys ```del key1 key2 key3```

- removing all keys from db ``` flushall```


## Using Redis with Node.js

There are three recommended node modules you can install to use with Redis. 

https://www.npmjs.com/package/redis

https://github.com/redis/hiredis-node. (hiredis-node is a Javascript wrapper which allows us to use Javascript syntax on Redis, even though Redis is written in C)

To install redis and hiredis, type: 

```npm install redis hiredis --save```

You can also use ```redis-connection module``` 

https://www.npmjs.com/package/redis-connection


1. Create ```basic.js```

```
var redis  = require("redis");
var client = redis.createClient();

client.set("Hello", "World", redis.print);

client.get("Hello", function(err, reply) {
   // reply is null when the key is missing
   console.log('Hello ' + reply);
});
```

Run your script ```node basic.js```, you should see:

```
$ node basic.js
Reply: OK
Hello World

```
## Mocking and testing Redis [click here](https://github.com/FAC6/book/blob/master/patterns/week5/MockingTestingreadme.md)
## RESOURCES

* [Try Redis](http://try.redis.io/)
* [Redis FAQ](http://redis.io/topics/faq)
* [Redis Data Types Intro](http://redis.io/topics/data-types-intro)
* [Great guide with Redis commands for Node](http://www.sitepoint.com/using-redis-node-js/)
* [An example of using Redis on Github](https://github.com/nelsonic/hits)
* [npm module](https://www.npmjs.com/package/redis)
* [Redis quick start](http://redis.io/topics/quickstart)
* [Redis data types tutorial](https://github.com/FAC6/book/blob/master/patterns/week5/RedisDataFolderStructure.md)
* [dwyl tutorial](https://github.com/docdis/learn-redis)
