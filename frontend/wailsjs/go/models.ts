export namespace client {
  export class Response {
    Status: string;
    StatusCode: number;
    Proto: string;
    ProtoMajor: number;
    ProtoMinor: number;
    Header: Record<string, string[]>;
    Body: any;
    ContentLength: number;
    TransferEncoding: string[];
    Close: boolean;
    Uncompressed: boolean;
    Trailer: Record<string, string[]>;
    // Go type: http
    Request?: any;
    // Go type: tls
    TLS?: any;

    static createFrom(source: any = {}) {
      return new Response(source);
    }

    constructor(source: any = {}) {
      if ("string" === typeof source) source = JSON.parse(source);
      this.Status = source["Status"];
      this.StatusCode = source["StatusCode"];
      this.Proto = source["Proto"];
      this.ProtoMajor = source["ProtoMajor"];
      this.ProtoMinor = source["ProtoMinor"];
      this.Header = source["Header"];
      this.Body = source["Body"];
      this.ContentLength = source["ContentLength"];
      this.TransferEncoding = source["TransferEncoding"];
      this.Close = source["Close"];
      this.Uncompressed = source["Uncompressed"];
      this.Trailer = source["Trailer"];
      this.Request = this.convertValues(source["Request"], null);
      this.TLS = this.convertValues(source["TLS"], null);
    }

    convertValues(a: any, classs: any, asMap: boolean = false): any {
      if (!a) {
        return a;
      }
      if (a.slice && a.map) {
        return (a as any[]).map((elem) => this.convertValues(elem, classs));
      } else if ("object" === typeof a) {
        if (asMap) {
          for (const key of Object.keys(a)) {
            a[key] = new classs(a[key]);
          }
          return a;
        }
        return new classs(a);
      }
      return a;
    }
  }
}
