var auth = {
    Login: function (email, password) {
        return new Promise((resolve, reject) => {
            let data = {
                'email': email,
                'password': password
            };
            fetch(`${common.HOST}/api/Auth/SignIn/${data.email}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                body: JSON.stringify(data)
            }).then(common.HandleError)
                .then(response => response.json())
                .then(returnVal => resolve(returnVal))
                .catch(error => reject({ isSuccess: false, userMessage: error }));
        });
    },
    SignUp: function (name, email, phone, password, confirmpassword) {
        return new Promise((resolve, reject) => {
            let data = {
                'name': name,
                'email': email,
                'phone': phone,
                'password': password,
                'confirmpassword': confirmpassword
            };

            fetch(`${common.HOST}/api/Auth/SignUp`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: JSON.stringify(data)
            })
                .then(response => response.json())
                .then(returnVal => resolve(returnVal))
                .catch(error => reject({ isSuccess: false, userMessage: error }));
        });
    }
}