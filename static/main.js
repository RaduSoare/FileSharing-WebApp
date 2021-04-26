
	function signUp() {
		var email = document.getElementById("email");
		var password = document.getElementById("password");

		const promise = auth.createUserWithEmailAndPassword(email.value, password.value);
		promise.catch(e=> alert(e.message));

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
			window.location.replace('/login');
			// ...
		})
		.catch((error) => {
			var errorCode = error.code;
			var errorMessage = error.message;
			alert(error.message);
		});

		//promise.catch(e => alert(e.message));

		

        

        
    }