import { createPromiseClient } from "@connectrpc/connect";
import { createGrpcWebTransport } from "@connectrpc/connect-web";
import { Auth } from "@/lib/auth_proto/auth_connect";

const transport = createGrpcWebTransport({
  baseUrl: "http://grpc-gateway:3000",
});

export default createPromiseClient(Auth, transport);
