import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { addNewBook } from "./BookActions";

function Admin() {
    const navigate = useNavigate();

    const initialValues = {
        title: "",
        author: "",
        price: "",
        bio: "",
        top1: "",
        top2: "",
        top3: "",
    };

    const validationSchema = Yup.object({
        title: Yup.string().required("Please enter title"),
        author: Yup.string().required("Please enter author"),
        price: Yup.number().required("Please enter price"),
        bio: Yup.string().required("Please enter bio"),
    });

    const handleSubmit = (values, { resetForm }) => {
        const bookObj = {
            title: values.title,
            author: values.author,
            price: values.price,
            bio: values.bio,
            topBooks: [values.top1, values.top2, values.top3].filter(Boolean),
        };

        fetch("http://localhost:3003/books", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bookObj),
        })
            .then((res) => res.json())
            .then((data) => {
                addNewBook(data);
                resetForm();
                navigate("/home");
            })
            .catch((err) => console.error("Error adding book:", err));
    };

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-sm">
                        <div className="card-body"   id = "top3">
                            <h3>Add New Book</h3>

                            <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                            >
                                <Form>
                                    {["title", "author", "price", "bio"].map((field) => (
                                        <div className="mb-3" key={field}>
                                            <label className="form-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                                            <Field
                                                name={field}
                                                type={field === "price" ? "number" : "text"}
                                                className="form-control"
                                            />
                                            <ErrorMessage name={field} component="div" className="text-danger" />
                                        </div>
                                    ))}

                                    {["top1", "top2", "top3"].map((field, idx) => (
                                        <div className="mb-3" key={field}>
                                            <label className="form-label">Top Book {idx + 1}</label>
                                            <Field name={field} className="form-control" />
                                        </div>
                                    ))}

                                    <button type="submit" className="btn btn-success">
                                        Save Book
                                    </button>
                                </Form>
                            </Formik>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Admin;