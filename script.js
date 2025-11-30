// Система ключей
const validKeys = [
    'SHK-A3B9-C2D8', 'SHK-E5F7-G6H4', 'SHK-J8K3-L9M2',
    'SHK-N4P6-Q7R5', 'SHK-S9T2-U8V4', 'SHK-W3X7-Y5Z6',
    'SHK-2A8B-4C9D', 'SHK-6E3F-7G5H', 'SHK-8J2K-9L3M'
];

// Проверка ключа
function checkKey() {
    const keyInput = document.getElementById('keyInput');
    const keyMessage = document.getElementById('keyMessage');
    const key = keyInput.value.trim().toUpperCase();
    
    if (validKeys.includes(key)) {
        keyMessage.style.color = 'green';
        keyMessage.textContent = '✅ Ключ активирован! Доступ открыт.';
        localStorage.setItem('userKey', key);
        setTimeout(() => {
            showMainMenu();
        }, 1500);
    } else {
        keyMessage.style.color = 'red';
        keyMessage.textContent = '❌ Неверный ключ. Попробуйте еще раз.';
    }
}

// Показ главного меню
function showMainMenu() {
    document.getElementById('keyScreen').classList.remove('active');
    document.getElementById('mainMenu').classList.add('active');
    loadUserData();
}

// Выход
function logout() {
    localStorage.removeItem('userKey');
    localStorage.removeItem('userGrades');
    localStorage.removeItem('userNotes');
    document.getElementById('mainMenu').classList.remove('active');
    document.getElementById('keyScreen').classList.add('active');
    document.getElementById('keyInput').value = '';
    document.getElementById('keyMessage').textContent = '';
}

// Навигация по разделам
function showSection(sectionId) {
    // Скрываем все разделы
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Показываем выбранный раздел
    document.getElementById(sectionId).classList.add('active');
}

// Система оценок
let userGrades = [];

function changeGradingSystem() {
    const system = document.getElementById('gradingSystem').value;
    const gradeInput = document.getElementById('gradeInput');
    
    if (system === '10') {
        gradeInput.max = 10;
        gradeInput.placeholder = 'Оценка (1-10)';
    } else {
        gradeInput.max = 5;
        gradeInput.placeholder = 'Оценка (1-5)';
    }
    
    renderGrades();
}

function addGrade() {
    const subjectName = document.getElementById('subjectName').value.trim();
    const gradeValue = document.getElementById('gradeInput').value;
    const system = document.getElementById('gradingSystem').value;
    
    if (!subjectName || !gradeValue) {
        alert('Заполните все поля!');
        return;
    }
    
    userGrades.push({
        subject: subjectName,
        grade: parseInt(gradeValue),
        system: system,
        date: new Date().toLocaleDateString()
    });
    
    saveUserData();
    renderGrades();
    
    // Очищаем поля
    document.getElementById('subjectName').value = '';
    document.getElementById('gradeInput').value = '';
}

function renderGrades() {
    const gradesList = document.getElementById('gradesList');
    const averageGrade = document.getElementById('averageGrade');
    
    if (userGrades.length === 0) {
        gradesList.innerHTML = '<p style="color: #666; text-align: center;">Нет оценок</p>';
        averageGrade.innerHTML = '';
        return;
    }
    
    // Отображаем оценки
    gradesList.innerHTML = userGrades.map(grade => `
        <div style="padding: 10px; border-bottom: 1px solid #f0f0f0; display: flex; justify-content: space-between;">
            <span>${grade.subject}</span>
            <span style="font-weight: bold; color: ${getGradeColor(grade.grade, grade.system)}">
                ${grade.grade} ${grade.system === '10' ? '/10' : ''}
            </span>
        </div>
    `).join('');
    
    // Считаем средний балл
    const average = userGrades.reduce((sum, grade) => sum + grade.grade, 0) / userGrades.length;
    averageGrade.innerHTML = `📊 Средний балл: ${average.toFixed(2)}`;
}

function getGradeColor(grade, system) {
    if (system === '5') {
        if (grade >= 4) return '#28a745';
        if (grade >= 3) return '#ffc107';
        return '#dc3545';
    } else {
        if (grade >= 8) return '#28a745';
        if (grade >= 6) return '#ffc107';
        return '#dc3545';
    }
}

// Система памяток
let userNotes = [];

function addNote() {
    const noteText = document.getElementById('noteText').value.trim();
    
    if (!noteText) {
        alert('Введите текст памятки!');
        return;
    }
    
    userNotes.push({
        text: noteText,
        date: new Date().toLocaleString()
    });
    
    saveUserData();
    renderNotes();
    
    // Очищаем поле
    document.getElementById('noteText').value = '';
}

function renderNotes() {
    const notesList = document.getElementById('notesList');
    
    if (userNotes.length === 0) {
        notesList.innerHTML = '<p style="color: #666; text-align: center;">Нет памяток</p>';
        return;
    }
    
    notesList.innerHTML = userNotes.map((note, index) => `
        <div style="padding: 15px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #667eea;">
            <p>${note.text}</p>
            <small style="color: #666;">${note.date}</small>
            <button onclick="deleteNote(${index})" style="float: right; background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">Удалить</button>
        </div>
    `).join('');
}

function deleteNote(index) {
    userNotes.splice(index, 1);
    saveUserData();
    renderNotes();
}

// Сохранение данных
function saveUserData() {
    localStorage.setItem('userGrades', JSON.stringify(userGrades));
    localStorage.setItem('userNotes', JSON.stringify(userNotes));
}

function loadUserData() {
    const savedGrades = localStorage.getItem('userGrades');
    const savedNotes = localStorage.getItem('userNotes');
    
    if (savedGrades) userGrades = JSON.parse(savedGrades);
    if (savedNotes) userNotes = JSON.parse(savedNotes);
    
    renderGrades();
    renderNotes();
}

// Проверка авторизации при загрузке
window.addEventListener('load', function() {
    const savedKey = localStorage.getItem('userKey');
    if (savedKey && validKeys.includes(savedKey)) {
        showMainMenu();
    }
});
