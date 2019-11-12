const ethers = require('ethers');
const express = require('express');

const app = express();
const port = 3000;

app.get('/requestEth/:id',function( _req , _res ){
    const id = _req.params.id;
    console.log('/requestEth/' + id )
    const result = testParam(id);

    _res.send("leu " + id + " | testParam " + result);    
    _res.end();    
});

function testParam( _param ) {
    return isAddress(_param);
}

function isAddress ( _address ) {
    if (!/^(0x)?[0-9a-f]{40}$/i.test(_address)) {
        // check if it has the basic requirements of an address
        return false;
    } else if (/^(0x)?[0-9a-f]{40}$/.test(_address) || /^(0x)?[0-9A-F]{40}$/.test(_address)) {
        // If it's all small caps or all all caps, return true
        return true;
    } else {
        // Otherwise check each case
        return isChecksumAddress(_address);
    }
};

function isChecksumAddress(_address) {
    // Check each case
    _address = _address.replace('0x','');
    var addressHash = sha3(_address.toLowerCase());
    for (var i = 0; i < 40; i++ ) {
        // the nth letter should be uppercase if the nth digit of casemap is 1
        if ((parseInt(addressHash[i], 16) > 7 && _address[i].toUpperCase() !== _address[i]) || (parseInt(addressHash[i], 16) <= 7 && _address[i].toLowerCase() !== _address[i])) {
            return false;
        }
    }
    return true;
};


app.listen(port, () => console.log('App listening on port ' + port + '!'))