# setup

- install hyperlane CLI

```
npm install -g @hyperlane-xyz/cli
```

# deploy

- deploy hyperlane to galadriel:

```
cd hyperlane-galadriel
hyperlane deploy core \
    --targets sepolia,galadriel \
    --chains ./configs/chains.yaml \
    --ism ./configs/ism.yaml \
    --out ./artifacts/ \
    --key <deployer private key>
```

- create `.env` file in `./erc721` and add deployer private key

```
DEPLOYER_PRIVATE_KEY=<private key>
```

- deploy erc721

```
cd ..
cd erc721
npx hardhat deploy
```
