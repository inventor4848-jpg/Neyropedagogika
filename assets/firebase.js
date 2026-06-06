const firebaseConfig = {
  apiKey: "AIzaSyC85XPCnRVY87NMpv_MaxRzc7YFFpSAEeE",
  authDomain: "neuroped-3ef14.firebaseapp.com",
  projectId: "neuroped-3ef14",
  storageBucket: "neuroped-3ef14.firebasestorage.app",
  messagingSenderId: "283325791767",
  appId: "1:283325791767:web:4632fc7412d1cc530da652"
};

firebase.initializeApp(firebaseConfig);
window.db = firebase.firestore();
