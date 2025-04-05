const mysql = require('mysql2/promise');
const dbConfig = require('../config/dbConfig');

const pool = mysql.createPool({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

class Course {
    constructor() {
        this.pool = pool;
    }

    async getAllCourses() {
        const [rows] = await this.pool.query(
            `SELECT c.*, i.name as instructor_name, cat.name as category_name 
             FROM courses c 
             LEFT JOIN users i ON c.instructor_id = i.id 
             LEFT JOIN categories cat ON c.category_id = cat.id 
             ORDER BY c.created_at DESC`
        );
        return rows;
    }

    async getCourseById(id) {
        const [rows] = await this.pool.query(
            `SELECT c.*, i.name as instructor_name, cat.name as category_name 
             FROM courses c 
             LEFT JOIN users i ON c.instructor_id = i.id 
             LEFT JOIN categories cat ON c.category_id = cat.id 
             WHERE c.id = ?`,
            [id]
        );
        return rows[0];
    }

    async createCourse(courseData) {
        const [result] = await this.pool.query(
            `INSERT INTO courses 
             (title, description, duration, startDate, price, maxStudents, 
              language, level, objectives, learningOutcomes, category_id, instructor_id) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                courseData.title,
                courseData.description,
                courseData.duration,
                courseData.startDate,
                courseData.price,
                courseData.maxStudents,
                courseData.language,
                courseData.level,
                courseData.objectives,
                courseData.learningOutcomes,
                courseData.category_id,
                courseData.instructor_id
            ]
        );
        return result.insertId;
    }

    async updateCourse(id, courseData) {
        const [result] = await this.pool.query(
            `UPDATE courses SET 
             title = ?, description = ?, duration = ?, startDate = ?, price = ?, 
             maxStudents = ?, language = ?, level = ?, objectives = ?, 
             learningOutcomes = ?, category_id = ? 
             WHERE id = ?`,
            [
                courseData.title,
                courseData.description,
                courseData.duration,
                courseData.startDate,
                courseData.price,
                courseData.maxStudents,
                courseData.language,
                courseData.level,
                courseData.objectives,
                courseData.learningOutcomes,
                courseData.category_id,
                id
            ]
        );
        return result.affectedRows > 0;
    }

    async purchaseCourse(userId, courseId, purchaseData) {
        // First check if course exists and has available seats
        const [course] = await this.pool.query(
            `SELECT * FROM courses WHERE id = ? AND enrolledStudents < maxStudents`,
            [courseId]
        );

        if (!course[0]) {
            throw new Error('Course not found or fully booked');
        }

        // Create purchase record
        const [purchaseResult] = await this.pool.query(
            `INSERT INTO course_purchases 
             (course_id, user_id, full_name, email, phone, address, 
              payment_method, amount, comments) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                courseId,
                userId,
                purchaseData.fullName,
                purchaseData.email,
                purchaseData.phone,
                purchaseData.address,
                purchaseData.paymentMethod,
                course[0].price,
                purchaseData.comments
            ]
        );

        // Update course enrollment
        const [updateResult] = await this.pool.query(
            `UPDATE courses SET enrolledStudents = enrolledStudents + 1 WHERE id = ?`,
            [courseId]
        );

        return purchaseResult.insertId;
    }
}

module.exports = new Course();
