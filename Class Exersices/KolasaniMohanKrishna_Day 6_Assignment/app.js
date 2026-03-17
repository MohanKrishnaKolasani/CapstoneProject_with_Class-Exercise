"use strict";
class ContactManager {
    constructor() {
        this.contacts = [];
        this.storageKey = "myContacts";
        const data = localStorage.getItem(this.storageKey);
        if (data) {
            this.contacts = JSON.parse(data);
        }
    }
    save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.contacts));
    }
    addContact(contact) {
        const exists = this.contacts.find(c => c.id === contact.id);
        if (exists)
            return "Contact with this ID already exists!";
        this.contacts.push(contact);
        this.save();
        return "Contact added successfully!";
    }
    getContacts() {
        return this.contacts;
    }
    updateContact(id, updatedData) {
        const contact = this.contacts.find(c => c.id === id);
        if (!contact)
            return "Contact not found!";
        Object.assign(contact, updatedData);
        this.save();
        return "Contact updated successfully!";
    }
    deleteContact(id) {
        const index = this.contacts.findIndex(c => c.id === id);
        if (index === -1)
            return "Contact not found!";
        this.contacts.splice(index, 1);
        this.save();
        return "Contact deleted successfully!";
    }
}
const manager = new ContactManager();
let editingId = null;
function showMessage(text, type) {
    const messageDiv = document.getElementById("message");
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${text}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    messageDiv.appendChild(wrapper.firstElementChild);
}
function handleSubmit() {
    const idInput = document.getElementById("contactId");
    const nameInput = document.getElementById("contactName");
    const emailInput = document.getElementById("contactEmail");
    const phoneInput = document.getElementById("contactPhone");
    const submitBtn = document.getElementById("submitBtn");
    if (editingId === null) {
        const newContact = {
            id: Number(idInput.value),
            name: nameInput.value,
            email: emailInput.value,
            phone: phoneInput.value
        };
        const result = manager.addContact(newContact);
        showMessage(result, result.includes("exists") ? "danger" : "success");
    }
    else {
        const result = manager.updateContact(editingId, {
            name: nameInput.value,
            email: emailInput.value,
            phone: phoneInput.value
        });
        showMessage(result, result.includes("not found") ? "danger" : "success");
        editingId = null;
        submitBtn.textContent = "Add Contact";
        submitBtn.classList.remove("btn-success");
        submitBtn.classList.add("btn-primary");
    }
    displayContacts();
    idInput.value = "";
    nameInput.value = "";
    emailInput.value = "";
    phoneInput.value = "";
}
function displayContacts() {
    const tableBody = document.getElementById("contactTableBody");
    tableBody.innerHTML = "";
    manager.getContacts().forEach(contact => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${contact.id}</td>
            <td>${contact.name}</td>
            <td>${contact.email}</td>
            <td>${contact.phone}</td>
            <td>
                <button class="btn btn-warning btn-sm me-2" onclick="editContact(${contact.id})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="removeContact(${contact.id})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}
function editContact(id) {
    const contact = manager.getContacts().find(c => c.id === id);
    if (!contact) {
        showMessage("Contact not found!", "danger");
        return;
    }
    const idInput = document.getElementById("contactId");
    const nameInput = document.getElementById("contactName");
    const emailInput = document.getElementById("contactEmail");
    const phoneInput = document.getElementById("contactPhone");
    const submitBtn = document.getElementById("submitBtn");
    idInput.value = contact.id.toString();
    nameInput.value = contact.name;
    emailInput.value = contact.email;
    phoneInput.value = contact.phone;
    editingId = id;
    submitBtn.textContent = "Update Contact";
    submitBtn.classList.remove("btn-primary");
    submitBtn.classList.add("btn-success");
}
function removeContact(id) {
    const result = manager.deleteContact(id);
    showMessage(result, result.includes("not found") ? "danger" : "success");
    displayContacts();
}
window.onload = function () {
    displayContacts();
};
//# sourceMappingURL=app.js.map