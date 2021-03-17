FROM reg.qa.91jkys.com/appenv/node:12

ENV  APP_NAME=telescope-server

COPY --chown=app:app  ./   /app/src/
WORKDIR /app/src
USER app
RUN  npm set registry http://npmreg.qa.91jkys.com &&  npm install   && npm cache clean -f
CMD appctl start