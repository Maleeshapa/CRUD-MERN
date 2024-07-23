import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

function View() {
    const { email } = useParams();
    const [student, setStudent] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8081/view/${email}`)
            .then(res => {
                console.log(res);
                setStudent(res.data); // Assuming you're getting a single student object
            })
            .catch(err => console.log(err));
    }, [email]);

    return (
        <div className='d-flex vh-100 bg-primary justify-content-center align-items-center'>
            <div className='w-50 bg-white rounded p-3'>
                <div>
                    <h2>Student Details</h2>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {student ? (
                                <tr>
                                    <td>{student._id}</td>
                                    <td>{student.name}</td>
                                    <td>{student.email}</td>
                                </tr>
                            ) : (
                                <tr>
                                    <td colSpan="3">No data found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Link to='/login' className='btn btn-primary me-2'>Back</Link>
            </div>
        </div>
    );
}

export default View;
