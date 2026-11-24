const welcomeScreen = document.getElementById("welcomeScreen");
const menuScreen = document.getElementById("menuScreen");
const enterMenuBtn = document.getElementById("enterMenuBtn");

const categoriesContainer = document.getElementById("categories");
const productsContainer = document.getElementById("products");
const productCount = document.getElementById("productCount");
const emptyState = document.getElementById("emptyState");

let menuData = null;
let activeCategory = "all";


async function loadMenu() {
    try {
        const response = await fetch("./data/menu.json");

        if (!response.ok) {
            throw new Error("Menu data could not be loaded");
        }

        menuData = await response.json();

        renderCategories();
        renderProducts();

    } catch (error) {
        console.error("Menu loading error:", error);
        productsContainer.innerHTML =
            "<p>بارگذاری منو با مشکل مواجه شد. لطفاً صفحه را دوباره باز کنید.</p>";
    }
}


function renderCategories() {
    if (!menuData) return;

    categoriesContainer.innerHTML = "";

    menuData.categories.forEach(category => {
        const button = document.createElement("button");

        button.className =
            `category-btn ${category.id === activeCategory ? "active" : ""}`;

        button.textContent = category.name;

        button.addEventListener("click", () => {
            activeCategory = category.id;
            renderCategories();
            renderProducts();
        });

        categoriesContainer.appendChild(button);
    });
}


function renderProducts() {
    if (!menuData) return;

    const filteredProducts = activeCategory === "all"
        ? menuData.products
        : menuData.products.filter(product =>
            product.category === activeCategory
        );

    productsContainer.innerHTML = "";

    productCount.textContent = `${filteredProducts.length} محصول`;

    emptyState.hidden = filteredProducts.length !== 0;

    filteredProducts.forEach(product => {
        const card = document.createElement("article");
        card.className = "product-card";

        const image = document.createElement("div");
        image.className = "product-image";

        if (product.image) {
            const img = document.createElement("img");
            img.src = product.image;
            img.alt = product.name;
            img.loading = "lazy";

            img.onerror = () => {
                image.style.display = "none";
            };

            image.appendChild(img);
        } else {
            image.style.display = "none";
        }

        const info = document.createElement("div");
        info.className = "product-info";

        const title = document.createElement("h3");
        title.textContent = product.name;

        const description = document.createElement("p");
        description.className = "product-description";
        description.textContent = product.description || "";

        const bottom = document.createElement("div");
        bottom.className = "product-bottom";

        const price = document.createElement("span");
        price.className = "product-price";
        price.textContent = `${Number(product.price).toLocaleString("fa-IR")} تومان`;

        const unit = document.createElement("span");
        unit.className = "product-unit";
        unit.textContent = product.unit || "هر پرس";

        bottom.append(price, unit);
        info.append(title, description, bottom);
        card.append(image, info);

        productsContainer.appendChild(card);
    });
}


function enterMenu() {
    if (enterMenuBtn.disabled) return;

    enterMenuBtn.disabled = true;

    const rect = enterMenuBtn.getBoundingClientRect();

    const circle = document.createElement("div");
    circle.className = "transition-circle";

    circle.style.left = `${rect.left + rect.width / 2}px`;
    circle.style.top = `${rect.top + rect.height / 2}px`;

    document.body.appendChild(circle);

    welcomeScreen.classList.add("leaving");

    setTimeout(() => {
        welcomeScreen.style.display = "none";
        menuScreen.classList.add("visible");

        window.scrollTo({
            top: 0,
            behavior: "instant"
        });

        circle.remove();
    }, 850);
}


enterMenuBtn.addEventListener("click", enterMenu);

loadMenu();

// Theme Management

const themeToggle = document.getElementById("themeToggle");

function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);

    localStorage.setItem("pasha-theme", theme);

    themeToggle.setAttribute(
        "aria-label",
        theme === "dark" ? "فعال کردن حالت روشن" : "فعال کردن حالت تاریک"
    );

    document.querySelector('meta[name="theme-color"]')
        .setAttribute(
            "content",
            theme === "dark" ? "#191714" : "#f4f0e9"
        );
}

const savedTheme = localStorage.getItem("pasha-theme") || "light";

applyTheme(savedTheme);

themeToggle.addEventListener("click", () => {
    const currentTheme =
        document.documentElement.getAttribute("data-theme");

    const newTheme = currentTheme === "dark" ? "light" : "dark";

    applyTheme(newTheme);
});