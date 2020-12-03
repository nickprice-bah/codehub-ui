# build stage
FROM node:lts as build-stage

ARG CODEBUILD_GIT_BRANCH
ARG SONAR_TOKEN

ENV DEBIAN_FRONTEND=noninteractive

#update apt-get
#update apt-get
RUN apt-get update && apt-get install -y \
    apt-utils \
    fonts-liberation \
    libappindicator3-1 \
    libatk-bridge2.0-0 \
    libatspi2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxtst6 \
    lsb-release \
    xdg-utils \
    libgtk2.0-0 \
    libnotify-dev \
    libgconf-2-4 \
    libxss1 \
    libasound2 \
    xvfb \
  && rm -rf /var/lib/apt/lists/*

# install chrome
RUN curl --silent --show-error --location --fail --retry 3 --output /tmp/google-chrome-stable_current_amd64.deb https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb \
  && ( dpkg -i /tmp/google-chrome-stable_current_amd64.deb ||  apt-get -fy install)  \
  && rm -rf /tmp/google-chrome-stable_current_amd64.deb \
  &&  sed -i 's|HERE/chrome"|HERE/chrome" --disable-setuid-sandbox --no-sandbox|g' \
          "/opt/google/chrome/google-chrome" \
  && google-chrome --version


RUN npm install -g aurelia-cli@^1.2.0


WORKDIR /app

# install dependencies
COPY ./*.json  ./
RUN npm install

COPY config ./config
COPY aurelia_project  ./aurelia_project

COPY static ./static

# Copy files in the root folder
COPY *.* ./

# Copy source files
COPY src ./src


COPY test ./test

COPY cypress ./cypress


# RUN UNIT TESTS
RUN au test

# RUN E2E TESTS
# RUN npm run e2e:headless

# RUN Sonar
RUN mkdir -p /root/.sonar/sonar-scanner-4.4.0.2170-linux
RUN rm -rf /root/.sonar/sonar-scanner-4.4.0.2170-linux
RUN mkdir -p /root/.sonar/sonar-scanner-4.4.0.2170-linux
RUN curl -ksSLo /root/.sonar/sonar-scanner.zip https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-4.4.0.2170-linux.zip
RUN unzip /root/.sonar/sonar-scanner.zip -d /root/.sonar/
RUN rm /root/.sonar/sonar-scanner.zip
RUN if [ -z ${SONAR_TOKEN} ]; then echo "NO SONAR"; else /root/.sonar/sonar-scanner-4.4.0.2170-linux/bin/sonar-scanner -Dsonar.projectKey=usdot-jpo-codehub_codehub-ui -Dsonar.organization=usdot-jpo-codehub -Dsonar.sources=src -Dsonar.host.url=https://sonarcloud.io -Dsonar.login=${SONAR_TOKEN} -Dsonar.branch.name=${CODEBUILD_GIT_BRANCH} -Dsonar.javascript.lcov.reportPaths=test/coverage-jest/lcov.info; fi

# build
FROM build-stage as publish-stage
RUN au build --env prod

# production stage
FROM nginx:alpine as production-stage
COPY nginx.template.conf /etc/nginx
WORKDIR /usr/share/nginx/html

COPY --from=build-stage /app/entrypoint.sh .
COPY --from=publish-stage /app/dist/ .

EXPOSE 80

CMD ["sh","/usr/share/nginx/html/entrypoint.sh"]
