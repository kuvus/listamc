# ListaMC.pl

![ListaMc.pl](public/assets/listamc-256x256.png)

ListaMC.pl is a Minecraft server list that allows users to find new servers and rate them.

## How to run

### Docker

```bash
docker build -t listamc .
docker run -d -p 3000:3000 listamc
```

### Locally

To run development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

To run production server:

```bash
npm run build
# or
yarn build
# or
pnpm build
```

and then

```bash
npm run start
# or
yarn start
# or
pnpm start
```
