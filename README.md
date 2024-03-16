# setup

- install hyperlane CLI

```
npm install -g @hyperlane-xyz/cli
```

# deploy

- deploy hyperlane to galadriel:

```
hyperlane deploy core \
    --targets sepolia,galadriel \
    --chains ./configs/chains.yaml \
    --ism ./configs/ism.yaml \
    --out ./artifacts/ \
    --key <deployer private key>
```
