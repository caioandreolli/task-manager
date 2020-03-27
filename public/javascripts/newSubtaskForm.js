const subTaskButtonForm = document.getElementById('create-subtask-button');

subTaskButtonForm.onclick = () => {
  const formContainer = document.getElementById('sub-task-form-container');

  const urlArray = document.documentURI.split('/')
  const taskId = urlArray[urlArray.length - 1];

  formContainer.innerHTML = `
    <form action="/sub-task/new/${taskId}" method="POST">
      <input type="text" name="title" placeholder="Digite o nome da sua tarefa">
      <input type="text" name="description" placeholder="Digite a descrição da sua tarefa">
      <select name="status">
        <option value="TODO">To do</option>
        <option value="ONGOING">Ongoing</option>
        <option value="DONE">Done</option>
        <option value="CANCECLED">Canceled</option>
      </select>
      <input type="date" name="dueDate">

      <button type="submit">Criar Sub-Tarefa</button>
    </form>
  `;

};
