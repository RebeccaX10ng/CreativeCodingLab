// js/main-ui.js

// 导入所有需要的 Firebase 功能
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

// --- 1. Firebase 初始化 ---
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


// --- 2. 动态加载和初始化侧边栏 ---
async function loadAndInitMenu() {
    // 加载 menu.html 的内容
    const response = await fetch('menu.html');
    const menuHTML = await response.text();
    document.getElementById('menu-placeholder').innerHTML = menuHTML;

    // 初始化菜单的弹出/收回功能
    initMenuToggle();
    // 初始化用户登录状态监听器
    initAuthListener();
}

// --- 3. 侧边栏弹出/收回的逻辑 ---
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

// --- 4. 侧边栏登录/登出状态的逻辑 ---
function initAuthListener() {
    onAuthStateChanged(auth, (user) => {
        const authContainer = document.getElementById('authContainer');
        const myCollectionsLink = document.getElementById('myCollectionsLink');
        if (!authContainer || !myCollectionsLink) return;

        if (user) {
            // 用户已登录
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
            // 用户未登录
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

// --- 5. 页面加载完毕后，执行加载菜单的函数 ---
document.addEventListener('DOMContentLoaded', loadAndInitMenu);