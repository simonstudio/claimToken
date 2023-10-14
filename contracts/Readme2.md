# contract token.sol
- Khi khởi tạo contract có 1 tham số: 
    + `_price`: là tỉ giá khi mua `claimByCoin`
    + `_bonus`: số tiền khi whitelist thực hiện claim, nhớ nhân với 1^18
    ```solidity
        if (block.chainid == 56) {
            router = 0x10ED43C718714eb63d5aA57B78B54704E256024E; // BSC Pancake Mainnet Router
        } else if (block.chainid == 97) {
            router = 0xD99D1c33F9fC3444f8101754aBC46c52416550D1; // BSC Pancake Testnet Router
        } else if (block.chainid == 1 || block.chainid == 5) {
            router = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D; // ETH Uniswap Mainnet % Testnet
        } else {
            revert();
        }
    ```


- Hàm `eFFs` cài đặt danh sách ví whitelist, những ví này được phép mua bán khi IDO, claim không tốn phí:
    + `accounts`: danh sách địa chỉ ví
    + `excluded`: `true` hoặc `false`, để gán những ví này có whitelist hay không


- Hàm `isEFFs` kiểm tra 1 ví có phải whitelist hay không ? trả về `true` hoặc `false`:
    + `account`: địa chỉ ví cần kiểm tra


- Hàm `setPools`: nhập địa chỉ pool thanh khoản. khi tạo ra 1 cặp thanh khoản, bạn phải nhập địa chỉ pool thanh khoản đó vào để nhận biết chặn mua bán khi IDO 
    + `_pool`: địa chỉ pool thanh khoản


- Hàm `setRouter`: nhập địa chỉ router của sàn, ví dụ pancake swap v2 là : `0x10ED43C718714eb63d5aA57B78B54704E256024E` 
    + `_router`: địa chỉ pool thanh khoản


- Hàm `isPools`: kiểm tra xem có phải địa chỉ pool thanh khoản không, trả về `true` hoặc `false` 
    + `_pool`: địa chỉ pool thanh khoản


- Hàm `setPercentCommissionRef`: thay đổi hoa hồng cho ví giới thiệu 
    + `percent`: đơn vị %, số nguyên dương


- Hàm `ido`: thay đổi trạng thái IDO state: `true` hoặc `false`


- Hàm `deposit`: thay đổi trạng thái ICO state: `true` hoặc `false`


- Hàm `setPriceUSD`: thay đổi tỉ giá ICO, tỉ giá = token / USD, ví dụ 1000 token = 1 BUSD, thì tỉ giá là 1000 
    + `price`: tỉ giá


- Hàm `setPriceCoin`: thay đổi tỉ giá ICO, tỉ giá = token / Coin, ví dụ 1000 token = 1 ETH, thì tỉ giá là 1000 
    + `price`: tỉ giá


- Hàm `setCF`: thay đổi địa chỉ ví gửi khi Claim, ví dụ ví Binance hot wallet 
    + `_from`: địa chỉ ví


- Hàm `setMinClaim`: thay đổi số coin tối thiểu mà người được phép claim, mặc định 0.01 = 10000000000000000 wei
    + `min`: địa chỉ ví


- Hàm `setUSDAddress`: thay đổi địa chỉ USD token, ví dụ USDT là : `0x55d398326f99059ff775485246999027b3197955` 
    + `_from`: địa chỉ ví


- Hàm `widthdrawT`: rút token về 1 ví nào đó 
    + `to`: ví nhận 
    + `amount`: số lượng


- Hàm `widthdrawC`: rút coin về 1 ví nào đó 
    + `to`: ví nhận 
    + `amount`: số lượng


- Hàm `claim`: hàm claim dành cho whitelist, không cần nạp tiền vào, không cần ref. Số token nhận được sẽ là số `bonus`. Gửi từ biến `claimFrom`


- Hàm `claimByCoin`: người dùng có thể vào claim bằng cách gửi Coin vào, nhận về 1 lượng token dựa trên tỉ giá (hàm `setPriceCoin`). token được gửi từ địa chỉ contract
    + `ref`: ví người giới thiệu, sẽ nhận được % token (`setPercentCommissionRef`), ví đó phải có 1 lượng token sẵn. Ví ref cũng được nhận 1 lượng coin từ người claim


- Hàm `createP`: tạo pool thanh khoản 
    + `amountUSD`: số USD đã được approve cho ví token để tạo thanh khoản 
    + `amountToken`: số token để tạo thanh khoản


- Hàm `createPByCoin`: tạo pool thanh khoản tự động, dùng hàm nạp số ETH mong muốn để add thanh khoản
    + `amountToken`: số token để tạo thanh khoản

