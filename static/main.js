
var categoriesJSON;
fetch('static/categories.json')
            .then(response => response.json())
            .then(obj => {
                categoriesJSON = obj;
            });

            
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
    // Obtine numele cu care se va salva fisierul
    imgName = document.getElementById("namebox").value;

    // Verifica daca a adaugat numele imaginii
    if (!imgName) {
        alert("Insert image name!");
        return;
    }

    
    // Verifica daca a selectat o imagine
    if (!files[0]) {
        alert("Select image!");
        return;
    }
     
    // Uploadeaza fisierul in folderul userului curent
    var uploadTask = storage.ref("users_content/" + current_user.email.split(".")[0] + "/" + imgName + ".png").put(files[0]);

    // Arata progresul uploadului
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

                // Obtine categoria unde vrea sa fie afisat fisierul
                var fileCategory = document.getElementById("category-select");
                var subject = fileCategory.options[fileCategory.selectedIndex].value;

                // Cauta categoria unde trebuie adaugat
                var category;
                for(var i=0;i<categoriesJSON.length;i++){
                    if(categoriesJSON[i].subject == subject){
                        category = categoriesJSON[i].category;
                        console.log(category);
                        break;
                    }
                }

                firebase.database().ref('content_files/' + current_user.email.split(".")[0] + '/' +
                                        category + '/' + 
                                        subject + '/' + 
                                        imgName).set({
                    Name:imgName,
                    Link:imgUrl
                });
            alert("Image added successfully");
            }
        );
        // Curata elementele pentru alt upload
        document.getElementById("namebox").value = "";
        document.getElementById('UpProgress').innerHTML = "";

        
    });
}

function retrieveFile() {
    imgName = document.getElementById('namebox').value;
    firebase.database().ref('content_files/'+imgName).on('value', function(snapshot) {
        if (snapshot.val() != null && snapshot.val().Link != null) {
            //document.getElementById('img').src = snapshot.val().Link;
            console.log(snapshot.val().Link);
            console.log(snapshot.val().Name);
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