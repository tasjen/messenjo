npx buf generate lib/auth_proto/auth.proto && \
mv lib/gen/* lib/auth_proto/ &&
npx buf generate lib/chat_proto/chat.proto && \
mv lib/gen/* lib/chat_proto/ && \
rmdir lib/gen