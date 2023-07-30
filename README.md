# HTTPS Server

This project provides a basic HTTPS server setup in Deno. The server configurations can be set using environment variables and/or through the parameters in the `HttpsOptions` model.

## Installation

This project is meant to be used with [Deno](https://deno.land/). Make sure you have Deno installed on your system. If not, you can install it using the instructions found on their [official installation guide](https://deno.land/manual/getting_started/installation).

## Classes

### `HttpsOptions`

This class handles configuration options for setting up the HTTPS server. You can provide the following options:

- `cert` (string): Path to your SSL certificate. This should be provided as a string.
- `key` (string): Path to your SSL key. This should be provided as a string.
- `port` (number): Port number to start the server on. Defaults to 443.
- `host` (string): Host address where the server will be running. Defaults to "localhost".
- `prefix` (string): Prefix for the environment variables. Defaults to "HTTPS_SERVER".

The class fetches the environment variables, SSL certificate and SSL key from the filesystem, and sets up default values if they aren't provided.

### `HttpsServer`

This class initializes the server using the options defined in the `HttpsOptions` class, provides methods for getting the port and host of the server, and includes a `stop()` method for stopping the server.

## Usage

Create a new instance of `HttpsOptions` and provide it with your configurations:

```typescript
const model: httpsOptionsModel = {
    cert: "path/to/your/cert",
    key: "path/to/your/key",
    port: 443,
    host: "localhost",
    prefix: "HTTPS_SERVER"  // your prefix here
};

const httpsOptions = new HttpsOptions( model );
```

Then, create a new instance of `HttpsServer` with the `httpsOptions` instance, a `Deno.ServeHandler` for handling requests, and an `errorHandler`:

```typescript
const requestHandler: Deno.ServeHandler = (req: ServerRequest) => {
    // handle request here
};

const errorHandler: () => Response = () => {
    // handle error here
};

const httpsServer = new HttpsServer(httpsOptions, requestHandler, errorHandler);
```

Finally, start the server:

```typescript
httpsServer.start();
```

## Environment Variables

Environment variables are used to keep sensitive information out of your code. This server can use environment variables to get default values for `host`, `port`, `cert`, and `key` if they are not provided in the `HttpsOptions`. 

If you have set a `prefix` (default is "HTTPS_SERVER"), the server would look for the following environment variables:

- `{prefix}_HOST`
- `{prefix}_PORT`
- `{prefix}_CERT_PATH`
- `{prefix}_KEY_PATH`

To add these to your environment, you can either include them in your system's environment variables or create a `.env` file in your project's root directory and add them there.

## Note

Please make sure you provide the correct SSL certificate and key for your HTTPS server, as they are crucial for maintaining secure connections.

## License

This project is licensed under the [MIT license](LICENSE).