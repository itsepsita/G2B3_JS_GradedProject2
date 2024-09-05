const validCredentials = { username: "admin", password: "password" }; // Replace with actual credentials

document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("resume.html")) {
        // Load the resume page data and functionalities
        loadResumePage();
    } else if (window.location.pathname.includes("index.html")) {
        // Handle the login functionality
        document.getElementById("loginForm").addEventListener("submit", handleLogin);
    }
});

function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    
    if (username === validCredentials.username && password === validCredentials.password) {
        localStorage.setItem("loggedIn", "true");
        window.location.href = "resume.html";
    } else {
        document.getElementById("error-message").textContent = "Invalid username/password";
    }
}

function loadResumePage() {
    if (localStorage.getItem("loggedIn") !== "true") {
        window.location.href = "index.html";
        return;
    }

    fetch("data.json")
        .then(response => response.json())
        .then(data => {
            window.applicants = data.applicants;
            window.currentIndex = 0;
            displayApplicant();
        });

    document.getElementById("search").addEventListener("input", filterApplicants);
}

function displayApplicant() {
    const applicants = window.applicants;
    if (applicants.length === 0) return;

    const applicant = applicants[window.currentIndex];
    document.getElementById("applicant-details").innerHTML = `
        <h3>${applicant.name}</h3>
        <p>Job: ${applicant.job}</p>
        <p>Email: ${applicant.email}</p>
    `;

    document.getElementById("prev").style.display = window.currentIndex === 0 ? "none" : "inline";
    document.getElementById("next").style.display = window.currentIndex === applicants.length - 1 ? "none" : "inline";
}

function nextApplicant() {
    if (window.currentIndex < window.applicants.length - 1) {
        window.currentIndex++;
        displayApplicant();
    }
}

function prevApplicant() {
    if (window.currentIndex > 0) {
        window.currentIndex--;
        displayApplicant();
    }
}

function filterApplicants() {
    const searchQuery = document.getElementById("search").value.toLowerCase();
    const filtered = window.applicants.filter(applicant => applicant.job.toLowerCase().includes(searchQuery));
    
    if (filtered.length === 0) {
        document.getElementById("search-message").textContent = "Invalid search or No applications for this job";
        document.getElementById("applicant-details").innerHTML = "";
        document.getElementById("prev").style.display = "none";
        document.getElementById("next").style.display = "none";
    } else {
        document.getElementById("search-message").textContent = "";
        window.applicants = filtered;
        window.currentIndex = 0;
        displayApplicant();
    }
}

window.addEventListener("popstate", function () {
    if (window.location.pathname.includes("resume.html")) {
        window.history.pushState(null, "", "resume.html");
    }
});
