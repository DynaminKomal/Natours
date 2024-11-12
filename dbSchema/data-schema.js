//user schema

[
    {
        "_id": "ObjectId",
        "firstName": "string",
        "lastName": "string",
        "profileImage": "string",
        "username": "string",
        "email": "string",
        "dob": "date",
        "gender": "string", // or enum
        "mobileNo": "string",
        "countryCode": "string",
        "userType": "string",
        "isActive": "boolean",
        "createdAt": "date",
        "updatedAt": "date"
    }

]

// Movies Schema

[
    {
        "_id": "ObjectId",
        "fullName": "string",
        "originalName": "string",
        "description": "string",
        "summary": "string",
        "imageLink": "string",
        "videoLink": "string",
        "releaseDate": "date",
        "rating": "number",
        "duration": "string",
        "genres": ["string"],
        "actors": ["ObjectId"],
        "createdAt": "date",
        "updatedAt": "date",
        "deletedAt": "date"
    }

]


//Upcoming Movies Schema

[
    {
        "_id": "ObjectId",
        "fullName": "string",
        "originalName": "string",
        "summary": "string",
        "imageLink": "string",
        "trailerLink": "string",
        "releaseDate": "date",
        "duration": "string", // e.g., "1h 30m"
        "genres": ["string"],
        "actors": ["ObjectId"],
        "createdAt": "date",
        "updatedAt": "date",
        "deletedAt": "date"
    }

]


// User Search Schema
[
    {
        "userId": "ObjectId",
        "searchQuery": "string",
        "createdAt": "date",
    }
]


//Actor Schema

[
    {
        "_id": "ObjectId",
        "fullName": "string",
        "biography": "string",
        "profileImage": "string",
        "dateOfBirth": "date",
        "nationality": "string",
        "createdAt": "date",
        "updatedAt": "date",
    }

]


//Review Schema

[
    {
        "userId": "ObjectId",
        "movieId": "ObjectId",
        "rating": "string",
        "comment": "string",
        "createdAt": "date",
        "updatedAt": "date",
    }

]



//Favorite Movies Schema

[
    {
        "userId": "ObjectId",
        "movieId": "ObjectId",
        "createdAt": "date"
    }

]

//Watchlist  Schema

[
    {
        "userId": "ObjectId",
        "movieId": "ObjectId",
        "addedAt": "date"
    }

]