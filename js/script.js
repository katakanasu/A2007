document.addEventListener('DOMContentLoaded', function() {
    let studentsData;

    // Fetch students data from JSON
    fetch('data/students.json')
        .then(response => response.json())
        .then(data => {
            studentsData = data;
            populateStudentSelect(studentsData);
        });

    // Handle login form submission
    document.getElementById('login-form')?.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const className = document.getElementById('class').value;

        // Validate the input against the JSON data
        const isValid = studentsData.some(student => student.name === name && student.class === className);

        if (isValid) {
            // Store the logged-in user in local storage
            localStorage.setItem('loggedInUser', JSON.stringify({ name, className }));
            window.location.href = 'login.html';
        } else {
            document.getElementById('login-error').style.display = 'block';
        }
    });

    // Handle data form submission
    document.getElementById('data-form')?.addEventListener('submit', function(event) {
        event.preventDefault();

        const studentSelect = document.getElementById('student');
        const selectedStudentIndex = studentSelect.selectedIndex;
        const selectedStudent = studentSelect.options[selectedStudentIndex].dataset;

        const item = document.getElementById('item').value;

        const expiryTime = new Date();
        expiryTime.setHours(16, 0, 0, 0); // Set to 16:00:00 of today

        const data = {
            name: selectedStudent.name,
            className: selectedStudent.class,
            photoUrl: selectedStudent.photo,
            item,
            expiryTime: expiryTime.toISOString()
        };

        let storageData = JSON.parse(localStorage.getItem('data')) || [];
        storageData.push(data);
        localStorage.setItem('data', JSON.stringify(storageData));

        updateTable();
    });

    // Handle return form submission
    document.getElementById('return-form')?.addEventListener('submit', function(event) {
        event.preventDefault();

        const returnName = document.getElementById('return-name').value;

        let storageData = JSON.parse(localStorage.getItem('data')) || [];
        storageData = storageData.filter(item => item.name !== returnName);
        localStorage.setItem('data', JSON.stringify(storageData));

        // Redirect to the thank-you page
        window.location.href = 'thankyou.html';
    });

    // Populate student select options
    function populateStudentSelect(students) {
        const studentSelect = document.getElementById('student');
        students.forEach(student => {
            const option = document.createElement('option');
            option.textContent = `${student.name} (${student.class})`;
            option.dataset.name = student.name;
            option.dataset.class = student.class;
            option.dataset.photo = student.photoUrl;
            studentSelect.appendChild(option);
        });
    }

    // Update the table with data from local storage
    function updateTable() {
        const tableBody = document.querySelector('#info-table tbody');
        tableBody.innerHTML = '';

        const data = JSON.parse(localStorage.getItem('data')) || [];

        data.forEach(item => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.className}</td>
                <td><img src="${item.photoUrl}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover;"></td>
                <td>${item.item}</td>
                <td>${new Date(item.expiryTime).toLocaleTimeString()}</td>
            `;

            tableBody.appendChild(row);
        });
    }

    // Call updateTable when the page loads to show existing data
    updateTable();
});
