document.addEventListener("DOMContentLoaded",function (){

  const todos = []
  const RENDER_EVENT = 'render-todo'
  const submitForm = document.getElementById('form');

  submitForm.addEventListener('submit', function (e) {
    e.preventDefault();
    addTodo();
  });

  function addTodo(){
    const inputTodo = document.getElementById("title").value
    const inputDate = document.getElementById("date").value
    const generateID = generateId()
    const todoObject = generateTodoObject(generateID,inputTodo,inputDate,false)
    todos.push(todoObject)

    document.dispatchEvent(new Event(RENDER_EVENT))
  }
  function generateId(){
    return +new Date();
  }
  function generateTodoObject(id, task, timestamp, isCompleted){
    return {
      id,
      task,
      timestamp,
      isCompleted
    }
  }
  document.addEventListener(RENDER_EVENT,function () {
    const uncompletedTODOList = document.getElementById('todos');
    const completedTodo = document.getElementById('completed-todos');
    //Membersihkan Container
    uncompletedTODOList.innerHTML = '';
    completedTodo.innerHTML = '';
    for (const todoItem of todos) {
      const todoElement = makeTodo(todoItem);
      if(!todoItem.isCompleted){
        uncompletedTODOList.append(todoElement);
      }else{
        completedTodo.append(todoElement)
      }
    }

  })

  function makeTodo(todoObject){
    const titleTodo = document.createElement('h2')
    titleTodo.innerText = todoObject.task;

    const timestamp = document.createElement('p')
    timestamp.innerHTML = todoObject.timestamp;

    const textContainer = document.createElement('div')
    textContainer.classList.add('inner')
    textContainer.append(titleTodo,timestamp)

    const container = document.createElement('div')
    container.classList.add('item','shadow')
    container.append(textContainer)

    container.setAttribute('id',`todo-${todoObject.id}`)

    if (todoObject.isCompleted){
      const undoButton = document.createElement('button')
      undoButton.classList.add('undo-button')

      undoButton.addEventListener('click', function () {
        undoTaskFromCompleted(todoObject.id)
      })

      const trashButton = document.createElement('button')
      trashButton.classList.add('trash-button')

      trashButton.addEventListener('click', function () {
        removeTaskFromCompleted(todoObject.id)
      })
      container.append(undoButton,trashButton)
    } else {
      const checkButton = document.createElement('button')
      checkButton.classList.add('check-button')
      checkButton.addEventListener('click', function () {
        addTaskToCompleted(todoObject.id);
      });
      
      container.append(checkButton);
    }
    return container
  }
  function addTaskToCompleted (todoId) {
    const todoTarget = findTodo(todoId);
   
    if (todoTarget == null) return;
   
    todoTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
  function findTodo(todoId) {
    for (const todoItem of todos) {
      if (todoItem.id === todoId) {
        return todoItem;
      }
    }
    return null;
  }
  function removeTaskFromCompleted(todoId){
    const todoTarget = findIndex(todoId)
    if(todoTarget === -1) return
    todos.splice(todoTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT))
  }
  function findIndex(todoId){
    for(const index in todos){
      if(todos[index].id === todoId){
        return index
      }
    }
    return -1
  }
  function undoTaskFromCompleted(todoId){
    const todoTarget = findTodo(todoId)
    if (todoTarget == null) return
    todoTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT))
  }
})
