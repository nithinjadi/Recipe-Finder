let result = document.getElementById("result");
let searchBtn = document.getElementById("search-btn");
let url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

searchBtn.addEventListener("click", () => {
  let userInp = document.getElementById("user-inp").value.trim();
  if (userInp.length === 0) {
    result.innerHTML = `<h3>Input field cannot be empty</h3>`;
  } else {
    fetch(url + userInp)
      .then((response) => response.json())
      .then((data) => {
        if (data.meals) {
          let meals = data.meals.slice(0, 6); // Limit to 6 recipes
          result.innerHTML = ""; // Clear previous results

          meals.forEach((meal) => {
            let ingredients = [];
            let count = 1;

            for (let i in meal) {
              if (i.startsWith("strIngredient") && meal[i]) {
                let ingredient = meal[i];
                let measure = meal[`strMeasure${count}`];
                ingredients.push(`${measure} ${ingredient}`);
                count++;
              }
            }

            // Generate each recipe card
            result.innerHTML += `
              <div class="card">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <div class="details">
                  <h2>${meal.strMeal}</h2>
                  <h4>${meal.strArea}</h4>
                  <button class="view-recipe-btn" data-instructions="${meal.strInstructions}" data-ingredients="${ingredients.join(
              ", "
            )}">View Recipe</button>
                </div>
              </div>
            `;
            console.log(result);
          });

          // Add event listeners to the "View Recipe" buttons
          document.querySelectorAll(".view-recipe-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
              let instructions = e.target.getAttribute("data-instructions");
              let ingredients = e.target.getAttribute("data-ingredients").split(", ");
              let popUp = document.getElementById("popup");
              let popupContent = document.getElementById("popup-content");

              // Fill popup with recipe details
              popupContent.innerHTML = `
                <button id="close-popup">X</button>
                <h2>Instructions</h2>
                <p>${instructions}</p>
                <h3>Ingredients</h3>
                <ul>${ingredients.map((ing) => `<li>${ing}</li>`).join("")}</ul>
              `;

              // Show popup
              popUp.style.display = "block";

              // Close popup
              document.getElementById("close-popup").addEventListener("click", () => {
                popUp.style.display = "none";
              });
            });
          });
        } else {
          result.innerHTML = `<h3>No recipes found. Try another search.</h3>`;
        }
      })
      .catch(() => {
        result.innerHTML = `<h3>Invalid Input</h3>`;
      });
  }
});
