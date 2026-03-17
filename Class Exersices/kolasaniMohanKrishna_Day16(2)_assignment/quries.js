// INDEX CREATION

// Create index on genre
db.Books.createIndex({ genre: 1 });

// Create index on authorId
db.Books.createIndex({ authorId: 1 });

// Create index on ratings score
db.Books.createIndex({ "ratings.score": 1 });

// Show indexes
db.Books.getIndexes();

// Drop index
db.Books.dropIndex({ authorId: 1 });


// AGGREGATION QUERIES

// 1. Average rating per book
db.Books.aggregate([
 { $unwind: "$ratings" },
 {
   $group: {
     _id: "$title",
     avgRating: { $avg: "$ratings.score" }
   }
 }
]);

// 2. Top 3 rated books
db.Books.aggregate([
 { $unwind: "$ratings" },
 {
   $group: {
     _id: "$title",
     avgRating: { $avg: "$ratings.score" }
   }
 },
 { $sort: { avgRating: -1 } },
 { $limit: 3 }
]);

// 3. Books per genre
db.Books.aggregate([
 {
   $group: {
     _id: "$genre",
     totalBooks: { $sum: 1 }
   }
 }
]);

// 4. Authors with more than 2 books
db.Books.aggregate([
 {
   $group: {
     _id: "$authorId",
     totalBooks: { $sum: 1 }
   }
 },
 {
   $match: { totalBooks: { $gt: 2 } }
 }
]);

// 5. Reward points per author
db.Books.aggregate([
 { $unwind: "$ratings" },
 {
   $group: {
     _id: "$authorId",
     totalPoints: { $sum: "$ratings.score" }
   }
 }
]);