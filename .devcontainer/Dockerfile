FROM electronuserland/builder:wine

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
    python3-pip \
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
    software-properties-common \
    libgbm1:i386 \
    chromium-browser \
    xvfb

# crcmod is required by gsutil, which is used for filling the gclient git cache
RUN pip install -U crcmod

# dbusmock is needed for Electron tests
RUN pip install python-dbusmock

# Add xvfb init script
ADD tools/xvfb-init.sh /etc/init.d/xvfb
RUN chmod a+x /etc/init.d/xvfb

RUN curl --insecure -o ./sonarscanner.zip -L https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-3.0.3.778-linux.zip && \
    unzip sonarscanner.zip && \
    rm sonarscanner.zip && \
    mv sonar-scanner-3.0.3.778-linux /usr/lib/sonar-scanner && \
    ln -s /usr/lib/sonar-scanner/bin/sonar-scanner /usr/local/bin/sonar-scanner

#USER builduser
WORKDIR /app
