type httpsOptionsModel = {
    cert?: string,
    key?: string,
    port?: number,
    host?: string,
    prefix?: string
}

export class HttpsOptions {
    private _host = "localhost";
    private _port = 443;
    private _cert = "";
    private _key = "";

    private decoder = new TextDecoder();
    prefix: string;

    constructor( model: httpsOptionsModel ) {

        this.prefix = model.prefix || "HTTPS_SERVER";
        this.host = model.host;
        this.port = model.port;
        this.cert = model.cert;
        this.key = model.key;

        Object.freeze( this );

    }

    set host ( host: string | undefined ) {
        this._host = host || this.getEnv( "HOST" ) || this._host;
    }

    get host (): string {
        return this._host;
    }

    set port ( port: number | undefined ) {
        this._port = port || this.getEnv( "PORT" ) === undefined ? this._port : Number( this.getEnv( "PORT" ) );
    }

    get port (): number {
        return this._port;
    }

    set cert ( certPath: string | undefined ) {
        certPath = certPath || this.getEnv( "CERT_PATH" );
        if ( certPath === undefined ) {
            throw new Error( `certPath was not provided, and env ${this.prefix}_CERT_PATH is undefined` );
        }

        const certFile = Deno.readFileSync( certPath );
        this._cert = this.decoder.decode( certFile );

    }

    get cert () {
        return this._cert;
    }

    set key ( keyPath: string | undefined ) {
        keyPath = keyPath || this.getEnv( "KEY_PATH" );
        if ( keyPath === undefined ) {
            throw new Error( `keyPath was not provided, and env ${this.prefix}_KEY_PATH is undefined` );
        }

        const keyFile = Deno.readFileSync( keyPath );
        this._key = this.decoder.decode( keyFile );
    }

    get key () {
        return this._key;
    }

    private getEnv( env:string ) {
        return Deno.env.get(this.prefix + "_" + env);
    }

}

export class HttpsServer {

    private _port: number;
    private _host: string;
    private controller = new AbortController();
    private onListen = () => {
        console.log(`HTTPS Server started :)`);
    }
    server: Deno.Server

    constructor( { host, port, cert, key }: HttpsOptions, requestHandler: Deno.ServeHandler, errorHandler: () => Response) {
        this._port = port;
        this._host = host;

        const serverOptions = {
            cert,
            key,
            port,
            host,
            signal : this.controller.signal,
            onListen : this.onListen,
            onError : errorHandler
        };

        this.server = Deno.serve( serverOptions, requestHandler );
        
    }

    get port() {
        return this._port;
    }

    get host() {
        return this._host;
    }


    stop( reason?: string) {
        this.controller.abort( reason );
    }
}