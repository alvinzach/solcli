# Installing Sol-Cli
Clone the sol-cli github repository
```bash
git clone https://github.com/alvinzach/solcli.git
```
Navigate to the cloned directory . Install the dependencies and create a symbolic link

```bash 
npm install
sudo npm link
```
Thats it! . To test your installation just run

```bash
solcli --help
```

To create a new project , go to the desired folder and run 

```
solcli init <smart-contract-name> --host localhost --port 8545
```

A solidity boilerplate file will be created as follows `smartcontracts/<smart-contract-name>.sol`. 

## Compiling smart contracts

The `compile <filename>`command compiles smartcontracts/\<filename\>.sol. The abi and bytecode generated will be stored in the artifacts folder. 

## Deploying smart contracts

The `deploy <filename>` command will create a new instance of the contract . The address of the deployed contract will be present in artifacts/<filename.json>