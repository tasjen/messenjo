# npm i @grpc/grpc-js @grpc/proto-loader
./node_modules/.bin/proto-loader-gen-types \
--bytes=Array \
--grpcLib=@grpc/grpc-js \
--outDir=lib/chat_proto/ \
lib/chat_proto/chat.proto