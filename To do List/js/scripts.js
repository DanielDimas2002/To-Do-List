const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoDescription = document.querySelector("#todo-description"); 
const todoList = document.querySelector("#todo-list");

// Função para carregar tarefas do localStorage
const loadTodos = () => {
    todoList.innerHTML = ""; // Limpa a lista atual antes de carregar os itens do localStorage
    const todos = getTodosFromLocalStorage();
    todos.forEach((todo) => saveTodo(todo.title, todo.description, todo.done, false));
}

document.addEventListener("DOMContentLoaded", loadTodos);

// Função para salvar uma nova tarefa
const saveTodo = (title, description, done = false, saveToLocalStorage = true) => {
    const todo = document.createElement("div");
    todo.classList.add("todo");
    if (done) {
        todo.classList.add("done");
    }

    const todoContent = document.createElement("div");
    todoContent.classList.add("todo-content");
    
    const todoTitle = document.createElement("h3");
    todoTitle.innerText = title;
    todoContent.appendChild(todoTitle);

    const todoDesc = document.createElement("p");
    todoDesc.innerText = description;
    todoContent.appendChild(todoDesc);

    todo.appendChild(todoContent);

    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("todo-buttons");

    const doneBtn = document.createElement("button");
    doneBtn.classList.add("finish-todo");
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    buttonsContainer.appendChild(doneBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("remove-todo");
    deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    buttonsContainer.appendChild(deleteBtn);

    todo.appendChild(buttonsContainer);

    todoList.appendChild(todo);

    if (saveToLocalStorage) {
        saveTodoLocalStorage(title, description, done);
    }

    todoInput.value = "";
    todoDescription.value = "";
    todoInput.focus();
}

// Função para salvar tarefas no localStorage
const saveTodoLocalStorage = (title, description, done) => {
    let todos = getTodosFromLocalStorage();
    todos.push({ title, description, done });
    localStorage.setItem("todos", JSON.stringify(todos));
}

// Função para obter tarefas do localStorage
const getTodosFromLocalStorage = () => {
    const todos = localStorage.getItem("todos");
    return todos ? JSON.parse(todos) : [];
}

// Evento de envio do formulário
todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const titleValue = todoInput.value.trim();
    const descriptionValue = todoDescription.value.trim();

    if (titleValue && descriptionValue) {
        if (!isDuplicate(titleValue)) {
            saveTodo(titleValue, descriptionValue);
        } else {
            alert("Não são permitidos nomes iguais entre as tarefas.");
        }
    } else {
        alert("Há campos vazios!");
    }

});

// Função para verificar duplicatas
const isDuplicate = (title) => {
    const todos = getTodosFromLocalStorage();
    return todos.some((todo) => todo.title === title);
}

// Evento de clique para finalizar ou remover tarefas
document.addEventListener("click", (e) => {
    const targetEl = e.target;
    const todoEl = targetEl.closest(".todo");

    if (!todoEl) return;

    const title = todoEl.querySelector("h3").innerText;

    if (targetEl.classList.contains("finish-todo")) {
        todoEl.classList.toggle("done");
        updateTodoStatus(title, todoEl.classList.contains("done"));
    }
    if (targetEl.classList.contains("remove-todo")) {
        todoEl.remove();
        removeTodoFromLocalStorage(title);
    }
});

// Função para atualizar o status da tarefa
const updateTodoStatus = (title, done) => {
    let todos = getTodosFromLocalStorage();
    todos = todos.map((todo) => {
        if (todo.title === title) {
            todo.done = done;
        }
        return todo;
    });
    localStorage.setItem("todos", JSON.stringify(todos));
}

// Função para remover tarefas do localStorage
const removeTodoFromLocalStorage = (title) => {
    let todos = getTodosFromLocalStorage();
    todos = todos.filter((todo) => todo.title !== title);
    localStorage.setItem("todos", JSON.stringify(todos));
}
