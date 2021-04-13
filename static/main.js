

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

        const promise = auth.signInWithEmailAndPassword(email.value, password.value);

		window.location.replace('/login');

        promise.catch(e => alert(e.message));

        
    }