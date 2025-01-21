import React from 'react'
import "./course.css"
import { CourseData } from '../../context/CourseContext';
import CourseCard from '../../components/courseCard/CourseCard';

const Course = () => {

    const { courses } = CourseData();
    console.log(courses);
    return (
        <div>
            <div className="courses">
                <h2> Available Courses </h2>
                <div className="course-container">

                    {
                        courses && courses.length > 0 ? courses.map((e) => (
                            <CourseCard key={e._id} course={e} />
                        )) : (<p>No Courses yet</p>
                        )}
                </div>
            </div>
        </div>
    );


}

export default Course