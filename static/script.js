// Section References
const section_login = document.getElementById("login_section");
const section_mainpage = document.getElementById("mainpage_section");
const section_createnote = document.getElementById("createnote_section");
const section_profile = document.getElementById("profile_section");
const section_editnote = document.getElementById("editnote_section")


// Helper Functions
function showSection(sectionToShow) {
    console.log(`Attempting to show section: ${sectionToShow?.id || "unknown"}`);
    const sections = [section_login, section_mainpage, section_createnote, section_profile, section_editnote];
    sections.forEach((section) => {
        if (section) {
            section.style.display = section === sectionToShow ? "block" : "none";
            console.log(`Setting display for ${section.id}: ${section.style.display}`);
        }
    });

    const header = document.getElementById("header_id");
    if (header) {
        header.style.display = sectionToShow !== section_login ? "block" : "none";
    }
}

async function loadNotes() {
    const notesContainer = document.getElementById("notes_container");
    notesContainer.innerHTML = ""; // Clear notes container

    const ownerId = localStorage.getItem("loggedInUserId"); // Get logged-in user's ID
    if (!ownerId) {
        alert("User not logged in. Please log in again.");
        return;
    }

    const response = await fetch(`/api/notes?owner=${ownerId}`); // Fetch notes for the owner

    if (!response.ok) {
        console.error("Failed to fetch notes, status:", response.status);
        notesContainer.innerHTML = "<p>Error fetching notes</p>";
        return;
    }

    const notes = await response.json();
    notes.forEach((note) => {
        const noteElement = document.createElement("div");
        noteElement.classList.add("note");

        const titleSpan = document.createElement("div");
        titleSpan.classList.add("title_note");
        titleSpan.textContent = note.title;

        const contentSpan = document.createElement("div");
        contentSpan.classList.add("content_note");
        contentSpan.textContent = note.text;

        const footer = document.createElement("div");
        footer.classList.add("note-footer");

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.classList.add("edit-button");
        editButton.addEventListener("click", () => {
            showEditNoteSection(note);
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-button");
        deleteButton.addEventListener("click", async () => {
            const confirmDelete = confirm("Are you sure you want to delete this note?");
            if (confirmDelete) {
                const response = await fetch(`/api/notes/${note.id}`, {
                    method: "DELETE",
                });

                if (response.ok) {
                    alert("Note deleted successfully!");
                    await loadNotes();
                } else {
                    alert("Failed to delete note. Please try again.");
                }
            }
        });

        footer.appendChild(deleteButton);
        footer.appendChild(editButton);

        noteElement.appendChild(titleSpan);
        noteElement.appendChild(contentSpan);
        noteElement.appendChild(footer);

        notesContainer.appendChild(noteElement);
    });
}





async function submitLogin() {
    const username = document.getElementById("login_Username").value;
    const password = document.getElementById("login_Password").value;

    const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        console.error("Login failed with status:", response.status);
        console.log(localStorage.getItem("loggedInUserId"));

        alert("Login failed.");
        return;
    }

    const result = await response.json();
    if (result.success) {
        console.log("Login successful.");
        localStorage.setItem("loggedInUserId", result.user.id); // Save owner ID
        showSection(section_mainpage);
        document.body.style.background = "rgba(242, 242, 242, 1)";
        await loadNotes();
    } else {
        alert("Login failed: " + result.message);
    }
}


function setupEventListeners() {
    // Add Note Button
    const addNoteButton = document.getElementById("add_note_button");
    if (addNoteButton) {
        addNoteButton.addEventListener("click", () => showSection(section_createnote));
    }

    // Profile Button
    const profileButton = document.getElementById("profile_button");
    if (profileButton) {
        profileButton.addEventListener("click", () => showSection(section_profile));
    }

    // Main Page Button
    const mainPageButton = document.getElementById("logo_img");
    if (mainPageButton) {
        mainPageButton.addEventListener("click", () => showSection(section_mainpage));
    }

    // Login Button
    const loginButton = document.getElementById("login_button");
    if (loginButton) {
        loginButton.addEventListener("click", submitLogin);
    }

    // Expand Search Bar
    const searchBar = document.getElementById("search_bar");
    if (searchBar) {
        searchBar.addEventListener("click", expandSearchBar)
    }

    // Save Changes Button
    const saveEditButton = document.getElementById("save_edit_button");
    if (saveEditButton) {
        saveEditButton.addEventListener("click", () => {
            // Save logic here
        });
    }

    // Cancel Button for Edit Section
    const cancelEditButton = document.getElementById("button_exit");
    if (cancelEditButton) {
        cancelEditButton.addEventListener("click", () => {
            showSection(section_mainpage); // Return to the main page
        });
    }

    const editButton = document.getElementById("")


    // Save Note Button
    const saveNoteButton = document.querySelector(".button_save")
    const editor = document.getElementById("editor");
    const noteTitle = document.querySelector(".block_createnote h1")
    if (saveNoteButton) {
        saveNoteButton.addEventListener("click", async () => {
            const title = noteTitle.textContent.trim();
            const content = editor.value.trim();
            const ownerId = localStorage.getItem("loggedInUserId"); // Get owner ID from localStorage

            if (!ownerId) {
                alert("User not logged in. Please log in again.");
                return;
            }

            if (!title || !content) {
                alert("Both title and content are required!");
                return;
            }

            const response = await fetch("/api/notes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    owner: ownerId,
                    text: content,
                    title: title,
                }),
            });

            if (response.ok) {
                alert("Note saved successfully!");
                showSection(section_mainpage);
                await loadNotes();
            } else {
                alert("Failed to save note. Please try again.");
            }
        });
    }

    const editorElement = document.querySelector("#editor");
    const preview = document.querySelector(".preview");
    if (editorElement && preview) {
        editorElement.addEventListener("input", e => {
            preview.innerHTML = DOMPurify.sanitize(marked.parse(e.target.value));
        })
    }
}

function expandSearchBar() {
    const searchBar = document.getElementById("search_bar");
    searchBar.style.width = "60%";

    document.addEventListener("click", function handleClickOutside(event) {
        if (!searchBar.contains(event.target)) {
            searchBar.style.width = "30%";
            document.removeEventListener("click", handleClickOutside)
        }
    })
}
function showEditNoteSection(note) {
    const editNoteSection = document.getElementById("editnote_section");
    const editNoteTitle = document.getElementById("edit_note_title");
    const editNoteContent = document.getElementById("edit_note_content");

    if (!editNoteSection || !editNoteTitle || !editNoteContent) {
        console.error("Edit note section or elements not found!");
        return;
    }

    editNoteTitle.textContent = note.title || "Untitled";
    editNoteContent.value = note.text || "";

    editNoteSection.style.display = "block";

    const saveEditButton = document.getElementById("save_edit_button");
    saveEditButton.onclick = async () => {
        const updatedTitle = editNoteTitle.textContent.trim();
        const updatedContent = editNoteContent.value.trim();

        if (!updatedTitle || !updatedContent) {
            alert("Both title and content are required!");
            return;
        }

        const response = await fetch(`/api/notes/${note.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: updatedTitle,
                text: updatedContent,
            }),
        });

        if (response.ok) {
            alert("Note updated successfully!");
            editNoteSection.style.display = "none";
            await loadNotes();
        } else {
            alert("Failed to update note. Please try again.");
        }
    };

    const cancelEditButton = document.getElementById("cancel_edit_button");
    cancelEditButton.onclick = () => {
        editNoteSection.style.display = "none";
    };
}





document.addEventListener("DOMContentLoaded", () => {
    loadNotes()
    setupEventListeners()
});
