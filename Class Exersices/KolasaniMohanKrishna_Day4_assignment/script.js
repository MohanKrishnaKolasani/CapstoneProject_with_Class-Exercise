let users = [];

let activities = [
    { id: 1, activity: "Create project file which contains tables between 12 to 19", subject: "Maths" },
    { id: 2, activity: "Science model preparation", subject: "Science" },
    { id: 3, activity: "Essay writing competition", subject: "English" },
    { id: 4, activity: "Algebra worksheet practice", subject: "Maths" }
];

function showRegister() {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("registerPage").style.display = "block";
}
function backToLogin() {
    document.getElementById("registerPage").style.display = "none";
    document.getElementById("loginPage").style.display = "block";
}
function register() {
    let username = document.getElementById("regUser").value;
    let password = document.getElementById("regPass").value;

    users.push({ username, password });

    alert("Registration Successful!");
    backToLogin();
}

function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let validUser = users.find(user =>
        user.username === username && user.password === password
    );

    if (validUser) {
        document.getElementById("loginPage").style.display = "none";
        document.getElementById("mainApp").style.display = "block";
        window.location.hash = "";
    } else {
        alert("Invalid Credentials!");
    }
}


function logout() {
    document.getElementById("mainApp").style.display = "none";
    document.getElementById("loginPage").style.display = "block";
    window.location.hash = "";
}


function displayActivities(data) {
    let list = document.getElementById("activityList");
    list.innerHTML = "";

    data.forEach(item => {
        let li = document.createElement("li");
        li.className = "list-group-item";
        li.innerText = item.activity + " (" + item.subject + ")";
        list.appendChild(li);
    });
}

function filterActivities() {
    let subject = document.getElementById("subjectSelect").value;

    if (subject === "All") {
        displayActivities(activities);
    } else {
        let filtered = activities.filter(a => a.subject === subject);
        displayActivities(filtered);
    }
}

displayActivities(activities);
