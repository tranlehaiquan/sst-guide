import { APIGatewayProxyEventV2WithIAMAuthorizer } from 'aws-lambda';
import { Table } from "sst/node/table";
import handler from "@sst-guide/core/handler";
import dynamoDb from "@sst-guide/core/dynamodb";
import { CognitoIdentity } from './types';

export const main = handler(async (event: APIGatewayProxyEventV2WithIAMAuthorizer) => {
  if(!event.requestContext.authorizer.iam.cognitoIdentity) {
    throw new Error("Missing Cognito Identity");
  }

  const params = {
    TableName: Table.Notes.tableName,
    // 'Key' defines the partition key and sort key of the item to be retrieved
    Key: {
      userId: (event.requestContext.authorizer.iam.cognitoIdentity as CognitoIdentity).identityId,
      noteId: event.pathParameters?.id, // The id of the note from the path
    },
  };

  const result = await dynamoDb.get(params);
  if (!result.Item) {
    throw new Error("Item not found.");
  }

  // Return the retrieved item
  return result.Item;
});