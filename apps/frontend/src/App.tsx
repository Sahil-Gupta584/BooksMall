const f = {
  message: "Request failed with status code 500",
  name: "AxiosError",
  stack:
    "AxiosError: Request failed with status code 500\n    at settle (http://localhost:5173/node_modules/.vite/deps/axios.js?v=0fccb3bd:1229:12)\n    at XMLHttpRequest.onloadend (http://localhost:5173/node_modules/.vite/deps/axios.js?v=0fccb3bd:1561:7)\n    at Axios.request (http://localhost:5173/node_modules/.vite/deps/axios.js?v=0fccb3bd:2119:41)\n    at async onSubmit (http://localhost:5173/src/routes/_protected/feedbacks/index.tsx?t=1749283519986&tsr-split=component:165:19)\n    at async http://localhost:5173/node_modules/.vite/deps/react-hook-form.js?v=0fccb3bd:1481:9",
  config: {
    transitional: {
      silentJSONParsing: true,
      forcedJSONParsing: true,
      clarifyTimeoutError: false,
    },
    adapter: ["xhr", "http", "fetch"],
    transformRequest: [null],
    transformResponse: [null],
    timeout: 0,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    maxContentLength: -1,
    maxBodyLength: -1,
    env: {},
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
    method: "post",
    url: "/api/feedbacks/create",
    data: '{"feedback":{"id":"f1749283522932","user":"683c8cc2c9b96d3f2c413741","title":"book 2222222222","content":"c","category":"general","upvotedBy":["683c8cc2c9b96d3f2c413741"]}}',
    allowAbsoluteUrls: true,
  },
  code: "ERR_BAD_RESPONSE",
  status: 500,
};
