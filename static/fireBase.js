
// Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "AIzaSyCeuQ8D_Ur9aa8qH0r7-QVV1xBDJEOoPmw",
    authDomain: "filesharing-c294c.firebaseapp.com",
    projectId: "filesharing-c294c",
    storageBucket: "gs://filesharing-c294c.appspot.com",
    messagingSenderId: "665869251913",
    appId: "1:665869251913:web:0e2da78fd97ff190305698",
    databaseURL: "https://filesharing-c294c-default-rtdb.europe-west1.firebasedatabase.app/",
    measurementId: "G-9LQLPB971Q"
  };


  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  const auth = firebase.auth();
  
  // Get a reference to the storage service, which is used to create references in your storage bucket
  var storage = firebase.storage();

  // Create a storage reference from our storage service
  var storageRef = storage.ref();

  var contentRef = storageRef.child('users_content/');

  var database = firebase.database();
