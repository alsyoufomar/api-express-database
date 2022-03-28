# Part 2 Extensions

## Extension 1

Implement the below `PATCH /pets/:id` API method. It should be possible for the user to provide any combination of valid fields to update.

### PUT /pets/:id

Example Request

```sh
curl -X PUT localhost:3030/pets/52 \
-H 'Content-Type: application/json' \
-d '{"age": 41}'
```

Example Response

```json
{
  "pet": {
    "id": 52,
    "name": "Ollie",
    "age": 41,
    "type": "cat",
    "breed": "tabby",
    "microchip": true
  }
}
```

## Extension 2

Implement the below `GET /breeds` API method. This should use the existing data in the pets table. You will need to use `DISTINCT` in your SQL.

### GET /breeds

Return all **unique** pet breeds for a given type.

| Parameter | Value      | Required | Description                                         |
| --------- | ---------- | -------- | --------------------------------------------------- |
| `type`    | Any string | Yes      | Filter breeds to only animals of the specified type |

Example Request

```sh
curl localhost:3030/breeds?type=dog
```

Example Response

```json
{
  "breeds": [
    {
      "breed": "Basset Bleu de Gascogne"
    },
    {
      "breed": "East Siberian Laika"
    },
    {
      "breed": "Slovakian Wirehaired Pointer"
    }
  ]
}
```

## Extension 3

Implement validation so that if the client attempts to:

- `PUT` a pet that does exist
- `PUT` a pet without a required field
- `PATCH` a pet that doesn't exist
- `DELETE` a pet that doesn't exist

An error is returned to the client with a suitable message and HTTP code.

You can implement this logic yourself, or use another library such as [express validator](https://express-validator.github.io/docs/).

## Extension 4

If not already done so, update your code structure to follow the example from Part 1 Extension 2.
