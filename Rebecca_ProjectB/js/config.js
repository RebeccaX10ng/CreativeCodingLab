const firebaseConfig = {
    apiKey: "AIzaSyBzTuM4DLohNH-tUJP1Vi5Eq9W6I_2-VXI",
    authDomain: "myrecordarchive-6baea.firebaseapp.com",
    databaseURL: "https://myrecordarchive-6baea-default-rtdb.firebaseio.com",
    projectId: "myrecordarchive-6baea",
    storageBucket: "myrecordarchive-6baea.appspot.com",
    messagingSenderId: "278116511261",
    appId: "1:278116511261:web:e22cb8a4652dc9de1c20f4",
    measurementId: "G-HTQJJ6J8ZB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = firebase.database();
const storage = firebase.storage();
const dbRef = db.ref("userData");

function writeNewData(url) {
    dbRef.child(Image1).set(url).then(function () {
        console.log("update core data");
    }).catch(function (error) {
        console.log('Error updating core data:', error);
    })
}