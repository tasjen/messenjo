npx buf generate auth_proto/auth.proto && \
mv gen/* auth_proto/ &&
npx buf generate chat_proto/chat.proto && \
mv gen/* chat_proto/ && \
rmdir gen