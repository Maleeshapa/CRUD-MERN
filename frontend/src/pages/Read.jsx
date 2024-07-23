import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

function Read() {
  const { id } = useParams();
  const [student, setStudent] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:8081/read/${id}`)
      .then(res => {
        console.log(res);
        setStudent(res.data); // Assuming res.data is the student object
      })
      .catch(err => console.error('Error fetching student:', err));
  }, []);

  return (
    <div className='d-flex vh-100 bg-primary justify-content-center align-items-center'>
      <div className='w-50 bg-white rounded p-3'>
        <div>
          <h2>Details</h2>
          <h2>ID: {student._id}</h2>
          <h2>Name: {student.name}</h2>
          <h2>Email: {student.email}</h2>
        </div>

        <Link to='/' className='btn btn-primary me-2'>Back</Link>
        <Link to={`/edit/${student._id}`} className='btn btn-info'>Edit</Link>
      </div>
    </div>
  );
}

export default Read;
