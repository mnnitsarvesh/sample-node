function query(e, t, n, r, success, error) {
	var params = {};
	if (t == "GET" && n != undefined) {
		params = $.extend({}, params, n);
		n = undefined;
	}
	return $.ajax({
		url: "/api" + e + "?" + jQuery.param(params),
		async: r,
		method: t,
		data: n != undefined ? JSON.stringify(n) : "",
		dataType: "json",
		contentType: "application/json",
		success: function (msg) {
			success(msg);
		},
		error: function (jqXHR, textStatus, errorThrown) {
			for (let i = 0; i < jqXHR.responseJSON.errors.length; i++) {
				showError(jqXHR.responseJSON.errors[i]);
			}
			if (error != undefined) error(jqXHR.responseJSON);
		},
	});
}

function mediaQuery(e, t, n, r, success, error) {
	return $.ajax({
		url: "/api" + e,
		async: r,
		method: t,
		data: n != undefined ? n : "",
		processData: false,
		contentType: false,
		success: function (msg) {
			success(msg);
		},
		error: function (jqXHR, textStatus, errorThrown) {
			for (let i = 0; i < jqXHR.responseJSON.errors.length; i++) {
				showError(jqXHR.responseJSON.errors[i]);
			}
			if (error != undefined) error(jqXHR.responseJSON);
		},
	});
}

var api = {
	auth: {
		login: function (data, success, error) {
			return query("/login/", "POST", data, 1, success, error);
		},
	},
};
