FROM ubuntu:18.04

ENV DISPLAY=:1

# Install Linux packages
RUN echo ttf-mscorefonts-installer msttcorefonts/accepted-mscorefonts-eula select true | debconf-set-selections
RUN dpkg --add-architecture i386
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y \
    curl \
    libnotify-bin \
    locales \
    lsb-release \
    nano \
    python-dbus \
    python-pip \
    python-setuptools \
    sudo \
    vim-nox \
    wget \
    g++-multilib \
    libgl1:i386 \
    libgtk-3-0:i386 \
    libgdk-pixbuf2.0-0:i386 \
    libdbus-1-3:i386 \
    lsof \
    libgbm1:i386 \
  && mkdir -p /setup \
  && curl https://chromium.googlesource.com/chromium/src/+/HEAD/build/install-build-deps.sh\?format\=TEXT | base64 --decode | cat > /setup/install-build-deps.sh \
  && chmod +x /setup/install-build-deps.sh \
  && bash /setup/install-build-deps.sh --syms --no-prompt --no-chromeos-fonts --lib32 --arm \
  && rm -rf /var/lib/apt/lists/*

# Install Node.js
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash - \
  && DEBIAN_FRONTEND=noninteractive apt-get install -y nodejs \
  && rm -rf /var/lib/apt/lists/*

# crcmod is required by gsutil, which is used for filling the gclient git cache
RUN pip install -U crcmod

# dbusmock is needed for Electron tests
RUN pip install python-dbusmock

# Add xvfb init script
ADD tools/xvfb-init.sh /etc/init.d/xvfb
RUN chmod a+x /etc/init.d/xvfb

#USER builduser
WORKDIR /app
