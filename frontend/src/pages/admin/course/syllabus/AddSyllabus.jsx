import React, { useState, useEffect } from 'react'
import axios from 'axios'

const AddSyllabus = () => {
  const [formData, setFormData] = useState({
    course: '',
    session_index: '',
    topic: '',
    description: ''
  })
  const [courses, setCourses] = useState([])

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('http://localhost:8000/courses/list/')
        console.log("dattaa: ",res)
        setCourses(res.data)
      } catch (error) {
        console.error('Error fetching courses:', error)
      }
    }
    fetchCourses()
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('adminAccess')
      console.log("token isss : ",token)
      const res = await axios.post('http://localhost:8000/courses/add/syllabus/', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      alert('Syllabus added successfully!')
      console.log(res.data)
    } catch (err) {
      console.error('Error:', err.response?.data || err.message)
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Add Syllabus</h2>
      <form onSubmit={handleSubmit}>
      <select
        name="course"
        value={formData.course}
        onChange={handleChange}
        required
        className="w-full p-2 border mb-2 bg-gray-800"
        >
        <option value="">Select Course</option>
        {courses.map(course => (
            <option key={course.id} value={course.id}>{course.title}</option>
        ))}
        </select>

        <input
          type="number"
          name="session_index"
          placeholder="Session Index"
          value={formData.session_index}
          onChange={handleChange}
          required
          className="w-full p-2 border mb-2"
        />

        <input
          type="text"
          name="topic"
          placeholder="Topic"
          value={formData.topic}
          onChange={handleChange}
          required
          className="w-full p-2 border mb-2"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full p-2 border mb-2"
        ></textarea>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Syllabus
        </button>
      </form>
    </div>
  )
}

export default AddSyllabus