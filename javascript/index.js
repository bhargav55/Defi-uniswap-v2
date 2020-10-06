const {ChainId, Fetcher, WETH, Route, Trade, TokenAmount, TradeType, Percent} = require("@uniswap/sdk");
const ethers = require('ethers');

const chainId = ChainId.MAINNET;

const tokenAddress= '0x6b175474e89094c44da98b954eedeac495271d0f';

const init =async  () => {
    const dai = await Fetcher.fetchTokenData(chainId,tokenAddress);
    const weth = WETH[chainId];
    const pair = await Fetcher.fetchPairData(dai,weth);
    const route = new Route([pair],weth);
    const trade = new Trade(route, new TokenAmount(weth,100000000000000000),TradeType.EXACT_INPUT)
     console.log(route.midPrice.toSignificant(6))
     console.log(route.midPrice.invert().toSignificant(6))
     console.log(trade.executionPrice.toSignificant(6))
     console.log(trade.nextMidPrice.toSignificant(6))
     const slippageTolerance = new Percent('50','10000') //50 bips --- 1 bip = 0.001
     const amoutOutMin= trade.minimumAmountOut(slippageTolerance).raw;
     const path = [weth.address,dai.address];
     const to = '';
     const deadline = Math.floor(Date.now()/1000 + 60 * 20)
     const value = trade.inputAmount.raw;
     const provider = ethers.getDefaultProvider('mainnet', {
         infura: 'https://mainnet.infura.io/v3/0390859ca13244a4b41f29b2b376a2b0'
     });
     const signer = new ethers.Wallet(PRIVATE_KEY);
     const account = signer.connect(provider);
     const uniswap = new ethers.Contract(
         '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
         ['function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts);']

     );

     const txn = uniswap.sendExactETHForTokens(
         amoutOutMin, 
         path, 
         to,
         deadline, 
         {value,gasPrice: 20e9}
         );
     console.log(`Transaction hash: ${txn.hash}`);
     const receipt = await txn.wait();    
     console.log(`Transaction was mined in the block ${receipt.blockNumber}`);
}
 
init(); 