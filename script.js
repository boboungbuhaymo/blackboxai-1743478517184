// Enhanced User Authentication and Data Storage
let users = JSON.parse(localStorage.getItem('users')) || [
    { 
        username: 'admin', 
        password: 'password', 
        role: 'admin',
        email: 'admin@school.edu',
        avatar: 'https://images.pexels.com/photos/736716/pexels-photo-736716.jpeg'
    },
    { 
        username: 'user1', 
        password: 'user1pass', 
        role: 'user',
        email: 'user1@school.edu',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg'
    },
    { 
        username: 'user2', 
        password: 'user2pass', 
        role: 'user',
        email: 'user2@school.edu',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg'
    }
];

let subjects = JSON.parse(localStorage.getItem('subjects')) || ['Mathematics', 'Science', 'History'];
let assignments = JSON.parse(localStorage.getItem('assignments')) || [
    { subjectIndex: 0, name: 'Algebra Homework', dueDate: '2023-06-15', completed: false },
    { subjectIndex: 1, name: 'Science Project', dueDate: '2023-06-20', completed: false }
];
let announcements = JSON.parse(localStorage.getItem('announcements')) || [
    'School will be closed next Monday',
    'Science fair registration is now open'
];
let members = JSON.parse(localStorage.getItem('members')) || [];
let groups = JSON.parse(localStorage.getItem('groups')) || [];

// Enhanced Login and Logout Functions
function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me').checked;
    
    // Show loading state
    document.getElementById('login-text').classList.add('hidden');
    document.getElementById('login-spinner').classList.remove('hidden');
    document.getElementById('message').textContent = '';

    // Simulate network delay
    setTimeout(() => {
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            if (rememberMe) {
                localStorage.setItem('rememberedUser', JSON.stringify({
                    username: user.username,
                    role: user.role,
                    email: user.email,
                    avatar: user.avatar
                }));
            }
            
            if (user.role === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'user.html';
            }
        } else {
            document.getElementById('message').textContent = 'Invalid username or password.';
            document.getElementById('login-password').value = '';
            document.getElementById('login-text').classList.remove('hidden');
            document.getElementById('login-spinner').classList.add('hidden');
        }
    }, 1000);
}

function logout() {
    localStorage.removeItem('rememberedUser');
    window.location.href = 'index.html';
}

// Check for remembered user and initialize
document.addEventListener('DOMContentLoaded', () => {
    const rememberedUser = JSON.parse(localStorage.getItem('rememberedUser'));
    if (rememberedUser) {
        document.getElementById('login-username').value = rememberedUser.username;
        document.getElementById('remember-me').checked = true;
    }

    // Set up event delegation for dynamic elements
    document.body.addEventListener('click', (e) => {
        // Handle dark mode toggle
        if (e.target.closest('#theme-toggle, #profile-theme-toggle')) {
            document.documentElement.classList.toggle('dark');
            localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
        }
        
        // Handle all button clicks using data attributes
        const actionElement = e.target.closest('[data-action]');
        if (!actionElement) return;
        
        const action = actionElement.dataset.action;
        const index = actionElement.dataset.index;
        
        switch(action) {
            case 'edit-subject':
                editSubject(index);
                break;
            case 'delete-subject':
                deleteSubject(index);
                break;
            case 'edit-assignment':
                editAssignment(index);
                break;
            case 'delete-assignment':
                deleteAssignment(index);
                break;
            case 'toggle-assignment':
                toggleAssignmentCompletion(index);
                break;
            case 'edit-announcement':
                editAnnouncement(index);
                break;
            case 'delete-announcement':
                deleteAnnouncement(index);
                break;
            case 'edit-member':
                editMember(index);
                break;
            case 'delete-member':
                deleteMember(index);
                break;
            case 'edit-group':
                editGroup(index);
                break;
            case 'delete-group':
                deleteGroup(index);
                break;
            case 'theme-toggle':
                document.documentElement.classList.toggle('dark');
                localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
                break;
        }
    });

    // Update all displays
    if (window.location.pathname.endsWith('admin.html')) {
        displaySubjects();
        displayAssignments();
        displayAnnouncements();
        displayMembers();
        displayGroups();
    } else if (window.location.pathname.endsWith('user.html')) {
        displayUserSubjects();
        displayUserAssignments();
        displayUserAnnouncements();
        displayUserGroups();
    }
    
    updateNotificationBadges();

    // Initialize dark mode if previously set
    if (localStorage.getItem('darkMode') === 'true') {
        document.documentElement.classList.add('dark');
    }
});

// Notification system
function updateNotificationBadges() {
    const assignmentBadge = document.getElementById('assignment-badge');
    const announcementBadge = document.getElementById('announcement-badge');
    
    if (assignmentBadge) {
        const pendingAssignments = assignments.filter(a => !a.completed).length;
        assignmentBadge.textContent = pendingAssignments;
        if (pendingAssignments > 0) {
            assignmentBadge.classList.add('badge-pulse');
        }
    }
    
    if (announcementBadge) {
        announcementBadge.textContent = announcements.length;
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg text-white ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    }`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('opacity-0', 'transition-opacity', 'duration-300');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Enhanced Helper Functions
function updateSubjectSelects() {
    const subjectSelects = document.querySelectorAll('select[id$="-subject"]');
    subjectSelects.forEach(select => {
        select.innerHTML = '<option value="">Select Subject</option>';
        subjects.forEach((subject, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = subject;
            select.appendChild(option);
        });
    });
    
    // Update subject count in user dashboard
    const subjectCount = document.getElementById('subject-count');
    if (subjectCount) {
        subjectCount.textContent = subjects.length;
    }
}

function updateMemberSelect() {
    const memberSelect = document.getElementById('grouping-members');
    if(memberSelect){
        memberSelect.innerHTML = '';
        members.forEach((member, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = member.username;
            memberSelect.appendChild(option);
        });
    }
    
    // Update member count in admin dashboard
    const memberCount = document.getElementById('member-count');
    if (memberCount) {
        memberCount.textContent = members.length;
    }
}

function updateStats() {
    // Update all stats counters
    const subjectCount = document.getElementById('subject-count');
    const assignmentCount = document.getElementById('assignment-count');
    const memberCount = document.getElementById('member-count');
    const groupCount = document.getElementById('group-count');
    const deadlineCount = document.getElementById('deadline-count');
    const pendingAssignments = document.getElementById('pending-assignments');
    
    if (subjectCount) subjectCount.textContent = subjects.length;
    if (assignmentCount) assignmentCount.textContent = assignments.length;
    if (memberCount) memberCount.textContent = members.length;
    if (groupCount) groupCount.textContent = groups.length;
    
    if (deadlineCount) {
        const upcomingDeadlines = assignments.filter(a => 
            a.dueDate && new Date(a.dueDate) > new Date()
        ).length;
        deadlineCount.textContent = upcomingDeadlines;
    }
    
    if (pendingAssignments) {
        pendingAssignments.textContent = assignments.filter(a => !a.completed).length;
    }
}

// Enhanced Subject Management
function displaySubjects() {
    const subjectList = document.getElementById('subject-list');
    const userSubjectList = document.getElementById('user-subjects');
    
    if(subjectList){
        subjectList.innerHTML = '';
        subjects.forEach((subject, index) => {
            const listItem = document.createElement('li');
            listItem.className = 'flex justify-between items-center py-3 px-4 bg-gray-50 dark:bg-gray-700 rounded-lg';
            listItem.innerHTML = `
                <span class="text-gray-800 dark:text-white">${subject}</span>
                <div class="space-x-2">
                    <button data-action="edit-subject" data-index="${index}" class="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button data-action="delete-subject" data-index="${index}" class="text-red-500 hover:text-red-700 dark:hover:text-red-400">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;
            subjectList.appendChild(listItem);
        });
    }
    
    if(userSubjectList) {
        userSubjectList.innerHTML = '';
        subjects.forEach((subject) => {
            const card = document.createElement('li');
            card.className = 'subject-card p-4 rounded-lg shadow';
            card.innerHTML = `
                <h3 class="font-medium text-lg text-gray-800 dark:text-white">${subject}</h3>
                <p class="text-gray-600 dark:text-gray-300 mt-2">View assignments and resources</p>
                <button class="mt-3 text-primary hover:underline">View Details</button>
            `;
            userSubjectList.appendChild(card);
        });
    }
    
    localStorage.setItem('subjects', JSON.stringify(subjects));
    updateSubjectSelects();
    updateStats();
}

function addSubject() {
    const subjectName = document.getElementById('subject-name').value;
    if (subjectName) {
        subjects.push(subjectName);
        displaySubjects();
        document.getElementById('subject-name').value = '';
        showNotification('Subject added successfully!', 'success');
    }
}

function editSubject(index) {
    const newName = prompt('Enter new subject name:', subjects[index]);
    if (newName) {
        subjects[index] = newName;
        displaySubjects();
        showNotification('Subject updated successfully!', 'success');
    }
}

function deleteSubject(index) {
    if (confirm('Are you sure you want to delete this subject? All related assignments and groups will also be removed.')) {
        subjects.splice(index, 1);
        // Remove related assignments
        assignments = assignments.filter(a => a.subjectIndex !== index);
        // Update subject indices for assignments with higher indices
        assignments = assignments.map(a => {
            if (a.subjectIndex > index) {
                return {...a, subjectIndex: a.subjectIndex - 1};
            }
            return a;
        });
        // Remove related groups
        groups = groups.filter(g => g.subjectIndex !== index);
        // Update group subject indices
        groups = groups.map(g => {
            if (g.subjectIndex > index) {
                return {...g, subjectIndex: g.subjectIndex - 1};
            }
            return g;
        });
        
        displaySubjects();
        displayAssignments();
        displayGroups();
        showNotification('Subject deleted successfully!', 'success');
    }
}

// Enhanced Assignment Management
function displayAssignments() {
    const assignmentList = document.getElementById('assignment-list');
    const userAssignments = document.getElementById('user-assignments');
    
    if(assignmentList){
        assignmentList.innerHTML = '';
        assignments.forEach((assignment, index) => {
            const listItem = document.createElement('li');
            listItem.className = 'flex justify-between items-center py-3 px-4 bg-gray-50 dark:bg-gray-700 rounded-lg mb-2';
            listItem.innerHTML = `
                <div>
                    <span class="font-medium text-gray-800 dark:text-white">${subjects[assignment.subjectIndex]}</span>
                    <p class="text-gray-600 dark:text-gray-300">${assignment.name}</p>
                    ${assignment.dueDate ? `<p class="text-sm ${new Date(assignment.dueDate) < new Date() ? 'text-red-500' : 'text-gray-500'}">Due: ${assignment.dueDate}</p>` : ''}
                </div>
                <div class="space-x-2">
                    <button data-action="edit-assignment" data-index="${index}" class="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button data-action="delete-assignment" data-index="${index}" class="text-red-500 hover:text-red-700 dark:hover:text-red-400">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;
            assignmentList.appendChild(listItem);
        });
    }
    
    if(userAssignments) {
        const selectedSubject = document.getElementById('user-assignment-subject').value;
        userAssignments.innerHTML = '';
        
        assignments.forEach((assignment, index) => {
            if (!selectedSubject || assignment.subjectIndex == selectedSubject) {
                const listItem = document.createElement('li');
                listItem.className = `assignment-due ${assignment.completed ? 'assignment-completed' : ''} p-3 bg-white dark:bg-gray-800 rounded-lg shadow`;
                listItem.innerHTML = `
                    <h4 class="font-medium text-gray-800 dark:text-white">${assignment.name}</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400">${subjects[assignment.subjectIndex]}</p>
                    ${assignment.dueDate ? `<p class="text-sm ${new Date(assignment.dueDate) < new Date() ? 'text-red-500' : 'text-gray-500'}">Due: ${assignment.dueDate}</p>` : ''}
                    <div class="mt-2 flex justify-between items-center">
                        <button data-action="toggle-assignment" data-index="${index}" class="text-sm ${assignment.completed ? 'text-green-500' : 'text-gray-500'}">
                            ${assignment.completed ? '<i class="fas fa-check-circle mr-1"></i> Completed' : 'Mark as complete'}
                        </button>
                        <button class="text-sm text-primary hover:underline">Details</button>
                    </div>
                `;
                userAssignments.appendChild(listItem);
            }
        });
        
        // Update pending assignments count
        const pendingAssignments = assignments.filter(a => !a.completed).length;
        if (document.getElementById('pending-assignments')) {
            document.getElementById('pending-assignments').textContent = pendingAssignments;
        }
    }
    
    localStorage.setItem('assignments', JSON.stringify(assignments));
    updateSubjectSelects();
    updateNotificationBadges();
    updateStats();
}

function addAssignment() {
    const subjectIndex = document.getElementById('assignment-subject').value;
    const assignmentName = document.getElementById('assignment-name').value;
    const dueDate = document.getElementById('assignment-due-date')?.value;
    
    if (subjectIndex && assignmentName) {
        assignments.push({ 
            subjectIndex: parseInt(subjectIndex), 
            name: assignmentName,
            dueDate: dueDate || null,
            completed: false,
            id: Date.now() // Unique ID for each assignment
        });
        displayAssignments();
        document.getElementById('assignment-name').value = '';
        if (document.getElementById('assignment-due-date')) {
            document.getElementById('assignment-due-date').value = '';
        }
        showNotification('Assignment added successfully!', 'success');
    }
}

function editAssignment(index) {
    const assignment = assignments[index];
    const newName = prompt('Enter new assignment name:', assignment.name);
    if (newName) {
        assignments[index].name = newName;
        const newDueDate = prompt('Enter new due date (YYYY-MM-DD):', assignment.dueDate || '');
        if (newDueDate !== null) {
            assignments[index].dueDate = newDueDate || null;
        }
        displayAssignments();
        showNotification('Assignment updated successfully!', 'success');
    }
}

function deleteAssignment(index) {
    if (confirm('Are you sure you want to delete this assignment?')) {
        assignments.splice(index, 1);
        displayAssignments();
        showNotification('Assignment deleted successfully!', 'success');
    }
}

function toggleAssignmentCompletion(index) {
    assignments[index].completed = !assignments[index].completed;
    displayAssignments();
    const status = assignments[index].completed ? 'completed' : 'pending';
    showNotification(`Assignment marked as ${status}!`, 'success');
}

// Enhanced Announcement Management
function displayAnnouncements() {
    const announcementList = document.getElementById('announcement-list');
    const userAnnouncements = document.getElementById('user-announcements');
    
    if(announcementList){
        announcementList.innerHTML = '';
        announcements.forEach((announcement, index) => {
            const listItem = document.createElement('li');
            listItem.className = 'flex justify-between items-center py-3 px-4 bg-gray-50 dark:bg-gray-700 rounded-lg mb-2';
            listItem.innerHTML = `
                <p class="text-gray-800 dark:text-white">${announcement}</p>
                <div class="space-x-2">
                    <button data-action="edit-announcement" data-index="${index}" class="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button data-action="delete-announcement" data-index="${index}" class="text-red-500 hover:text-red-700 dark:hover:text-red-400">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;
            announcementList.appendChild(listItem);
        });
    }
    
    if(userAnnouncements) {
        userAnnouncements.innerHTML = '';
        announcements.forEach((announcement) => {
            const listItem = document.createElement('li');
            listItem.className = 'p-4 bg-white dark:bg-gray-800 rounded-lg shadow';
            listItem.innerHTML = `
                <div class="flex items-start">
                    <div class="flex-shrink-0 pt-1">
                        <i class="fas fa-bullhorn text-primary"></i>
                    </div>
                    <div class="ml-3">
                        <p class="text-gray-800 dark:text-white">${announcement}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">${new Date().toLocaleDateString()}</p>
                    </div>
                </div>
            `;
            userAnnouncements.appendChild(listItem);
        });
    }
    
    localStorage.setItem('announcements', JSON.stringify(announcements));
    updateNotificationBadges();
}

function addAnnouncement() {
    const announcementText = document.getElementById('announcement-text').value;
    if (announcementText) {
        announcements.push(announcementText);
        displayAnnouncements();
        document.getElementById('announcement-text').value = '';
        showNotification('Announcement added successfully!', 'success');
    }
}

function editAnnouncement(index) {
    const newText = prompt('Enter new announcement text:', announcements[index]);
    if (newText) {
        announcements[index] = newText;
        displayAnnouncements();
        showNotification('Announcement updated successfully!', 'success');
    }
}

function deleteAnnouncement(index) {
    if (confirm('Are you sure you want to delete this announcement?')) {
        announcements.splice(index, 1);
        displayAnnouncements();
        showNotification('Announcement deleted successfully!', 'success');
    }
}

// Enhanced Member Management
function displayMembers() {
    const memberList = document.getElementById('member-list');
    if(memberList){
        memberList.innerHTML = '';
        members.forEach((member, index) => {
            const listItem = document.createElement('li');
            listItem.className = 'flex justify-between items-center py-3 px-4 bg-gray-50 dark:bg-gray-700 rounded-lg mb-2';
            listItem.innerHTML = `
                <div>
                    <span class="font-medium text-gray-800 dark:text-white">${member.username}</span>
                    <span class="text-sm ${member.role === 'admin' ? 'text-blue-500' : 'text-gray-500'}">(${member.role})</span>
                </div>
                <div class="space-x-2">
                    <button data-action="edit-member" data-index="${index}" class="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button data-action="delete-member" data-index="${index}" class="text-red-500 hover:text-red-700 dark:hover:text-red-400">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;
            memberList.appendChild(listItem);
        });
    }
    
    localStorage.setItem('members', JSON.stringify(members));
    updateMemberSelect();
    updateStats();
}

function addMember() {
    const memberName = document.getElementById('member-name').value;
    const memberRole = document.getElementById('member-role').value;
    if (memberName) {
        members.push({ 
            username: memberName, 
            role: memberRole,
            email: `${memberName.toLowerCase()}@school.edu`,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(memberName)}&background=random`
        });
        displayMembers();
        document.getElementById('member-name').value = '';
        showNotification('Member added successfully!', 'success');
    }
}

function editMember(index) {
    const member = members[index];
    const newName = prompt('Enter new member name:', member.username);
    if (newName) {
        members[index].username = newName;
        const newRole = prompt('Enter new role (admin/user):', member.role);
        if (newRole && (newRole === 'admin' || newRole === 'user')) {
            members[index].role = newRole;
        }
        displayMembers();
        showNotification('Member updated successfully!', 'success');
    }
}

function deleteMember(index) {
    if (confirm('Are you sure you want to delete this member?')) {
        // Remove member from any groups they're in
        groups = groups.map(group => {
            return {
                ...group,
                memberIndices: group.memberIndices.filter(memberIndex => memberIndex !== index)
            };
        });
        // Update indices for members with higher indices
        groups = groups.map(group => {
            return {
                ...group,
                memberIndices: group.memberIndices.map(memberIndex => {
                    if (memberIndex > index) {
                        return memberIndex - 1;
                    }
                    return memberIndex;
                })
            };
        });
        
        members.splice(index, 1);
        displayMembers();
        displayGroups();
        showNotification('Member deleted successfully!', 'success');
    }
}

// Enhanced Group Management
function displayGroups() {
    const groupList = document.getElementById('group-list');
    const userGroupList = document.getElementById('user-groups');
    
    if(groupList){
        groupList.innerHTML = '';
        groups.forEach((group, index) => {
            const listItem = document.createElement('li');
            listItem.className = 'flex justify-between items-center py-3 px-4 bg-gray-50 dark:bg-gray-700 rounded-lg mb-2';
            
            const memberNames = group.memberIndices.map(memberIndex => 
                `<span class="inline-block bg-gray-200 dark:bg-gray-600 rounded-full px-2 py-1 text-xs mr-1">${members[memberIndex].username}</span>`
            ).join('');
            
            listItem.innerHTML = `
                <div>
                    <h4 class="font-medium text-gray-800 dark:text-white">${group.name}</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400">${subjects[group.subjectIndex]}</p>
                    <div class="mt-1 flex flex-wrap">${memberNames}</div>
                </div>
                <div class="space-x-2">
                    <button data-action="edit-group" data-index="${index}" class="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button data-action="delete-group" data-index="${index}" class="text-red-500 hover:text-red-700 dark:hover:text-red-400">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;
            groupList.appendChild(listItem);
        });
    }
    
    if(userGroupList) {
        const selectedSubject = document.getElementById('user-group-subject').value;
        userGroupList.innerHTML = '';
        
        groups.forEach((group) => {
            if (!selectedSubject || group.subjectIndex == selectedSubject) {
                const listItem = document.createElement('li');
                listItem.className = 'p-3 bg-white dark:bg-gray-800 rounded-lg shadow';
                
                const memberNames = group.memberIndices.map(memberIndex => 
                    `<span class="inline-block bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-1 text-xs mr-1">${members[memberIndex].username}</span>`
                ).join('');
                
                listItem.innerHTML = `
                    <h4 class="font-medium text-gray-800 dark:text-white">${group.name}</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400">${subjects[group.subjectIndex]}</p>
                    <div class="mt-2">
                        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">Members:</p>
                        <div class="flex flex-wrap">${memberNames}</div>
                    </div>
                    <button class="mt-3 text-sm text-primary hover:underline">View Group</button>
                `;
                userGroupList.appendChild(listItem);
            }
        });
    }
    
    localStorage.setItem('groups', JSON.stringify(groups));
    updateSubjectSelects();
    updateMemberSelect();
    updateStats();
}

function addGroup() {
    const subjectIndex = document.getElementById('grouping-subject').value;
    const groupName = document.getElementById('group-name').value;
    const memberIndices = Array.from(document.getElementById('grouping-members').selectedOptions).map(option => parseInt(option.value));
    if (subjectIndex && groupName && memberIndices.length > 0) {
        groups.push({ 
            subjectIndex: parseInt(subjectIndex), 
            name: groupName, 
            memberIndices: memberIndices,
            createdAt: new Date().toISOString()
        });
        displayGroups();
        document.getElementById('group-name').value = '';
        showNotification('Group created successfully!', 'success');
    }
}

function editGroup(index) {
    const group = groups[index];
    const newName = prompt('Enter new group name:', group.name);
    if (newName) {
        groups[index].name = newName;
        displayGroups();
        showNotification('Group updated successfully!', 'success');
    }
}

function deleteGroup(index) {
    if (confirm('Are you sure you want to delete this group?')) {
        groups.splice(index, 1);
        displayGroups();
        showNotification('Group deleted successfully!', 'success');
    }
}

// User Functions
function displayUserSubjects() {
    const userSubjectList = document.getElementById('user-subjects');
    if(userSubjectList){
        userSubjectList.innerHTML = '';
        subjects.forEach((subject) => {
            const card = document.createElement('li');
            card.className = 'subject-card p-4 rounded-lg shadow';
            card.innerHTML = `
                <h3 class="font-medium text-lg text-gray-800 dark:text-white">${subject}</h3>
                <p class="text-gray-600 dark:text-gray-300 mt-2">View assignments and resources</p>
                <button class="mt-3 text-primary hover:underline">View Details</button>
            `;
            userSubjectList.appendChild(card);
        });
    }
}

function displayUserAssignments() {
    const userAssignmentSubject = document.getElementById('user-assignment-subject');
    const userAssignments = document.getElementById('user-assignments');
    if(userAssignmentSubject && userAssignments){
        userAssignmentSubject.innerHTML = '<option value="">All Subjects</option>';
        subjects.forEach((subject, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = subject;
            userAssignmentSubject.appendChild(option);
        });

        userAssignmentSubject.addEventListener('change', displayAssignments);
        displayAssignments();
    }
}

function displayUserAnnouncements() {
    const userAnnouncements = document.getElementById('user-announcements');
    if(userAnnouncements){
        userAnnouncements.innerHTML = '';
        announcements.forEach((announcement) => {
            const listItem = document.createElement('li');
            listItem.className = 'p-4 bg-white dark:bg-gray-800 rounded-lg shadow';
            listItem.innerHTML = `
                <div class="flex items-start">
                    <div class="flex-shrink-0 pt-1">
                        <i class="fas fa-bullhorn text-primary"></i>
                    </div>
                    <div class="ml-3">
                        <p class="text-gray-800 dark:text-white">${announcement}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">${new Date().toLocaleDateString()}</p>
                    </div>
                </div>
            `;
            userAnnouncements.appendChild(listItem);
        });
    }
}

function displayUserGroups() {
    const userGroupSubject = document.getElementById('user-group-subject');
    const userGroups = document.getElementById('user-groups');
    if(userGroupSubject && userGroups){
        userGroupSubject.innerHTML = '<option value="">All Subjects</option>';
        subjects.forEach((subject, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = subject;
            userGroupSubject.appendChild(option);
        });

        userGroupSubject.addEventListener('change', displayGroups);
        displayGroups();
    }
}