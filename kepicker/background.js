const extensionVersion = chrome.runtime.getManifest().version;

let is_local = false;
let url = is_local
  ? "http://localhost:4000"
  : "https://bbymt5vudd.execute-api.eu-central-1.amazonaws.com";

const awsRegion = "eu-central-1"; // e.g., 'us-east-1'
const userPoolId = "eu-central-1_R6AWA8Juv";
const clientId = "575tk81rvg1obcfd9c3762t1uk";
const userPoolEndpoint = `https://cognito-idp.${awsRegion}.amazonaws.com`;

const updatePreferences = async (user) => {
  console.log("updatePreferences", user);

  const selectedPreference = user?.preferences?.find(
    (preference) => preference.selected
  );
  await prefencesServerDataTransformer(selectedPreference);
};

const updateCaches = async (data) => {
  const user = decodeJWT(data.AuthenticationResult.IdToken);
  const bearer = data.AuthenticationResult.AccessToken;
  const refreshToken = data.AuthenticationResult.RefreshToken;
  const idToken = data.AuthenticationResult.IdToken;
  const accessToken = data.AuthenticationResult.AccessToken;
  const expireTime = Date.now() + 3600000;

  await setCache("user", JSON.stringify(user));

  await setPreference("bearer", bearer);
  await updatePreferences(user);

  await setCache("refreshToken", refreshToken);

  await setCache("idToken", idToken);

  await setCache("accessToken", accessToken);

  await setCache("expireTime", expireTime);

  await setCache("sessionId", user?.sessionId);

  await setCache("preferences", JSON.stringify(user?.preferences));

  return {
    user: decodeJWT(data.AuthenticationResult.IdToken),
    idToken: data.AuthenticationResult.IdToken,
    accessToken: data.AuthenticationResult.AccessToken,
    refreshToken: data.AuthenticationResult.RefreshToken,
  };
};

const versionCheck = async (body) => {
  if (body?.version_update_required) {
    await sendMessageToContentScript(
      "versionUpdateRequired",
      body.version,
      null
    );
    return;
  } else {
    return body;
  }
};

const signIn = async (username, password) => {
  const authParams = {
    USERNAME: username,
    PASSWORD: password,
  };

  const requestBody = {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: clientId,
    AuthParameters: authParams,
  };

  const res = await fetch(userPoolEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-amz-json-1.1",
      "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth",
    },
    body: JSON.stringify(requestBody),
  });
  const data = await res.json();

  if (data.AuthenticationResult) {
    await updateCaches(data);
    return await syncUser(data.AuthenticationResult.AccessToken);

    // Store tokens securely, handle session, etc.
  } else {
    //if that fails too, sent notification to content script
    await sendMessageToContentScript("signInFailed", data.message, null);
    return false;
    // Handle authentication failure, prompt user, etc.
  }
};

const refreshAccessTokenByRefreshToken = async () => {
  const refreshToken = await getCache("refreshToken");

  if (refreshToken === null || refreshToken?.length < 1) return false;
  const authParams = {
    REFRESH_TOKEN: refreshToken,
  };

  const requestBody = {
    AuthFlow: "REFRESH_TOKEN_AUTH",
    ClientId: clientId,
    AuthParameters: authParams,
  };

  const res = await fetch(userPoolEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-amz-json-1.1",
      "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth",
    },
    body: JSON.stringify(requestBody),
  });

  const data = await res.json();

  if (data?.AuthenticationResult) {
    await updateCaches(data);

    return await syncUser(data.AuthenticationResult.AccessToken);
  } else {
    await resetApp();
    return false;
  }
};

const getSingleProduct = async (asin, tryCount = 0) => {
  await checkExpired();
  //send post request to /sp-api/roi with bearers
  const bearer = await getCache("accessToken");

  const sessionId = await getCache("sessionId");
  const response = await fetch(`${url}/sp-api/roi`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${bearer}`,
    },
    body: JSON.stringify({
      asin,
      sessionId,
      version: extensionVersion,
    }),
  });
  if (response.status === 401) {
    await refreshAccessTokenByRefreshToken();
    console.log("401");
    await removeTaskByType("productPage");
    // await getSingleProduct(asin, target_domain, base_domain, is_fba, currency, shipping_deal, fetch_keepa_data, tryCount + 1);
  }
  //response status is 403 then refresh token

  if (response.status === 403) {
    await resetApp();
  }

  if (!response.ok) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (tryCount < 3) {
      await getSingleProduct(asin, tryCount + 1);
    } else {
      //if tried 3 times, return empty array
      await sendMessageToContentScript(
        "notification",
        { message: "Network problem!" },
        null
      );
      return [];
    }
  }

  const data = await response.json();
  console.log("data from single data", data);
  if (data?.statusMessage) {
    await sendMessageToContentScript(
      "updateStatusMessage",
      { message: data?.statusMessage },
      null
    );
  }
  return await versionCheck(data);
};

const getRates = async () => {
  const bearer = await getCache("accessToken");

  const response = await fetch(`${url}/currency/USD`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${bearer}`,
    },
  });
  const data = await response.json();
  //add timestamp to data
  data.timestamp = Date.now();
  return data;
};

const calculateManualFees = async (
  asin,
  basePrice,
  targetPrice,
  shippingCost,
  monthlyStorageFee,
  weight,
  tryCount = 0
) => {
  await checkExpired();
  const bearer = await getCache("accessToken");
  const sessionId = await getCache("sessionId");

  try {
    const response = await fetch(`${url}/sp-api/roiManual`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${bearer}`,
      },
      body: JSON.stringify({
        asin,
        basePrice,
        targetPrice,
        shippingCost,
        monthlyStorageFee,
        weight,
        sessionId,
        version: extensionVersion,
      }),
    });
    if (response.status === 401) {
      await refreshAccessTokenByRefreshToken();
      await calculateManualFees(
        asin,
        basePrice,
        targetPrice,
        shippingCost,
        monthlyStorageFee,
        weight,
        tryCount + 1
      );
    }
    if (!response.ok) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (tryCount < 3) {
        return await calculateManualFees(
          asin,
          basePrice,
          targetPrice,
          shippingCost,
          monthlyStorageFee,
          weight,
          tryCount + 1
        );
      } else {
        //if tried 3 times, return empty array
        await sendMessageToContentScript(
          "notification",
          { message: "Network problem!" },
          request.domain
        );
        return [];
      }
    }

    const data = await response.json();

    return data;
  } catch (error) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (tryCount < 3) {
      return await calculateManualFees(
        asin,
        basePrice,
        targetPrice,
        shippingCost,
        monthlyStorageFee,
        weight,
        tryCount + 1
      );
    } else {
      //if tried 3 times, return empty array
      await sendMessageToContentScript(
        "notification",
        { message: "Network problem!" },
        request.domain
      );
      return [];
    }
  }
};

const checkProtection = async (sellerId) => {
  const bearer = await getCache("accessToken");
  try {
    const response = await fetch(`${url}/asinLists/checkProtection`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bearer}`,
      },
      body: JSON.stringify({
        seller_id: sellerId,
      }),
    });
    const data = await response.json();
    console.log("check protection response", data?.is_protected);
    return data?.is_protected;
  } catch (error) {
    console.log("check protection error", error);
    return true;
  }
};

const saveAsinList = async (name, from, seller_id, asinArr) => {
  const bearer = await getCache("accessToken");

  if (asinArr.length < 1) {
    await sendMessageToContentScript(
      "notification",
      { message: "Please import excel with asins" },
      null
    );
    return false;
  }
  if (asinArr.length > 5000) {
    //split asin arr to 5000 parts and send request for each part
    const splittedArr = splitArrayIntoChunks(asinArr, 5000);
    for (let i = 0; i < splittedArr.length; i++) {
      await saveAsinList(
        `${name}-(${i + 1}/${splittedArr.length})`,
        from,
        seller_id,
        splittedArr[i]
      );
    }

    return false;
  }

  console.log("check protection called", bearer, seller_id);
  const response = await fetch(`${url}/asinLists`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${bearer}`,
    },
    body: JSON.stringify({
      name,
      from,
      seller_id,
      asinArr,
      version: extensionVersion,
    }),
  });
  console.log("saveAsinList response", response);
  if (response.status === 401) {
    await refreshAccessTokenByRefreshToken();
    console.log("401");
    await removeTaskByType("productPage");
    // await getSingleProduct(asin, target_domain, base_domain, is_fba, currency, shipping_deal, fetch_keepa_data, tryCount + 1);
  }
  if (response.status === 200) {
    return false;
  } else {
    return true;
  }
};

const sendAction = async (asinListId, action) => {
  const bearer = await getCache("accessToken");

  console.log("startComparisonProcess called");
  const response = await fetch(`${url}/actions/${action}/${asinListId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${bearer}`,
    },
  });
  console.log("saveAsinList response", response);
  if (response.status === 401) {
    await refreshAccessTokenByRefreshToken();
    console.log("401");
    await removeTaskByType("productPage");
    // await getSingleProduct(asin, target_domain, base_domain, is_fba, currency, shipping_deal, fetch_keepa_data, tryCount + 1);
  }
  if (response.status === 200) {
    return false;
  } else {
    return true;
  }
};

const getAsinLists = async () => {
  const bearer = await getCache("accessToken");

  const response = await fetch(`${url}/asinLists`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${bearer}`,
    },
  });
  console.log("getAsinLists response", response);
  if (response.status === 401) {
    await refreshAccessTokenByRefreshToken();
    console.log("401");
    await removeTaskByType("productPage");
    // await getSingleProduct(asin, target_domain, base_domain, is_fba, currency, shipping_deal, fetch_keepa_data, tryCount + 1);
  }
  if (response.status === 200) {
    const data = await response.json();
    await setCache("asinLists", JSON.stringify(data));
    return data;
  } else {
    return [];
  }
};

const getAsinListAsins = async (asinListId) => {
  const bearer = await getCache("accessToken");

  const response = await fetch(`${url}/asinLists/${asinListId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${bearer}`,
    },
  });
  console.log("getAsinLists response", response);
  if (response.status === 401) {
    await refreshAccessTokenByRefreshToken();
    console.log("401");
    await removeTaskByType("productPage");
    // await getSingleProduct(asin, target_domain, base_domain, is_fba, currency, shipping_deal, fetch_keepa_data, tryCount + 1);
  }
  if (response.status === 200) {
    const data = await response.json();
    return data;
  } else {
    return [];
  }
};

const getAllAsinListAsins = async () => {
  const bearer = await getCache("accessToken");

  const response = await fetch(`${url}/asinLists/all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${bearer}`,
    },
  });
  console.log("getAsinLists response", response);
  if (response.status === 401) {
    await refreshAccessTokenByRefreshToken();
    console.log("401");
    await removeTaskByType("productPage");
    // await getSingleProduct(asin, target_domain, base_domain, is_fba, currency, shipping_deal, fetch_keepa_data, tryCount + 1);
  }
  if (response.status === 200) {
    const data = await response.json();
    return data;
  } else {
    return [];
  }
};
const getAllAsinListSingleAsins = async () => {
  const bearer = await getCache("accessToken");

  const response = await fetch(`${url}/asinLists/allSingle`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${bearer}`,
    },
  });
  console.log("getAsinLists response", response);
  if (response.status === 401) {
    await refreshAccessTokenByRefreshToken();
    console.log("401");
    await removeTaskByType("productPage");
    // await getSingleProduct(asin, target_domain, base_domain, is_fba, currency, shipping_deal, fetch_keepa_data, tryCount + 1);
  }
  if (response.status === 200) {
    const data = await response.json();
    return data;
  } else {
    return [];
  }
};
const deleteAsinList = async (asinListId) => {
  const bearer = await getCache("accessToken");

  const response = await fetch(`${url}/asinLists/${asinListId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${bearer}`,
    },
  });
  console.log("deleteAsinList response", response);
  if (response.status === 401) {
    await refreshAccessTokenByRefreshToken();
    console.log("401");
    await removeTaskByType("productPage");
    // await getSingleProduct(asin, target_domain, base_domain, is_fba, currency, shipping_deal, fetch_keepa_data, tryCount + 1);
  }
  if (response.status === 200) {
    const data = await response.json();
    return data;
  } else {
    return [];
  }
};

const sendStockRequest = async (asin, domain) => {
  const bearer = await getCache("accessToken");

  const response = await fetch(`${url}/stockFetcherTrigger`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${bearer}`,
    },
    body: JSON.stringify({ asin, domain }),
  });
  console.log("sendStockRequest response", response);
  if (response.status === 401) {
    await refreshAccessTokenByRefreshToken();
    console.log("401");
  }
  if (response.status === 200) {
    const data = await response.json();
    return data;
  } else {
    return [];
  }
};

const poolStockRequest = async (stockId) => {
  const bearer = await getCache("accessToken");

  const response = await fetch(`${url}/stock/${stockId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${bearer}`,
    },
  });
  console.log("sendStockRequest response", response);
  if (response.status === 401) {
    await refreshAccessTokenByRefreshToken();
    console.log("401");
  }
  if (response.status === 200) {
    const data = await response.json();
    return data;
  } else {
    return [];
  }
};

const sendReport = async (data) => {
  const bearer = await getCache("accessToken");

  const response = await fetch(`${url}/reports`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${bearer}`,
    },
    body: JSON.stringify({
      ...data,
      details: data?.details + "from url:" + data?.currentUrl,
    }),
  });
  console.log("sendReport response", response);
  if (response.status === 200) {
    const data = await response.json();
    return data;
  } else {
    return [];
  }
};

const updateUserPreferences = async () => {
  const prefences = await getPreferences();
  const bearer = await getCache("accessToken");
  const response = await fetch(`${url}/profile/preferences`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${bearer}`,
    },
    body: JSON.stringify({
      isFba: prefences.isFba,
      isKeepa: prefences.isKeepa,
      isDiscount: prefences.isDiscount,
      currency: prefences.currency,
      baseDomain: prefences.baseDomain,
      targetDomain: prefences.targetDomain,
      shippingDeal: prefences.shippingDeal,
      vatType: prefences.vatType,
      vatPercentage: prefences.vatPercentage,
      version: extensionVersion,
    }),
  });
  console.log("getAsinLists response", response);
  if (response.status === 401) {
    await refreshAccessTokenByRefreshToken();
    console.log("401");
    await removeTaskByType("productPage");
    // await getSingleProduct(asin, target_domain, base_domain, is_fba, currency, shipping_deal, fetch_keepa_data, tryCount + 1);
  }
  if (response.status === 200) {
    const data = await response.json();
    return data;
  } else {
    return [];
  }
};
const syncUser = async () => {
  const bearer = await getCache("accessToken");
  const response = await fetch(`${url}/preferences`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${bearer}`,
    },
  });
  const data = await response.json();
  //get default preference

  await setCache("user", JSON.stringify(data?.user));
  await setCache("allPreferences", JSON.stringify(data?.preferences));

  const selectedPreference = data?.preferences?.find(
    (preference) => preference?.selected
  );
  await prefencesServerDataTransformer(selectedPreference);
  await setCache("selectedPreferenceId", selectedPreference?.id);

  await sendMessageToContentScript("refreshPage", null, null);

  return data;
};
const selectPreference = async (preferenceId) => {
  const bearer = await getCache("accessToken");

  const response = await fetch(`${url}/preferences/select/${preferenceId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${bearer}`,
    },
  });
  const data = await response.json();
  //get default preference

  await setCache("user", JSON.stringify(data?.user));
  await setCache("allPreferences", JSON.stringify(data?.preferences));

  const selectedPreference = data?.preferences?.find(
    (preference) => preference?.selected
  );
  await prefencesServerDataTransformer(selectedPreference);
  await setCache("selectedPreferenceId", selectedPreference?.id);

  //await sendMessageToContentScript("refreshPage", null, null);

  return data;
};
const createPreference = async (preference) => {
  const bearer = await getCache("accessToken");

  const response = await fetch(`${url}/preferences`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${bearer}`,
    },
    body: JSON.stringify(preference),
  });
  const data = await response.json();
  //get default preference

  await setCache("user", JSON.stringify(data?.user));
  await setCache("allPreferences", JSON.stringify(data?.preferences));

  const selectedPreference = data?.preferences?.find(
    (preference) => preference?.selected
  );
  await prefencesServerDataTransformer(selectedPreference);

  return data;
};
const updatePreference = async (preference) => {
  const bearer = await getCache("accessToken");

  const response = await fetch(`${url}/preferences/${preference?.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${bearer}`,
    },
    body: JSON.stringify(preference),
  });
  const data = await response.json();
  //get default preference

  await setCache("user", JSON.stringify(data?.user));
  await setCache("allPreferences", JSON.stringify(data?.preferences));

  const selectedPreference = data?.preferences?.find(
    (preference) => preference?.selected
  );
  await prefencesServerDataTransformer(selectedPreference);

  return data;
};
const deletePreference = async (preferenceId) => {
  const bearer = await getCache("accessToken");

  const response = await fetch(`${url}/preferences/${preferenceId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${bearer}`,
    },
  });
  const data = await response.json();
  //get default preference

  await setCache("user", JSON.stringify(data?.user));
  await setCache("allPreferences", JSON.stringify(data?.preferences));

  const selectedPreference = data?.preferences?.find(
    (preference) => preference?.selected
  );
  await prefencesServerDataTransformer(selectedPreference);

  return data;
};
const deleteMultipleAsinLists = async (asinlistIds) => {
  const bearer = await getCache("accessToken");

  const response = await fetch(`${url}/asinLists/multiple`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${bearer}`,
    },
    body: JSON.stringify({ asinListIds: asinlistIds }),
  });
  const data = await response.json();
  //get default preference
  await sendMessageToContentScript(
    "notification",
    { message: "Asin lists deleted successfully" },
    null
  );
  return data;
};
const mergeAsinLists = async (asinlistIds) => {
  const bearer = await getCache("accessToken");

  const response = await fetch(`${url}/asinLists/merge`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${bearer}`,
    },
    body: JSON.stringify({ asinListIds: asinlistIds }),
  });
  const data = await response.json();
  //get default preference
  await sendMessageToContentScript(
    "notification",
    { message: "Asin lists merged successfully" },
    null
  );
  return data;
};

const addToSheet = async (data) => {
  console.log("addToSheet called");
  const bearer = await getCache("accessToken");

  const user = await getCache("user");
  console.log("user", user);
  if (user?.google_sheet_enabled) {
    const response = await fetch(`${url}/sheet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${bearer}`,
      },
      body: JSON.stringify(data),
    });
    //get default preference
    await sendMessageToContentScript(
      "notification",
      { message: "Asin added to Google Sheet successfully!" },
      null
    );
    return response.data;
  } else {
    await sendMessageToContentScript(
      "notification",
      { message: "Please connect your Google Sheet account from your panel!" },
      null
    );
  }
};
const checkExpired = async () => {
  const expireTime = await getCache("expireTime");
  const refreshToken = await getCache("refreshToken");

  if (!refreshToken) {
    await resetApp();
  } else if (expireTime < Date.now()) {
    await refreshAccessTokenByRefreshToken();
  } else if (expireTime < Date.now() + 600000) {
    await refreshAccessTokenByRefreshToken();
  }
};

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
//create a function that waits for a specified amount of time
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
let counter = 0;

//create an async function to send a message to the content script
async function sendMessageToContentScript(type, data, domain) {
  console.log("sendMessageToContentScript triggered", type, domain);
  //get all tabs
  const tabs = await chrome.tabs.query({});
  //find the active tab and make sure it matchs /amazon\./
  //console.log(tabs, domain);
  let tab;
  if (domain) {
    tab = tabs.filter((tab) => tab.url.includes(domain));
    console.log("sending to specific domain", tab);
  } else {
    //send all amazon tabs
    console.log("sending to all amazon tabs", counter);
    tab = tabs.filter((tab) => tab.url.includes("www.amazon."));
  }
  console.log(
    "tab",
    tab,
    tab?.length,
    tab?.length ? "true" : "false",
    counter < 3 ? "true" : "false",
    counter
  );
  if (tab?.length && counter < 3) {
    console.log("sending message to tab", tab, counter);
    await Promise.all(
      tab.map(async (t) => {
        console.log("sending message to tab", t, counter);

        chrome.tabs
          .sendMessage(t.id, { type: type, data: data, domain: t.url })
          .then((response) => {
            console.log("response", response);
            counter = 0;
          })
          .catch((err) => {
            counter++;
            if (counter > 2) {
              counter = 0;
              return;
            }
            console.log("err", err, counter);
            return;
            //remove the task by domain
            removeTaskByDomain(domain).then(() => {
              console.log("error on sending message to content script", err);
            });
          });
      })
    );
  } else {
    console.log("I am here");
    counter = 0;
    await removeTaskByDomain(domain);
  }
}
async function removeTaskByDomain(domain) {
  console.log("removeTaskByDomain", domain);
  //get tasks
  const tasks = await getTasks();
  console.log("tasks to remove", tasks, domain);
  //filter tasks
  const filteredTasks = tasks?.filter((task) => task.domain !== domain);
  //set tasks
  await setCache("tasks", JSON.stringify(filteredTasks));
}

//create a function that checks the chrome cache with a specified key if key is null then return all keys
async function getCache(key, domain) {
  return new Promise((resolve) => {
    chrome.storage.local.get(
      `${domain ? domain : "main"}-${key}`,
      function (result) {
        if (result[`${domain ? domain : "main"}-${key}`]) {
          let r = "";
          //check if the result is a stringified json
          try {
            r = JSON.parse(result[`${domain ? domain : "main"}-${key}`]);
          } catch (error) {
            r = result[`${domain ? domain : "main"}-${key}`];
          }

          resolve(r);
        } else {
          resolve(null);
        }
      }
    );
  });
}

async function getMultipleCache(keys, domain) {
  return new Promise((resolve) => {
    chrome.storage.local.get(
      keys.map((key) => `${domain ? domain : "main"}-${key}`),
      function (result) {
        resolve(result);
      }
    );
  });
}
//create a function that sets the chrome cache with a specified key and value
async function setCache(key, value, domain) {
  return new Promise((resolve) => {
    chrome.storage.local.set(
      { [`${domain ? domain : "main"}-${key}`]: value },
      function () {
        resolve();
      }
    );
  });
}

//create a function that removes the chrome cache with a specified key if key is null then remove all keys
async function removeCache(key, domain) {
  return new Promise((resolve) => {
    chrome.storage.local.remove(
      `${domain ? domain : "main"}-${key}`,
      function () {
        resolve();
      }
    );
  });
}
//create a function that sets the preferences
async function setPreferences(preferences) {
  await setCache("preferences", JSON.stringify(preferences), "main");
}

async function setPreference(key, value) {
  const preferences = await getPreferences();
  if (preferences && preferences[key]) {
    preferences[key] = value;
    await setCache("preferences", JSON.stringify(preferences), "main");
  } else {
    console.log("key not found", key);
    await setCache("preferences", JSON.stringify({ [key]: value }), "main");
  }
}

//create a function that gets the preferences
async function getPreferences(key) {
  const preferences = await getCache("preferences", "main");
  if (key) {
    return preferences[key];
  } else {
    return preferences;
  }
}

//create a function that sets the remaining token count
async function setRemainingTokenCount(count) {
  await setCache("remainingTokenCount", count, "main");
}

//create a function that gets the remaining token count
async function getRemainingTokenCount() {
  const count = await getCache("remainingTokenCount", "main");
  return count;
}

//create a function that sets the product page data with asin and today's date (MM/DD/YYYY)
async function setProductPageData(asin, data, domain) {
  const dataName = `${asin}-${new Date().toLocaleDateString()}`;
  await setCache(dataName, JSON.stringify(data), domain);
}

//create a function that gets the product page data with asin and today's date (MM/DD/YYYY)
//if the data is not found, return null and remove all data with that asin
async function getProductPageData(asin, domain) {
  const dataName = `${asin}-${new Date().toLocaleDateString()}`;
  const data = await getCache(dataName, domain);
  if (data) {
    return JSON.parse(JSON.stringify(data));
  } else {
    await removeProductPageData(asin);
    return null;
  }
}
//get all chrome storage keys
async function getAllCacheKeys() {
  return new Promise((resolve) => {
    chrome.storage.local.get(null, function (result) {
      resolve(result);
    });
  });
}

//remove all chrome storage keys
async function removeAllCacheKeys() {
  return new Promise((resolve) => {
    chrome.storage.local.clear(function () {
      resolve();
    });
  });
}

//create a function that removes the product page data with asin
async function removeProductPageData(asin, domain) {
  const keys = await getAllCacheKeys();
  for (const key in keys) {
    if (key.includes(`${domain}-${asin}`)) {
      await removeCache(key, domain);
    }
  }
}

function getTodaysDate() {
  return new Date().toLocaleDateString();
}
function getAsinsFromHtml(html) {
  const regex = /\/([A-Z0-9]{10})\//g;
  let found = html?.match(regex);
  found = found ? found.map((asin) => asin.replace(/\//g, "")) : [];

  return [...new Set(found)];
}
function checkArrayIfAlreadyIncludesAllItemsOfArray(array, items) {
  return items?.every((item) => array?.includes(item));
}
function updateDbDataForContentScript(data) {
  return data.map((i) => {
    const id = i.id;
    delete i.id;
    return {
      id: id,
      data: i,
    };
  });
}
async function getBearer() {
  console.log("getBearer", await getCache("accessToken"));
  return await getCache("accessToken");
}
async function convertCurrency(amount, from, to) {
  const rates = await getCache("exchangeRate");
  //it is always in usd so convert to usd first then to the target currency
  const convertedToUsd = convertCurrencyToUsd(rates, amount, from);
  const convertedToTarget = convertUsdToCurrency(rates, convertedToUsd, to);
  return convertedToTarget;
}
function convertCurrencyToUsd(rates, amount, from) {
  return rates[from] ? parseFloat(amount / rates[from]).toFixed(2) : amount;
}
function convertUsdToCurrency(rates, amount, to) {
  return rates[to] ? parseFloat(amount * rates[to]).toFixed(2) : amount;
}
function decodeJWT(jwtToken) {
  const payload = jwtToken.split(".")[1];
  const base64 = payload
    .replace("-", "+")
    .replace("_", "/")
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
}
function makeUniqueWithKey(array, key) {
  return [...new Map(array.map((item) => [item[key], item])).values()];
}
function flatComparisonData(comparisonData) {
  return comparisonData.map((i) => {
    return {
      ...i,
      hasDiscounts: i.baseDomainData?.summary?.hasDiscounts,
      percentage: parseFloat(
        (parseFloat(i.targetDomainPrice) / parseFloat(i.baseDomainPrice)) *
          100.0
      ).toFixed(2),
      profitPerItem: (
        (parseFloat(i.roi) * parseFloat(i.baseDomainPrice)) /
        100.0
      ).toFixed(2),
      sellerCount: i?.targetDomainData?.summary.sellerCount,
      fbaSellerCount: i?.targetDomainData?.summary.fbaSellerCount,
      fbmSellerCount: i?.targetDomainData?.summary.fbmSellerCount,
      isAmazonIsSeller: i?.targetDomainData?.summary.isAmazonIsSeller,
    };
  });
}
async function getCacheWithPrefix(prefix, domain = "main") {
  return new Promise((resolve) => {
    chrome.storage.local.get(null, function (result) {
      const keys = Object.keys(result);
      const filteredKeys = keys.filter((key) =>
        key.includes(`${domain}-${prefix}`)
      );
      const filteredResult = {};
      filteredKeys.forEach((key) => {
        if (typeof result[key] === "string") {
          //check if parse float is NaN
          if (
            !isNaN(parseFloat(JSON.parse(result[key]))) &&
            JSON.parse(result[key]) !== null
          ) {
            filteredResult[key] = parseFloat(JSON.parse(result[key]));
          } else {
            filteredResult[key] = JSON.parse(result[key]);
          }
        }
        if (typeof result[key] === "object") filteredResult[key] = result[key];
      });
      resolve(filteredResult);
    });
  });
}
async function applyFilters(data) {
  //get filters
  const filters = await getCacheWithPrefix("filter");
  console.log(filters);
  //get available filter names main-filter-basePrice-max the 3rd one
  let filterNames = Object.keys(filters).map((i) => i.split("-")[2]);
  //remove duplicates
  filterNames = [...new Set(filterNames)];
  console.log(filterNames);
  //filter data
  let filteredData = data;
  filteredData = filteredData.map((i) => {
    return { ...i, filteredOut: false };
  });
  filterNames.forEach((filterName) => {
    const max = parseFloat(filters[`main-filter-${filterName}-max`]);
    const min = parseFloat(filters[`main-filter-${filterName}-min`]);
    const booleanFilters = filters[`main-filter-${filterName}-boolean`];
    console.log(max, min, booleanFilters);
    console.log("first", (max == 0 || max) && !min);
    console.log("second", (min == 0 || min) && !max);
    console.log("third", (min == 0 || min) && (max == 0 || max));

    if ((max == 0 || max) && !min) {
      console.log("first", max, min);
      filteredData = filteredData.map((i) => {
        return {
          ...i,
          filteredOut: i.filteredOut
            ? i.filteredOut
            : parseFloat(i[filterName]) > max,
        };
      });
    }
    if ((min == 0 || min) && !max) {
      console.log("second", max, min);
      filteredData = filteredData.map((i) => {
        return {
          ...i,
          filteredOut: i.filteredOut
            ? i.filteredOut
            : parseFloat(i[filterName]) < min,
        };
      });
    }
    if ((min == 0 || min) && (max == 0 || max)) {
      console.log("third", max, min);
      filteredData = filteredData.map((i) => {
        return {
          ...i,
          filteredOut: i.filteredOut
            ? i.filteredOut
            : parseFloat(i[filterName]) < min ||
              parseFloat(i[filterName]) > max,
        };
      });
    }
    if (booleanFilters) {
      console.log("boolean", booleanFilters);
      filteredData = filteredData.map((i) => {
        console.log(i[filterName], booleanFilters);
        const booleanFilterValue = booleanFilters === "true" ? true : false;
        return {
          ...i,
          filteredOut: i.filteredOut
            ? i.filteredOut
            : i[filterName] !== booleanFilterValue,
        };
      });
    }
  });
  return filteredData;
}
async function removeTaskByType(type) {
  //get tasks
  const tasks = await getTasks();
  //filter tasks
  const filteredTasks = tasks?.filter((task) => task.type !== type);
  //set tasks
  await setCache("tasks", JSON.stringify(filteredTasks));
}
function parseInContentScript(type, data, attempt = 0) {
  const maxAttempts = 3; // Set the maximum number of attempts

  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (chrome.runtime.lastError) {
        if (attempt < maxAttempts) {
          console.log(`Retrying... Attempt ${attempt + 1}`);
          //wait 1 sec
          new Promise((res) => setTimeout(res, 1000));
          resolve(parseInContentScript(type, data, attempt + 1)); // Retry
        } else {
          //remove the task
          removeTaskByType("productPage").then(() => {
            console.log("error on parsing html 11", chrome.runtime.lastError);
            //reject(chrome.runtime.lastError);
          });
        }
        return;
      }
      try {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(
            tabs[0].id,
            { action: "parseHtml", type, data },
            (response) => {
              if (chrome.runtime.lastError) {
                if (attempt < maxAttempts) {
                  console.log(`Retrying... Attempt ${attempt + 1}`);
                  new Promise((res) => setTimeout(res, 1000));
                  resolve(parseInContentScript(type, data, attempt + 1)); // Retry
                } else {
                  removeTaskByType("productPage").then(() => {
                    console.log(
                      "error on parsing html 2",
                      chrome.runtime.lastError
                    );
                    reject(chrome.runtime.lastError);
                  });
                }
              } else {
                resolve(response);
              }
            }
          );
        } else {
          if (attempt < maxAttempts) {
            console.log(`Retrying... Attempt ${attempt + 1}`);
            new Promise((res) => setTimeout(res, 1000));
            resolve(parseInContentScript(type, data, attempt + 1)); // Retry
          } else {
            removeTaskByType("productPage").then(() => {
              console.log("error on parsing html 2", chrome.runtime.lastError);
              reject(chrome.runtime.lastError);
            });
          }
        }
      } catch (error) {
        removeTaskByType("productPage").then(() => {
          console.log("error on parsing html 4", error);
          reject(console.error());
        });
      }
    });
  });
}
function getSellerIdFromUrl(url) {
  return url?.split("me=")[1]?.split("&")[0] || null;
}

function comparisonServerDataTransformer(data) {
  return {
    asin: data.asin,
    title: data.additionalData?.Title,
    hasDiscounts: data.baseOffers?.hasDiscount,
    baseDomainPrice: data.baseDomainPrice,
    targetDomainPrice: data.targetDomainPrice,
    shippingCost: data.shippingCost,
    fee: parseFloat(data.fees).toFixed(2),
    roi: data.roi,
    profitPerItem: data.profitPerItem,
    isAmazonIsSeller: "N/A",
    salesRank: data.targetOffers?.salesRank,
    brand: data.additionalData?.Brand,
    binding: data.additionalData?.Binding,
    productGroup: data.additionalData?.ProductGroup,
    productTypeName: data.additionalData?.ProductTypeName,
    ItemDimensions: data.additionalData?.ItemDimensions,
    PackageDimensions: data.additionalData?.PackageDimensions,
    stockError: data.stockError,
    calculated: data.calculated,
    totalSellerCount:
      parseInt(data.targetOffers?.fbaOffersCount || 0) +
      parseInt(data.targetOffers?.fbmOffersCount || 0),
    fbaSellerCount: data.targetOffers?.fbaOffersCount,
    fbmSellerCount: data.targetOffers?.fbmOffersCount,
  };
}

async function prefencesServerDataTransformer(data) {
  let currentPreferences = await getPreferences();
  console.log("currentPreferences", currentPreferences, data);
  const language = await getSelectedLanguage();

  currentPreferences = currentPreferences?.[0]
    ? JSON.parse(currentPreferences?.[0])
    : null;
  currentPreferences = {
    ...currentPreferences,
    baseDomain: data?.base_domain,
    targetDomain: data?.target_domain,
    shippingDeal: data?.shipping_deal,
    shippingType: data?.shipping_type,
    labelingDeal: data?.labeling_deal,
    currency: data?.currency,
    fixedDeal: data?.fixed_deal,
    isFba: data?.is_fba,
    isKeepa: data?.uses_keepa,
    isDiscount: data?.include_discounts,
    vatType: data?.vat_type,
    vatPercentage: data?.vat_percentage,
    language: language,
  };

  console.log("currentPreferences", currentPreferences);
  //update preferences
  await setCache("preferences", JSON.stringify(currentPreferences));
}
function generateSimpleID() {
  //genereate a simple id
  return (
    new Date().getTime().toString().slice(-4) +
    "-" +
    Math.floor(Math.random() * 10000)
      .toString()
      .slice(-4)
  );
}
function splitArrayIntoChunks(array, chunkSize) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

function prefencesExtensionDataTransformer(data) {
  return {
    name:
      data?.name?.length > 0
        ? data?.name
        : `my preference-${generateSimpleID()}`,
    base_domain: data?.baseDomain || "www.amazon.com",
    target_domain: data?.targetDomain || "www.amazon.ca",
    currency: data?.currency || "CAD",
    is_fba: data?.isFba === "true" ? true : false,
    uses_keepa: data?.isKeepa === "true" ? true : false,
    include_discounts: data?.isDiscount === "true" ? true : false,
    vat_type: data?.vatType,
    vat_percentage: isNaN(parseFloat(data?.vatPercentage))
      ? 0
      : parseFloat(data?.vatPercentage),
    shipping_type: data?.shippingType,
    labeling_deal: isNaN(parseFloat(data?.labelingDeal))
      ? 0
      : parseFloat(data?.labelingDeal),
    shipping_deal: isNaN(parseFloat(data?.shippingDeal))
      ? 0
      : parseFloat(data?.shippingDeal),
    fixed_deal: isNaN(parseFloat(data?.fixedDeal))
      ? 0
      : parseFloat(data?.fixedDeal),
  };
}
async function getSelectedLanguage() {
  const language = await getCache("language");
  return language ? language : "en";
}

const availableDomains = [
  {
    domain: "www.amazon.com",
    currency: "USD",
    country: "US",
    symbol: "$",
    id: "ATVPDKIKX0DER",
    zipCodes: ["90210", "10001", "60601"], // US
    server: "na",
  },
  {
    domain: "www.amazon.ca",
    currency: "CAD",
    country: "CA",
    symbol: "$",
    id: "A2EUQ1WTGCTBG2",
    zipCodes: ["M5G 2C3", "V5K 0A1", "H3Z 2Y7"], // Canada
    server: "na",
  },
  {
    domain: "www.amazon.com.mx",
    currency: "MXN",
    country: "MX",
    symbol: "$",
    id: "A1AM78C64UM0Y8",
    zipCodes: ["06700", "03100", "01219"], // Mexico
    server: "na",
  },
  {
    domain: "www.amazon.co.uk",
    currency: "GBP",
    country: "GB",
    symbol: "£",
    id: "A1F83G8C2ARO7P",
    zipCodes: ["EC1A 1BB", "M1 1AE"], // UK
    server: "eu",
  },
  {
    domain: "www.amazon.de",
    currency: "EUR",
    country: "DE",
    symbol: "€",
    id: "A1PA6795UKMFR9",
    zipCodes: ["10115", "80331", "20457"], // Germany
    server: "eu",
  },
  {
    domain: "www.amazon.fr",
    currency: "EUR",
    country: "FR",
    symbol: "€",
    id: "A13V1IB3VIYZZH",
    zipCodes: ["75001", "13001", "69001"], // France
    server: "eu",
  },
  {
    domain: "www.amazon.it",
    currency: "EUR",
    country: "IT",
    symbol: "€",
    id: "APJ6JRA9NG5V4",
    zipCodes: ["00118", "20121", "40100"], // Italy
    server: "eu",
  },
  {
    domain: "www.amazon.es",
    currency: "EUR",
    country: "ES",
    symbol: "€",
    id: "A1RKKUPIHCS9HS",
    zipCodes: ["28001", "46001", "11001"], // Spain
    server: "eu",
  },
  {
    domain: "www.amazon.co.jp",
    currency: "JPY",
    country: "JP",
    symbol: "¥",
    id: "A1VC38T7YXB528",
    zipCodes: ["100-0001", "104-0061", "150-0001"], // Japan
    server: "fe",
  },
  {
    domain: "www.amazon.sg",
    currency: "SGD",
    country: "SG",
    symbol: "$",
    id: "A19VAU5U5O7RUS",
    zipCodes: ["049513", "238883", "018960"], // Singapore
    server: "fe",
  },
  {
    domain: "www.amazon.ae",
    currency: "AED",
    country: "AE",
    symbol: "د.إ",
    id: "A2VIGQ35RCS4UG",
    zipCodes: [""], // UAE does not use zip codes
    server: "eu",
  },
  {
    domain: "www.amazon.com.br",
    currency: "BRL",
    country: "BR",
    symbol: "R$",
    id: "A2Q3Y263D00KWC",
    zipCodes: ["01000-000", "20010-000", "40010-000"], // Brazil
    server: "na",
  },
  {
    domain: "www.amazon.com.au",
    currency: "AUD",
    country: "AU",
    symbol: "$",
    id: "A39IBJ37TRP1C6",
    zipCodes: ["2000", "3000", "4000"], // Australia
    server: "fe",
  },
  {
    domain: "www.amazon.in",
    currency: "INR",
    country: "IN",
    symbol: "₹",
    id: "A21TJRUUN4KGV",
    zipCodes: ["110001", "400001", "700001"], // India
    server: "eu",
  },
  {
    domain: "www.amazon.nl",
    currency: "EUR",
    country: "NL",
    symbol: "€",
    id: "A1805IZSGTT6HS",
    zipCodes: ["1011 AA", "2000 AA", "3001 AA"], // Netherlands
    server: "eu",
  },
  {
    domain: "www.amazon.sa",
    currency: "SAR",
    country: "SA",
    symbol: "ر.س",
    id: "A17E79C6D8DWNP",
    zipCodes: ["12241", "11564", "31311"], // Saudi Arabia
    server: "eu",
  },
  {
    domain: "www.amazon.com.tr",
    currency: "TRY",
    country: "TR",
    symbol: "₺",
    id: "A33AVAJ2PDY3EV",
    zipCodes: ["34000", "38030", "06100"], // Turkey
    server: "eu",
  },
  {
    domain: "www.amazon.se",
    currency: "SEK",
    country: "SE",
    symbol: "kr",
    id: "A2NODRKZP88ZB9",
    zipCodes: ["111 21", "753 20", "411 16"], // Sweden
    server: "eu",
  },
  {
    domain: "www.amazon.com.be",
    currency: "EUR",
    country: "BE",
    symbol: "€",
    id: "AMEN7PMS3EDWL",
    zipCodes: ["1000", "2000", "3000"], // Belgium
    server: "eu",
  },
  {
    domain: "www.amazon.eg",
    currency: "EGP",
    country: "EG",
    symbol: "ج.م",
    id: "ARBP9OOSHTCHU",
    zipCodes: ["11511", "11351", "11771"], // Egypt
    server: "eu",
  },
  {
    domain: "www.amazon.pl",
    currency: "PLN",
    country: "PL",
    symbol: "zł",
    id: "A1C3SOZRARQ6R3",
    zipCodes: ["00-001", "02-495", "31-147"], // Poland
    server: "eu",
  },
];

//get available domains if it is not set, save to storage
function getAvailableDomains() {
  return availableDomains;
}
//put available domains to storage
async function setAvailableDomains() {
  await setCache("availableDomains", JSON.stringify(availableDomains), "main");
}

async function setExchangeRate() {
  const cachedRates = await getCache("exchangeRate");
  const lastFetchedTimeStamp = cachedRates?.timestamp
    ? cachedRates.timestamp
    : 0;
  //if last fetched time is less than 1 hour, use cached rates
  if (Date.now() - lastFetchedTimeStamp < 3600000) {
    console.log("using cached rates");
    return;
  } else {
    console.log("fetching new rates");
    const rates = await getRates();
    await setCache("exchangeRate", JSON.stringify(rates), "main");
  }
}

async function fetchAsinHtmlByDomain(asin, domain) {
  // useTemporaryCookie(domain);
  try {
    const response = await fetch(`https://${domain}/dp/${asin}`, {
      headers: {
        "x-keepicker": "true",
        // other headers...
      },
    });

    if (!response.ok) {
      //restoreUserCookiesFromLocalStorage(domain);
      if (response.status === 403) {
        //console.log("Access to this website is forbidden");
        //need to update the cookies and try again
      } else if (response.status === 404) {
        return "404";
        //console.log("Website not found");
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } else {
      //restoreUserCookiesFromLocalStorage(domain);
      const html = await response.text();
      return html;
    }
  } catch (err) {
    //restoreUserCookiesFromLocalStorage(domain);
    //console.log("An error occurred while fetching the website", err);
    return err;
  }
}
async function scrapProductDataFromHtmlByRegex(
  html,
  availableDomains,
  domain,
  rates
) {
  const prefences = await getPreferences();
  let price,
    fraction = "00",
    symbol,
    all;

  // Check for out of stock condition
  const outOfStock = html?.includes('id="outOfStock"');
  if (outOfStock || html === "404") {
    //console.log("out of stock");
    return {
      domain,
      convertedPriceFloat: "Out of stock",
      sessionId: null,
      requestId: null,
      outOfStock,
    };
  } else {
    // Extract price details
    const priceWholeMatch = html.match(/class="a-price-whole">([^<]+)</);
    price = priceWholeMatch
      ? priceWholeMatch[1].trim().replace(",", "").replace(".", "")
      : null;

    const fractionMatch = html.match(/class="a-price-fraction">([^<]+)</);
    fraction = fractionMatch ? fractionMatch[1].trim() : "00";

    const symbolMatch = html.match(/class="a-price-symbol">([^<]+)</);
    symbol = symbolMatch ? symbolMatch[1].trim() : null;

    const allMatch = html.match(/class="a-offscreen">([^<]+)</);
    all = allMatch ? allMatch[1].trim() : null;

    let regex = /sessionId: "([^"]*)"/;
    let regex2 = /requestId: "([^"]*)"/;
    let match2 = html.match(regex);
    let match3 = html.match(regex2);
    // Handle cases where price or fraction are not present
    if (!price || !fraction) {
      const priceMatch = all?.match(/(\d+)(?:[,.](\d+))?/);
      price = priceMatch ? priceMatch[1] : "0";
      fraction = priceMatch ? priceMatch[2] : "00";
      symbol = priceMatch ? all.replace(priceMatch[0], "") : symbol;
    }

    const completePrice = price + "." + fraction;
    const fetchedCurrency =
      availableDomains.find((i) => i.domain == domain)?.currency || "Unknown";

    const conversionRate = rates[fetchedCurrency] || 1;

    let convertedPriceFloat = 0.0;
    if (prefences.currency === fetchedCurrency) {
      convertedPriceFloat = parseFloat(completePrice);
    } else if (fetchedCurrency === "USD") {
      convertedPriceFloat =
        parseFloat(completePrice) * rates[prefences.currency];
    } else {
      //convert to USD first then to target currency
      convertedPriceFloat = parseFloat(completePrice) * conversionRate;
      convertedPriceFloat = convertedPriceFloat / rates[prefences.currency];
    }

    return {
      domain,
      convertedPriceFloat,
      sessionId: match2 ? match2[1] : null,
      requestId: match3 ? match3[1] : null,
      outOfStock,
    };
  }
}
async function getOtherSellerPagesData(asin, domain, pageNo) {
  try {
    const response = await fetch(
      `https://${domain}/gp/product/ajax/ref=aod_page_${pageNo}?asin=${asin}&m=&qid=&smid=&sourcecustomerorglistid=&sourcecustomerorglistitemid=&sr=&pc=dp&isonlyrenderofferlist=true&pageno=${pageNo}&experienceId=aodAjaxMain`
    );

    if (!response.ok) {
      //  console.log("response not ok in page ", pageNo);
    }
    const html = await response.text();

    return html;
  } catch (error) {
    //  console.log("error in page ", pageNo);
  }
}
async function getSellersData(asin, domain) {
  // const { requestId, sessionId } = await useTemporaryCookie(domain);
  console.log("seller data triggereddd", domain, asin);

  try {
    const response = await fetch(
      `https://${domain}/gp/product/ajax/ref=dp_aod_NEW_mbc?asin=${asin}&m=&qid=&smid=&sourcecustomerorglistid=&sourcecustomerorglistitemid=&sr=&pc=dp&experienceId=aodAjaxMain`
    );

    if (!response.ok) {
      //restoreUserCookiesFromLocalStorage(domain);
      //  console.log("response not ok");
    }
    //restoreUserCookiesFromLocalStorage(domain);

    let html = await response.text();

    const regex =
      /<input type="hidden" name="" value="(\d+)" id="aod-total-offer-count"\/>/;
    const match = html.match(regex);
    const optionsCount = match ? match[1] : null;

    if (optionsCount > 10) {
      //  console.log("optionsCount", optionsCount);

      //need to fetch other pages too and add them to the html
      const promises = [];
      for (let i = 2; i <= Math.ceil(optionsCount / 10); i++) {
        promises.push(getOtherSellerPagesData(asin, domain, i));
      }
      const otherPagesData = await Promise.all(promises);
      otherPagesData.forEach((pageData) => {
        html += pageData;
      });
    }

    return { html };
  } catch (err) {
    //restoreUserCookiesFromLocalStorage(domain);
    //console.log("An error occurred while fetching the website", err);
  }
}
async function scrapDataFromHtmlPiece(offerHtml, hostname, asin, buyboxData) {
  const h5Match = /<h5>\s*(.*?)\s*<\/h5>/.exec(offerHtml);
  productType = h5Match ? h5Match[1].trim() : null;
  // Extracting seller URL
  // const sellerIdRegex = /seller=(.*?)&/;
  // const sellerUrlRegex = /<div id=\"aod-offer-soldBy\".*?<a .*?href=\"(.*?)\".*?>.*?<\/a>/;
  // const sellerUrlMatch = sellerUrlRegex.exec(offerHtml);
  // const sellerUrl = sellerUrlMatch ? sellerUrlMatch[1].trim() : null;
  // const sellerRegex = /<div id=\"aod-offer-soldBy\".*?<a .*?href=\".*?\">(.*?)<\/a>/;
  // const sellerMatch = sellerRegex.exec(offerHtml);
  // const sellerName = sellerMatch ? sellerMatch[1].trim() : null;

  // let sellerId = null;
  // if (sellerUrl) {
  //   const sellerIdMatch = sellerIdRegex.exec(sellerUrl);
  //   sellerId = sellerIdMatch ? sellerIdMatch[1] : null;
  // // }
  // const storeFrontUrl = sellerId ? `/s?me=${sellerId}` : null;
  const sellerUrlAndNameRegex =
    /<a [^>]*?href="([^">]+?isAmazonFulfilled[^">]+?)"[^>]*?>([^<]+)<\/a>/;
  const sellerUrlAndNameMatch = sellerUrlAndNameRegex.exec(offerHtml);
  let sellerUrl = null;
  let sellerName = null;

  if (sellerUrlAndNameMatch) {
    sellerUrl = sellerUrlAndNameMatch[1];
    sellerName = sellerUrlAndNameMatch[2].trim();
  }

  const sellerIdRegex = /seller=(.*?)&/;
  let sellerId = null;
  if (sellerUrl) {
    const sellerIdMatch = sellerIdRegex.exec(sellerUrl);
    sellerId = sellerIdMatch ? sellerIdMatch[1] : null;
  }

  const storeFrontUrl = sellerId ? `/s?me=${sellerId}` : null;

  // Extracting price and priceFraction
  const priceMatch =
    /<span class="a-price-whole">(.*?)<\/span>.*?<span class="a-price-fraction">(.*?)<\/span>/.exec(
      offerHtml
    );
  const price = priceMatch ? priceMatch[1].trim() : null;
  const priceFraction = priceMatch ? priceMatch[2].trim() : null;

  // Assuming price might contain unwanted characters.
  let cleanPrice = price
    ? price.replace(/<[^>]+>/g, "").replace(/[^0-9]/g, "")
    : ""; // Removes HTML tags and non-numeric characters.
  let finalPrice = parseFloat(cleanPrice + "." + (priceFraction || "00"));

  const sellerRatingSectionRegex =
    /<div id="aod-offer-seller-rating".*?>[\s\S]*?<\/div>/.exec(offerHtml);
  const sellerRatingSection = sellerRatingSectionRegex
    ? sellerRatingSectionRegex[0]
    : null;
  let ratings = null;
  let positiveFeedback = null;
  if (sellerRatingSection) {
    const ratingsRegex = /<span>\((\d+)[^\d]*\)/.exec(sellerRatingSection);
    ratings = ratingsRegex ? parseInt(ratingsRegex[1], 10) : null;

    // Extracting positive feedback percentage
    const positiveFeedbackRegex = /<br>(\d+)%/.exec(sellerRatingSection);
    positiveFeedback = positiveFeedbackRegex
      ? parseInt(positiveFeedbackRegex[1], 10)
      : null;
  }

  const deliveryPriceRegex = /data-csa-c-delivery-price="([^"]+)"/.exec(
    offerHtml
  );
  let deliveryPrice = deliveryPriceRegex ? deliveryPriceRegex[1] : null;

  // Remove all non-numeric characters except for the decimal point
  if (deliveryPrice) {
    deliveryPrice = parseFloat(deliveryPrice.replace(/[^0-9.]/g, "")) || null;
  }

  // Extracting delivery time
  const deliveryTimeRegex = /data-csa-c-delivery-time="([^"]+)"/.exec(
    offerHtml
  );
  const deliveryTime = deliveryTimeRegex ? deliveryTimeRegex[1] : null;

  //console.log("Delivery Price:", deliveryPrice); // Should print £60.06 or null if not found
  //console.log("Delivery Time:", deliveryTime);

  // Extracting oid
  const oidRegex = /data-select-aod-qty-option="({.*?})"/.exec(offerHtml);
  let oid = null;
  if (oidRegex) {
    const cleanedData = oidRegex[1].replace(/&quot;/g, '"'); // replace &quot; with "
    const dataSelectAodQtyOption = JSON.parse(cleanedData);
    oid = dataSelectAodQtyOption.oid;
  }

  // Determining isFba and sellerId
  const isFba = sellerUrl ? sellerUrl.includes(`isAmazonFulfilled=1`) : false;
  const availableDomains = await getCache("availableDomains");
  const domainCurrency =
    availableDomains.find((i) => i.domain == hostname)?.currency || "Unknown";
  const preferences = await getPreferences();
  //console.log("domainCurrency", domainCurrency);

  //add delivery price to final price
  if (deliveryPrice) {
    finalPrice = parseFloat(finalPrice) + parseFloat(deliveryPrice);
  }
  // if (!sellerName) {
  //   console.log("sellerName", sellerName, offerHtml);
  // }
  const hasDiscounts = offerHtml.includes(
    `<div id="aod-offer-quantityDiscounts`
  );
  const baseDomainMainPrice =
    parseFloat(finalPrice).toFixed(2) + " " + domainCurrency;
  return {
    isBuyBox: false,
    asin,
    domain: hostname,
    sellerName,
    productType,
    finalPrice,
    convertedFinalPrice: finalPrice
      ? await convertCurrency(finalPrice, domainCurrency, preferences.currency)
      : null,
    sellerUrl,
    sellerId,
    storeFrontUrl,
    isFba,
    ratings,
    positiveFeedback,
    deliveryTime,
    deliveryPrice,
    convertedDeliveryPrice: deliveryPrice
      ? await convertCurrency(
          deliveryPrice,
          domainCurrency,
          preferences.currency
        )
      : null,
    oid,
    oidDecoded: oid ? decodeURIComponent(oid) : null,
    percentageOfBuyBoxPrice: finalPrice
      ? parseFloat((finalPrice / buyboxData?.finalPrice) * 100 - 100.0).toFixed(
          2
        )
      : null,
    baseDomainMainPrice,
    hasDiscounts,
  };
}
async function scrapBuyBoxDataFromHtml(html, hostname, asin) {
  const prefences = await getPreferences();
  const availableDomains = await getCache("availableDomains");
  const domainCurrency =
    availableDomains.find((i) => i.domain == hostname)?.currency || "Unknown";
  let productType,
    sellerId,
    sellerName,
    sellerUrl,
    storeFrontUrl,
    isFba,
    ratings,
    positiveFeedback,
    deliveryTime,
    deliveryPrice,
    oid,
    oidDecoded;

  //define the buybox html by splicing the html from the buybox div
  const buyboxIndex = html?.indexOf('<div id="aod-pinned-offer"');
  const filterIndex = html?.indexOf('<div id="aod-offer-list"');
  //buybox html is between buyboxIndex and filterIndex
  const buyboxHtml = html?.substring(buyboxIndex, filterIndex);

  //prepare regexes for scraping
  //productType is like <h5>New</h5> and we need to extract New.
  const productTypeRegex = /<h5>\s*(.*?)\s*<\/h5>/;
  const sellerIdRegex = /seller=(.*?)&/;
  const sellerUrlRegex =
    /<a [^>]*?href="(\/gp\/aag\/main[^"]*?&amp;isAmazonFulfilled[^"]*)"/;
  const sellerRegex =
    /<a [^>]*?href="\/gp\/aag\/main[^"]*?&amp;isAmazonFulfilled[^"]*">(.*?)<\/a>/s;

  const sellerNameRegex = /<a [^>]*?href="\/gp\/aag\/main[^"]*?">(.*?)<\/a>/s;
  const sellerNameMatch = sellerNameRegex.exec(buyboxHtml);
  sellerName = sellerNameMatch ? sellerNameMatch[1].trim() : null;

  const priceRegex =
    /<span class="a-price-whole">(.*?)<\/span>.*?<span class="a-price-fraction">(.*?)<\/span>/;
  const sellerRatingSectionRegex =
    /<div id="aod-offer-seller-rating".*?>[\s\S]*?<\/div>/;
  const ratingsRegex = /<span>\((\d+)[^\d]*\)/;
  const positiveFeedbackRegex = /<br>(\d+)%/;
  const deliveryPriceRegex = /data-csa-c-delivery-price="([^"]+)"/;
  const deliveryTimeRegex = /data-csa-c-delivery-time="([^"]+)"/;
  const oidRegex = /data-select-aod-qty-option="({.*?})"/;

  // Extracting product type
  const productTypeMatch = productTypeRegex.exec(buyboxHtml);
  productType = productTypeMatch ? productTypeMatch[1].trim() : null;

  // Extracting seller URL
  const sellerUrlMatch = sellerUrlRegex.exec(buyboxHtml);
  sellerUrl = sellerUrlMatch ? sellerUrlMatch[1].trim() : null;

  // Extracting seller ID from seller URL
  if (sellerUrl) {
    const sellerIdMatch = sellerIdRegex.exec(sellerUrl);
    sellerId = sellerIdMatch ? sellerIdMatch[1] : null;
  }

  // Extracting seller name
  const sellerMatch = sellerRegex.exec(buyboxHtml);
  sellerName = sellerMatch ? sellerMatch[1].trim() : null;

  // Extracting price and priceFraction
  const priceMatch = priceRegex.exec(buyboxHtml);
  const price = priceMatch ? priceMatch[1].trim() : null;
  const priceFraction = priceMatch ? priceMatch[2].trim() : null;

  // Assuming price might contain unwanted characters.
  let cleanPrice = price
    ? price.replace(/<[^>]+>/g, "").replace(/[^0-9]/g, "")
    : ""; // Removes HTML tags and non-numeric characters.
  let finalPrice = parseFloat(cleanPrice + "." + (priceFraction || "00"));

  // Extract the aod-offer-seller-rating section
  const sellerRatingSectionMatch = sellerRatingSectionRegex.exec(buyboxHtml);
  const sellerRatingSection = sellerRatingSectionMatch
    ? sellerRatingSectionMatch[0]
    : null;

  // Extracting number of ratings
  const ratingsMatch = ratingsRegex.exec(sellerRatingSection);
  ratings = ratingsMatch ? parseInt(ratingsMatch[1], 10) : null;

  // Extracting positive feedback percentage
  const positiveFeedbackMatch = positiveFeedbackRegex.exec(sellerRatingSection);
  positiveFeedback = positiveFeedbackMatch
    ? parseInt(positiveFeedbackMatch[1], 10)
    : null;

  // Extracting delivery
  // Extracting delivery price
  const deliveryPriceMatch = deliveryPriceRegex.exec(buyboxHtml);
  deliveryPrice = deliveryPriceMatch ? deliveryPriceMatch[1] : null;
  if (deliveryPrice) {
    deliveryPrice = parseFloat(deliveryPrice.replace(/[^0-9.]/g, "")) || null;
  }

  // Extracting delivery time
  const deliveryTimeMatch = deliveryTimeRegex.exec(buyboxHtml);
  deliveryTime = deliveryTimeMatch ? deliveryTimeMatch[1] : null;

  // Extracting oid
  const oidMatch = oidRegex.exec(buyboxHtml);
  oid = oidMatch ? oidMatch[1] : null;

  storeFrontUrl = sellerId ? `/s?me=${sellerId}` : null;

  isFba = buyboxHtml?.includes(`isAmazonFulfilled=1`);

  if (deliveryPrice) {
    finalPrice = parseFloat(finalPrice) + parseFloat(deliveryPrice);
  }

  oidDecoded = oid ? decodeURIComponent(oid) : null;
  const baseDomainMainPrice =
    parseFloat(finalPrice).toFixed(2) + " " + domainCurrency;
  const hasDiscounts = buyboxHtml?.includes(
    `<div id="aod-offer-quantityDiscounts`
  );

  return {
    isBuyBox: true,
    asin,
    domain: hostname,
    sellerName,
    productType,
    finalPrice,
    convertedFinalPrice: finalPrice
      ? await convertCurrency(finalPrice, domainCurrency, prefences.currency)
      : null,
    sellerUrl,
    sellerId,
    storeFrontUrl,
    isFba,
    ratings,
    positiveFeedback,
    deliveryTime,
    deliveryPrice,
    convertedDeliveryPrice:
      deliveryPrice && deliveryPrice !== "FREE"
        ? await convertCurrency(
            deliveryPrice,
            domainCurrency,
            prefences.currency
          )
        : null,
    oid,
    oidDecoded,
    percentageOfBuyBoxPrice: "0.00",
    baseDomainMainPrice,
    hasDiscounts,
  };
}
async function scrapFromSellerHtml(hostname, asin, html) {
  //get buybox seller too
  const buyboxData = await scrapBuyBoxDataFromHtml(html, hostname, asin);
  //  console.log("buyboxData", buyboxData);

  let data = [];
  data.push(buyboxData);

  // const offerRegex = /id="aod-offer"(.*?)<\/\w+>/gs;

  // let match;

  // while ((match = offerRegex.exec(html)) !== null) {
  //   const scrapped = await scrapDataFromHtmlPiece(match[1], hostname, asin);
  //   console.log("scrapped", scrapped);

  //   data.push(scrapped);
  // }

  const chunks = html.split('<div id="aod-offer"');

  // Skip the first chunk because it's content before the first occurrence
  for (let i = 1; i < chunks.length; i++) {
    // You can further process each chunk here if needed.
    // For example, to extract content until the next closing div tag:

    const scrapped = await scrapDataFromHtmlPiece(
      chunks[i],
      hostname,
      asin,
      buyboxData
    );

    data.push(scrapped);
  }

  data = data.filter((i) => i?.convertedFinalPrice);

  return {
    sellerData: data,
    summary: {
      sellerCount: data.length,
      fbaSellerCount: data.filter((i) => i.isFba).length,
      fbmSellerCount: data.filter((i) => !i.isFba).length,
      isAmazonIsSeller: data.filter((i) => i.sellerName?.includes("Amazon"))
        .length
        ? true
        : false,
      lowestPriceInSellers: data.length
        ? data.sort(
            (a, b) =>
              parseFloat(a.convertedFinalPrice) -
              parseFloat(b.convertedFinalPrice)
          )[0]?.convertedFinalPrice
        : null,
      averagePriceInSellers: data.length
        ? parseFloat(
            data.reduce(
              (acc, curr) =>
                parseFloat(acc) + parseFloat(curr?.convertedFinalPrice),
              0
            ) / parseFloat(data.length)
          ).toFixed(2)
        : null,
      highestPriceInSellers: data.length
        ? data.sort(
            (a, b) =>
              parseFloat(b?.convertedFinalPrice) -
              parseFloat(a?.convertedFinalPrice)
          )[0]?.convertedFinalPrice
        : null,
      buyBoxPrice: data.find((i) => i.isBuyBox)?.convertedFinalPrice || null,
      hasDiscounts: data.find((i) => i.hasDiscounts) ? true : false,
    },
  };
}
async function fetchHtmlFromUrl(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const html = await response.text();
    return html;
  } catch (err) {
    console.log("An error occurred while fetching the website", err);
  }
}
async function getAsinsFromPages(url, seller, domain) {
  console.log("getAsinsFromPages", url, seller, domain);
  let page = 1;
  let hasAsin = true;
  let uniqueAsins = [];
  const sellerId = (await getSellerIdFromUrl(url)) || null;
  while (hasAsin) {
    const hasStopped = await getCache("hasStopped");
    console.log("hasStopped", hasStopped);

    if (hasStopped) {
      console.log("in if has stopped", hasStopped);
      hasAsin = false;
    }
    const html = await fetchHtmlFromUrl(
      url.replace(`&page=${page - 1}`, "") + `&page=${page}`
    );
    console.log(url);

    let asinsInPage = getAsinsFromHtml(html);
    if (asinsInPage.length > 0) {
      const uniqueAsinsLength = uniqueAsins.length;
      uniqueAsins = [...uniqueAsins, ...asinsInPage];
      uniqueAsins = [...new Set(uniqueAsins)];
      if (uniqueAsins.length === uniqueAsinsLength) {
        hasAsin = false;
      }

      await sendMessageToContentScript(
        "fetchedPageAsins",
        {
          asins: uniqueAsins,
          page: page,
          from: "asinSpy",
          seller: seller || "Search",
        },
        domain
      );

      page++;
    }
    if (asinsInPage.length == 0) {
      hasAsin = false;
    }
  }
  await sendMessageToContentScript(
    "completedfetchedPageAsins",
    {
      asins: uniqueAsins,
      page: page,
      from: sellerId ? "Seller" : "Search",
      seller: sellerId,
    },
    domain
  );
  await saveAsinList(
    seller,
    sellerId ? "Seller" : "Search",
    sellerId,
    uniqueAsins
  );

  const asinLists = await getAsinLists();
  console.log("asinLists", asinLists);

  await sendMessageToContentScript(
    "savedAsins",
    {
      data: asinLists?.asin_lists?.filter((i) =>
        i.origin === sellerId ? "Seller" : "Search"
      ),
      from: "Search",
      tokenCount: asinLists?.token_count,
      asinCount: asinLists?.asin_count,
    },
    domain
  );
}

async function handleInit() {
  const preference = await getCache("main-preferences");
  const language = preference?.language || "en";
  console.log("initiating app", language);
  await removeAllCacheKeys();

  console.log("initiating app", language);
  await setPreferences({
    baseDomain: "www.amazon.com",
    targetDomain: "www.amazon.co.uk",
    currency: "GBP",
    tokenCount: 10,
    shippingDeal: 10,
    bearer: null,
    isFba: true,
    isKeepa: true,
    isDiscount: true,
    vatType: "noVat",
    vatPercentage: "20",
    language: language,
  });
  await setAvailableDomains();
  await setExchangeRate();
}
async function handleDailyInit() {
  await setAvailableDomains();
  await setExchangeRate();
}
async function resetApp(domain) {
  //remove all cache
  await removeAllCacheKeys();
  //remove db
  await deleteAllData();
  // add init data
  await handleInit();
  // send message to content script to reload
  await sendMessageToContentScript("reset", "Reset completed", domain);
}

// Open a connection to the database
let db;
function generateSimpleID() {
  return Date.now() + "-" + Math.floor(Math.random() * 10000);
}
function openDB() {
  const request = indexedDB.open("kepickerDb", 1);

  request.onupgradeneeded = (event) => {
    db = event.target.result;
    db.createObjectStore("store", { keyPath: "id" });
  };

  request.onsuccess = (event) => {
    db = event.target.result;
    //console.log("Database opened successfully");
  };

  request.onerror = (event) => {
    console.error("Error opening database:", event.target.errorCode);
  };
}

// Add data to the object store
async function addData(id, data, retryCount = 0) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["store"], "readwrite");
    const objectStore = transaction.objectStore("store");
    data.id = id + "-" + generateSimpleID();
    const request = objectStore.add(data);

    request.onsuccess = (event) => {
      //console.log("Data added successfully");
      resolve(event.target.result);
    };

    request.onerror = async (event) => {
      console.error("Error adding data:", event.target.error);
      if (retryCount < 3) {
        //console.log("Retrying add operation...");
        await new Promise((res) => setTimeout(res, 1000)); // wait for 1 second
        addData(id, data, retryCount + 1)
          .then(resolve)
          .catch(reject);
      } else {
        console.error("Failed to add data after 3 attempts");
        reject(event.target.error);
      }
    };
  });
}
async function mergeAndUpdateData(id, newData, retryCount = 0) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["store"], "readwrite");
    const objectStore = transaction.objectStore("store");

    // Retrieve the existing object with the specified id
    const getRequest = objectStore.get(id);
    getRequest.onerror = (event) => {
      console.error("Error retrieving data:", event.target.error);
      reject(event.target.error);
    };

    getRequest.onsuccess = (event) => {
      let existingData = getRequest.result;
      if (existingData) {
        // Check if data is an array
        if (Array.isArray(existingData) && Array.isArray(newData)) {
          let set = new Set(existingData);
          for (const item of newData) {
            set.add(item);
          }
          existingData = Array.from(set);
        } else if (typeof existingData === "object" && typeof newData === "object") {
          Object.assign(existingData, newData); // Merge objects
        } else {
          console.warn("Data types don't match, replacing existing data");
          existingData = newData;
        }
      } else {
        // If there is no existing data, use the new data as is
        existingData = newData;
      }
      existingData.id = id; // Make sure the ID is set

      // Save the updated data back into the IndexedDB
      const putRequest = objectStore.put(existingData);

      putRequest.onsuccess = (event) => {
        // Data added/updated successfully
        resolve(event.target.result);
      };

      putRequest.onerror = async (event) => {
        console.error("Error adding/updating data:", event.target.error);
        if (retryCount < 3) {
          // Retrying add/update operation
          await new Promise((res) => setTimeout(res, 1000)); // wait for 1 second
          mergeAndUpdateData(id, newData, retryCount + 1)
            .then(resolve)
            .catch(reject);
        } else {
          console.error("Failed to add/update data after 3 attempts");
          reject(event.target.error);
        }
      };
    };
  });
}
//merge unique data
async function mergeAndUpdateUniqueDataWithKey(id, newDataArr, key) {
  //delete old data
  await deleteData(id);
  await mergeAndUpdateData(id, newDataArr);
}

// Get data from the object store by id
async function getData(id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["store"], "readonly");
    const objectStore = transaction.objectStore("store");
    const request = objectStore.get(id);

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

async function getAllData() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["store"], "readonly");
    const objectStore = transaction.objectStore("store");
    const request = objectStore.getAll();

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

async function getDataByPrefix(prefix) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["store"], "readonly");
    const objectStore = transaction.objectStore("store");
    const request = objectStore.getAll();

    request.onsuccess = (event) => {
      const result = event.target.result.filter((item) => item.id.startsWith(prefix));
      resolve(result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

async function deleteData(id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["store"], "readwrite");
    const objectStore = transaction.objectStore("store");
    const request = objectStore.delete(id);

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

async function deleteByPrefix(prefix) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["store"], "readwrite");
    const objectStore = transaction.objectStore("store");
    const request = objectStore.getAll();

    request.onsuccess = (event) => {
      const result = event.target.result.filter((item) => item.id.startsWith(prefix));
      result.forEach((item) => {
        objectStore.delete(item.id);
      });
      resolve(result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

async function deleteAllData() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["store"], "readwrite");
    const objectStore = transaction.objectStore("store");
    const request = objectStore.clear();

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

// Initialize the database
function initializeDb() {
  openDB();
}

//save all current cookies from specific domain to local storage
async function saveUserCookies(domain) {
  const domainName = domain.replace("www", "");

  chrome.cookies.getAll({ domain: `${domainName}` }, async function (cookies) {
    const cookiesToSave = cookies.filter((cookie) => cookie.domain === domainName);
    let cookieArray = [];
    for (var i = 0; i < cookiesToSave.length; i++) {
      //save cookie to storage with domain as key
      cookieArray.push(cookiesToSave[i]);
    }
    await setCache(`user-${domain}-${getTodaysDate()}`, JSON.stringify(cookieArray));
  });
}

async function removeUserCookies(domain) {
  // We need to consider both http and https while removing the cookies
  const httpUrl = `http://${domain}`;
  const httpsUrl = `https://${domain}`;
  const domainName = domain.replace("www", "");

  chrome.cookies.getAll({ domain: domainName }, function (cookies) {
    const cookiesToRemove = cookies.filter((cookie) => cookie.domain === domainName);

    cookiesToRemove.forEach((cookie) => {
      // Decide the URL protocol based on cookie's secure flag
      const url = cookie.secure ? httpsUrl : httpUrl;

      chrome.cookies.remove({ url: url + cookie.path, name: cookie.name });
    });
  });
}

//restore all user cookies from local storage to specific domain
async function restoreUserCookiesFromLocalStorage(domain) {
  let cookies = await getCache(`user-${domain}-${getTodaysDate()}`);
  console.log("restoreUserCookiesFromLocalStorage", domain, cookies);
  await injectCookie(domain, cookies, "restore");
}

function setCookie(cookieDetails) {
  return new Promise((resolve, reject) => {
    chrome.cookies.set(cookieDetails, (cookie) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(cookie);
      }
    });
  });
}

async function injectCookie(domain, cookieArray, from) {
  const parsedUrl = new URL(domain);
  const cleanDomain = parsedUrl.hostname; // e.g., 'www.amazon.co.uk'
  const fullURL = parsedUrl.href; // e.g., 'https://www.amazon.co.uk/'
  for (const cookie of cookieArray) {
    try {
      await setCookie({
        url: fullURL, // Use the full URL here
        domain: cleanDomain.startsWith("www.") ? cleanDomain.substring(4) : cleanDomain,
        name: cookie.name,
        value: cookie.value,
      });
    } catch (error) {
      console.error("Error on injecting cookie", error, from);
    }
  }
}

async function setTemporaryCookie(domain) {
  console.log("setTemporaryCookie", domain);
  const response = await fetch(`${domain}/amazonprime`, {
    headers: {
      "X-OSA-Ext": "oa",
      "Cache-Control": "max-age=0",
      "upgrade-insecure-requests": "1",
    },
  });

  const productHtml = await response.text();
  //get response headers

  let regex = /sessionId: "([^"]*)"/;
  let regex2 = /requestId: "([^"]*)"/;
  let match = productHtml.match(regex);
  let match2 = productHtml.match(regex2);

  console.log("match", match);
  console.log("match2", match2);

  if (match && match2) {
    let sessionId = match[1];
    let requestId = match2[1];
    //clear cookies first

    await injectCookie(
      domain.replace("http://www", ""),
      [
        { name: "session-id", value: sessionId },
        { name: "session-id-time", value: Date.now().toString() },
        { name: "i18n-prefs", value: "USD" },
        { name: "sp-cdn", value: "L5Z9:TR" },
        { name: "skin", value: "noskin" },
        { name: "X-OSA-Ext", value: "oa" + requestId || null },
      ],
      "set temporary"
    );
    await addressChangeHandler(domain, sessionId);

    return { sessionId, requestId };
  }
}

async function addressChangeHandler(domain, sessionId) {
  const date = Date.now();
  const availableDomains = await getCache("availableDomains");

  await fetch(
    `${domain}/portal-migration/hz/glow/get-rendered-toaster?pageType=Gateway&aisTransitionState=in&rancorLocationSource=IP_GEOLOCATION&_=${date}`
  );

  await fetch(
    `${domain}/portal-migration/hz/glow/get-rendered-address-selections?deviceType=desktop&pageType=Gateway&storeContext=NoStoreName&actionSource=desktop-modal`
  );
  const selectedDomain = availableDomains.filter((d) => d.domain === domain.replace("https://", ""))[0];
  console.log("selectedDomain", selectedDomain, domain, domain.replace("https://", ""));

  const zipCode = selectedDomain.zipCodes[Math.floor(Math.random() * selectedDomain.zipCodes.length)];
  console.log("zipCode", zipCode);

  const response = await fetch(`${domain}/portal-migration/hz/glow/address-change?actionSource=glow`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "X-Requested-With": "XMLHttpRequest",
      "Accept-Language": "en-US,en;q=0.9",
      "Accept-Encoding": "gzip, deflate, br",
      Accept: "*/*",
    },
    body: `locationType=LOCATION_INPUT&zipCode=${zipCode}&storeContext=generic&deviceType=web&pageType=Gateway&actionSource=glow`,
  });

  const data = await response.json();
  return data;
}

async function useTemporaryCookie(domain) {
  return await setTemporaryCookie(domain);
}

function getCookiesForDomain(domain) {
  return new Promise((resolve, reject) => {
    chrome.cookies.getAll({ domain: domain }, (result) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError));
      } else {
        resolve(result);
      }
    });
  });
}

async function getDomainCookies(domain) {
  const domainName = domain.replace("https://www", "");

  const cookies = await getCookiesForDomain(domainName);
  const cookiesToSave = cookies.filter((cookie) => cookie.domain === domainName);
  console.log("cookiesToSave", cookiesToSave.length);
  return {
    domain: domain,
    cookies: cookiesToSave.length,
    cookiesToSave,
  };
}

async function deleteDomainCookies(domain) {
  const domainName = domain.replace("https://www", "");
  const cookies = await getCookiesForDomain(domainName);
  cookies.forEach((cookie) => {
    // console.log(`Removing cookie: ${cookie.name} from ${domainName}`);
    chrome.cookies.remove({ url: `https://${domainName}`, name: cookie.name }, function (result) {
      if (chrome.runtime.lastError) {
        // console.error(`Error removing cookie ${cookie.name}: ${chrome.runtime.lastError}`);
      } else {
        // console.log(`Successfully removed cookie ${cookie.name}:`, result);
      }
    });
  });
}
async function deleteCookiesByArr(arr, domain) {
  const domainName = domain.replace("https://www", "");

  arr.forEach((cookie) => {
    // console.log(`Removing cookie: ${cookie.name} from ${domainName}`);
    chrome.cookies.remove({ url: `https://${domainName}`, name: cookie.name }, function (result) {
      if (chrome.runtime.lastError) {
        console.error(`Error removing cookie ${cookie.name}: ${JSON.stringify(chrome.runtime.lastError)}`);
      } else {
        console.log(`Successfully removed cookie ${cookie.name}:`, result);
      }
    });
  });
}

//create a function that sets the current state of task
async function setState(state) {
  await setCache(`state`, state);
}

//create a function that gets the current state of task
async function getState() {
  const state = await getCache(`state`);
  return state;
}

//create a function that pushes a task to the task list
async function pushTask(task) {
  let tasks = await getCache(`tasks`);
  tasks = JSON.parse(JSON.stringify(tasks));
  if (tasks) {
    tasks.push(task);
  } else {
    tasks = [task];
  }
  await setCache(`tasks`, JSON.stringify(tasks));
}

//create a function that removes a task from the task list
async function removeTask(task) {
  let tasks = await getCache(`tasks`);
  tasks = JSON.parse(JSON.stringify(tasks));
  if (tasks) {
    tasks = tasks.filter((t) => t?.data?.url !== task?.data?.url);
  }
  console.log(JSON.stringify(tasks));
  console.log(JSON.stringify(task));
  await setCache(`tasks`, JSON.stringify(tasks));
}
//create a function that removes a task from the task list
async function removeTaskByDomain(task) {
  let tasks = await getCache(`tasks`);
  tasks = JSON.parse(JSON.stringify(tasks));
  if (tasks) {
    tasks = tasks.filter((t) => t?.domain !== task?.domain);
  }
  console.log("removeTask", tasks);
  await setCache(`tasks`, JSON.stringify(tasks));
}

//create a function that gets the task list
async function getTasks() {
  const tasks = await getCache(`tasks`);
  if (!tasks) return [];
  return JSON.parse(JSON.stringify(tasks));
}

//create a function that sets the current task
async function setCurrentTask(task) {
  await setCache("currentTask", JSON.stringify(task));
}

//create a function that gets the current task
async function getCurrentTask() {
  const task = await getCache("currentTask");
  if (!task) return "idle";
  return JSON.parse(JSON.stringify(task));
}

async function checkIfRequestInProgress(targetTask) {
  const currentTask = await getCurrentTask();
  console.log("checkIfRequestInProgress", currentTask, targetTask);

  if (currentTask.type === targetTask.type) {
    return true;
  } else {
    await setCurrentTask(targetTask);
    return false;
  }
}
async function releaseState() {
  await setCurrentTask("idle");
}
async function taskExecutor() {
  console.log("taskExecutor initialize");
  let counter = 0;
  while (true) {
    const tasks = await getTasks();
    //console.log("taskExecutor running", tasks);
    //for every hour, refresh the access token

    if (counter % 3600 === 0) {
      await refreshAccessTokenByRefreshToken();
      counter = 1;
      console.log("refreshed token");
    }
    counter++;
    if (tasks && tasks.length > 0) {
      const task = tasks[0]; // Take the first task in the queue
      console.log("taskExecutor running", task);

      if (task.type === "startFetchingAsins") {
        removeTask(task); // Remove from the queue
        await fetchAsins(task, tasks.length); // Execute it
        await setCache("hasStopped", JSON.stringify(false));
      } else if (task.type === "productPage") {
        console.log("productPage", task);
        try {
          await serverHandleProductPage(task);
          await removeTaskByDomain(task);
        } catch (error) {
          console.log("error", error);
          await removeTaskByDomain(task);
        }
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for a second before checking again
  }
}

async function serverHandleProductPage(request) {
  const asin = request.data.asin;
  const comparisonData = await getSingleProduct(asin);
  console.log("comparisonData", comparisonData, request.domain, asin);

  return await sendMessageToContentScript("productPageData", { ...comparisonData, asin: request.data.asin }, request.domain);
}

async function sellerDataHandler(asin, domain, request) {
  console.log("sellerDataHandler", asin, domain, request);
  const sellerData = await fetchSellerData(asin, domain);
  if (!sellerData) return;

  await sendMessageToContentScript("sellerData", sellerData, request.domain);
}

async function sellerDataHandlerForStock(asin, domain, request) {
  console.log("sellerDataHandlerForStock", asin, domain, request);
  const sellerData = await fetchSellerData(
    asin,
    domain.replace("https://", "")
  );
  if (!sellerData) return;

  const updatedData = {
    summary: {
      status: "in_progress",
      sellerCount: sellerData?.summary?.sellerCount,
      fba_sellers: sellerData?.summary?.fbaSellerCount,
      fbm_sellers: sellerData?.summary?.fbmSellerCount,
      total_stock: 0,
      total_fba_stock: 0,
      total_fbm_stock: 0,
      lowest_price: sellerData?.summary?.lowestPriceInSellers,
      average_price: sellerData?.summary?.averagePriceInSellers,
      highest_price: sellerData?.summary?.highestPriceInSellers,
      buybox_price: sellerData?.summary?.buyBoxPrice,
    },
    sellers: sellerData.sellerData.map((seller) => {
      return {
        seller_id: seller.sellerId,
        seller_name: seller.sellerName,
        price: seller.finalPrice,
        domain: domain,
        shipping_price: seller.deliveryPrice,
        total_price: seller.finalPrice + seller.deliveryPrice,
        rating: seller.ratings,
        rating_count: seller.positiveFeedback,
        currency: "USD",
        condition: seller.productType,
        fulfilled_by: seller.isFba ? "Amazon" : "Seller",
        delivery_date: seller.deliveryTime,
        buybox: seller.isBuyBox,
        amazon: seller.isAmazonIsSeller,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_limited: false,
      };
    }),
  };

  console.log("sellerDataHandlerForStock for stock", sellerData);
  await sendMessageToContentScript(
    "sellerDataForStock",
    updatedData,
    request.domain
  );
}
async function fetchSellerData(asin, domain) {
  const data = await getSellersData(asin, domain);
  if (data) {
    const scrapped = await parseInContentScript("seller", {
      html: data.html,
      domain,
      asin,
    });

    return scrapped;
  }
}

async function fetchAsins(request, taskLength) {
  const inProgress = await checkIfRequestInProgress(request);
  console.log("inProgress in fetch asins", inProgress, request);

  //seller id is the "me" parameter in the url
  const sellerId = request?.data?.url?.split("me=")[1]?.split("&")[0] || null;
  console.log("sellerId", sellerId);
  let isProtected;
  if (sellerId) {
    isProtected = await checkProtection(sellerId);
  } else {
    isProtected = false;
  }
  console.log("isProtected", isProtected);

  if (isProtected) {
    console.log("isProtected", isProtected, request);

    await removeTaskByDomain(request);
    if (request.type === "startFetchingAsins") {
      await sendMessageToContentScript(
        "completedfetchedPageAsins",
        {
          asins: [],
          page: "Search",
          from: "Protected",
          seller: "Protected",
        },
        request.domain
      );
    }
    //send a notification to the user
    await sendMessageToContentScript("protectedSeller", {}, request.domain);
    return;
  }

  if (inProgress) {
    const tasks = await getTasks();
    //check if request is already in queue
    const isAlreadyInQueue = tasks.filter(
      (t) => t?.data?.url === request?.data?.url
    );
    if (isAlreadyInQueue.length > 0) {
      console.log("isAlreadyInQueue");
      return;
    }
    console.log("inProgress");
    // await removeTaskByDomain(request);

    // If it's already in progress, push the request to the task queue and exit
    //await pushTask(request);

    // return;
  }
  console.log("not in progress");
  await setCurrentTask(request);

  const url = request.data.url;
  const seller = request.data.seller;
  const query = request.data?.query;

  try {
    // Do the actual task

    const savedAsinListId = await getAsinsFromPages(
      url,
      `${query ? query : seller}`,
      request.domain
    );
    console.log("savedAsinListId", savedAsinListId);

    await removeTask(request); // Remove from the queue after execution
  } catch (error) {
    console.error("Error in fetchAsins:", error);
  } finally {
    console.log("fetchAsins finally");
    await releaseState();
    // Always release the state, ensuring the task manager can continue with other tasks if any
  }
}

// Your new importScripts block or any other code modifications

let taskFlags = {
  init: false,
  dailyInit: false,
  savePageAsins: false,
  getSavedAsins: false,
  getSellerData: false,
  startFetchingAsins: false,
  manualCalculateRoi: false,
};

async function completeTask(request) {
  console.log(`${request.type} completed.`);
  taskFlags[request.type] !== undefined && (taskFlags[request.type] = false);
}
//listen messages from content script
chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  // use if to handle different requests

  //if request is already in progress then return
  // Attempt to start the task; if already in progress, return

  if (taskFlags[request.type]) {
    return await sendMessageToContentScript(
      "notification",
      { message: request.type + " in progress" },
      request.domain
    );
  }

  taskFlags[request.type] !== undefined && (taskFlags[request.type] = true);

  //check if user is logged in
  const refreshToken = await getCache("refreshToken");

  if (refreshToken) {
    try {
      if (request.type === "init") {
        await handleInit();
        await sendMessageToContentScript("init", "init done", request.domain);
      }
      if (request.type === "dailyInit") {
        handleDailyInit();
      }
      if (request.type === "productPage") {
        const tasks = await getTasks();
        //check if request is already in queue
        const isAlreadyInQueue = tasks.filter(
          (t) => t?.domain === request?.domain
        );
        if (isAlreadyInQueue.length > 0) {
          console.log("already in queue");
          return;
        }
        // If it's already in progress, push the request to the task queue and exit
        await pushTask(request);
        await setCurrentTask(request);
        //await handleProductPageData(request);
      }
      if (request.type === "getSellerData") {
        await sellerDataHandler(
          request.data.asin,
          request.data.domain,
          request
        );
      }

      if (request.type === "deleteCookies") {
        await deleteCookiesHandler(request);
      }
      if (request.type === "updateAddress") {
        await updateAddressHandler(request);
      }
      if (request.type === "startFetchingAsins") {
        console.log("startFetchingAsins", request);
        await fetchAsins(request);
      }
      if (request.type === "savePageAsins") {
        await saveAsinList(
          request.domain,
          "Page",
          null,
          request.data.pageAsins
        );
        const asinLists = await getAsinLists();

        await sendMessageToContentScript(
          "savedAsins",
          {
            data: asinLists?.asin_lists,
            from: "Page",
            tokenCount: asinLists?.token_count,
            asinCount: asinLists?.asin_count,
          },
          request.domain
        );
      }
      if (request.type === "getSavedAsins") {
        const asinLists = await getAsinLists();

        await sendMessageToContentScript(
          "savedAsins",
          {
            data: asinLists?.asin_lists,
            from: request.data.type,
            tokenCount: asinLists?.token_count,
            asinCount: asinLists?.asin_count,
          },
          request.domain
        );
      }
      if (request.type === "getSavedAsinsByRefresh") {
        const asinLists = await getAsinLists();

        await sendMessageToContentScript(
          "savedAsinsByRefresh",
          {
            data: asinLists?.asin_lists,
            from: request.data.type,
            tokenCount: asinLists?.token_count,
            asinCount: asinLists?.asin_count,
          },
          request.domain
        );
      }
      if (request.type === "getSavedAsinsByRefreshBackground") {
        const asinLists = await getAsinLists();

        await sendMessageToContentScript(
          "savedAsinsByRefreshBackground",
          {
            data: asinLists?.asin_lists,
            from: request.data.type,
            tokenCount: asinLists?.token_count,
            asinCount: asinLists?.asin_count,
          },
          request.domain
        );
      }

      if (request.type === "downloadAsinsFromList") {
        const data = await getAsinListAsins(request.data.id);

        sendMessageToContentScript(
          "downloadAsins",
          data?.asins.map((i) => {
            return i.asin;
          }),
          request.domain
        );
      }
      if (request.type === "startComparison") {
        await sendAction(request.data.id, "startComparison");

        const data = await getAsinLists();
        await sendMessageToContentScript(
          "savedAsins",
          {
            data: data?.asin_lists,
            from: request.data?.from,
            tokenCount: data?.token_count,
            asinCount: data?.asin_count,
          },
          request.domain
        );
      }
      if (request.type === "stopComparison") {
        await sendAction(request.data.id, "stopComparison");

        const data = await getAsinLists();
        await sendMessageToContentScript(
          "savedAsins",
          {
            data: data?.asin_lists,
            from: request.data?.from,
            tokenCount: data?.token_count,
            asinCount: data?.asin_count,
          },
          request.domain
        );
      }
      if (request.type === "restartComparison") {
        await sendAction(request.data.id, "startComparison");
        const data = await getAsinListAsins(request.data.id);

        const filteredAsins = await applyFilters(data.asins);

        await sendMessageToContentScript(
          "showComparisonList",
          {
            data: filteredAsins,
            base_domain: data?.asinList?.base_domain,
            target_domain: data?.asinList?.target_domain,
            currency: data?.asinList?.currency,
            status: data?.asinList?.status,
            id: request.data.id,
            totalAsinCount: data?.asins?.length,
            tokenCount: data?.token_count,
            asinListName: data?.asinList?.name,
          },
          request.domain
        );
      }
      if (request.type === "stopComparisonList") {
        await sendAction(request.data.id, "stopComparison");

        const data = await getAsinListAsins(request.data.id);
        const filteredAsins = await applyFilters(data.asins);

        await sendMessageToContentScript(
          "showComparisonList",
          {
            data: filteredAsins,
            base_domain: data?.asinList?.base_domain,
            target_domain: data?.asinList?.target_domain,
            currency: data?.asinList?.currency,
            status: data?.asinList?.status,
            id: request.data.id,
            totalAsinCount: data?.asins?.length,
            tokenCount: data?.token_count,
            asinListName: data?.asinList?.name,
          },
          request.domain
        );
      }
      if (request.type === "reloadComparison") {
        await sendAction(request.data.id, "restartComparison");
        const data = await getAsinListAsins(request.data.id);

        const filteredAsins = await applyFilters(data.asins);

        await sendMessageToContentScript(
          "showComparisonList",
          {
            data: filteredAsins,
            base_domain: data?.asinList?.base_domain,
            target_domain: data?.asinList?.target_domain,
            currency: data?.asinList?.currency,
            status: data?.asinList?.status,
            id: request.data.id,
            totalAsinCount: data?.asins?.length,
            tokenCount: data?.token_count,
            asinListName: data?.asinList?.name,
          },
          request.domain
        );
      }

      if (request.type === "showAsins") {
        const id = request.data.id;
        const data = await getAsinListAsins(id);
        const filteredAsins = await applyFilters(data.asins);

        await sendMessageToContentScript(
          "showComparisonList",
          {
            data: filteredAsins,
            base_domain: data?.asinList?.base_domain,
            target_domain: data?.asinList?.target_domain,
            currency: data?.asinList?.currency,
            status: data?.asinList?.status,
            id: id,
            totalAsinCount: data?.asins?.length,
            tokenCount: data?.token_count,
            asinListName: data?.asinList?.name,
          },
          request.domain
        );
      }
      if (request.type === "showAsinsBackground") {
        const id = request.data.id;
        const data = await getAsinListAsins(id);
        const filteredAsins = await applyFilters(data.asins);

        await sendMessageToContentScript(
          "showComparisonListBackground",
          {
            data: filteredAsins,
            base_domain: data?.asinList?.base_domain,
            target_domain: data?.asinList?.target_domain,
            currency: data?.asinList?.currency,
            status: data?.asinList?.status,
            id: id,
            totalAsinCount: data?.asins?.length,
            tokenCount: data?.token_count,
            asinListName: data?.asinList?.name,
          },
          request.domain
        );
      }
      if (request.type === "deleteList") {
        const updatedAsinLists = await deleteAsinList(request.data.id);
        const asinLists = await getAsinLists();
        await sendMessageToContentScript(
          "savedAsins",
          {
            data: asinLists?.asin_lists,
            from: "all",
            tokenCount: asinLists?.token_count,
            asinCount: asinLists?.asin_count,
          },
          request.domain
        );
      }
      if (request.type === "uploadAsinList") {
        const data = request.data.data;
        await saveAsinList(request.data.fileName, "Import", null, data);
        const asinLists = await getAsinLists();

        await sendMessageToContentScript(
          "savedAsins",
          {
            data: asinLists?.asin_lists,
            from: request.data.type,
            tokenCount: asinLists?.token_count,
            asinCount: asinLists?.asin_count,
          },
          request.domain
        );
      }
      if (request.type === "manualCalculateRoi") {
        const {
          asin,
          basePrice,
          targetPrice,
          shippingCost,
          monthlyStorageFee,
          weight,
        } = request.data;
        const res = await calculateManualFees(
          asin,
          basePrice,
          targetPrice,
          shippingCost,
          monthlyStorageFee,
          weight
        );

        await sendMessageToContentScript(
          "productPageData",
          {
            asin,
            profit: parseFloat(res.profit).toFixed(2),
            shippingCost: parseFloat(res.shippingCost).toFixed(2),
            fees: parseFloat(res.fees).toFixed(2),
            ReferralFee: res.ReferralFee,
            VariableClosingFee: res.VariableClosingFee,
            baseDomainPriceMain: res.baseDomainPriceMain,
            FBAFees: res.FBAFees,
            PerItemFee: res.PerItemFee,
            monthlyStorageFee: res.monthlyStorageFee,
            baseCurrency: res.baseCurrency,
            roi: res.roi,
            baseDomainPrice: basePrice,
            targetDomainPrice: targetPrice,
            vat: res.vat,
          },
          request.domain
        );
      }
      if (request.type === "resetApp") {
        await resetApp(request.domain);
      }
      if (request.type === "filterApply") {
        const asinListId = request.data.asinListId;

        const data = await getAsinListAsins(asinListId);
        const filteredAsins = await applyFilters(data.asins);
        await sendMessageToContentScript(
          "showComparisonList",
          {
            data: filteredAsins,
            base_domain: data?.asinList?.base_domain,
            target_domain: data?.asinList?.target_domain,
            currency: data?.asinList?.currency,
            status: data?.asinList?.status,
            id: asinListId,
            totalAsinCount: data?.asins?.length,
            tokenCount: data?.token_count,
            asinListName: data?.asinList?.name,
          },
          request.domain
        );
      }
      if (request.type === "downloadComparisonData") {
        const data = await getAsinListAsins(request.data.id);

        sendMessageToContentScript(
          "downloadComparisonData",
          data.asins,
          request.domain
        );
      }
      if (request.type === "downloadAllAsins") {
        const data = await getAllAsinListSingleAsins();
        sendMessageToContentScript(
          "downloadAsins",
          [
            ...new Set(
              data?.asinListAsins.map((i) => {
                return i.asin;
              })
            ),
          ],
          request.domain
        );
      }
      if (request.type === "downloadAllComparisons") {
        const data = await getAllAsinListAsins();

        sendMessageToContentScript(
          "downloadComparisonData",
          data.asinListAsins.filter((i) => i.calculated),
          request.domain
        );
      }
      if (request.type === "startFetchingStocks") {
        const { asin, domain } = request.data;

        const d = await sellerDataHandlerForStock(asin, domain, request);
        const res = await sendStockRequest(asin, domain);
        await sendMessageToContentScript(
          "updateStockButton",
          { stockId: res?.stockId },
          request.domain
        );
      }
      if (request.type === "fetchStockProcess") {
        const { stockId } = request.data;
        const res = await poolStockRequest(stockId);
        await sendMessageToContentScript("stockData", res, request.domain);
      }
      if (request.type === "updatePreferences") {
        return await updateUserPreferences();
      }
      if (request.type === "logout") {
        //clear all chrome storage
        chrome.storage.local.clear();
        await sendMessageToContentScript("loginRequired", {}, null);
      }
      if (request.type === "sendReport") {
        await sendReport(request.data);
        await sendMessageToContentScript(
          "notification",
          { message: "Report sent" },
          request.domain
        );
      }
      if (request.type === "copyAsinList") {
        const id = request.data.id;
        const data = await getAsinListAsins(id);
        sendMessageToContentScript("copyAsinList", data.asins, request.domain);
      }
      if (request.type === "newPage") {
        //check if is there stock fetcher process running
        const isStockFetcherRunning = await getCache(`stockFetcherRunning`);
        if (isStockFetcherRunning === null) {
          //create new cache
          await setCache(`stockFetcherRunning`, false);
        } else {
          //there is an ongoing stock fetcher process
          //stop it
          await setCache(`stockFetcherStopped`, false);
          //restore cookies
          //refresh page
        }
      }
      if (request.type === "sync-user") {
        const response = await syncUser();
        console.log("sync-user response", response);
      }
      if (request.type === "selectPreference") {
        const response = await selectPreference(request?.data?.id);
        console.log("select-preference response", response);
        await sendMessageToContentScript(
          "selectedPreference",
          null,
          request.domain
        );
      }
      if (request.type === "savePreference") {
        if (request?.data?.id === "new") {
          await createPreference(request?.data);
          await sendMessageToContentScript(
            "reRenderPreferences",
            null,
            request.domain
          );
        }
        // else if (!isNaN(parseInt(request?.data?.id))) {
        //   await updatePreference(request?.data);
        //   await sendMessageToContentScript("selectedPreference", null, request.domain);
        // }
        else {
          console.log("invalid preference id");
          await sendMessageToContentScript(
            "notification",
            { message: "Invalid preference id" },
            request.domain
          );
        }
      }
      if (request.type === "deleteSavedSetting") {
        if (!isNaN(parseInt(request?.data?.id))) {
          await deletePreference(request?.data?.id);
          await sendMessageToContentScript(
            "reRenderPreferences",
            null,
            request.domain
          );
        } else {
          console.log("invalid preference id");
          await sendMessageToContentScript(
            "notification",
            { message: "Invalid preference id" },
            request.domain
          );
        }
      }
      if (request.type === "mergeAsinLists") {
        const ids = request.data.ids;
        await mergeAsinLists(ids);
        const asinLists = await getAsinLists();

        await sendMessageToContentScript(
          "savedAsins",
          {
            data: asinLists?.asin_lists,
            from: "Merged",
            tokenCount: asinLists?.token_count,
            asinCount: asinLists?.asin_count,
          },
          request.domain
        );
      }
      if (request.type === "deleteAsinLists") {
        const ids = request.data.ids;
        await deleteMultipleAsinLists(ids);
        const asinLists = await getAsinLists();
        await sendMessageToContentScript(
          "savedAsins",
          {
            data: asinLists?.asin_lists,
            from: request?.data?.from,
            tokenCount: asinLists?.token_count,
            asinCount: asinLists?.asin_count,
          },
          request.domain
        );
      }
      if (request.type === "addToSheet") {
        const data = request.data;
        return await addToSheet(data);
      }
      if (request.type === "setExchangeRates") {
        await setExchangeRate();
      }

      completeTask(request);
    } catch (error) {
      console.log(error, request);
      completeTask(request);
    }
  } else {
    console.log("request sent without refresh token", request);
    if (request.type === "signIn") {
      const data = await signIn(request.data.email, request.data.password);
      if (data) {
        console.log("user", data);
        await sendMessageToContentScript(
          "signInSuccesfull",
          data,
          request.domain
        );
      }
    } else if (request.type === "init") {
      await handleInit();
      await sendMessageToContentScript("init", "init done", request.domain);
      await sendMessageToContentScript("loginRequired", {}, null);
    } else if (request.type === "dailyInit") {
      handleDailyInit();
    } else {
      console.log("login required");
      await sendMessageToContentScript("loginRequired", {}, null);
    }

    completeTask(request);
  }
});
chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason === "install") {
   
  }
});
chrome.runtime.setUninstallURL("https://kepicker.com/support?removed=true");
initializeDb();
taskExecutor();

