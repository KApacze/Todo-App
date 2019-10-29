//TODO
//format wyswietlania dat
//zoptymalizowac porownywanie dat

"use strict";
let todoList = [];

// let initList = function() {
//   let savedList = window.localStorage.getItem("todos");
//   if (savedList != null) todoList = JSON.parse(savedList);
//   else
//     todoList.push(
//       {
//         title: "Learn JS",
//         description: "Create a demo application for my TODO's",
//         place: "445",
//         dueDate: new Date(2019, 10, 16)
//       },
//       {
//         title: "Lecture test",
//         description: "Quick test from the first three lectures",
//         place: "F6",
//         dueDate: new Date(2019, 10, 17)
//       }
//       // of course the lecture test mentioned above will not take place
//     );
// };

//initList();

$.ajax({
  // copy Your bin identifier here. It can be obtained in the dashboard
  url: "https://api.jsonbin.io/b/5da879a4fb450e0b9ca00b50/latest",
  type: "GET",
  headers: {
    //Required only if you are trying to access a private bin
    "secret-key": "$2b$10$pks4rlNfI6NN6f1ph29HNOvWz9DvTtTpPd0nFi4qvdMEm/IkBt6Vm"
  },
  success: data => {
    // console.log(data);
    todoList = data;
  },
  error: err => {
    console.log(err.responseJSON);
  }
});

let updateJSONbin = function() {
  $.ajax({
    url: "https://api.jsonbin.io/b/5da879a4fb450e0b9ca00b50",
    type: "PUT",
    headers: {
      //Required only if you are trying to access a private bin
      "secret-key":
        "$2b$10$pks4rlNfI6NN6f1ph29HNOvWz9DvTtTpPd0nFi4qvdMEm/IkBt6Vm"
    },
    contentType: "application/json",
    data: JSON.stringify(todoList),
    success: data => {
      // console.log(data);
    },
    error: err => {
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

Date.prototype.isValid = function() {
  return !isNaN(Date.parse(this));
};

function compareDates(b, e, ba) {
  var begin = new Date(b);
  var end = new Date(e);
  var base = new Date(ba);

  if (begin.isValid() && end.isValid()) {
    if (base >= begin && base <= end) return true;
    else return false;
  } else if (begin.isValid()) {
    if (base >= begin) return true;
    else return false;
  } else if (end.isValid()) {
    if (base <= end) return true;
    else return false;
  } else return true;
}

let updateTodoTable = function() {
  let todoTable = $("#todoTbody").empty();

  {
    let filterInput = $("#inputSearch").val();

    let beginDate = new Date($("#dateBegin").val());
    let endDate = new Date($("#dateEnd").val());

    for (let todo in todoList) {
      if (
        (filterInput == "" ||
          todoList[todo].title.includes(filterInput) ||
          todoList[todo].description.includes(filterInput)) &&
        compareDates(beginDate, endDate, todoList[todo].dueDate)
      ) {
        let date = new Date(todoList[todo].dueDate);
        let dateContent = date.toLocaleDateString();
        let newDeleteButton = $("<input>")
          .attr("type","button")
          .attr("value", "x");
        newDeleteButton.on("click", () => deleteTodo(todo));
        let deleteTd = $("<td></td>").append(newDeleteButton);
        let row = $("<tr></tr>")
          .append($("<td></td>").text(todoList[todo].title))
          .append($("<td></td>").text(todoList[todo].description))
          .append($("<td></td>").text(todoList[todo].place))
          .append($("<td></td>").text(dateContent))
          .append(deleteTd);
        todoTable.append(row);
      }
    }
  }
};

//setInterval(updateTodoList, 1000);
setInterval(updateTodoTable, 1000);

let deleteTodo = function(index) {
  todoList.splice(index, 1);
  updateJSONbin();
  window.localStorage.setItem("todos", JSON.stringify(todoList));
};

let addTodo = function() {
  //get the values from the form
  let newTitle = $("#inputTitle").val();
  let newDescription = $("#inputDescription").val();
  let newPlace = $("#inputPlace").val();
  let newDate = new Date($("#inputDate").val());
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
