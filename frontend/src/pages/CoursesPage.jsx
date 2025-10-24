import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import { Star, Bookmark } from 'lucide-react'

const CoursesPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState('my-courses')
  const [coursesData, setCoursesData] = useState(null)

  useEffect(() => {
    const fetchCoursesData = async () => {
      try {
        const response = await fetch('/data/courses.json')
        const data = await response.json()
        setCoursesData(data)
      } catch (error) {
        console.error('Error fetching courses data:', error)
      }
    }
    fetchCoursesData()
  }, [])

  if (!coursesData) {
    return <div>Loading...</div>
  }

  const { statsCards, courseCards, popularCourses } = coursesData

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        activePage="courses"
      />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-80'
      }`}>
        {/* Courses Content */}
        <main className="flex-1 mt-16 overflow-x-hidden overflow-y-auto bg-gray-50 p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Learning Hub Header */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">Learning Hub</h1>
              <p className="text-gray-600">Discover and continue your AI learning journey</p>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-2 inline-flex">
              <button
                onClick={() => setActiveTab('my-courses')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === 'my-courses'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                My Courses
              </button>
              <button
                onClick={() => setActiveTab('explore-courses')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === 'explore-courses'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Explore Courses
              </button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {statsCards.map((card, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">{card.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                    </div>
                    <div className={`p-3 rounded-xl ${card.iconBg}`}>
                      <img src={card.icon} alt={card.label} className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Content based on active tab */}
            {activeTab === 'my-courses' ? (
              /* My Courses Content */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courseCards.map((course) => (
                  <div key={course.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    {/* Course Header with Background */}
                    <Link to={`/course-preview/${course.id}`}>
                      <div className={`relative h-48 bg-gradient-to-br ${course.backgroundGradient} p-4 flex flex-col justify-between`}>
                        {course.backgroundImage && (
                          <img
                            src={course.backgroundImage}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        )}
                          <div className="relative z-10">
                            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full">
                              {course.status}
                            </span>
                          </div>
                          <div className="relative z-10 space-y-3">
                            <h3 className="text-xl font-semibold text-white">{course.title}</h3>
                            <div className="space-y-2">
                              <div className="w-full bg-white/20 rounded-full h-2">
                                <div
                                  className="h-2 bg-white rounded-full transition-all duration-300"
                                  style={{ width: `${course.progress}%` }}
                                />
                              </div>
                              <p className="text-white/80 text-sm">{course.progress}% Complete</p>
                            </div>
                          </div>
                        </div>
                    </Link>

                      {/* Course Details */}
                      <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{course.lessons}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${course.levelColor}`}>
                            {course.level}
                          </span>
                        </div>
                                              <Link to={`/learning/${course.id}`}>
                                                <button className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 ${course.buttonStyle} hover:shadow-lg`}>
                                                  {course.buttonText}
                                                </button>
                                              </Link>
                      </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Explore Courses Content */
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800">Popular Courses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {popularCourses.map((course) => (
                    <Link to={`/course-preview/${course.id}`} key={course.id}>
                      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200">
                        {/* Course Image */}
                        <div className="relative">
                          <img
                            src={course.image}
                            alt={course.title}
                            className="w-full h-40 object-cover"
                          />
                          {/* Rating Badge */}
                          <div className="absolute bottom-3 right-3 bg-white rounded-full px-2 py-1 flex items-center space-x-1 shadow-sm">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-medium text-gray-700">{course.rating}</span>
                          </div>
                          {/* Student count */}
                          <div className="absolute top-3 right-3 text-xs text-gray-500">
                            {course.students}
                          </div>
                        </div>

                        {/* Course Details */}
                        <div className="p-4 space-y-3">
                          {/* Category Badge */}
                          <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${course.categoryColor}`}>
                            {course.category}
                          </div>

                          {/* Course Title */}
                          <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">{course.title}</h3>

                          {/* Course Info */}
                          <p className="text-sm text-gray-600">{course.lessons} • {course.level}</p>

                          {/* Price and Bookmark */}
                          <div className="flex items-center justify-between pt-2">
                            <span className="text-lg font-bold text-gray-900">{course.price}</span>
                            <div className={`p-2 rounded-full ${course.isBookmarked ? 'bg-teal-500' : 'bg-white border border-gray-200'}`}>
                              <Bookmark className={`w-4 h-4 ${course.isBookmarked ? 'text-white fill-white' : 'text-teal-600'}`} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default CoursesPage
