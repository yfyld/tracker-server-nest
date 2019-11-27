FROM reg.qa.91jkys.com/appenv/node:10

ENV  APP_NAME=telescope

COPY --chown=app:app  ./   /app/src/
WORKDIR /app/src
USER app
RUN npm install --registry=https://registry.npm.taobao.org  && npm cache clean -f
CMD appctl run prod:91jkys