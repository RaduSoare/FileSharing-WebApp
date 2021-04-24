
// Insert navbar
$(document).ready(function(){
    $('#my-navbar').load("/navbar");
});

var files = [];
let current_user;

firebase.auth().onAuthStateChanged(user => {
    if (user) {
      console.log("state = definitely signed in")
      console.log(user.email);
      current_user = user;

    }
    else {
      console.log("state = definitely signed out")
    }
  })

function selectFile() {
    
    var reader;

    var input = document.createElement('input');
    input.type = 'file';

    input.onchange = e => {
        files = e.target.files;
        reader = new FileReader();
        reader.readAsDataURL(files[0]);
    }
    input.click();
}

// Pune in storage fisierul
function uploadFile() {
    imgName = document.getElementById("namebox").value;
    
    var uploadTask = storage.ref("users_content/" + current_user.email.split(".")[0] + "/" + imgName + ".png").put(files[0]);

    uploadTask.on('state_changed', 
        function(snapshot){
            progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            document.getElementById('UpProgress').innerHTML = 'Upload' + progress + "%";
        },

        function(error) {
            alert('error in saving the image');
        },

        // Mapeaza link-ul catre fisier la numele fisierului pentru retrieve
        function() {
            uploadTask.snapshot.ref.getDownloadURL().then(function(url) {
                imgUrl = url;

                firebase.database().ref('content_files/' + current_user.email.split(".")[0] + '/' +imgName).set({
                    Name:imgName,
                    Link:imgUrl
                });
            alert("Image added successfully");
            }
        );
        document.getElementById("namebox").value = "";
        document.getElementById('UpProgress').innerHTML = "";

        
    });
}

function retrieveFile() {
    imgName = document.getElementById('namebox').value;
    firebase.database().ref('content_files/'+imgName).on('value', function(snapshot) {
        if (snapshot.val() != null && snapshot.val().Link != null) {
            document.getElementById('img').src = snapshot.val().Link;
        } else {
            alert("Could not retrieve the file");
        }
        
    });
}

function removeFile() {

}

function signOut() {
    
   firebase.auth().signOut().then(() => {
    // Sign-out successful.
    alert("Signed Out ");

    window.location.replace('/');
    }).catch((error) => {
    // An error happened.
    });
    
}