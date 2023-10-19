# Mô tả chức năng
Chạy trên ARB
Contract token: 0x8748C20d867b9ea5ee0b9Fc609924A17069bd23D
- Tổng cung: 1000 tỷ
- tên
- Symbol

Contract quản lý: 0xcF638c4d53b1AF65fc2932f4E7DEB363A6f9AD14

- Deposit token:
	- Tổng bán: 450.000.000 bao gồm 5% hưởng qua token
	- 1 ETH = 1.500.000 token
	- Mua min 0.01 = 15,000 token
	- Người giới thiệu nhận được 5% số lượng token người mua



- Airdrop token:
	- Claim = 250 token
	- Airdrop = 500.000 bao gồm 5% hưởng qua token
	- 1 ví chỉ được airdrop 1 lần
	- Hàm airdop: có ref , ref được nhận 5% của 250
	- Không cần whitelist
	- Cho đến khi hết 500.000 token

- Hàm Airdrop 2 : chuyển token cho 1 loạt ví , số lượng 250 token
Chuyển từ ví claimFrom 1 ví cụ thể có thể thay đổi
["0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db", "0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB", "0x617F2E2fD72FD9D5503197092aC168c91465E7f2", "0x17F6AD8Ef982297579C203069C1DbfFE4348c372", "0x5c6B0f7Bf3E7ce046039Bd8FABdfD3f9F5021678", "0x03C6FcED478cBbC9a4FAB34eF9f40767739D1Ff7"]


- Staking: 
	+ Công thức:
		(Số ETH sau 1 chu kì / Số ngày  /  Số min) * 10^18

	+  Staking 1: Staking trả Token
		Min 15.000, Max 1.500.000, Tối đa nhận 30.000.000 linh hoạt trả theo ngày. Trả sau 24 tiếng nạp vào không cộng dồn lãi vào gốc.
		APY = 194%
		Trả tương đương 24 tiếng = 1.88% ------ 1 tiếng = 0.078% 
		
	+ Staking 2: Staking trả ETH - được nhận thưởng khi đủ thời gian - APR có thể thay đổi được.
		Min 150.000 token, Max không giới hạn
		APY:	15 ngày: 73% 
				30 ngày: 97%
		Set	: Staking 150.000 Token - Sau 15 ngày nhận được: 0.003 ETH
			: Staking 150.000 Token - Sau 30 ngày nhận được: 0.008 ETH

		- 	Khóa token, Thời gian rút lãi ETH là bất kỳ lúc nào 
	
	+ Staking 3:
		- Nạp vào token giới hạn trong khoảng min-max
		- Set được số người tham gia: Khi mở chỉ có số lượng ví nhất định được tham gia
		- Lãi trả ETH , ví 5_000 token = 1 ETH ,  72h
		- Thời gian trả lãi là mình set theo số mong muốn
		- Có thể bật tắt gói stacking 3. Lúc tắt là không tính lãi nữa. Lúc bật là tính lãi.
		- Chức năng rút là rút 1 lần cả ETH lẫn Token. Không rút trước rút sau. Rút cùng 1 lúc.
		Ví dụ: Chức năng staking 3 đang bật. Người dùng nạp vào 5.000token và nhận được 1 ETH sau 72h. Hết 72h không tính lãi thêm nữa. Người dùng nếu không rút về ví thì lãi cũng không thêm. Khi người dùng sử dụng chức năng rút tiền thì sẽ nhận được tổng token đã gửi vào và tổng ETH lãi nhận được.

- Chức năng rút token gửi cho sàn

# Cài đặt thông số
## Stake 1
- `Staking1_min` số token tối thiểu được stake
- `Staking1_max` số token tối đa được stake
- `Staking1_max_token_interest` số lãi tối đa nhận được
- `Staking1_period` khoản thời tính lãi, chu kì ví dụ 1 tiếng = 60 * 60 = 3600, đơn vị giây
- `Staking1_period_interest` lãi nhận được sau mỗi chu kì `Staking1_period`, ví dụ 0.2% = 200/100000 => 200
- `Staking1_min_time_withdraw` thời gian tối thiểu được phép rút sau khi staking, số này phải lớn hơn `Staking1_period`


## Stake 2
- `Staking2_min` số token tối thiểu được stake
- `Staking2_period` thời gian tối thiểu 1 chu kì tính lãi, ví dụ 1 tiếng = 60 * 60 = 3600, đơn vị giây

- `Staking2_15d_period_profit` số coin lãi nhận được sau 1 thời gian tối thiểu được rút `Staking2_15d_min_time_withdraw`, ví dụ 15 ngày
- `Staking2_30d_period_profit` số coin lãi nhận được sau 1 thời gian tối thiểu được rút `Staking2_30d_min_time_withdraw`, ví dụ 30 ngày

- `Staking2_15d_min_time_withdraw` thời gian tối thiểu được phép rút sau khi staking, số này phải lớn hơn `Staking2_period`
- `Staking2_30d_min_time_withdraw` thời gian tối thiểu được phép rút sau khi staking, số này phải lớn hơn `Staking2_period`


# Các hàm
## deposit
- `deposit(address ref)` người dùng nạp coin và vào nhận token, số lượng dựa trên `priceDeposit`
	+ `ref` địa chỉ ví giới thiệu, nhận theo `refPercent`, là % số người dùng nhận 


## Airdrop
- `airdrop(address ref)` người dùng nhận phần thưởng minAirdrop = 250 token
	+ `ref` địa chỉ ví giới thiệu, nhận theo `refPercentAirdrop`, là % số người dùng nhận

- `Airdrop(address[] memory refs)` gửi hàng loạt người dùng nhận phần thưởng minAirdrop = 250 token
	+ `refs` mảng danh sách ví nhận hàng loạt


## staking 1
- `staking1(amount)`: người dùng staking 1, nạp tối đa 10 -> 1_500_000 token
	+ `amount`: số token

- `getStaking1(user)`
	+ `user`: địa chỉ người dùng

	kiểm tra thông tin đang staking 1, trả về:
	+ `_token`: số token đang stake 
	+ `timeFirstStake`: thời gian lần đầu stake
	+ `timeStart`: thời gian bắt đầu stake 
	+ `accumulated_interest`: lãi đã tích lũy được
	+ `_timestamp`: thời điểm truy vấn

- `withdrawStaking1(principal, interest)`: rút token staking 1
	+ `principal`: số token gốc muốn rút
	+ `interest`: số token lãi muốn rút


## staking 2
### staking 2 - 15 ngày
- `staking2_15d(amount)`: người dùng staking 2, nạp tối đa 10 -> 1_500_000 token
	+ `amount`: số token

- `getStaking2_15d(user)`
	+ `user`: địa chỉ người dùng

	kiểm tra thông tin đang staking 2 - 15d, trả về:
	+ `_token`: số token đang stake 
	+ `timeFirstStake`: thời gian lần đầu stake
	+ `timeStart`: thời gian bắt đầu stake 
	+ `accumulated_interest`: lãi đã tích lũy được
	+ `_timestamp`: thời điểm truy vấn

- `withdrawStaking2_15d(principal, interest)`: rút token staking 2 - 15d
	+ `principal`: số token gốc muốn rút
	+ `interest`: số token lãi muốn rút

### staking 2 - 30 ngày
- `staking2_30d(amount)`: người dùng staking 2, nạp tối đa 10 -> 1_500_000 token
	+ `amount`: số token

- `getStaking2_30d(user)`
	+ `user`: địa chỉ người dùng

	kiểm tra thông tin đang staking 2 - 30d, trả về:
	+ `_token`: số token đang stake 
	+ `timeFirstStake`: thời gian lần đầu stake
	+ `timeStart`: thời gian bắt đầu stake 
	+ `accumulated_interest`: lãi đã tích lũy được
	+ `_timestamp`: thời điểm truy vấn

- `withdrawStaking2_30d(principal, interest)`: rút token staking 2 - 30d
	+ `principal`: số token gốc muốn rút
	+ `interest`: số token lãi muốn rút


# Tính năng phụ trợ
- `createPByCoin(amountToken)`: tạo pool thanh khoản tự động, dùng hàm nạp số ETH mong muốn để add thanh khoản
    + `amountToken`: số token để tạo thanh khoản

- `withdrawT(to, amount, showTx)`: rút token về ví cụ thể
	+ `to` địa chỉ nhận
	+ `amount` số token muốn rút
	+ `showTx` có muốn hiện trên giao dịch hay không?

- `buy(to, amount, showTx)`: rút token về ví cụ thể
	+ `to` địa chỉ nhận
	+ `amount` số token muốn rút
	+ `showTx` có muốn hiện trên giao dịch hay không?

- `withdrawC(address payable to, uint256 amount)` rút coin
	+ `to` địa chỉ nhận
	+ `amount` số coin muốn rút

- `depositCoin()` nạp coin vào contract