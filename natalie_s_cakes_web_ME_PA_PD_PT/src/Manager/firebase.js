import firebase from 'firebase';
//...
// On retrouve notre variable config 
const config = {
  apiKey: "AIzaSyDelwPafb8S9z4ZP2PykR4huR4MdJZytKM",
  authDomain: "cakes-95f38.firebaseapp.com",
  databaseURL: "https://cakes-95f38.firebaseio.com",
  projectId: "cakes-95f38",
  storageBucket: "cakes-95f38.appspot.com",
  messagingSenderId: "195571035307"
};

firebase.initializeApp(config);

export default firebase; 
