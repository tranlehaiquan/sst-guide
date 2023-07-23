import { ApiHandler } from "sst/node/api";

export default function handler(lambda: any) {
  return ApiHandler(async (event, context) => {
    let body, statusCode;

    try {
      // Run the Lambda
      body = await lambda(event, context);
      statusCode = 200;
    } catch (e: any) {
      console.error(e);
      body = { error: e.message };
      statusCode = 500;
    }

    // Return HTTP response
    return {
      statusCode,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };
  });
}