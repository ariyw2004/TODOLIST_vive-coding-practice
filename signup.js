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
    const signupForm = document.querySelector('.signup-container');
    const emailInput = document.getElementById('email');
    const nicknameInput = document.getElementById('nickname');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const signupButton = document.querySelector('.signup-button-main');

    signupButton.addEventListener('click', async (event) => {
        event.preventDefault(); // 폼 제출 기본 동작 방지

        const email = emailInput.value;
        const nickname = nicknameInput.value;
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (password !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
            await userCredential.user.updateProfile({
                displayName: nickname
            });
            alert('회원가입에 성공했습니다! 로그인 페이지로 이동합니다.');
            window.location.href = 'login.html'; // 회원가입 성공 시 로그인 페이지로 이동
        } catch (error) {
            alert('회원가입 실패: ' + error.message);
            console.error('회원가입 에러:', error);
        }
    });
});

