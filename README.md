# Function  
- [x] Đăng nhập (đăng nhập bằng username và email)
- [x] Đăng ký account (có xác thực mail)
- [x] Xem toàn bộ các cuộc trò truyện
- [ ] Private Chat
- [ ] Group chat
- [ ] Video call
- [ ] Xem danh sách bạn bè + gợi ý bạn bè từ danh bạ
- [ ] Cập nhật thông tin cá nhân (username, email, sdt, ho  và tên)
- [ ] Cập nhật thông tin danh bạ
- [ ] Đăng bài (ảnh, chữ, video)
- [ ] Thả reaction, comment
- [ ] Tìm bạn bè qua sdt hoặc email, username(tìm, kết bạn)

# Incoming (fee apply)
 - [ ] Change password

# Command
- SSH to Server: `ssh -i x.pem azureuser@20.89.56.87`
- Import DB from file with CMD: `mysql -u username -p database_name < file.sql`
- SCP file: `scp -i x.pem -r C:\kma_alo\BE\components azureuser@20.89.56.87:/home/azureuser/kma_alo/components`
- SQL CREATE_AT & UPDATED_AT: 
> ALTER TABLE private_chat_message
  ADD COLUMN CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN UPDATED_AT DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
# Hint code
- [Room Socket.io](https://stackoverflow.com/questions/13143945/dynamic-namespaces-socket-io)
- [Create Chat](https://stackoverflow.com/questions/24100218/socket-io-send-packet-to-sender-only)

# Tip 
- [Disable lower case check on Mariadb Ubuntu](https://stackoverflow.com/questions/55025847/how-to-set-lower-case-table-names-1-on-ubuntu-18-04-mariadb-mysql-5-7)

# TODO:  
**Select the lastest chat message each room and map with user**  
Line 22 - PrivateChatDAO.js: `SELECT * FROM PRIVATE_CHAT a JOIN USERS b ON (a.UID_ONE = 3 AND a.UID_TWO = b.UID) OR (a.UID_TWO = 3 AND a.UID_ONE = b.UID) LEFT JOIN (SELECT DISTINCT ROOM_CHAT_ID FROM PRIVATE_CHAT_MESSAGE ORDER BY CREATED_AT DESC) c ON c.ROOM_CHAT_ID = a.ROOM_CHAT_ID LIMIT 1`