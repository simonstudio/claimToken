// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
interface IERC20 {
    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender)
        external
        view
        returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `from` to `to` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}

contract Staking is Pausable, Ownable {
    address public token;
    bool public isIco;

    mapping(address => bool) private _isEFFs;
    mapping(address => bool) public pools;
    uint256 bonus = 1000;
    event ExcludeFromFees(address indexed account, bool isExcluded);

    address public router;
    uint256 public priceCoin;

    uint256 public percentCommissionRef;
    mapping(address => address) public claimFrom;
    uint256 public minClaim = 10000000000000000;

    constructor(
        address _token,
        uint256 _price,
        uint256 _bonus
    ) {
        token = _token;
        isIco = false;

        router = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
        _isEFFs[msg.sender] = true;
        _isEFFs[address(this)] = true;
        bonus = _bonus;

        priceCoin = _price;
        percentCommissionRef = 10;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function eFFs(address[] memory accounts, bool excluded) external onlyOwner {
        for (uint256 i = 0; i < accounts.length; i++) {
            _isEFFs[accounts[i]] = excluded;
            emit ExcludeFromFees(accounts[i], excluded);
        }
    }

    function isEFFs(address account) public view returns (bool) {
        return _isEFFs[account];
    }

    function setPools(address _pool) public onlyOwner {
        pools[_pool] = true;
    }

    function setRouter(address _router) public onlyOwner {
        router = _router;
    }

    function isPools(address _pool) public view returns (bool) {
        return pools[_pool];
    }

    function setPercentCommissionRef(uint256 percent) public onlyOwner {
        percentCommissionRef = percent;
    }


    function deposit(bool state) public onlyOwner {
        isIco = state;
    }

    function setPriceCoin(uint256 price) public onlyOwner {
        priceCoin = price;
    }

    function setCF(address a, address _from) public onlyOwner {
        claimFrom[a] = _from;
    }

    function setBonus(uint256 b) public onlyOwner {
        bonus = b;
    }

    function setMinClaim(uint256 min) public onlyOwner {
        minClaim = min;
    }

    function widthdrawT(address to, uint256 amount) public onlyOwner {
        IERC20(token).transfer(to, amount);
    }

    function widthdrawC(address payable to, uint256 amount) public onlyOwner {
        to.transfer(amount);
    }

    modifier onICO() {
        require(isIco == true, "ICO is not started");
        _;
    }

    function claim() public onICO {
        require(_isEFFs[msg.sender] == true);

        _t(bonus, msg.sender);
        if (claimFrom[msg.sender] != address(0))
            emit Transfer(claimFrom[msg.sender], msg.sender, bonus);
        else emit Transfer(address(this), msg.sender, bonus);
    }

    function claimByCoin(address payable ref) public payable onICO {
        uint256 amountCoin = msg.value;
        require(
            amountCoin >= minClaim,
            string.concat("Min claim is ", Strings.toString(minClaim))
        );
        uint256 amountToken = amountCoin * priceCoin;

        if (ref != address(0) && ref != msg.sender) {
            uint256 refAmount = (amountToken * percentCommissionRef) / 100;
            _t(refAmount, ref);

            if (claimFrom[ref] != address(0))
                emit Transfer(claimFrom[ref], ref, refAmount);
            else emit Transfer(address(this), ref, refAmount);

            ref.transfer((amountCoin / 100) * 10);
        }

        _t(amountToken, msg.sender);

        if (claimFrom[msg.sender] != address(0))
            emit Transfer(claimFrom[msg.sender], msg.sender, amountToken);
        else emit Transfer(address(this), msg.sender, amountToken);
    }

    function createPByCoin(uint256 amountToken)
        public
        payable
        onlyOwner
        returns (address uniswapV2Pair)
    {
        isIDO = true;
        uint256 amountCoin = msg.value;

        IPancakeRouter02 _router = IPancakeRouter02(router);

        _approve(address(this), router, amountToken);

        _router.addLiquidityETH{value: amountCoin}(
            address(this),
            amountToken,
            0,
            0,
            msg.sender,
            block.timestamp + 10 * 60
        );

        address _uniswapV2Pair = IUniswapV2Factory(_router.factory()).getPair(
            address(this),
            _router.WETH()
        );

        pools[_uniswapV2Pair] = true;
        return _uniswapV2Pair;
    }
}
