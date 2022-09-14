# Function  
- [x] Đăng nhập (đăng nhập bằng username và email)
- [x] Đăng ký account (có xác thực mail)
- [x] Xem toàn bộ các cuộc trò truyện
- [x] Private Chat
- [ ] Video call
- [ ] Xem danh sách bạn bè + gợi ý bạn bè từ danh bạ
- [x] Cập nhật thông tin cá nhân (username, email, sdt, ho  và tên)
- [ ] Cập nhật thông tin danh bạ
- [x] Đăng bài (ảnh, chữ, video)
- [x] Thả reaction, comment
- [ ] Tìm bạn bè qua sdt hoặc email, username(tìm, kết bạn)
- [ ] Quên mk

# Incoming (fee apply)
 - [ ] Change password

# Command
- SSH to Server: `ssh -i x.pem azureuser@20.89.94.38`
- Import DB from file with CMD: `mysql -u username -p database_name < file.sql`
- SCP file: `scp -i x.pem -r E:\kma_alo\BE\components azureuser@20.89.94.38:/home/azureuser/kma_alo`
- SQL CREATE_AT & UPDATED_AT: 
> ALTER TABLE private_chat_message
  ADD COLUMN CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN UPDATED_AT DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

# Hint code
- [Room Socket.io](https://stackoverflow.com/questions/13143945/dynamic-namespaces-socket-io)
- [Create Chat](https://stackoverflow.com/questions/24100218/socket-io-send-packet-to-sender-only)
- [Config lower_case_table_names value on Ubuntu](https://askubuntu.com/questions/1261422/how-to-install-mysql-8-0-with-lower-case-table-names-1-on-ubuntu-server-20-04-lt)

# Tip 
- [Disable lower case check on Mariadb Ubuntu](https://stackoverflow.com/questions/55025847/how-to-set-lower-case-table-names-1-on-ubuntu-18-04-mariadb-mysql-5-7)
- [Remove file when edit .gitignore](https://stackoverflow.com/questions/1139762/ignore-files-that-have-already-been-committed-to-a-git-repository)
# TODO:  
- [x] Get Sender info from token in authenticate when sending message
- [ ] Finish profile update (information + avatar) info backend
