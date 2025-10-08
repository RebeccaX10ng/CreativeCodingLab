import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBOTjmMPnN16vh6zd6TQ3MVV1I1fqCpQ2U",
    authDomain: "days-records.firebaseapp.com",
    projectId: "days-records",
    storageBucket: "days-records.firebasestorage.app",
    messagingSenderId: "454621890868",
    appId: "1:454621890868:web:9095c79739212ca4e3bd61",
    measurementId: "G-7ZKGPTRHPP"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


async function loadAndInitMenu() {
    const response = await fetch('menu.html');
    const menuHTML = await response.text();
    document.getElementById('menu-placeholder').innerHTML = menuHTML;

    initMenuToggle();
    initAuthListener();
}

function initMenuToggle() {
    const menuBtn = document.getElementById('sideMenuBtn');
    const sideMenu = document.getElementById('sideMenu');
    if (!menuBtn || !sideMenu) return;

    menuBtn.onclick = () => {
        sideMenu.classList.toggle('open');
    };

    document.addEventListener('click', (e) => {
        if (!sideMenu.contains(e.target) && e.target !== menuBtn) {
            sideMenu.classList.remove('open');
        }
    });
}
function initAuthListener() {
    onAuthStateChanged(auth, (user) => {
        const authContainer = document.getElementById('authContainer');
        const myCollectionsLink = document.getElementById('myCollectionsLink');
        if (!authContainer || !myCollectionsLink) return;

        if (user) {
            authContainer.innerHTML = `
                <div class="side-menu-user">
                    <p>Welcome, ${user.displayName.split(' ')[0]}!</p>
                    <a href="#" id="signOutBtn" class="side-menu-signin">Sign Out</a>
                </div>
            `;
            document.getElementById('signOutBtn').addEventListener('click', (e) => {
                e.preventDefault();
                signOut(auth);
            });
            myCollectionsLink.href = 'my-creations.html';
        } else {
            authContainer.innerHTML = `
                <a href="#" id="signInBtn" class="side-menu-signin">Sign In</a>
            `;
            document.getElementById('signInBtn').addEventListener('click', (e) => {
                e.preventDefault();
                const provider = new GoogleAuthProvider();
                signInWithPopup(auth, provider).catch(error => console.error(error));
            });
            myCollectionsLink.href = '#';
        }
    });
}

document.addEventListener('DOMContentLoaded', loadAndInitMenu);