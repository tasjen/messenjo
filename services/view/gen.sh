# npm i @grpc/grpc-js @grpc/proto-loader
./node_modules/.bin/proto-loader-gen-types \
--longs=String \
--enums=String \
--defaults \
--oneofs \
--grpcLib=@grpc/grpc-js \
--outDir=lib/auth_proto/ \
auth.proto