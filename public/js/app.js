"use strict";

$(document).ready(function () {

    var user = false;
    var username = "";

    $("#login_btn").on("click", function () {
        var loginCheck = {
            username : $("#username-login").val(),
            password : $("#user-password").val()
        }
        $.ajax("/api/account/login", {
            type: "POST",
            data: loginCheck
        }).then(function(response) {
            
        });
    });

    if (req.isAuthenticated()) {

    }

});