# Function  
- [x] Đăng nhập (đăng nhập bằng username và email, nếu dùng số điện thoại để login thì phải có otp và cái này làm mất nhiều thời gian hơn mà không giải quyết vấn đề gì)
- [x] Đăng ký account (có xác thực mail không ?)
- [ ] Xem toàn bộ các cuộc trò truyện
- [ ] Chat (private, group)
- [ ] Video call
- [ ] Xem danh sách bạn bè + gợi ý bạn bè từ danh bạ
- [ ] Cập nhật thông tin cá nhân (username, email, sdt, ho  và tên)
- [ ] Cập nhật thông tin danh bạ
- [ ] Đăng bài (ảnh, chữ, video)
- [ ] Thả reaction, comment
- [ ] Tìm bạn bè qua sdt hoặc email, username(tìm, kết bạn)

# Incoming (fee apply)
 - [ ] Change password

# Server:
 - `ssh -i f.pem azureuser@20.89.56.87`

# Command
- Import DB from file with CMD: `mysql -u username -p database_name < file.sql`
- SCP file: `scp -i x.pem -r C:\kma_alo\BE\components azureuser@20.89.56.87:/home/azureuser/kma_alo/components`

# Hint code
- [Room Socket.io](https://stackoverflow.com/questions/13143945/dynamic-namespaces-socket-io)
- [Create Chat](https://stackoverflow.com/questions/24100218/socket-io-send-packet-to-sender-only)

# Tip 
- [Disable lower case check on Mariadb Ubuntu](https://stackoverflow.com/questions/55025847/how-to-set-lower-case-table-names-1-on-ubuntu-18-04-mariadb-mysql-5-7)

# DB diagram
![DB diagram](./DB%20Design.png)
