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

      Log(`try #${tries} ${url}`);

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
        LogError(`URL '${url}': access denied ${JSON.stringify(data)}`);
        return data;
      }

      if (data.error_code === 500) {
        LogError(`URL '${url}': server error ${JSON.stringify(data)}`);
        return data;
      }

      if (data.error_code !== 200) {
        LogError(
          `URL '${url}': ${JSON.stringify(data)}. try ${tries} of ${retryCount}`
        );
      } else {
        return data;
      }
    } catch (error) {
      LogError(
        `URL '${url}': ${error.message}. try ${tries} of ${retryCount}`
      );
    }
  }

  LogError(`URL '${url}': max retries ${retryCount} exceeded`);

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
  if (searchTerm != null) {
    url += searchTerm;
  }
  const data = await internetJsonFetch("GET", url, null, {
    Authorization: `Bearer ${token}`,
  });

  return data;
}

async function getGroups(token) {
  let url = `${config.API_URL}/groups`;
  const data = await internetJsonFetch("GET", url, null, {
    Authorization: `Bearer ${token}`,
  });

  return data;
}

async function getRoles(token) {
  let url = `${config.API_URL}/roles`;
  const data = await internetJsonFetch("GET", url, null, {
    Authorization: `Bearer ${token}`,
  });

  return data;
}

async function getMaps(token) {
  let url = `${config.API_URL}/maps`;
  const data = await internetJsonFetch("GET", url, null, {
    Authorization: `Bearer ${token}`,
  });

  return data;
}

async function getNodes(token, mapId) {
  let url = `${config.API_URL}/maps/${mapId}/nodes`;
  const data = await internetJsonFetch("GET", url, null, {
    Authorization: `Bearer ${token}`,
  });

  return data;
}

async function getAcls(
  token, 
  groupId, 
  roleId, 
  mapIds, 
  nodeIds) {

  let url = `${config.API_URL}/acls`;
  const data = await internetJsonFetch("POST", url, {
    groupId: groupId,
    roleId: roleId,
    mapIds: mapIds,
    nodeIds: nodeIds,
  }, {
    Authorization: `Bearer ${token}`,
  });

  return data;

  /*
  return {
    data: [
      {
        id: 1,
        groupName: "All",
        groupId: 0,
        roleName: "All",
        roleId: 0,
        objectType: "All",
        objectIndex: "*",
        read: false,
        write: false,
        execute: false,
      }
    ]
  };
  */
}

export {
  loginUserAsync,
  getGroups,
  getRoles,
  getUsers,
  getMaps,
  getNodes,
  getAcls
};
