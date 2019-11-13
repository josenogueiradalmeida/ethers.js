const ethers  = require('ethers');
const express = require('express');

const app = express();
const port = 3000; //FIXME

const privateKey = "0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d"; //FIXME
const wallet     = new ethers.Wallet(privateKey);
const valueInETH = "0.001"; //FIXME
const gasLimit   = "53000"; //FIXME
//const provider   = ethers.getDefaultProvider('rinkeby');    
const provider   = new ethers.providers.JsonRpcProvider();// Default: http://localhost:8545 //FIXME

app.get('/requestEth/:addressto',function( _req , _res ){
    const addressto = _req.params.addressto;
    console.log('/requestEth/' + addressto )
    const isValidAddress = testParam(addressto);
    
    if ( isValidAddress ) {
        requestETH( addressto );
    } else {
        console.log("Can not send ETH to an invalid address!")
    }        

    _res.send("The address: " + addressto + " | is valid? " + isValidAddress);    
    _res.end();    
});

function requestETH( _addressto ) {    
    var gasPricePromise         = provider.getGasPrice();
    var balancePromise          = provider.getBalance(wallet.address);    
    var transactionCountPromise = provider.getTransactionCount(wallet.address);

    var allPromises = Promise.all([
        gasPricePromise,
        balancePromise,
        transactionCountPromise
    ]);

    var sendPromise = allPromises.then(
        function(results) {    
            var gasPrice         = results[0];
            var balance          = results[1];
            var transactionCount = results[2];
           
            var value = ethers.utils.parseEther(valueInETH);

            var transaction = {
                to: _addressto,
                gasPrice: gasPrice,
                gasLimit: ethers.utils.bigNumberify(gasLimit),
                nonce: transactionCount,

                // The amount to send
                value: value,

                // Prevent replay attacks across networks
                chainId: provider.chainId,
            };

            var signedTransaction = wallet.sign(transaction);

            // By returning a Promise, the sendPromise will resolve once the
            // transaction is sent
            console.log("The transaction promise was made."); 
            console.log("The current balance is " + balance);             
            return provider.sendTransaction(signedTransaction);
        }
    );

    // This will be called once the transaction is sent
    sendPromise.then(
        function(transaction) {        
            // This promise will be resolve once the transaction has been mined.
            console.log("The transaction was sent: " + transaction.hash); 
        } 
    );

    sendPromise.catch(
        function(error) {
            console.log("An error happened!");
            console.log(error);
        }
    );

}

function testParam( _param ) {
    try {
        ethers.utils.getAddress( _param );
        return true;
    } catch(e) {
        return false;
    }
}

app.listen(port, () => console.log('App listening on port ' + port + '!'))