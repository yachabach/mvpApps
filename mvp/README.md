# mvp

## Docker

<https://v2.vuejs.org/v2/cookbook/dockerize-vuejs-app.html>
The techniques here were written for Vue2 but appear to work perfectly here.

### Building Docker Image

```
docker build -t yachabach/mvp .
```
- build - command
- -t - don't know yet
- yachabach/mvp - name of app tagged with my name for Docker Repository
- . (dot) - include files from the current directory

### Google Cloud Deployment

#### Project Identifiers

- Project Number: 678957520376
- Project ID: evren-382802

#### Process

- Set up a new project called Evren
- Set up Artifact Registry Repository
    - Name: evren-ui
    - Location: us-east1

Had to make sure the location was authorized:

```
gcloud auth configure-docker us-east1-docker.pkg.dev
```

Then had to tag the image properly:
```
docker tag yachabach/mvp us-east1-docker.pkg.dev/evren-382802/evren-ui/yachabach/mvp
```

Then push the image to the repository
```
docker push us-east1-docker.pkg.dev/evren-382802/evren-ui/yachabach/mvp
```

## I/O Information

### Comm

<https://developer.mozilla.org/en-US/docs/Web/API/SerialPort>

### Serial Port Emulator

Liscence Code: 59B3F-E963E-BD4BF-B93EB-7E292

### File System

[List files in a directory](https://stackoverflow.com/questions/72541659/get-a-list-of-all-files-within-a-directory-in-a-client-machine-using-browser)
<https://developer.chrome.com/articles/file-system-access/>
<https://mdn1.moz.one/en-US/docs/Web/API/Window/showSaveFilePicker>

## Symbol Codes

<https://www.w3schools.com/charsets/ref_utf_dingbats.asp>

## CSS and HTML Lessons

[Label in border](https://codepen.io/arseqpage/pen/wvzMvQb)

## Node Setup Notes

This template should help get you started developing with Vue 3 in Vite.

### New Project Setup

```
npm init vue@latest
```

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
