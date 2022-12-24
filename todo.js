//      Tüm Elementlerin Seçimi

const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.getElementById("card-body-1");
const secondCardBody = document.getElementById("card-body-2");
const filter = document.getElementById("filter");
const clearButton = document.getElementById("clear-todos");

eventListener();

//      Tüm event listenerlar
function eventListener() {
  form.addEventListener("submit", addTodo);
  document.addEventListener("DOMContentLoaded", loadAllTodosToUI);
  secondCardBody.addEventListener("click", deleteTodo);
  filter.addEventListener("keyup", filterTodos);
  clearButton.addEventListener("click", clearAllTodos);
}

//Tüm Todoları Silme
function clearAllTodos(e) {
  if (confirm("Tümünü silmek istediğinize emin misiniz?")) {
    //Arayüzden todoları temizleme
    // todoList.innerHTML = ""; //Yavaş bir yöntem
    while (todoList.firstElementChild != null) {
      todoList.removeChild(todoList.firstElementChild);
    }
    localStorage.removeItem("todos");
  }
}

//Filtreleme Özelliği
function filterTodos(e) {
  const filterValue = e.target.value.toLowerCase();
  const listItems = document.querySelectorAll(".list-group-item");

  listItems.forEach(function (listItem) {
    const text = listItem.textContent.toLowerCase();
    if (text.indexOf(filterValue) === -1) {
      //Bulamadı
      listItem.setAttribute("style", "display : none !important");
    } else {
      listItem.setAttribute("style", "display : block");
    }
  });
}

//Sayfa yüklendiği zaman Todoları LocalStorage'tan çekme ve ekleme
function loadAllTodosToUI() {
  let todos = getTodosFromStorage();
  todos.forEach(function (todo) {
    addTodoToUI(todo);
  });
}
//Todoları Storage'dan silme
function deleteTodoFromToStorage(deletetodo) {
  let todos = getTodosFromStorage();
  todos.forEach(function (todo, index) {
    if (todo === deletetodo) {
      todos.splice(index, 1); //Arrayden değeri silebilir
    }
  });
  localStorage.setItem("todos", JSON.stringify(todos));
}

//Todoları Silme
function deleteTodo(e) {
  if (e.target.className === "fa fa-remove") {
    e.target.parentElement.parentElement.remove();
    deleteTodoFromToStorage(e.target.parentElement.parentElement.textContent);
    showAlert("success", "Todo Başarıyla Silindi...");
  }
}

//Todoları Ekleme ve Alertbox Ekleme
function addTodo(e) {
  const newTodo = todoInput.value.trim();
  //Eğer bir todo girilmeden ekleme yapılırsa hata vermek için
  if (newTodo === "") {
    /*
    <div class="alert alert-danger" role="alert">
        Bir Todo Girmeniz Gerekli
    </div>
    */
    showAlert("danger", "Lütfen bir todo girin...");
  } else {
    addTodoToUI(newTodo);
    addTodoToStorage(newTodo);
    showAlert("success", "Todo Başarıyla Eklendi");
  }

  e.preventDefault();

  //trim() fonksiyonu baştaki ve sondaki gereksiz boşlukların silinmesini sağlar
}

//Alert Box oluşturma
function showAlert(type, message) {
  const alert = document.createElement("div");
  alert.className = `alert alert-${type}`;
  alert.textContent = message;
  firstCardBody.appendChild(alert);
  //SetTimeOut
  setTimeout(function () {
    alert.remove();
  }, 1000);
}

//Storagedan Todoları Alma
function getTodosFromStorage() {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  return todos;
}

//Todoları Storage'a Ekleme
function addTodoToStorage(newTodo) {
  let todos = getTodosFromStorage();
  todos.push(newTodo);
  localStorage.setItem("todos", JSON.stringify(todos));
}

//String değerini list item olarak UI'a ekleyecek
function addTodoToUI(newTodo) {
  /*
    <li class="list-group-item d-flex justify-content-between">
        Todo 1
        <a href="#" class="delete-item"><i class="fa fa-remove"></i></a>
    </li>
  */
  //List İtem oluşturma
  const listItem = document.createElement("li");

  //Link Oluşturma
  const link = document.createElement("a");
  link.href = "#";
  link.className = "delete-item";
  link.innerHTML = "<i class ='fa fa-remove'></i>";

  listItem.className = "list-group-item d-flex justify-content-between";

  //Text Node Ekleme
  listItem.appendChild(document.createTextNode(newTodo));
  listItem.appendChild(link);

  //Todo List'e List İtem'ı Ekleme
  todoList.appendChild(listItem);
  todoInput.value = "";
}
