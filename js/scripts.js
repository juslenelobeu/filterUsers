let listResultsUsers = null,
    displayStatus = null,
    inputSearch = null,
    buttonSearch = null,
    spinner = null,
    mainSearch = null,
    users = []
    countFemale = 0,
    countMale = 0,
    sumAges = 0,
    averageAges = 0,
    numberFormat = null;
    
const formatter = Intl.NumberFormat('pt-BR');

window.addEventListener('load', async () => {
    mapElements();
    await fetchUsers();
    addEvents();
});

function mapElements(){
    listResultsUsers = document.querySelector('#listResultsUsers');
    displayStatus = document.querySelector('#displayStatus');
    inputSearch = document.querySelector('#inputSearch');
    buttonSearch = document.querySelector('#buttonSearch');
    spinner = document.querySelector('#spinner');
    mainSearch = document.querySelector('#mainSearch');
}

async function fetchUsers() {
    const res = await fetch('https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo');
    const json = await res.json();
    users = json.results.map(({ login, name, picture, dob, gender }) => {
        const fullName = name.first+' '+name.last;
        return {
            id: login.uuid,
            name: fullName,
            nameLowerCase: fullName.toLowerCase(),
            avatar: picture.medium,
            age: dob.age,
            gender: gender
        }
    }).sort((a,b) => {
        return a.name.localeCompare(b.name);
    });

    
}

function showMainSearch(){
    spinner.classList.remove('d-none');
}

function addEvents(){
    inputSearch.addEventListener('keyup', handleKeyUp);
    buttonSearch.addEventListener('click', () => filterUsers(inputSearch.value));
}

function handleKeyUp(event){
    const currentKey = event.key;
    if(currentKey !== 'Enter'){
        return;
    }

    const filterText = event.target.value;
    
    if(filterText !== ''){
        filterUsers(filterText);
    }
}

function filterUsers(filterText){
    const filterTextLowerCase = filterText.toLowerCase();
    const filteredUsers = users.filter(user => {
        return user.nameLowerCase.includes(filterTextLowerCase);
    });

    renderUsers(filteredUsers);
    renderStatistics(filteredUsers);
}

function renderUsers(users){
    listResultsUsers.innerHTML = '';

    const h2 = document.createElement('h2');
    h2.textContent = `${users.length} usuário(s) encontrado(s)`;
    const ul = document.createElement('ul');
    ul.classList.add('list-group');
    
    users.forEach(user => {
        const li = document.createElement('li');
        const img = `<img class="shadow rounded-circle img-fluid mr-3" src="${user.avatar}" alt="${user.name}"`;
        const userData = `<span>${user.name}, ${user.age} anos</span>`;
        li.innerHTML = `${img}${userData}`;
        li.classList.add('list-group-item-secondary');
        li.classList.add('list-group-item');
        ul.appendChild(li);
    })
    showMainSearch();
    setTimeout(() => {
        spinner.classList.add('d-none')
        listResultsUsers.appendChild(h2);
        listResultsUsers.appendChild(ul);
    }, 1500);
}

function renderStatistics(users){
    countMale = users.filter(user => user.gender === 'male').length;
    countFemale = users.filter(user => user.gender === 'female').length;

    sumAges = users.reduce((acc, curr) => {
        return acc + curr.age;
    }, 0);

    averageAges = sumAges / users.length || 0;

    showMainSearch();
    setTimeout(() => {
        
        displayStatus.innerHTML = `
        <h2>Estatísticas</h2>
        <ul class="list-group shadow">
            <li class="list-group-item list-group-item-dark d-flex justify-content-between align-items-center">
                Sexo Masculino
                <span class="badge badge-dark badge-pill">${countMale}</span>
            </li>
            <li class="list-group-item list-group-item-dark d-flex justify-content-between align-items-center">
                Sexo Feminino
                <span class="badge badge-dark badge-pill">${countFemale}</span>
            </li>
            <li class="list-group-item list-group-item-dark d-flex justify-content-between align-items-center">
                Soma das idades
                <span class="badge badge-dark badge-pill">${formatNumber(sumAges)}</span>
            </li>
            <li class="list-group-item list-group-item-dark d-flex justify-content-between align-items-center">
                Média das idades
                <span class="badge badge-dark badge-pill">${formatAverage(averageAges)}</span>
            </li>
        </ul>

        `;
    }, 1500);
    displayStatus.innerHTML = '';
}

function formatNumber(number){
    return formatter.format(number);
}
 function formatAverage(number){
     return number.toFixed(2).replace('.',',');
}