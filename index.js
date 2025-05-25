const itemsPerPage = 5;
let currentPage = 1;
let allItems = [];

document.addEventListener('DOMContentLoaded', function () {
    loadProducts();
});

async function loadProducts() {
    try {
        const response = await fetch('http://localhost:3000/products');
        if (!response.ok) throw new Error('Ошибка загрузки');

        const data = await response.json();
        renderProducts(data);
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Не удалось загрузить продукты');
    }
}

document.getElementById('searchButton').addEventListener('click', function () {
    const filterValue = document.getElementById('filterText').value;
    filterProducts(filterValue);
});

async function filterProducts(value) {
    const response = await fetch(`http://localhost:3000/products?name=${value}`);
    if (!response.ok) throw new Error('Ошибка загрузки');
    const data = await response.json();
    renderProducts(data);
}

function renderProducts(products) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    allItems = products;
    const paginatedItems = allItems.slice(startIndex, endIndex);
    const tableBody = document.querySelector('#productsTable tbody');
    tableBody.innerHTML = paginatedItems.map(product => `
                        <tr>
                            <td>${product.id}</td>
                            <td>${product.name}</td>
                            <td>${product.price}</td>
                            <td>${product.category}</td>
                            <td>
                                <a href="/ProductEdit?id=${product.id}" class="btn btn-warning">Редактировать</a>
                                <button onclick="deleteProduct('${product.id}')" class="btn btn-danger">Удалить</button>
                            </td>
                        </tr>
                    `).join('');
}

function renderPagination() {
    const totalPages = Math.ceil(allItems.length / itemsPerPage);
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    if (totalPages <= 1) return;

    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="#" aria-label="prevoius">
                <span aria-hidden="true">&laquo;</span>
            </a>`;
    prevLi.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            renderProducts(allItems);
            renderPagination();
        }
    });
    pagination.appendChild(prevLi);

    for (let i = 0; i < totalPages; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
        li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        li.addEventListener('click', (e) => {
            e.preventDefault();
            currentPage = i;
            renderProducts(allItems);
            renderPagination();
        });
        pagination.appendChild(li);
    }

    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="#" aria-label="next">
                <span aria-hidden="true">&raquo;</span>
            </a>`;
    nextLi.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentPage > 1) {
            currentPage++;
            renderProducts(allItems);
            renderPagination();
        }
    });
    pagination.appendChild(nextLi);
}

async function deleteProduct(id) {
    if (!confirm('Вы уверены, что хотите удалить этот продукт?')) return;

    try {
        const response = await fetch(`http://localhost:3000/products/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Ошибка удаления');

        await loadProducts();
        alert('Продукт успешно удален');
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Не удалось удалить продукт');
    }
}