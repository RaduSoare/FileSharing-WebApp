
	function signUp() {
		var email = document.getElementById("email");
		var password = document.getElementById("password");
		var username = document.getElementById("username");

		if (email.value == '' || username.value =='' || username.value =='') {
			alert('Form not completed!');
			return;
		}

		const promise = auth.createUserWithEmailAndPassword(email.value, password.value);
		promise.catch(e=> {
			alert(e.message);
			return;
		});

		var docData = {
			Name: username.value,
			Subscriptions: []
		};
		firebase.firestore().collection("users").doc(email.value).set(docData).then(() => {
			console.log("Document successfully written!");
		});

		alert("Registered");
	}

    function signIn() {
        var email = document.getElementById("email");
        var password = document.getElementById("password");

        firebase.auth().signInWithEmailAndPassword(email.value, password.value)
		.then((userCredential) => {
			// Signed in
			var user = userCredential.user;
			console.log(user.email);
			window.location.replace('/main');
			// ...
		})
		.catch((error) => {
			var errorCode = error.code;
			var errorMessage = error.message;
			alert(error.message);
		});

    }