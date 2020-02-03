var Mock = require("mockjs");
const ALY = require("aliyun-sdk");

const sls = new ALY.SLS({
  accessKeyId: "LTAI4FiudjsTsY8LAAVH26CT", // 步骤2获取的密钥
  secretAccessKey: "kjg3UU6oJeVHEZUx0sxS8rthXFP3XC", // 步骤2获取的密钥值
  endpoint: "http://cn-hangzhou.sls.aliyuncs.com",
  apiVersion: "2015-06-01"
});

function aaaa(params) {
  const logGroup = {
    logs: []
  };
  for (let i = 0; i < 1000; i++) {
    const time = Math.floor(
      new Date().getTime() / 1000 - Math.random() * 43200000
    );
    const data = { time, contents: [] };

    data.contents = Mock.mock([
      {
        key: "projectId",
        value: "" + Math.floor(Math.random() * 10)
      },
      {
        key: "clientHeight",
        value: "" + 2350
      },
      {
        key: "clientWidth",
        value: "" + 2350
      },
      {
        key: "title",
        value: "@title"
      },
      {
        key: "libVersion",
        value: "1.0.0"
      },
      {
        key: "libType",
        value: "js"
      },
      {
        key: "referrer",
        value: "@url"
      },
      {
        key: "trackTime",
        value: "" + (time - Math.floor(Math.random() * 1000))
      },
      {
        key: "host",
        value: "yfyld.com"
      },
      {
        key: "actionType",
        value: "PAGE"
      },
      {
        key: "trackId",
        value: /\w/
      },
      {
        key: "endTime",
        value: "" + Math.floor(time + Math.random() * 1000)
      },
      {
        key: "durationTime",
        value: /\d\d\d/
      },

      {
        key: "country",
        value: "中国"
      },
      {
        key: "province",
        value: "浙江"
      },
      {
        key: "city",
        value: "杭州"
      },
      {
        key: "utoken",
        value: /\d\d\d\d\d\d\d\d\d\d\d/
      },
      {
        key: "url",
        value: "http://127.0.0.1:5500"
      },
      {
        key: "ip",
        value: /122\.224\.200\.2\d\d/
      },
      {
        key: "startTime",
        value: "" + time
      },
      {
        key: "path",
        value: "/tracker-sdk/example/trackVue.html"
      },
      {
        key: "ua",
        value:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36"
      }
    ]);

    logGroup.logs.push(data);
  }

  sls.putLogs(
    {
      projectName: "ua-test",
      logStoreName: "data",
      logGroup
    },
    (error, data) => {
      console.log(error, data);
    }
  );
}

for (let i = 0; i < 100; i++) {
  aaaa();
}
