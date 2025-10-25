import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const AdminPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({
    id: '',
    title: '',
    category: '',
    level: '',
    rating: 4.5,
    students: '0 students',
    lessons: '0 lessons',
    price: '₹0',
    image: '',
    categoryColor: 'bg-blue-100 text-blue-600',
  });

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...newCourse, id: parseInt(newCourse.id), rating: parseFloat(newCourse.rating) }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add course');
      }

      await fetchCourses(); // Refresh list
      setNewCourse({ id: '', title: '', category: '', level: '', rating: 4.5, students: '0 students', lessons: '0 lessons', price: '₹0', image: '', categoryColor: 'bg-blue-100 text-blue-600' });
      alert('Course added successfully!');
    } catch (error) {
      console.error('Error adding course:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete course');
      }
      await fetchCourses(); // Refresh list
      alert('Course deleted successfully!');
    } catch (error) {
      console.error('Error deleting course:', error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        activePage="admin"
      />
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-80'}`}>
        <main className="flex-1 mt-16 overflow-x-hidden overflow-y-auto bg-gray-50 p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel - Course Management</h1>

            {/* Add Course Form */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Add New Course</h2>
              <form onSubmit={handleAddCourse} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <input type="number" name="id" value={newCourse.id} onChange={handleInputChange} placeholder="Course ID (e.g., 4)" required className="p-2 border rounded" />
                <input type="text" name="title" value={newCourse.title} onChange={handleInputChange} placeholder="Title" required className="p-2 border rounded" />
                <input type="text" name="category" value={newCourse.category} onChange={handleInputChange} placeholder="Category" required className="p-2 border rounded" />
                <input type="text" name="level" value={newCourse.level} onChange={handleInputChange} placeholder="Level" required className="p-2 border rounded" />
                <input type="number" step="0.1" name="rating" value={newCourse.rating} onChange={handleInputChange} placeholder="Rating" required className="p-2 border rounded" />
                <input type="text" name="students" value={newCourse.students} onChange={handleInputChange} placeholder="Students (e.g., 1.2k students)" required className="p-2 border rounded" />
                <input type="text" name="lessons" value={newCourse.lessons} onChange={handleInputChange} placeholder="Lessons (e.g., 15 lessons)" required className="p-2 border rounded" />
                <input type="text" name="price" value={newCourse.price} onChange={handleInputChange} placeholder="Price (e.g., ₹999)" required className="p-2 border rounded" />
                <input type="text" name="image" value={newCourse.image} onChange={handleInputChange} placeholder="Image URL" required className="p-2 border rounded col-span-1 md:col-span-2" />
                <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 col-span-1 md:col-span-3">Add Course</button>
              </form>
            </div>

            {/* Course List */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Existing Courses</h2>
              <div className="space-y-4">
                {courses.map((course) => (
                  <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-bold">{course.title} (ID: {course.id})</h3>
                      <p className="text-sm text-gray-600">{course.category}</p>
                    </div>
                    <button onClick={() => handleDeleteCourse(course.id)} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
