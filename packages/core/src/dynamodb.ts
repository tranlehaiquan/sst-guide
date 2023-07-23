import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  PutCommand,
  PutCommandInput,
  GetCommand,
  GetCommandInput,
  QueryCommand,
  QueryCommandInput,
  UpdateCommand,
  UpdateCommandInput,
  DeleteCommand,
  DeleteCommandInput,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

export default {
  put: (params: PutCommandInput) => client.send(new PutCommand(params)),
  get: (params: GetCommandInput) => client.send(new GetCommand(params)),
  query: (params: QueryCommandInput) => client.send(new QueryCommand(params)),
  update: (params: UpdateCommandInput) =>
    client.send(new UpdateCommand(params)),
  delete: (params: DeleteCommandInput) =>
    client.send(new DeleteCommand(params)),
};
