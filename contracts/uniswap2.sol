
// implementing swap with solidity
pragma solidity ^0.7.0;

interface IUniswap{
    
    function swapExactTokensForETH(
        uint amountIn, 
        uint amountOutMin, 
        address[] calldata path,
        address to, 
        uint deadline
        )
        external
        returns (uint[] memory amounts);
    function WETH() external pure returns (address);    
}

interface ERC20{
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
}

contract Uniswap2{
    
    IUniswap uniswap;
    constructor(address _uniswap){
        uniswap = IUniswap(_uniswap);
    }
    
    function swapTokensForETH(
        address token,
        uint amountIn,
        uint amountOutMin,
        uint deadline)
        external
        {
            IERC20(token).transferFrom(msg.sender, address(this),amountIn);
            address[] memory path = new address[](2);
            address[0]=token;
            address[1]=uniswap.WETH();
            IERC20(token).approve(address(uniswap), amountIn);
            uniswap.swapExactTokensForETH(amountIn,amountOutMin,path,msg.sender,deadline)
        }
}