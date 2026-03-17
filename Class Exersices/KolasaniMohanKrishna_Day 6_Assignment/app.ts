interface Contact {
    id: number;
    name: string;
    email: string;
    phone: string;
}

class ContactManager {
    private contacts: Contact[] = [];
    private storageKey: string = "myContacts";

    constructor() {
        const data = localStorage.getItem(this.storageKey);
        if (data) {
            this.contacts = JSON.parse(data);
        }
    }

    private save(): void {
        localStorage.setItem(this.storageKey, JSON.stringify(this.contacts));
    }

    addContact(contact: Contact): string {
        const exists = this.contacts.find(c => c.id === contact.id);
        if (exists) return "Contact with this ID already exists!";
        this.contacts.push(contact);
        this.save();
        return "Contact added successfully!";
    }

    getContacts(): Contact[] {
        return this.contacts;
    }

    updateContact(id: number, updatedData: Partial<Contact>): string {
        const contact = this.contacts.find(c => c.id === id);
        if (!contact) return "Contact not found!";
        Object.assign(contact, updatedData);
        this.save();
        return "Contact updated successfully!";
    }

    deleteContact(id: number): string {
        const index = this.contacts.findIndex(c => c.id === id);
        if (index === -1) return "Contact not found!";
        this.contacts.splice(index, 1);
        this.save();
        return "Contact deleted successfully!";
    }
}

const manager = new ContactManager();
let editingId: number | null = null;

function showMessage(text: string, type: "success" | "danger"): void {
    const messageDiv = document.getElementById("message") as HTMLDivElement;

    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${text}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;

    messageDiv.appendChild(wrapper.firstElementChild as HTMLElement);
}

function handleSubmit(): void {
    const idInput = document.getElementById("contactId") as HTMLInputElement;
    const nameInput = document.getElementById("contactName") as HTMLInputElement;
    const emailInput = document.getElementById("contactEmail") as HTMLInputElement;
    const phoneInput = document.getElementById("contactPhone") as HTMLInputElement;
    const submitBtn = document.getElementById("submitBtn") as HTMLButtonElement;

    if (editingId === null) {
        const newContact: Contact = {
            id: Number(idInput.value),
            name: nameInput.value,
            email: emailInput.value,
            phone: phoneInput.value
        };

        const result = manager.addContact(newContact);
        showMessage(result, result.includes("exists") ? "danger" : "success");
    } else {
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

function displayContacts(): void {
    const tableBody = document.getElementById("contactTableBody") as HTMLTableSectionElement;
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

function editContact(id: number): void {
    const contact = manager.getContacts().find(c => c.id === id);
    if (!contact) {
        showMessage("Contact not found!", "danger");
        return;
    }

    const idInput = document.getElementById("contactId") as HTMLInputElement;
    const nameInput = document.getElementById("contactName") as HTMLInputElement;
    const emailInput = document.getElementById("contactEmail") as HTMLInputElement;
    const phoneInput = document.getElementById("contactPhone") as HTMLInputElement;
    const submitBtn = document.getElementById("submitBtn") as HTMLButtonElement;

    idInput.value = contact.id.toString();
    nameInput.value = contact.name;
    emailInput.value = contact.email;
    phoneInput.value = contact.phone;

    editingId = id;
    submitBtn.textContent = "Update Contact";
    submitBtn.classList.remove("btn-primary");
    submitBtn.classList.add("btn-success");
}

function removeContact(id: number): void {
    const result = manager.deleteContact(id);
    showMessage(result, result.includes("not found") ? "danger" : "success");
    displayContacts();
}

window.onload = function () {
    displayContacts();
};