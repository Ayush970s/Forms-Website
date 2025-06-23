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

function loadDepartmentForms(deptKey) {
    return fetch(`api.php?department=${deptKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                return {
                    title: departmentTitles[deptKey] || "Department Forms",
                    forms: data.forms
                };
            } else {
                throw new Error(data.message || 'Failed to load forms');
            }
        })
        .catch(error => {
            console.error('Error loading forms:', error);
            return {
                title: departmentTitles[deptKey] || "Department Forms",
                forms: []
            };
        });
}

const welcomeMessage = document.getElementById('welcomeMessage');
const formsSection = document.getElementById('formsSection');
const sectionTitle = document.getElementById('sectionTitle');
const formsTableBody = document.getElementById('formsTableBody');
const navLinks = document.querySelectorAll('.nav-link');
const navMenu = document.getElementById('navMenu');
const scrollLeftBtn = document.getElementById('scrollLeft');
const scrollRightBtn = document.getElementById('scrollRight');

const scrollAmount = 200;

scrollLeftBtn.addEventListener('click', () => {
    navMenu.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
});

scrollRightBtn.addEventListener('click', () => {
    navMenu.scrollBy({ left: scrollAmount, behavior: 'smooth' });
});

navMenu.addEventListener('wheel', (e) => {
    e.preventDefault();
    const scrollSpeed = 2;
    navMenu.scrollBy({
        left: e.deltaY * scrollSpeed,
        behavior: 'smooth'
    });
});

function updateScrollButtons() {
    const isAtStart = navMenu.scrollLeft <= 0;
    const isAtEnd = navMenu.scrollLeft >= navMenu.scrollWidth - navMenu.clientWidth;

    scrollLeftBtn.disabled = isAtStart;
    scrollRightBtn.disabled = isAtEnd;
}

navMenu.addEventListener('scroll', updateScrollButtons);
window.addEventListener('resize', updateScrollButtons);
setTimeout(updateScrollButtons, 100);

navLinks.forEach(link => {
    link.addEventListener('click', async (e) => {
        e.preventDefault();
        const deptKey = e.target.getAttribute('data-dept');

        navLinks.forEach(nav => nav.classList.remove('active'));
        e.target.classList.add('active');

        welcomeMessage.style.display = 'none';
        sectionTitle.textContent = 'Loading forms...';
        formsTableBody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 40px;">Loading forms...</td></tr>';
        formsSection.classList.add('active');
        formsSection.scrollIntoView({ behavior: 'smooth' });

        try {
            const deptData = await loadDepartmentForms(deptKey);
            sectionTitle.textContent = deptData.title;

            if (deptData.forms.length === 0) {
                formsTableBody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 40px; color: #64748b;">No forms available for this department yet.</td></tr>';
            } else {
                const tableRows = deptData.forms.map((form, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${form.form_name}</td>
                        <td>${form.file_size}</td>
                        <td>
                            <button class="download-btn" onclick="downloadForm(${form.id}, '${form.form_name}')">
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

function downloadForm(formId, formName) {
    const btn = event.target;
    const originalText = btn.textContent;

    btn.textContent = 'Downloading...';
    btn.disabled = true;

    // Create a temporary link to trigger download
    const link = document.createElement('a');
    link.href = `download.php?id=${formId}`;
    link.download = formName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
        btn.textContent = 'Downloaded ✓';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
        }, 1500);
    }, 1000);
}