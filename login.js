// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBNRS2rlp8NpGS4nW776Hc8hqHaq7x5PKM",
    authDomain: "vive-coding-backend-6aa93.firebaseapp.com",
    projectId: "vive-coding-backend-6aa93",
    storageBucket: "vive-coding-backend-6aa93.firebasestorage.app",
    messagingSenderId: "810300711274",
    appId: "1:810300711274:web:7b5226119d06ed2e0d8513",
    databaseURL: "https://vive-coding-backend-6aa93-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login-container');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginButton = document.querySelector('.login-button');

    loginButton.addEventListener('click', async (event) => {
        event.preventDefault(); // 폼 제출 기본 동작 방지

        const email = emailInput.value;
        const password = passwordInput.value;

        try {
            await firebase.auth().signInWithEmailAndPassword(email, password);
            alert('로그인에 성공했습니다! 할일 목록 페이지로 이동합니다.');
            window.location.href = 'index.html'; // 로그인 성공 시 할일 목록 페이지로 이동
        } catch (error) {
            alert('로그인 실패: ' + error.message);
            console.error('로그인 에러:', error);
        }
    });
});

