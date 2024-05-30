npx buf generate lib/auth_proto/auth.proto
./node_modules/.bin/proto-loader-gen-types \
--bytes=Array \
--grpcLib=@grpc/grpc-js \
--outDir=lib/chat_proto/ \
lib/chat_proto/chat.proto