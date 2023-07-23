import { APIGatewayProxyEvent } from 'aws-lambda';
import * as uuid from "uuid";
import handler from "@sst-guide/core/handler";
import dynamodb from "@sst-guide/core/dynamodb";
import { Table } from 'sst/node/table';

export const main = handler(async (event: APIGatewayProxyEvent) => {
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body || "{}");

  const params = {
    TableName: Table.Notes.tableName,
    Item: {
      // The attributes of the item to be created
      userId: "123", // The id of the author
      noteId: uuid.v1(), // A unique uuid
      content: data.content, // Parsed from request body
      attachment: data.attachment, // Parsed from request body
      createdAt: Date.now(), // Current Unix timestamp
    },
  };

  await dynamodb.put(params);

  return params.Item;
});
