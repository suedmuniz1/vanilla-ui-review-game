import "./css/app.css";
import axios from "axios";

class Game {
  constructor(title, genre, score, description) {
    this.title = title;
    this.genre = genre;
    this.score = score;
    this.description = description;
  }
}

// UI class: Handle UI Tasks
class UI {
  static displayGames() {
    axios({
      method: "get",
      url: "http://localhost:3000/games",
    })
      .then((res) => res.data)
      .then((data) => {
        data.forEach((game) => UI.addGameToList(game));
      })
      .catch((err) => console.error(err));
  }

  static addGameToList(game) {
    const list = document.querySelector("#game-list");
    const row = document.createElement("tr");
    row.setAttribute("id", game.id);

    row.innerHTML = `
              <td id="id-${game.id}" style="display: none">${game.id}</td>
              <td id="game-${game.id}-title">${game.title}</td>
              <td id="game-${game.id}-genre">${game.genre}</td>
              <td id="game-${game.id}-score">${game.score}</td>
              <td id="game-${game.id}-description">${game.description}</td>
              <td><a id="" href="#" class="btn btn-primary btn-sm game-${game.id}-edit">Editar</a></td>
              <td><a href="#" class="btn btn-danger btn-sm game-${game.id}-delete">Excluir</a></td>
          `;

    list.appendChild(row);
  }

  static updateGameOnList(game) {
    const row = document.getElementById(game.id);

    row.querySelector(`#game-${game.id}-title`).innerHTML = game.title;
    row.querySelector(`#game-${game.id}-genre`).innerHTML = game.genre;
    row.querySelector(`#game-${game.id}-score`).innerHTML = game.score;
    row.querySelector(`#game-${game.id}-description`).innerHTML =
      game.description;

    document.querySelector("#edit-game-id").remove();
    document.querySelector("#save-changes-button").style.display = "none";
    document.querySelector("#cancel-button").style.display = "none";
    document.querySelector("#add-button").style.display = "block";

    UI.showAlert("Game information updated.", "success");
  }

  static deleteGame(el, gameId) {
    if (el.classList.contains(`game-${gameId}-delete`)) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#game-form");
    container.insertBefore(div, form);

    // Vanish in 3 seconds
    setTimeout(() => document.querySelector(".alert").remove(), 3000);
  }

  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#genre").value = "";
    document.querySelector("#score").value = "";
    document.querySelector("#description").value = "";
  }
}

// Event: Displays Books
document.addEventListener("DOMContentLoaded", UI.displayGames);

// Event: Saving an edited game
document
  .querySelector("#save-changes-button")
  .addEventListener("click", (e) => {
    const newTitle = document.querySelector("#title").value;
    const newGenre = document.querySelector("#genre").value;
    const newScore = document.querySelector("#score").value;
    const newDescription = document.querySelector("#description").value;
    const id = document.querySelector("#edit-game-id").textContent;

    const updatedGame = {
      title: newTitle,
      genre: newGenre,
      score: newScore,
      description: newDescription,
    };

    axios
      .put(`http://localhost:3000/games/${id}`, updatedGame)
      .then((response) => response.data)
      .then((data) => {
        UI.updateGameOnList(data);
      });

    UI.clearFields();
  });

// Event: Cancel an editing operation
document.querySelector("#cancel-button").addEventListener("click", (e) => {
  document.querySelector("#edit-game-id").remove();
  document.querySelector("#save-changes-button").style.display = "none";
  document.querySelector("#cancel-button").style.display = "none";
  document.querySelector("#add-button").style.display = "block";
  UI.clearFields();
});

// Event: Add a Game
document.querySelector("#game-form").addEventListener("submit", (e) => {
  // Prevent actual Submit
  e.preventDefault();

  // Get form values
  const title = document.querySelector("#title").value;
  const genre = document.querySelector("#genre").value;
  const score = document.querySelector("#score").value;
  const description = document.querySelector("#description").value;

  // Validate empty fields
  if (title === "" || genre === "" || score === "" || description === "") {
    UI.showAlert("Please, fill in all fields.", "danger");
  } else {
    // Validate existing title in database
    axios({
      method: "get",
      url: "http://localhost:3000/games",
    })
      .then((res) => res.data)
      .then((data) => {
        let hasError = false;

        data.forEach((game) => {
          if (game.title.toLowerCase() === title.toLowerCase()) {
            hasError = true;
          }
        });

        if (hasError) {
          UI.showAlert(
            "This title is already on the list. Please edit the existing one or add a new game title.",
            "danger"
          );
        } else {
          // Instantiate game
          const game = new Game(title, genre, score, description);

          // Add game to database
          axios
            .post("http://localhost:3000/games", game)
            .then((response) => response.data)
            .then((data) => {
              // Add game to UI
              UI.addGameToList(data);
            })
            .catch((err) => console.error(err));

          // Show success message
          UI.showAlert("Game Added", "success");

          // Clear fields
          UI.clearFields();
        }
      })
      .catch((err) => console.error(err));
  }
});

document.querySelector("#game-list").addEventListener("click", (e) => {
  // Get the game ID
  let gameId = e.target.parentElement.parentElement.id;

  // Edit a game
  if (e.target.classList.contains(`game-${gameId}-edit`)) {
    // Getting the data from selected row
    const oldTitle = document.querySelector(
      `#game-${gameId}-title`
    ).textContent;
    const oldGenre = document.querySelector(
      `#game-${gameId}-genre`
    ).textContent;
    const oldScore = document.querySelector(
      `#game-${gameId}-score`
    ).textContent;
    const oldDescription = document.querySelector(
      `#game-${gameId}-description`
    ).textContent;

    // Creating invisible element to store game ID and appending to the form
    const span = document.createElement("span");
    span.style.display = "none";
    span.id = "edit-game-id";
    span.textContent = gameId;
    document.querySelector("#game-form").appendChild(span);

    // Filling out the form with selected row data
    document.querySelector("#title").value = oldTitle;
    document.querySelector("#genre").value = oldGenre;
    document.querySelector("#score").value = oldScore;
    document.querySelector("#description").value = oldDescription;

    // Hiding 'add game review' button, and displaying 'save changes' and 'cancel' instead
    document.querySelector("#save-changes-button").style.display =
      "inline-block";
    document.querySelector("#cancel-button").style.display = "inline-block";
    document.querySelector("#add-button").style.display = "none";
  }

  if (e.target.classList.contains(`game-${gameId}-delete`)) {
    // Remove game from UI
    UI.deleteGame(e.target, gameId);

    //   Remove game from database
    axios.delete(`http://localhost:3000/games/${gameId}`);

    // Show success message
    UI.showAlert("Game Removed", "success");
  }

  e.preventDefault();
});
