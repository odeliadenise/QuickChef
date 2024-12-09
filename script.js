const searchBtn = document.getElementById('search-btn');
const mealList = document.getElementById('meal');
const mealDetailsContent = document.querySelector('.meal-details-content');
const recipeCloseBtn = document.getElementById('recipe-close-btn');

// Event Listeners
searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    document.querySelector('.meal-details').classList.remove('showRecipe');
});

// Fetch and display meal list
function getMealList() {
    let searchInputTxt = document.getElementById('search-input').value.trim();

    // Check if the input is empty
    if (searchInputTxt === "") {
        const errorMessage = document.getElementById('error-message');
        errorMessage.style.display = "block"; // Show the error message
        errorMessage.innerHTML = "<p>Please enter an ingredient.</p>";
        mealList.innerHTML = ""; // Clear any previous results
        return; // Exit the function
    }

    // Hide the error message if input is valid
    document.getElementById('error-message').style.display = "none";

    // Fetch data from API
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
        .then(response => response.json())
        .then(data => {
            let html = "";
            if (data.meals) {
                data.meals.forEach(meal => {
                    html += `
                        <div class="meal-item" data-id="${meal.idMeal}">
                            <div class="meal-img">
                                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                            </div>
                            <div class="meal-name">
                                <h3>${meal.strMeal}</h3>
                                <a href="#" class="recipe-btn">Get Recipe</a>
                            </div>
                        </div>
                    `;
                });
                mealList.classList.remove('notFound');
            } else {
                html = "<p>Sorry, no meals found.</p>";
                mealList.classList.add('notFound');
            }
            mealList.innerHTML = html;
        })
        .catch(error => {
            console.error("Error fetching meal data:", error);
            const errorMessage = document.getElementById('error-message');
            errorMessage.style.display = "block";
            errorMessage.innerHTML = "<p>Something went wrong. Please try again later.</p>";
        });
}


// Fetch and display meal recipe
function getMealRecipe(e) {
    e.preventDefault();
    if (e.target.classList.contains('recipe-btn')) {
        let mealItem = e.target.parentElement.parentElement;

        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
            .then(response => response.json())
            .then(data => {
                let meal = data.meals[0];
                let html = `
                    <h2 class="recipe-title">${meal.strMeal}</h2>
                    <p class="recipe-category">${meal.strCategory}</p>
                    <div class="recipe-instruct">
                        <h3>Instructions:</h3>
                        <p>${meal.strInstructions}</p>
                    </div>
                    <div class="recipe-meal-img">
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    </div>
                    <div class="recipe-link">
                        <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
                    </div>
                `;
                mealDetailsContent.innerHTML = html;
                document.querySelector('.meal-details').classList.add('showRecipe');
            });
    }
}
