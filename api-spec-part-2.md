# Part 2 API spec

Implement the following API methods. For the standard criteria, you do not need to implement any validation. If you implemented the part 1 code structure extension, use the same structure here.

## Books

### PUT /books/:id

Example Request

```sh
curl -X PUT localhost:3030/books/42 \
-H 'Content-Type: application/json' \
-d '{"title": "2312", "type": "Fiction", "author":"Kim Stanley Robinson", "topic":"science fiction","publicationDate":"2020-09-13T01:03:23.774+01:00"}'
```

Example Response

```json
{
  "book": {
    "id": 42,
    "title": "2312",
    "type": "Fiction",
    "author": "Kim Stanley Robinson",
    "topic": "science fiction",
    "publicationDate": "2020-09-13T01:03:23.774+01:00",
    "pages": 300
  }
}
```

### DELETE /books/:id

Example Request

```sh
curl -X DELETE localhost:3030/books/42
```

Example Response

```json
{
  "book": {
    "id": 42,
    "title": "2312",
    "type": "Fiction",
    "author": "Kim Stanley Robinson",
    "topic": "science fiction",
    "publicationDate": "2020-09-13T01:03:23.774+01:00",
    "pages": 300
  }
}
```

## Pets

### PUT /pets/:id

Example Request

```sh
curl -X PUT localhost:3030/pets/52 \
-H 'Content-Type: application/json' \
-d '{"name": "Ollie", "age": 8, "type":"cat", "breed":"tabby","microchip":true}'
```

Example Response

```json
{
  "pet": {
    "id": 52,
    "name": "Ollie",
    "age": 8,
    "type": "cat",
    "breed": "tabby",
    "microchip": true
  }
}
```

### DELETE /pets/:id

Example Request

```sh
curl -X DELETE localhost:3030/pets/50
```

Example Response

```json
{
  "pet": {
    "id": 50,
    "name": "Lenora",
    "age": 3,
    "type": "dog",
    "breed": "Perro de Pastor Mallorqui",
    "microchip": false
  }
}
```
