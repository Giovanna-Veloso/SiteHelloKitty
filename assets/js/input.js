const searchInput = document.getElementById('searchInput');
const optionsList = document.getElementById('optionsList');
const options = document.querySelectorAll('.option');

// Mostrar as opções ao clicar
function showOptions() {
    optionsList.style.display = 'flex';
}

// Filtrar resultados enquanto digita
searchInput.addEventListener('input', function() {
    const filter = searchInput.value.toLowerCase();
    let hasResult = false;

    options.forEach(option => {
    const text = option.textContent.toLowerCase();
    if (text.includes(filter)) {
        option.style.display = 'block';
        hasResult = true;
    } else {
        option.style.display = 'none';
    }
    });

    // Mostrar "sem resultados" se nada for encontrado
    if (!hasResult) {
    if (!document.querySelector('.no-result')) {
        const noResult = document.createElement('div');
        noResult.className = 'no-result';
        noResult.textContent = 'Nenhum resultado encontrado';
        optionsList.appendChild(noResult);
    }
    } else {
    const noResult = document.querySelector('.no-result');
    if (noResult) noResult.remove();
    }
});

// Selecionar uma opção
options.forEach(option => {
    option.addEventListener('click', () => {
    searchInput.value = option.textContent;
    optionsList.style.display = 'none';
    });
});

// Ocultar opções ao clicar fora
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-box')) {
    optionsList.style.display = 'none';
    }
});