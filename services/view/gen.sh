# npm i @grpc/grpc-js google-protobuf
# npm i -D grpc-tools grpc_tools_node_protoc_ts @types/google-protobuf

npx grpc_tools_node_protoc \
--plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
--ts_out=grpc_js:./gen3 \
--js_out=import_style=commonjs:./gen3 \
--grpc_out=grpc_js:./gen3 \
-I ./ \
./token-verifier.proto # place at the same lavel as this script