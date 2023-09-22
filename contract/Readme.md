# contract token.sol
- Khi khởi tạo contract có 1 tham số: 
    + `_price`: là tỉ giá khi mua `claimByCoin`


- Hàm `eFFs` cài đặt danh sách ví whitelist:
    + `accounts`: danh sách địa chỉ ví
    + `excluded`: `true` hoặc `false`, để gán những ví này có whitelist hay không


- Hàm `isEFFs` kiểm tra 1 ví có phải whitelist hay không ? trả về `true` hoặc `false`:
    + `account`: địa chỉ ví cần kiểm tra


- Hàm `changeLimitTimeTx`: thay đổi thời gian tối thiểu giao dịch, ví dụ sau 10 phút, ví đó mới được giao dịch tiếp:
    + `_limitTimeTx`: số thời gian đơn vị là giây


- Hàm `setPools`: nhập địa chỉ pool thanh khoản. khi tạo ra 1 cặp thanh khoản, bạn phải nhập địa chỉ pool thanh khoản đó vào để nhận biết chặn mua bán khi IDO 
    + `_pool`: địa chỉ pool thanh khoản


- Hàm `setRouter`: nhập địa chỉ router của sàn, ví dụ pancake swap v2 là : `0x10ED43C718714eb63d5aA57B78B54704E256024E` 
    + `_router`: địa chỉ pool thanh khoản


- Hàm `isPools`: kiểm tra xem có phải địa chỉ pool thanh khoản không, trả về `true` hoặc `false` 
    + `_pool`: địa chỉ pool thanh khoản


- Hàm `setPercentCommissionRef`: thay đổi hoa hồng cho ví giới thiệu 
    + `percent`: đơn vị %, số nguyên dương


- Hàm `ido`: thay đổi trạng thái IDO state: `true` hoặc `false`


- Hàm `setIco`: thay đổi trạng thái ICO state: `true` hoặc `false`


- Hàm `setPriceUSD`: thay đổi tỉ giá ICO, tỉ giá = token / USD, ví dụ 1000 token = 1 BUSD, thì tỉ giá là 1000 
    + `price`: tỉ giá


- Hàm `setPriceCoin`: thay đổi tỉ giá ICO, tỉ giá = token / Coin, ví dụ 1000 token = 1 ETH, thì tỉ giá là 1000 
    + `price`: tỉ giá


- Hàm `setCF`: thay đổi địa chỉ ví gửi khi Claim, ví dụ ví Binance 
    + `_from`: địa chỉ ví


- Hàm `setUSDAddress`: thay đổi địa chỉ USD token, ví dụ USDT là : `0x55d398326f99059ff775485246999027b3197955` 
    + `_from`: địa chỉ ví


- Hàm `widthdraw`: rút USD từ ví token về 1 ví nào đó to: ví nhận 
    + `amount`: số lượng


- Hàm `claim`: người dùng có thể vào claim bằng cách gửi USD vào token , nhận về 1 lượng token dựa trên tỉ giá 
    + `amountUSD`: số lượng USD 
    + `ref`: ví người giới thiệu, sẽ nhận được % token (hàm `setPercentCommissionRef`), ví đó phải có 1 lượng token sẵn


- Hàm `claimByCoin`: người dùng có thể vào claim bằng cách gửi Coin vào, nhận về 1 lượng token dựa trên tỉ giá (hàm `setPriceCoin`)
    + `ref`: ví người giới thiệu, sẽ nhận được % token (`setPercentCommissionRef`), ví đó phải có 1 lượng token sẵn


- Hàm `createP`: tạo pool thanh khoản 
    + `amountUSD`: số USD đã được approve cho ví token để tạo thanh khoản 
    + `amountToken`: số token để tạo thanh khoản


- Hàm `createPByCoin`: tạo pool thanh khoản tự động, dùng hàm nạp số ETH mong muốn để add thanh khoản
    + `amountToken`: số token để tạo thanh khoản

