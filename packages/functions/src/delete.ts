import { Table } from "sst/node/table";
import handler from "@sst-guide/core/handler";
import dynamoDb from "@sst-guide/core/dynamodb";
import { CognitoIdentity } from "./types";

export const main = handler(async (event) => {
  const params = {
    TableName: Table.Notes.tableName,
    // 'Key' defines the partition key and sort key of the item to be removed
    Key: {
      userId: (event.requestContext.authorizer.iam.cognitoIdentity as CognitoIdentity).identityId,
      noteId: event.pathParameters.id, // The id of the note from the path
    },
  };

  await dynamoDb.delete(params);

  return { status: true };
});