var Redis = require('./redis.js')(process.env.REDIS_URL);

console.log(process.env.REDIS_URL)

Redis.set("Hello2", "World", redis.print);

Redis.get("Hello2", function(err, reply) {
    // reply is null when the key is missing
    console.log('Hello ' + reply);
});
