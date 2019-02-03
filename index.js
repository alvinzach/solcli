#!/usr/bin/env node
const program=require('commander')
const solc=require('solc')
const fs=require('fs')

program
    .version('1.0.0')
    .description('solidity compiler')
    .option('-p,--port <n>','rpc port')
    .option('-h,--host <n>','rpc host')

program
    .command('init <filename>')
    .description('initiate')
    .alias('i')
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
                        console.log('run "npm install web3" ')
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

program.parse(process.argv)