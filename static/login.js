function signOut() {
    auth.signOut();
    alert("Signed Out ");

    window.location.replace('/');
}