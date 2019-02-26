#!/usr/bin/env node
const program=require('commander')
const solc=require('solc')
const fs=require('fs')
var Web3=require('web3');
program
    .version('1.0.0')
    .description('solidity compiler')
    
program
    .command('init <filename>')
    .description('initiate')
    .alias('i')
    .option('-p,--port <n>','rpc port')
    .option('-h,--host <n>','rpc host')
    .action((filename)=>{
        var config={
            "smartcontracts":[]
        }
        if(program.port){
            config.port=program.port
        }else{
            config.port="8545"
        }
        if(program.host){
            config.host=program.host
        }else{
            config.host="localhost"
        }
        config.smartcontracts.push(filename)
        var sampleSol=`pragma solidity ^0.4.23;\ncontract ${filename} {\n}`
        fs.writeFile('./config.json',JSON.stringify(config,null,2),(err)=>{
            if(err){
                console.log('Cannot init solcli')
                return
            }else{
                if (!fs.existsSync('smartcontracts')){
                    fs.mkdirSync('smartcontracts');
                }
                fs.writeFile(`./smartcontracts/${filename}.sol`,sampleSol,(err)=>{
                    if(err){
                        console.log(err)
                        return
                    }else{
                        console.log(`Edit smartcontracts/${filename}.sol file`)
                    }
                })
                
            }
        })
        

    })
program
    .command('compile [filename]')
    .description('compile solidity file')
    .alias('c')
    .action((filename)=>{

        if(filename){
            if (!fs.existsSync('artifacts')){
                fs.mkdirSync('artifacts');
            }
            let input = fs.readFileSync(`./smartcontracts/${filename}.sol`);
            let output = solc.compile(input.toString(), 1);
            if(output.errors){
                output.errors.forEach(element => {
                    console.log(element)
                });
            }
            if(output.contracts[`:${filename}`]){
                var artifacts={
                    bytecode:output.contracts[`:${filename}`].bytecode,
                    abi:output.contracts[`:${filename}`].interface,
                }
                fs.writeFile(`./artifacts/${filename}.json`,JSON.stringify(artifacts,null,2),(err)=>{
                    if(err){
                        console.log(err)
                        return
                    }else{
                        console.log('wrote artifacts')
                    }
                })
                
            }
        }else{
            console.log('no contract specified')
        }
    })
program
    .command('deploy [filename]')
    .description('deploy smart contract')
    .alias('d')
    .option('-a,--address <n>','Address of sender')
    .option('-p,--password <n>','password')
    .action((filename)=>{
        var config=JSON.parse(fs.readFileSync('config.json'))
        var web3=new Web3(new Web3.providers.HttpProvider(`${config.host}:${config.port}`));
        if(program.address){
            web3.eth.defaultAccount=address;
        }else{
            web3.eth.defaultAccount=web3.eth.accounts[0];
        }
        if(program.password){
            web3.personal.unlockAccount(web3.eth.defaultAccount,program.password,100000)
        }
        var contract_details=JSON.parse(fs.readFileSync(`artifacts/${filename}.json`));
        var contract=web3.eth.contract(JSON.parse(contract_details.abi))
        const contractInstance = contract.new({
            data: '0x' + contract_details.bytecode,
            gas: 90000*5
        }, (err, res) => {
            if (err) {
                console.log(err);
                return;
            }
        
            console.log("transaction hash :"+res.transactionHash);
        
            var intId=setInterval(()=>{
                if(contractInstance.address!==undefined){
                    contract_details.address=contractInstance.address;
                    fs.writeFileSync(`artifacts/${filename}.json`,JSON.stringify(contract_details,null,2))
                    console.log(contractInstance.address)
                    clearInterval(intId)
                    return
                }
            },3000)
        });
        console.log(config)
    })
program.parse(process.argv)