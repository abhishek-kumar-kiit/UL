let recipes = [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

const recipeList = document.getElementById("recipe-list");
const searchInput = document.getElementById("search");
const filterSelect = document.getElementById("filter");
const modal = document.getElementById("recipe-modal");
const closeModal = document.getElementById("close-modal");

// Fetch recipes from JSON file
fetch("recipes.json")
    .then(res => res.json())
    .then(data => {
        recipes = data;
        renderRecipes(recipes);
    });

function renderRecipes(list) {
    recipeList.innerHTML = "";
    list.forEach(recipe => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.name}">
            <div class="card-content">
                <h3>${recipe.name}
                    <span class="favorite ${favorites.includes(recipe.id) ? 'active' : ''}" 
                          onclick="toggleFavorite(${recipe.id})">♥</span>
                </h3>
                ${recipe.tags.map(tag => `<span class="tag">${tag}</span>`).join("")}
            </div>
        `;

        card.addEventListener("click", (e) => {
            if (!e.target.classList.contains("favorite")) {
                openModal(recipe);
            }
        });

        recipeList.appendChild(card);
    });
}

function openModal(recipe) {
    document.getElementById("modal-title").textContent = recipe.name;
    document.getElementById("modal-image").src = recipe.image;
    document.getElementById("modal-ingredients").innerHTML = recipe.ingredients.map(i => `<li>${i}</li>`).join("");
    document.getElementById("modal-steps").innerHTML = recipe.steps.map(s => `<li>${s}</li>`).join("");
    modal.style.display = "block";
}

closeModal.onclick = () => modal.style.display = "none";
window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; };

function toggleFavorite(id) {
    if (favorites.includes(id)) {
        favorites = favorites.filter(fav => fav !== id);
    } else {
        favorites.push(id);
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
    applyFilters();
}

function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const filterValue = filterSelect.value;

    let filtered = recipes.filter(r => r.name.toLowerCase().includes(searchTerm));

    if (filterValue !== "all") {
        if (filterValue === "favorites") {
            filtered = filtered.filter(r => favorites.includes(r.id));
        } else {
            filtered = filtered.filter(r => r.tags.includes(filterValue));
        }
    }

    renderRecipes(filtered);
}

searchInput.addEventListener("input", applyFilters);
filterSelect.addEventListener("change", applyFilters);

document.getElementById('nav-veg').addEventListener('click', function() {
    document.getElementById('filter').value = 'veg';
    document.getElementById('filter').dispatchEvent(new Event('change'));
    setActiveNavButton('nav-veg');
});

document.getElementById('nav-nonveg').addEventListener('click', function() {
    document.getElementById('filter').value = 'non-veg';
    document.getElementById('filter').dispatchEvent(new Event('change'));
    setActiveNavButton('nav-nonveg');
});

function setActiveNavButton(activeId) {
    document.querySelectorAll('.nav-buttons button').forEach(btn => {
        btn.classList.toggle('active', btn.id === activeId);
    });
}
