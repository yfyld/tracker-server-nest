FROM reg.qa.91jkys.com/appenv/node:10

ENV  APP_NAME=telescope

COPY --chown=app:app  ./   /app/src/
WORKDIR /app/src
USER app
RUN npm install  && npm cache clean -f
CMD appctl run prod:91jkys