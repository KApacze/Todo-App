"use strict";
let todoList = [];

let initList = function () {
    let savedList = window.localStorage.getItem("todos");
    if (savedList != null)
        todoList = JSON.parse(savedList);
    else
        todoList.push(
            {
                title: "Learn JS",
                description: "Create a demo application for my TODO's",
                place: "445",
                dueDate: new Date(2019, 10, 16)
            },
            {
                title: "Lecture test",
                description: "Quick test from the first three lectures",
                place: "F6",
                dueDate: new Date(2019, 10, 17)
            }
            // of course the lecture test mentioned above will not take place
        );
};

//initList();


$.ajax({
    // copy Your bin identifier here. It can be obtained in the dashboard
    url: 'https://api.jsonbin.io/b/5da879a4fb450e0b9ca00b50/latest',
    type: 'GET',
    headers: { //Required only if you are trying to access a private bin
        'secret-key': "$2b$10$pks4rlNfI6NN6f1ph29HNOvWz9DvTtTpPd0nFi4qvdMEm/IkBt6Vm"
    },
    success: (data) => {
        console.log(data);
        todoList = data;
    },
    error: (err) => {
        console.log(err.responseJSON);
    }
});

let updateJSONbin = function () {
    $.ajax({
        url: 'https://api.jsonbin.io/b/5da879a4fb450e0b9ca00b50',
        type: 'PUT',
        headers: { //Required only if you are trying to access a private bin
            'secret-key': '$2b$10$pks4rlNfI6NN6f1ph29HNOvWz9DvTtTpPd0nFi4qvdMEm/IkBt6Vm'
        },
        contentType: 'application/json',
        data: JSON.stringify(todoList),
        success: (data) => {
            console.log(data);
        },
        error: (err) => {
            console.log(err.responseJSON);
        }
    });
};

/*
//LISTA
let updateTodoList = function () {
  let todoListDiv =
    document.getElementById("todoListView");

  //remove all elements
  while (todoListDiv.firstChild) {
    todoListDiv.removeChild(todoListDiv.firstChild);
  }
  //add all elements
  let filterInput = document.getElementById("inputSearch");
  for (let todo in todoList) {
    if (
      (filterInput.value == "") ||
      (todoList[todo].title.includes(filterInput.value)) ||
      (todoList[todo].description.includes(filterInput.value))
    ) {
      let newElement = document.createElement("p");
      let newContent = document.createTextNode(todoList[todo].title + " " +
        todoList[todo].description);
      newElement.appendChild(newContent);
      //delete button
      let newDeleteButton = document.createElement("input");
      newDeleteButton.type = "button";
      newDeleteButton.value = "x";
      newDeleteButton.addEventListener("click",
        function () {
          deleteTodo(todo);
        });
      newElement.appendChild(newDeleteButton);
      todoListDiv.appendChild(newElement);
    }
  }

}
*/

Date.prototype.isValid = function () {
  // An invalid date object returns NaN for getTime() and NaN is the only
  // object not strictly equal to itself.
  return this.getTime() === this.getTime();

}; 

function isDateIn(arr) {
if(arr[0]>= arr[1] && arr[0] <= arr[2]) {
  return 1;
}else return 0;
}

function compareDates(b, e, ba) {
  var begin = new Date(b);
  var end = new Date(e);
  var base = new Date(ba);

  

  // console.log(base);
  // console.log(begin);
  // console.log(end);
  if(begin.isValid() && end.isValid()) {
      if(base>begin && base <end) return true;
      else return false;

  // var day = [base.getDate(), begin.getDate(), end.getDate()];
  // var month = [base.getMonth(), begin.getMonth(), end.getMonth()];
  // var year = [base.getYear(), begin.getYear(), end.getYear()];
  // for(let i in month ) {
  //   console.log(month[i]);
  // } 

  // if(base.getYear() >= begin.getYear() && base.getYear() <= end.getYear()){
  //   if(base.getYear() === begin.getYear() && base.getMonth() <= begin.getMonth()){
      
  //     if(base.getMonth() === begin.getMonth() && base.getDay() <= begin.getDay()) { 
  //       return false;
  //     } else return true;
  //   }
    
      
    
     
  //   return true;
  // } else return false;
   } else return true;
}

//DYNAMICZNA TABELA
let createTd = function (row, content) {
    let td = document.createElement("td");
    let text = document.createTextNode(content);
    td.appendChild(text);
    row.appendChild(td);
};

let updateTodoTable = function () {
    let todoTable = document.getElementById("todoTbody");

    while (todoTable.firstChild) {
        todoTable.removeChild(todoTable.firstChild);
    }

    //todoTable.rows.length

    {
        let filterInput = document.getElementById("inputSearch");
        let beginDate = document.getElementById("dateBegin");
        var begin = new Date(beginDate.value);
        let endDate = document.getElementById("dateEnd");
       let end = new Date(endDate.value);
     
        for (let todo in todoList) {
         
            if (

              
                ((filterInput.value == "") ||
                (todoList[todo].title.includes(filterInput.value)) ||
                (todoList[todo].description.includes(filterInput.value))) &&
                compareDates(begin, end, todoList[todo].dueDate)
            ) {

                let row = todoTable.insertRow(todoTable.rows.length);
                createTd(row, todoList[todo].title);
                createTd(row, todoList[todo].description);
                createTd(row, todoList[todo].place);
                createTd(row, todoList[todo].dueDate);
                let newDeleteButton = document.createElement("input");
                newDeleteButton.type = "button";
                newDeleteButton.value = "x";
                newDeleteButton.addEventListener("click",
                    function () {
                        deleteTodo(todo);
                    });
                let td = document.createElement("td");
                td.appendChild(newDeleteButton);
                row.appendChild(td);
                //todoTable.appendChild(row);
            }
        }
    }
};

//setInterval(updateTodoList, 1000);
setInterval(updateTodoTable, 10000);


let deleteTodo = function (index) {
    todoList.splice(index, 1);
    updateJSONbin();
    window.localStorage.setItem("todos", JSON.stringify(todoList));
};


let addTodo = function () {
    //get the elements in the form
    let inputTitle = document.getElementById("inputTitle");
    let inputDescription = document.getElementById("inputDescription");
    let inputPlace = document.getElementById("inputPlace");
    let inputDate = document.getElementById("inputDate");
    //get the values from the form
    let newTitle = inputTitle.value;
    let newDescription = inputDescription.value;
    let newPlace = inputPlace.value;
    let newDate = new Date(inputDate.value);
    //create new item
    let newTodo = {
        title: newTitle,
        description: newDescription,
        place: newPlace,
        dueDate: newDate
    };
    //add item to the list
    todoList.push(newTodo);
    //save on local storage
    //window.localStorage.setItem("todos", JSON.stringify(todoList));
    updateJSONbin();

};






