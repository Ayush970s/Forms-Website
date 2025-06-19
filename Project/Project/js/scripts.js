// Department titles mapping
const departmentTitles = {
    director_secretariat: "Director Secretariat Forms",
    flight_sim_eval: "Flight Simulation and Evaluation Group Forms",
    it: "Information Technology Forms",
    quality_safety: "Quality, Reliability and Safety Forms",
    project_control: "Project Control and Management Forms",
    propulsion_eval: "Propulsion Systems Evaluation Group Forms",
    materials_mgmt: "Materials Management Group Forms",
    administration: "Administration Forms",
    finance_division: "Finance Division Forms",
    motor_transport: "Motor Transport Forms",
    security_division: "Security Division Forms",
    tech_forecasting: "Technology Forecasting and Analysis Forms",
    cal_lab: "Computer Aided Laboratory Forms",
    strategic_research: "Strategic and Aerospace Research Centre Forms",
    electronics_reliability: "Electronic Systems Reliability Group Forms",
    finance_coord: "Finance Coordination & Human Budgeting Forms"
};


// Function to load forms from PHP backend
async function loadDepartmentForms(deptKey) {
    try {
        const response = await fetch(`api.php?department=${deptKey}`);
        const data = await response.json();
        
        if (data.success) {
            return {
                title: departmentTitles[deptKey] || "Department Forms",
                forms: data.forms.map(form => ({
                    id: form.id,
                    name: form.form_name,
                    size: form.file_size,
                    file_name: form.file_name
                }))
            };
        } else {
            console.error('API Error:', data.message);
            return {
                title: departmentTitles[deptKey] || "Department Forms",
                forms: []
            };
        }
    } catch (error) {
        console.error('Error loading forms:', error);
        return {
            title: departmentTitles[deptKey] || "Department Forms",
            forms: []
        };
    }
}

// DOM elements
const welcomeMessage = document.getElementById('welcomeMessage');
const formsSection = document.getElementById('formsSection');
const sectionTitle = document.getElementById('sectionTitle');
const formsTableBody = document.getElementById('formsTableBody');
const navLinks = document.querySelectorAll('.nav-link');

// Handle department selection
navLinks.forEach(link => {
    link.addEventListener('click', async (e) => {
        e.preventDefault(); // Prevent default link behavior
        const deptKey = e.target.getAttribute('data-dept');
        
        // Remove active class from all nav links
        navLinks.forEach(nav => nav.classList.remove('active'));
        
        // Add active class to clicked nav link
        e.target.classList.add('active');
        
        // Hide welcome message
        welcomeMessage.style.display = 'none';
        
        // Show loading state
        sectionTitle.textContent = 'Loading forms...';
        formsTableBody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 40px;">Loading forms...</td></tr>';
        formsSection.classList.add('active');

        // Smooth scroll to forms section
        formsSection.scrollIntoView({ behavior: 'smooth' });
        
        try {
            // Load forms from backend
            const deptData = await loadDepartmentForms(deptKey);
            
            // Update section title
            sectionTitle.textContent = deptData.title;
            
            if (deptData.forms.length === 0) {
                formsTableBody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 40px; color: #64748b;">No forms available for this department yet.</td></tr>';
            } else {
                // Generate table rows
                const tableRows = deptData.forms.map((form, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${form.name}</td>
                        <td>${form.size}</td>
                        <td>
                            <button class="download-btn" onclick="downloadForm(${form.id}, '${form.name}')">
                                Download
                            </button>
                        </td>
                    </tr>
                `).join('');
                
                formsTableBody.innerHTML = tableRows;
            }
        } catch (error) {
            console.error('Error loading forms:', error);
            sectionTitle.textContent = 'Error Loading Forms';
            formsTableBody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 40px; color: #dc2626;">Error loading forms. Please try again later.</td></tr>';
        }
    });
});

// Download form function - now uses real backend download
function downloadForm(formId, formName) {
    const btn = event.target;
    const originalText = btn.textContent;
    
    // Show download feedback
    btn.textContent = 'Downloading...';
    btn.disabled = true;
    
    // Create download link and trigger download
    const downloadLink = document.createElement('a');
    downloadLink.href = `download.php?id=${formId}`;
    downloadLink.download = formName;
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    // Update button state
    setTimeout(() => {
        btn.textContent = 'Downloaded ✓';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
        }, 1500);
    }, 1000);
}