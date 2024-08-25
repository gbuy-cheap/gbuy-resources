'use strict';

$(document).ready(function () {

  chrome.storage.local.get(["extensionEnabled"], function (result) {
    try {
      if (result.extensionEnabled == undefined || result.extensionEnabled) {
        $("#enableExtension").prop("checked", true)
      } else {
        $("#enableExtension").prop("checked", false)
      }
    } catch (error) {
      errorHandler.SendErrorToAdmin(error);
    }
  });

  $(document).on("change", "#enableExtension", function () {
    $("#enableExtension").prop("disabled", true)
    chrome.storage.local.set({ extensionEnabled: $("#enableExtension").prop("checked") }, function () {
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
        try {
          for (let i = 0; i < tabs.length; i++) {
            chrome.tabs.sendMessage(tabs[i].id, { message: "extensionEnabled", extensionEnabled: $("#enableExtension").prop("checked") }, function (response) { });
          }
          $("#enableExtension").prop("disabled", false);
        } catch (error) {
          errorHandler.SendErrorToAdmin(error);
        }
      });
    });
  });

  chrome.storage.local.get(["qvEnabled"], function (result) {
    try {
      if (result.qvEnabled == undefined || !result.qvEnabled) {
        $("#enableQuickView").prop("checked", false)
      } else {
        $("#enableQuickView").prop("checked", true)
      }
    } catch (error) {
      errorHandler.SendErrorToAdmin(error);
    }
  });

  $(document).on("change", "#enableQuickView", function () {
    $("#enableQuickView").prop("disabled", true)
    chrome.storage.local.set({ qvEnabled: $("#enableQuickView").prop("checked") }, function () {
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
        try {
          for (let i = 0; i < tabs.length; i++) {
            chrome.tabs.sendMessage(tabs[i].id, { message: "qvEnabled", qvEnabled: $("#enableQuickView").prop("checked") }, function (response) { });
          }
          $("#enableQuickView").prop("disabled", false);
        } catch (error) {
          errorHandler.SendErrorToAdmin(error);
        }
      });
    });
  });

  chrome.storage.local.get(['mysysToken'], async function (result) {
    try {
      if (result?.mysysToken) {
        await ShowLoggedinView();
      } else {
        await ShowLoggedinView(false);
      }
    } catch (error) {
      errorHandler.SendErrorToAdmin(error);
    }
  });

  $('#form-signup').submit(function (event) {
    event.preventDefault();
    $("#form-signup button").prop('disabled', true);
    $("#form-signup button").text("Please Wait");
    let name = $('#form-signup input[name=name]').val(),
      email = $('#form-signup input[name=email]').val(),
      password = $('#form-signup input[name=password]').val(),
      phone = $('#form-signup input[name=phone]').val(),
      confirmpassword = $('#form-signup input[name=confirmpassword]').val();

    auth.SignUp(name, email, phone, password, confirmpassword).then((returnVal) => {
      if (returnVal.isSuccess != undefined && !returnVal.isSuccess) {
        showError(returnVal.userMessage);
      } else if (returnVal.errors && Object.values(returnVal.errors).length > 0) {
        let objArray = Object.values(returnVal.errors);
        let errorMessage = "";

        for (let i = 0; i < objArray.length; i++) {
          for (let k = 0; k < objArray[i]?.length; k++) {
            errorMessage += "<li>" + objArray[i][k] + "</li>";
          }
        }

        showError(errorMessage);

      } else {
        showModal("User Verification", returnVal.userMessage);
      }
    }, (error) => {
      showError(common.CreateErrorMessageByjqXHR(error));
    }).finally(() => {
      $("#form-signup button").prop('disabled', false);
      $("#form-signup button").text("Register");
    });
  });

  $('#form-login').submit(function (event) {
    event.preventDefault();
    $("#form-login button").prop('disabled', true);
    let email = $('#form-login input[name=email]').val();
    let password = $('#form-login input[name=password]').val();

    auth.Login(email, password).then((returnVal) => {
      if (!returnVal.isSuccess) {
        showError(returnVal.userMessage);
      }
      else {
        chrome.storage.local.set({ mysysToken: returnVal.paramStr, userSettings: returnVal.paramStr2 }, async function () {
          await ShowLoggedinView();
          chrome.tabs.query({}, function (tabs) {
            try {
              for (let i = 0; i < tabs.length; i++) {
                chrome.tabs.sendMessage(tabs[i].id, { mysysToken: returnVal.paramStr, userSettings: returnVal.paramStr2 }, function (response) { });
              }
            } catch (error) {
              errorHandler.SendErrorToAdmin(error);
            }
          });
        });
      }
    }, (error) => {
      showError(common.CreateErrorMessageByjqXHR(error));
    }).finally(() => {
      $("#form-login button").prop('disabled', false);
    });
  });

  $("#btnSignOut").click(function (e) {
    $("#btnSignOut").prop('disabled', true);
    chrome.storage.local.get(['mysysToken'], function (result) {
      let token = result.mysysToken;

      $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: `${common.HOST}/api/Auth/SignOut`,
        headers: {
          "token": token
        }
      }).done(async (returnVal) => {
        try {
          await ShowLoggedinView(false);
          if (!returnVal.isSuccess && returnVal.statusCode != 401) {
            showError(returnVal.userMessage);
          }
          chrome.storage.local.remove("mysysToken", function () {
            chrome.tabs.query({}, function (tabs) {
              try {
                for (let i = 0; i < tabs.length; i++) {
                  chrome.tabs.sendMessage(tabs[i].id, { mysysToken: "" }, function (response) { });
                }
              } catch (error) {
                errorHandler.SendErrorToAdmin(error);
              }
            });
          });
        } catch (error) {
          errorHandler.SendErrorToAdmin(error);
        }
      }).fail((jqXHR) => {
        showError(common.CreateErrorMessageByjqXHR(jqXHR));
      }).always(() => {
        $("#btnSignOut").prop('disabled', false);
      })

    })
    e.preventDefault();
  });

  $("#btnForgotPassword").click(function (e) {
    $('#btnForgotPassword').addClass("disabled");
    $('#btnForgotPassword').text("Please Wait");
    let email = $("input[name=email]").val();

    if (email) {
      $.ajax({
        type: "POST",
        url: `${common.HOST}/api/Auth/ResetPass/${email}`,
      }).done((returnVal) => {
        if (!returnVal.isSuccess && returnVal.statusCode != 401) {
          showError(returnVal.userMessage);
        }
        if (returnVal.isSuccess) {
          showModal("New Password", returnVal.userMessage);
        }
      }).fail((jqXHR) => {
        showError(common.CreateErrorMessageByjqXHR(jqXHR));
      }).always(() => {
        $('#btnForgotPassword').removeClass("disabled");
        $('#btnForgotPassword').text("Forgot Password");
      });
    } else {
      showError("E-mail cannot be empty.");
      $('#btnForgotPassword').removeClass("disabled");
      $('#btnForgotPassword').text("Forgot Password");
    }
    e.preventDefault();
  })

  $('#form-changepass').submit(function (event) {
    event.preventDefault();
    $("#form-changepass button").prop('disabled', true);
    chrome.storage.local.get(['mysysToken'], function (result) {
      let token = result?.mysysToken;

      let formData = {
        'oldPassword': $('#form-changepass input[name=oldPassword]').val(),
        'newPassword': $('#form-changepass input[name=newPassword]').val(),
        'confirmNewPassword': $('#form-changepass input[name=confirmNewPassword]').val()
      };

      $.ajax({
        url: `${common.HOST}/api/Auth/ChangePass`,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(formData),
        headers: {
          "token": token
        }
      }).done((returnVal) => {
        $('#form-changepass input[name=oldPassword]').val("");
        $('#form-changepass input[name=newPassword]').val("");
        $('#form-changepass input[name=confirmNewPassword]').val("");
        if (!returnVal.isSuccess) {
          showError(returnVal.userMessage);
        } else {
          showModal("Password", returnVal.userMessage);

        }
      }).fail((jqXHR) => {
        showError(common.CreateErrorMessageByjqXHR(jqXHR));
      }).always(() => {
        $("#form-changepass button").prop('disabled', false);
      })
    });
  });

  $("#customModal").on("show.bs.modal", function () {
    $("body").css("height", "150px");
  });

  $("#customModal").on("hide.bs.modal", function () {
    $("body").css("height", "");
  });

  function showError(errorMessage) {
    showModal("Error", errorMessage, "error");
  }

  function showModal(header, content, type) {
    let customModal = new bootstrap.Modal(document.getElementById('customModal'));

    if (type === 'error') {
      $('#customModal #customModalLabel').html(header).addClass("ms-text-danger");
    }
    else {
      $('#customModal #customModalLabel').html(header).removeClass("ms-text-danger");
    }

    $('#customModal .ms-modal-body p').html(content);

    customModal.show();
  }

  async function ShowLoggedinView(show = true) {
    if (show) {
      $("#accordionSignedIn").removeClass("ms-d-none");
      $("#accordionAuth").addClass("ms-d-none");
      $("#enableQuickView").parents("div").eq(0).removeClass("ms-d-none");
      let userInfo = await GetUserInfo();
      if (userInfo && userInfo.UserType != "Premium") {
        EnablePremiumLink(true, userInfo.Token);
      }
    } else {
      $("#accordionSignedIn").addClass("ms-d-none");
      $("#accordionAuth").removeClass("ms-d-none");
      $("#enableQuickView").parents("div").eq(0).addClass("ms-d-none");
      EnablePremiumLink(false);
    }
  }

  async function GetUserInfo() {
    try {
      let userInfo = common.GetUserInfoFromSessionStorage();
      if (!userInfo || userInfo?.Token != mysysToken) {
        userInfo = await common.GetUserInfo();
      }

      return userInfo;
    } catch (error) {
      if (error.indexOf("Session is timed-out or invalid") == -1) {
        errorHandler.SendErrorToAdmin(error);
      } else {
        return null;
      }
    }
  }

  async function EnablePremiumLink(enable = true, token) {
    if (enable) {
      $("#premiumLink").attr("href", (await common.GetPremiumLink(token)));
      $("#premiumLink").removeClass("ms-d-none");
    } else {
      $("#premiumLink").attr("href", "");
      $("#premiumLink").addClass("ms-d-none");
    }
  }
});

