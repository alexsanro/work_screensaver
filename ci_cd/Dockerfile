FROM electronuserland/builder:wine-chrome

ENV DISPLAY=:1

# Install Linux packages
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y libxtst6 p7zip-full zip

RUN mkdir -p /root/.cache/electron-builder/winCodeSign/winCodeSign-2.6.0
RUN mkdir -p /root/.cache/electron-builder/nsis/nsis-3.0.4.1
RUN mkdir -p /root/.cache/electron-builder/nsis/nsis-resources-3.4.1

RUN wget https://github.com/electron-userland/electron-builder-binaries/releases/download/nsis-3.0.4.1/nsis-3.0.4.1.7z
RUN wget https://github.com/electron-userland/electron-builder-binaries/releases/download/winCodeSign-2.6.0/winCodeSign-2.6.0.7z
RUN wget https://github.com/electron-userland/electron-builder-binaries/releases/download/nsis-resources-3.4.1/nsis-resources-3.4.1.7z

RUN 7z x winCodeSign-2.6.0.7z -o/root/.cache/electron-builder/winCodeSign/winCodeSign-2.6.0
RUN 7z x nsis-3.0.4.1.7z -o/root/.cache/electron-builder/nsis/nsis-3.0.4.1
RUN 7z x nsis-resources-3.4.1.7z -o/root/.cache/electron-builder/nsis/nsis-resources-3.4.1

WORKDIR /app
