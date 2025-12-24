const firebaseConfig = {
    apiKey: "AIzaSyBNRS2rlp8NpGS4nW776Hc8hqHaq7x5PKM",
    authDomain: "vive-coding-backend-6aa93.firebaseapp.com",
    projectId: "vive-coding-backend-6aa93",
    storageBucket: "vive-coding-backend-6aa93.firebasestorage.app",
    messagingSenderId: "810300711274",
    appId: "1:810300711274:web:7b5226119d06ed2e0d8513",
    databaseURL: "https://vive-coding-backend-6aa93-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

firebase.initializeApp(firebaseConfig);

let db; // Realtime Database 인스턴스를 저장할 변수
let currentUserId = null;

let todoInput;
let addTodoBtn;
let todoList;
let clearAllBtn;
let todos = []; // Firebase에서 데이터를 가져오므로 초기화

const getTodos = () => {
    if (!currentUserId) return; // 사용자 ID가 없으면 할일 가져오지 않음

    db.ref('users/' + currentUserId + '/todos').on('value', (snapshot) => {
        todos = [];
        snapshot.forEach(childSnapshot => {
            const todoItem = childSnapshot.val();
            todos.push({ id: childSnapshot.key, ...todoItem });
        });
        // 별표된 할일을 최상단으로, 그 다음은 최신순으로 정렬
        todos.sort((a, b) => {
            if (a.starred !== b.starred) {
                return b.starred ? -1 : 1; // starred가 true인 항목을 위로
            }
            return (b.timestamp || 0) - (a.timestamp || 0); // timestamp로 내림차순 정렬
        });
        renderTodos();
    });
};

const renderTodos = () => {
    todoList.innerHTML = '';
    todos.forEach((todo) => {
        const listItem = document.createElement('li');
        listItem.setAttribute('data-id', todo.id); // Firestore 문서 ID 사용
        if (todo.completed) {
            listItem.classList.add('completed');
        }
        if (todo.starred) {
            listItem.classList.add('starred');
        }

            listItem.innerHTML = `
                <span class="checkbox"></span>
                <span class="todo-text">${todo.text}</span>
                <span class="todo-author">작성자: ${todo.author || '익명'}</span>
                <button class="star-btn">⭐</button>
                <button class="delete-btn">🗑</button>
            `;

        todoList.appendChild(listItem);
    });
};

const addTodo = async () => {
    if (!currentUserId) return; // 사용자 ID가 없으면 추가하지 않음
    const todoText = todoInput.value.trim();
    if (todoText !== '') {
        const newTodoRef = db.ref('users/' + currentUserId + '/todos').push();
        await newTodoRef.set({
            text: todoText,
            completed: false,
                starred: false,
                author: firebase.auth().currentUser.displayName || '익명', // 작성자 닉네임 추가
                timestamp: firebase.database.ServerValue.TIMESTAMP
        });
        todoInput.value = '';
    }
};

const toggleTodo = async (id, currentCompleted) => {
    if (!currentUserId) return; // 사용자 ID가 없으면 업데이트하지 않음
    await db.ref('users/' + currentUserId + '/todos/' + id).update({ completed: !currentCompleted });
};

const deleteTodo = async (id) => {
    if (!currentUserId) return; // 사용자 ID가 없으면 삭제하지 않음
    await db.ref('users/' + currentUserId + '/todos/' + id).remove();
};

const clearAllTodos = async () => {
    if (!currentUserId) return; // 사용자 ID가 없으면 삭제하지 않음
    await db.ref('users/' + currentUserId + '/todos').remove();
};

const toggleStar = async (id, currentStarred) => {
    if (!currentUserId) return; // 사용자 ID가 없으면 업데이트하지 않음
    await db.ref('users/' + currentUserId + '/todos/' + id).update({ starred: !currentStarred });
};


firebase.auth().onAuthStateChanged(user => {
    if (user) {
        currentUserId = user.uid;
        db = firebase.database(); // 사용자 UID가 있을 때 db 인스턴스 초기화
        getTodos(); // 사용자별 할일 로드
    } else {
        currentUserId = null;
        // 사용자가 로그아웃했거나 로그인하지 않은 경우 처리
        todos = []; // 할일 목록 초기화
        renderTodos();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    todoInput = document.getElementById('todo-input');
    addTodoBtn = document.getElementById('add-todo-btn');
    todoList = document.getElementById('todo-list');
    clearAllBtn = document.getElementById('clear-all-btn');

    addTodoBtn.addEventListener('click', addTodo);

    todoInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTodo();
        }
    });

    todoList.addEventListener('click', (event) => {
        const listItem = event.target.closest('li');
        if (!listItem) return;

        const id = listItem.getAttribute('data-id');
        const todo = todos.find(t => t.id === id);
        if (!todo) return;

        if (event.target.classList.contains('checkbox') || event.target.classList.contains('todo-text')) {
            toggleTodo(id, todo.completed);
        } else if (event.target.classList.contains('delete-btn')) {
            deleteTodo(id);
        } else if (event.target.classList.contains('star-btn')) {
            toggleStar(id, todo.starred);
        }
    });

    clearAllBtn.addEventListener('click', clearAllTodos);
});