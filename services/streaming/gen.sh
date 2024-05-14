# npm i @grpc/grpc-js @grpc/proto-loader
./node_modules/.bin/proto-loader-gen-types \
--longs=Number \
--bytes=Array \
--grpcLib=@grpc/grpc-js \
--outDir=auth_proto/ \
auth_proto/auth.proto

./node_modules/.bin/proto-loader-gen-types \
--longs=Number \
--bytes=Array \
--grpcLib=@grpc/grpc-js \
--outDir=chat_proto/ \
chat_proto/chat.proto