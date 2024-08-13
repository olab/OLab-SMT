import { Log, LogInfo, LogError } from "../utils/Logger";
import log from "loglevel";
import { config } from "../config";

let retryCount = 10;
if (config?.API_RETRY_COUNT) {
  retryCount = Number(config.API_RETRY_COUNT);
}

async function internetJsonFetch(
  method,
  url,
  payload,
  headerOverrides = null,
  settingsOverrides = null
) {
  let tries = 0;

  let headers = {
    "Content-Type": "application/json",
    ...headerOverrides,
  };

  let settings = {
    method: method,
    headers: headers,
    ...settingsOverrides,
  };

  if (payload) {
    settings.body = JSON.stringify(payload);
    // log.debug(`URL: ${url} payload: ${settings.body})`);
  }

  while (tries++ < retryCount) {
    try {
      settings.signal = AbortSignal.timeout(30000);
      const response = await fetch(url, settings);

      let data = {};

      if (settings.responseType == "blob") {
        data.body = response.body;
        data.error_code = 200;
      } else {
        data = await response.json();
      }

      if (data.error_code === 401) {
        log.error(`URL '${url}': access denied ${JSON.stringify(data)}`);
        return data;
      }

      if (data.error_code === 500) {
        log.error(`URL '${url}': server error ${JSON.stringify(data)}`);
        return data;
      }

      if (data.error_code !== 200) {
        log.error(
          `URL '${url}': ${JSON.stringify(data)}. try ${tries} of ${retryCount}`
        );
      } else {
        return data;
      }
    } catch (error) {
      log.error(
        `URL '${url}': ${error.message}. try ${tries} of ${retryCount}`
      );
    }
  }

  log.error(`URL '${url}': max retries ${retryCount} exceeded`);

  return {
    data: "max retries exceeded",
    errorCode: 500,
    message: `${URL}: server error`,
  };
}

async function loginUserAsync(credentials) {
  var payload = {
    UserName: credentials.username,
    Password: credentials.password,
  };
  let url = `${config.API_URL}/auth/login`;

  return await internetJsonFetch("POST", url, payload);
}

async function getUsers(token, searchTerm = null) {
  let url = `${config.API_URL}/auth/getusers`;
  if ( searchTerm != null ) {
    url += searchTerm;
  }
  const data = await internetJsonFetch("GET", url, null, {
    Authorization: `Bearer ${token}`,
  });

  return data;
}

export {
  loginUserAsync,
  getUsers,
};
