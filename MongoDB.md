# MongoDB Administrator Training
---

## Installing MongoDB
---
### Install on Windows
1. Download and run the .msi Windows installer from mongodb.org/downloads.

   By default binaries will be placed in the following directory:
      *C:\Program Files\MongoDB\Server\<VERSION>\bin*

2. Create directories for your database and log files:
   * *C:\data\db*
   * *C:\data\log*

3. Create a configuration file at *C:\Program Files\MongoDB\mongod.cfg* and paste:
      ```
      systemLog:
        destination: file
        path: c:\data\log\mongod.log
      storage:
        dbPath: c:\data\db
      ```

4. Install the MongoDB service:
   ```ssh
   "C:\Program Files\MongoDB\Server\<VERSION>\bin\mongod.exe" --config "C:\Program Files\MongoDB\mongod.cfg" --install
   ```

5. Start / Stop / Restart MongoDB service:
   ```ssh
   net start MongoDB
   net stop MongoDB
   net restart MongoDB
   ```

6. Remove MongoDB service:
   ```ssh
   "C:\Program Files\MongoDB\Server\<VERSION>\bin\mongod.exe" --remove
   ```


## Storage Engine
---

| Storage Engine | Concurrency | Compression |
|----------------|-------------|-------------|
|     MMAPv1     |  Collection |      No     |
|   WiredTiger   |   Document  |      Yes    |

### WiredTiger Compression Option

   * Snappy (default) : less CPU usage and less reduction data size
   * Zlib : greater CPU usage +and greater reduction data size

## Dropping
---
### Dropping Database
Delete :
   * the associated data files from disk, freeing disk space

```javascript
db.dropDatabase()
```

### Dropping Collection
Delete :
   * the collection and all documents,
   * any metadata associated with the collection
   * indexes are one type of metadata removed

```javascript
db.<Collection>.drop()
```

## Query
### Comparison Query Operators
   * **$lt**: Exists and is less than
   * **$lte**: Exists and is less than or equal to
   * **$gt**: Exists and is greater than
   * **$gte**: Exists and is greater than or equal to
   * **$ne**: Does not exist or does but is not equal to
   * **$in**: Exists and is in a set
   * **$nin**: Does not exist or is not in a set

   ```javascript
   db.movies.find( { "imdb_rating" : { $gte : 7 } } )
   ```

### Logical Query Operators
   * **$or**: Match either of two or more values
   * **$not**: Used with other operators
   * **$nor**: Match neither of two or more values
   * **$and**: Match both of two or more values
     * This is the default behavior for queries specifying more than one condition.
     * Use $and if you need to include the same operator more than once in a query.   

   ```javascript
   db.movies.find( { $or : [                                        // or
     { "category" : "sci-fi" }, { "imdb_rating" : { $gte : 7 } }
   ] } )
   db.movies.find( { $or : [                                       // more complex $or, really good sci-fi movie or medicore family movie
     { "category" : "sci-fi", "imdb_rating" : { $gte : 8 } },
     { "category" : "family", "imdb_rating" : { $gte : 7 } }
   ] } )
   db.movies.find( { "imdb_rating" : { $gt : 5 , $lte : 7 } } )    // and is implicit
   db.movies.find( { $and : [                                      // and is explicit
     { $or : [
       { "category" : "sci-fi", "imdb_rating" : { $gte : 8 } },
       { "category" : "family", "imdb_rating" : { $gte : 7 } }
     ] } ,
       { $or : [
       { "category" : "action", "imdb_rating" : { $gte : 6 } }
     ] }
   ] } )
   ```

### Element Query Operators
  * **$exists**: Select documents based on the existence of a particular field.
  * **$type**: Select documents based on their type.

```javascript
db.movies.find( { "budget" : { $exists : true } } )             // exist
db.movies.find( { "budget" : { $type : 1 } } )                  // type 1 is Double
db.movies.find( { "budget" : { $type : 3 } } )                  // type 3 is Object (embedded document)
```

### Array Query Operators
  * **$all**: Array field must contain all values listed.
  * **$size**: Array must have a particular size. E.g., $size : 2 means 2 elements in the array
  * **$elemMatch**: All conditions must be matched by at least one element in the array  

```javascript
db.movies.find( { "category" : { $all : [ "sci-fi", "action" ] } } )  // all
db.movies.find( { "category" : { $size : 3 } } )                      // size
db.movies.find( {                                                     // elemMatch
  "filming_locations" : {
    $elemMatch : {
    "city" : "Florence",
    "country" : "Italy"
    }
  }
} )
```

## CRUD
---
### Creating Document
Syntax:
```javascript
db.<Collection>.insert( { <JsonObject> } )
or
db.<Collection>.insert( [ { <JsonObject> }, { <JsonObject> }, ...], { <Options> } )
```

Examples:
```javascript
db.<Collection>.insert( { "name" : "Mongo" } )                // Implicit _id assignment
db.<Collection>.insert( { "_id" : "Jaws", "year" : 1975 } )   // Assigning _ids
db.<Collection>.insert( [                                     // Ordered Bulk inserts
  { "name" : "Mongo" },
  { "name" : "Couchbase" } ] )
db.<Collection>.insert( [                                     // Unordered Bulk inserts
  { "name" : "Mongo" },
  { "name" : "Couchbase" } ],
  { ordered : false } )

```

### Reading Document
Syntax:
```javascript
db.<Collection>.find( { <Query Criteria> }, { <Projection> } )
```

Examples:
```javascript
db.<Collection>.find()                                          // Read all
db.<Collection>.find( { "year" : 1975 } )                       // Read documents matching with [key, value] = ["year", 1975]
db.<Collection>.find( { "year" : 1975, "..." : ... } )          // Read documents matching with [[key, value], [key, value]] = [["year", 1975], ["...", ...]]
db.<Collection>.find( { "category " : ["action", "comedy" ] } ) // Read documents matching with [key, value] = ["category", ["action", "comedy"]]
db.<Collection>.find( { "box_office.budget" : 14 }              // Read documents matching with [key, value] = ["box_office.budget", 14]
db.<Collection>.find( { } , { "year" : 1, "category" : 1} )     // Read all with projection
```

Cursor Methods :
   * count(): Returns the number of documents in the result set.
   * limit(n): Limits the result set to the number of documents specified.
   * skip(n): Skips the number of documents specified.
   * distinct("field"):

### Deleting Document
Syntax:
```javascript
db.<Collection>.remove( { <Query Criteria> }, { <Options> } )
```

Examples:
```javascript
db.<Collection>.remove()                                      // Error: requires a query document
db.<Collection>.remove( { } )                                 // All documents removed
db.<Collection>.remove( { "years" : 1975 } )                  // Removed all documents matching with the query
db.<Collection>.remove(                                       // Remove the first document matching with the query
  { "years" : 1975 },
  { justOne : true } )
```

### Updating Document
Syntax:
```javascript
db.<Collection>.update( { <Query Criteria (old)> }, { <Query Criteria (new)> }, { <Options> } )
```

Examples:
```javascript

```

Update Operators :
  * **$inc** : Increment a field's value by the specified amount.
  * **$mult** : Multiplies the value of the field by the specified amount.
  * **$rename** : Renames a field.
  * **$set** : Sets the value of a field in a document.
  * **$unset** : Removes the specified field from a document.
  * **$min** : Only updates the field if the specified value is less than the existing field value.
  * **$max** : Only updates the field if the specified value is greater than the existing field value.
  * **$currentDate** : Sets the value of a field to current date, either as a Date or a Timestamp.

Array Operators :
  * **$push** : Appends an element to the end of the array.
  * **$pushAll** : Appends multiple element to the end of the array.
  * **$pop** : Removes the first or last item of an array.
  * **$pull** :
  * **$pullAll** :
  * **$addToSet** :

### Saving Document

## Indexes
---
#### Read/Write Performance

|   Action  | Performance |
|-----------|-------------|
|    Read   |      +      |
|    Write  |      -      |    
|   Update  |      +      |

### Single-Field Indexes
Single-field indexes are based on a single field of the document in a collection.

```javascript
db.tweets.createIndex( { "user.followers_count" : 1 } )         // Create a single-field index on user.followers_count
db.tweets.createIndex(                                          // Create a single-field index with name parameter
  { field_name : 1 },
  { name : "myIndex" } )
db.tweets.createIndex(                                          // Prevent duplicate value
  { field_name : 1 },
  { unique : true } )
db.tweets.createIndex(                                          //
  { field_name : 1 },
  { sparse : true } )
db.tweets.createIndex(                                          // Background index creation in non-blocking
  { "user.followers_count" : 1 },
  { background : true } )
```

### Compound Indexes
Compound indexes are based on more than one field of the document in a collection.

```javascript
db.messages.createIndex( { username : 1, timestamp : 1 }, { name : "myIndex" } )
```

### Multikey Indexes
Multikey indexes in an index on an array. An index entry is created on each value found in the array.

```javascript
db.race_results.createIndex( { "lap_times" : 1 } )              // Same other index
```

## Replica Sets
http://blog.ippon.fr/2014/10/31/bdx-io-mongodb-internals-la-vie-dune-ecriture-et-sa-replication/
http://pcoding.blogspot.fr/2010/09/mongodb-replication-sharding-failover.html

#### Example
1. Since we will be running all nodes on a single machine, make sure each has its own data directory.
```ssh
mkdir -p c:/data/rs{1,2,3}
```

2. Now start 3 instances of mongod in the foreground so that it is easier to observe and shutdown.
```ssh
mongod --replSet myReplSet --dbpath c:/data/rs1 --port 27017 --oplogSize 200 --smallfiles
mongod --replSet myReplSet --dbpath c:/data/rs2 --port 27018 --oplogSize 200 --smallfiles
mongod --replSet myReplSet --dbpath c:/data/rs3 --port 27019 --oplogSize 200 --smallfiles
```

3. Connect to a MongoDB Instance:
```ssh
mongo           // connect to the default port 27017
```

4. Configure the Replica Set:
```
> conf = {
  _id: "<REPLICA-SET-NAME>",
    members: [
      { _id : 0, host : "<HOSTNAME>:27017"},
      { _id : 1, host : "<HOSTNAME>:27018"},
      { _id : 2, host : "<HOSTNAME>:27019",
      "arbiterOnly" : true},
    ]
  }
> rs.initiate(conf)
> rs.status()
```

5. Write to the Primary:
```
db.testcol.insert({ a: 1 })
db.testcol.count()
exit
```

6. Read from a Secondary:
```ssh
mongo --port 27018
```

   ```
   rs.slaveOk()
   db.testcol.find()
   ```

## Exerice
---
### 2.4 Lab : Finding Documents
```javascript
db.scores.find( { "score": { $lt : 65 } } )
db.scores.find( { $or : [ { "kind" : "exam" }, { "kind" : "quiz" } ] } ).count()
db.scores.find().sort( { "score" : -1 } ).limit(1)
db.stories.find( { "shorturl" : { $elemMatch : { "view_count" : { $gt : 1000 } } } } )
db.stories.find( { $or : [ { "topic.name" : "Television" }, { "topic.name" : "videos" } ] } ).skip(5).limit(10)
db.stories.find( { $and : [ { $or : [ { "media" : "news" }, { "media" : "images" } ] }, { "topic.name" : "Comedy" } ] } )
```

### 2.6 Lab : Updating Documents
```javascript
db.scores.update( { "score" : { $gte : 90 } }, { $set : { "grade" : "A" } }, { multi : true } )
db.scores.update( { $and : [ { "score" : { $gte : 80 } },  { "score" : { $lt : 90 } }] }, { $set : { "grade" : "B" } }, { multi : true } )
db.scores.update( { "score" : { $lt : 60 } }, { $inc : { "score" : 10 } }, { multi : true } )
```

### 3.3 Lab : Optimizing an index
```javascript
db.sensor_readings.createIndex( { "tstamp" : 1, "active" : 1 } )
db.sensor_readings.createIndex( { "active" : 1 } )
```

### Replicas - Elections in Failover Scenarios
```
A - Random between

Idée : le lien réseau entre les datacenters est coupé.
B - Not change
C - Le primaire passe secondaire
D - Not change
    Si on perd le 1er datacenter -> il n'y aura pas d'élection sur le 2nd datacentre faute de majorité.
E - Si on perd le 1er datacenter -> soit le primaire reste up, soit l'un des secondaires devient primaire
F - Si on perd le 1er datacenter ->  
```
