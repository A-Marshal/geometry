package main

import (
	"database/sql"
	"errors"
	"log"
	"time"
)

type commentsPerDay struct {
	Num       int64  `json:"num,string"`
	CreatedAt string `json:"createdAt"`
}

func validateDate(fromDate string, toDate string) error {
	//Constant unix date value that time.Parse uses as reference, do not change
	const layout = "2006-01-02 15:04:05"

	if fromDate == "" {
		fromDate = "2000-01-01 00:00:01"
	}

	from, errorFromDate := time.Parse(layout, fromDate)
	to, errorToDate := time.Parse(layout, toDate)

	if errorFromDate != nil {
		log.Println("Error validating fromDate: ", errorFromDate)
		return errorFromDate
	}

	if errorToDate != nil {
		log.Println("Error validating toDate: ", errorToDate)
		return errorToDate
	}

	duration := to.Sub(from)
	if duration.Hours() < 0 {
		log.Println("Error: date values reversed, fromDate is after toDate in time")
		return errors.New("Error: date values reversed, fromDate is after toDate in time")
	}

	log.Println("Date values in GET are valid")
	return nil
}

func validateTime(fromHour string, toHour string) error {
	//Constant unix time value that time.Parse uses as reference, do not change
	//Hour = 03 means 00-12 AM/PM format
	//Hour = 15 means 00-24 format
	const layout = "15:04:05"

	if fromHour == "" {
		fromHour = "00:00:01"
	}

	from, errorFromHour := time.Parse(layout, fromHour)
	to, errorToHour := time.Parse(layout, toHour)

	if errorFromHour != nil {
		log.Println("Error validating fromHour: ", errorFromHour)
		return errorFromHour
	}

	if errorToHour != nil {
		log.Println("Error validating toHour: ", errorToHour)
		return errorToHour
	}

	duration := to.Sub(from)
	if duration.Hours() < 0 {
		log.Println("Error: time values reversed, fromHour is after toHour in time")
		return errors.New("Error: time values reversed, fromHour is after toHour in time")
	}

	log.Println("Time values in GET are valid")
	return nil
}

func getCommentCountMonth(fromDate string, toDate string, db *sql.DB) ([]commentsPerDay, error) {
	comments := []commentsPerDay{}

	rows, err := db.Query("SELECT MONTHNAME(DATE(createdAt)) AS month_name, COUNT(createdAt) AS num FROM comments WHERE createdAt BETWEEN ? AND ? GROUP BY  month_name ORDER BY MONTH(DATE(createdAt)) ASC", fromDate, toDate)

	defer rows.Close()

	if err != nil {
		log.Printf("Error counting comments %s\n", err.Error())
		return nil, err
	}

	for rows.Next() {
		var c commentsPerDay
		log.Println(c)
		if err := rows.Scan(&c.CreatedAt, &c.Num); err != nil {
			log.Printf("Error getting comment %s\n", err.Error())
			return nil, err
		}
		comments = append(comments, c)
	}

	log.Println("##### Comments per month fetched #####", comments)
	return comments, nil
}

func getCommentCountDate(fromDate string, toDate string, db *sql.DB) ([]commentsPerDay, error) {
	comments := []commentsPerDay{}

	rows, err := db.Query("SELECT CONCAT(DATE(createdAt)) AS createdAt, count(*) AS num FROM comments WHERE createdAt>=? AND createdAt<=? GROUP BY DATE(createdAt)", fromDate, toDate)

	defer rows.Close()

	if err != nil {
		log.Printf("Error counting comments %s\n", err.Error())
		return nil, err
	}

	for rows.Next() {
		var c commentsPerDay
		log.Println(c)
		if err := rows.Scan(&c.CreatedAt, &c.Num); err != nil {
			log.Printf("Error getting comment %s\n", err.Error())
			return nil, err
		}
		comments = append(comments, c)
	}

	log.Println("##### Comments per date fetched #####", comments)
	return comments, nil
}

func getCommentCountHour(fromDate string, toDate string, db *sql.DB) ([]commentsPerDay, error) {
	comments := []commentsPerDay{}

	rows, err := db.Query("SELECT CONCAT(HOUR(createdAt), ':00-', HOUR(createdAt)+1, ':00') AS createdAt, COUNT(*) AS num FROM comments WHERE createdAt BETWEEN ? AND ? GROUP BY HOUR(createdAt)", fromDate, toDate)

	defer rows.Close()

	if err != nil {
		log.Printf("Error counting comments %s\n", err.Error())
		return nil, err
	}

	for rows.Next() {
		var c commentsPerDay
		log.Println(c)
		if err := rows.Scan(&c.CreatedAt, &c.Num); err != nil {
			log.Printf("Error getting comment %s\n", err.Error())
			return nil, err
		}
		comments = append(comments, c)
	}

	log.Println("##### Comments per hour fetched #####", comments)
	return comments, nil
}

func getCommentCountDayBtwHours(fromDate string, toDate string, fromHour string, toHour string, db *sql.DB) ([]commentsPerDay, error) {
	comments := []commentsPerDay{}

	rows, err := db.Query("SELECT CONCAT(DATE(createdAt)) AS createdAt, COUNT(*) AS num FROM comments WHERE createdAt BETWEEN ? AND ? AND TIME(createdAt) BETWEEN ? AND ? GROUP BY DATE(createdAt)", fromDate, toDate, fromHour, toHour)

	defer rows.Close()

	if err != nil {
		log.Printf("Error counting comments %s\n", err.Error())
		return nil, err
	}

	for rows.Next() {
		var c commentsPerDay
		log.Println(c)
		if err := rows.Scan(&c.CreatedAt, &c.Num); err != nil {
			log.Printf("Error getting comment %s\n", err.Error())
			return nil, err
		}
		comments = append(comments, c)
	}

	log.Println("##### Comments per day between hours fetched #####", comments)
	return comments, nil
}

func getCommentCountDay(fromDate string, toDate string, db *sql.DB) ([]commentsPerDay, error) {
	comments := []commentsPerDay{}

	rows, err := db.Query("SELECT DAYNAME(DATE(createdAt)) AS day_name, COUNT(*) AS num FROM comments WHERE createdAt BETWEEN ? AND ? GROUP BY day_name ORDER BY DAYOFWEEK(DATE(createdAt)) ASC", fromDate, toDate)

	defer rows.Close()

	if err != nil {
		log.Printf("Error counting comments %s\n", err.Error())
		return nil, err
	}

	for rows.Next() {
		var c commentsPerDay
		log.Println(c)
		if err := rows.Scan(&c.CreatedAt, &c.Num); err != nil {
			log.Printf("Error getting comment %s\n", err.Error())
			return nil, err
		}
		comments = append(comments, c)
	}

	log.Println("##### Comments per day fetched #####", comments)
	return comments, nil
}

func getTotalComments(fromDate string, toDate string, db *sql.DB) ([]commentsPerDay, error) {
	total := []commentsPerDay{}

	rows, err := db.Query("SELECT count(id) AS num FROM comments WHERE createdAt BETWEEN ? AND ? AND deletedAt IS NULL", fromDate, toDate)

	defer rows.Close()

	if err != nil {
		log.Printf("Error counting total comments %s\n", err.Error())
		return nil, err
	}

	for rows.Next() {
		var t commentsPerDay
		log.Println(t)
		if err := rows.Scan(&t.Num); err != nil {
			log.Printf("Error getting total # of comments %s\n", err.Error())
			return nil, err
		}
		total = append(total, t)
	}

	log.Println("##### Total # of comments fetched #####", total)
	return total, nil
}

func getDeletedCommentCountMonth(fromDate string, toDate string, db *sql.DB) ([]commentsPerDay, error) {
	comments := []commentsPerDay{}

	rows, err := db.Query("SELECT MONTHNAME(DATE(deletedAt)) AS month_name, COUNT(deletedAt) AS num FROM comments WHERE deletedAt BETWEEN ? AND ? GROUP BY  month_name ORDER BY MONTH(DATE(deletedAt)) ASC", fromDate, toDate)

	defer rows.Close()

	if err != nil {
		log.Printf("Error counting deleted comments %s\n", err.Error())
		return nil, err
	}

	for rows.Next() {
		var c commentsPerDay
		log.Println(c)
		if err := rows.Scan(&c.CreatedAt, &c.Num); err != nil {
			log.Printf("Error getting deleted comment %s\n", err.Error())
			return nil, err
		}
		comments = append(comments, c)
	}

	log.Println("##### Deleted comments per month fetched #####", comments)
	return comments, nil
}

func getDeletedCommentCountDate(fromDate string, toDate string, db *sql.DB) ([]commentsPerDay, error) {
	comments := []commentsPerDay{}

	rows, err := db.Query("SELECT CONCAT(DATE(deletedAt)) AS deletedAt, count(*) AS num FROM comments WHERE deletedAt BETWEEN ? AND ? GROUP BY DATE(deletedAt)", fromDate, toDate)

	defer rows.Close()

	if err != nil {
		log.Printf("Error counting deleted comments %s\n", err.Error())
		return nil, err
	}

	for rows.Next() {
		var c commentsPerDay
		log.Println(c)
		if err := rows.Scan(&c.CreatedAt, &c.Num); err != nil {
			log.Printf("Error getting deleted comment %s\n", err.Error())
			return nil, err
		}
		comments = append(comments, c)
	}

	log.Println("##### Deleted comments per date fetched #####", comments)
	return comments, nil
}

func getDeletedCommentCountHour(fromDate string, toDate string, db *sql.DB) ([]commentsPerDay, error) {
	comments := []commentsPerDay{}

	rows, err := db.Query("SELECT CONCAT(HOUR(deletedAt), ':00-', HOUR(deletedAt)+1, ':00') AS deletedAt, COUNT(*) AS num FROM comments WHERE deletedAt BETWEEN ? AND ? GROUP BY HOUR(deletedAt)", fromDate, toDate)

	defer rows.Close()

	if err != nil {
		log.Printf("Error counting deleted comments %s\n", err.Error())
		return nil, err
	}

	for rows.Next() {
		var c commentsPerDay
		log.Println(c)
		if err := rows.Scan(&c.CreatedAt, &c.Num); err != nil {
			log.Printf("Error getting deleted comments %s\n", err.Error())
			return nil, err
		}
		comments = append(comments, c)
	}

	log.Println("##### Deleted comments per hour fetched #####", comments)
	return comments, nil
}

func getDeletedCommentCountDay(fromDate string, toDate string, db *sql.DB) ([]commentsPerDay, error) {
	comments := []commentsPerDay{}

	rows, err := db.Query("SELECT DAYNAME(DATE(deletedAt)) AS day_name, COUNT(*) AS num FROM comments WHERE deletedAt BETWEEN ? AND ? GROUP BY day_name ORDER BY DAYOFWEEK(DATE(deletedAt)) ASC", fromDate, toDate)

	defer rows.Close()

	if err != nil {
		log.Printf("Error counting deleted comments %s\n", err.Error())
		return nil, err
	}

	for rows.Next() {
		var c commentsPerDay
		log.Println(c)
		if err := rows.Scan(&c.CreatedAt, &c.Num); err != nil {
			log.Printf("Error getting deleted comments %s\n", err.Error())
			return nil, err
		}
		comments = append(comments, c)
	}

	log.Println("##### Deleted comments per day fetched #####", comments)
	return comments, nil
}

func getDeletedCommentCountDayBtwHours(fromDate string, toDate string, fromHour string, toHour string, db *sql.DB) ([]commentsPerDay, error) {
	comments := []commentsPerDay{}

	rows, err := db.Query("SELECT CONCAT(DATE(deletedAt)) AS deletedAt, count(*) AS num FROM comments WHERE deletedAt BETWEEN ? AND ? AND TIME(deletedAt) BETWEEN ? and ? GROUP BY DATE(deletedAt)", fromDate, toDate, fromHour, toHour)

	defer rows.Close()

	if err != nil {
		log.Printf("Error counting deleted comments %s\n", err.Error())
		return nil, err
	}

	for rows.Next() {
		var c commentsPerDay
		log.Println(c)
		if err := rows.Scan(&c.CreatedAt, &c.Num); err != nil {
			log.Printf("Error getting deleted comment %s\n", err.Error())
			return nil, err
		}
		comments = append(comments, c)
	}

	log.Println("##### Deleted comments per day between hours fetched #####", comments)
	return comments, nil
}

func getTotalDeletedComments(fromDate string, toDate string, db *sql.DB) ([]commentsPerDay, error) {
	total := []commentsPerDay{}

	rows, err := db.Query("SELECT count(id) AS num FROM comments WHERE deletedAt BETWEEN ? AND ?", fromDate, toDate)

	defer rows.Close()

	if err != nil {
		log.Printf("Error counting total deleted comments %s\n", err.Error())
		return nil, err
	}

	for rows.Next() {
		var t commentsPerDay
		log.Println(t)
		if err := rows.Scan(&t.Num); err != nil {
			log.Printf("Error getting total # of deleted comments %s\n", err.Error())
			return nil, err
		}
		total = append(total, t)
	}

	log.Println("##### Total # of deleted comments fetched #####", total)
	return total, nil
}

func getCreatedUsersMonth(fromDate string, toDate string, db *sql.DB) ([]commentsPerDay, error) {
	createdUsers := []commentsPerDay{}

	rows, err := db.Query("SELECT MONTHNAME(DATE(createdAt)) AS month_name, count(DISTINCT users.id) AS users FROM users WHERE createdAt BETWEEN ? AND ? AND DATE(deletedAt) IS NULL GROUP BY month_name ORDER BY MONTH(Date(createdAt)) ASC", fromDate, toDate)

	defer rows.Close()

	if err != nil {
		log.Printf("Error counting created users per %s\n", err.Error())
		return nil, err
	}

	for rows.Next() {
		var c commentsPerDay
		log.Println(c)
		if err := rows.Scan(&c.CreatedAt, &c.Num); err != nil {
			log.Printf("Error getting created users per day %s\n", err.Error())
			return nil, err
		}
		createdUsers = append(createdUsers, c)
	}

	log.Println("##### Created users per month fetched #####", createdUsers)
	return createdUsers, nil
}

func getCreatedUsersDate(fromDate string, toDate string, db *sql.DB) ([]commentsPerDay, error) {
	createdUsers := []commentsPerDay{}

	rows, err := db.Query("SELECT CONCAT(DATE(createdAt)) AS date_name, count(DISTINCT users.id) AS users FROM users WHERE createdAt BETWEEN ? AND ? AND DATE(deletedAt) IS NULL GROUP BY DATE(date_name)", fromDate, toDate)

	defer rows.Close()

	if err != nil {
		log.Printf("Error counting created users per date %s\n", err.Error())
		return nil, err
	}

	for rows.Next() {
		var c commentsPerDay
		log.Println(c)
		if err := rows.Scan(&c.CreatedAt, &c.Num); err != nil {
			log.Printf("Error getting created users per date %s\n", err.Error())
			return nil, err
		}
		createdUsers = append(createdUsers, c)
	}

	log.Println("##### Created users per date fetched #####", createdUsers)
	return createdUsers, nil
}

func getCreatedUsersHour(fromDate string, toDate string, db *sql.DB) ([]commentsPerDay, error) {
	createdUsers := []commentsPerDay{}

	rows, err := db.Query("SELECT CONCAT(HOUR(createdAt), ':00-', HOUR(createdAt)+1, ':00') AS createdAt, count(DISTINCT users.id) AS users FROM users WHERE createdAt BETWEEN ? AND ? AND DATE(deletedAt) IS NULL GROUP BY Hour(createdAt)", fromDate, toDate)

	defer rows.Close()

	if err != nil {
		log.Printf("Error counting created users per %s\n", err.Error())
		return nil, err
	}

	for rows.Next() {
		var c commentsPerDay
		log.Println(c)
		if err := rows.Scan(&c.CreatedAt, &c.Num); err != nil {
			log.Printf("Error getting created users per hour %s\n", err.Error())
			return nil, err
		}

		createdUsers = append(createdUsers, c)
	}
	log.Println("##### Created users per day fetched #####", createdUsers)
	return createdUsers, nil
}

func getCreatedUsersDay(fromDate string, toDate string, db *sql.DB) ([]commentsPerDay, error) {
	createdUsers := []commentsPerDay{}

	rows, err := db.Query("SELECT DAYNAME(DATE(createdAt)) AS day_name, count(DISTINCT users.id) AS users FROM users WHERE createdAt BETWEEN ? AND ? AND DATE(deletedAt) IS NULL GROUP BY day_name ORDER BY DAYOFWEEK(DATE(createdAT)) ASC", fromDate, toDate)

	defer rows.Close()

	if err != nil {
		log.Printf("Error counting created users per day %s\n", err.Error())
		return nil, err
	}

	for rows.Next() {
		var c commentsPerDay
		log.Println(c)
		if err := rows.Scan(&c.CreatedAt, &c.Num); err != nil {
			log.Printf("Error getting created users per day %s\n", err.Error())
			return nil, err
		}
		createdUsers = append(createdUsers, c)
	}
	log.Println("##### Created users per day fetched #####", createdUsers)
	return createdUsers, nil
}

func getTotalUsers(fromDate string, toDate string, db *sql.DB) ([]commentsPerDay, error) {
	total := []commentsPerDay{}

	rows, err := db.Query("SELECT count(id) AS num FROM users WHERE users.createdAt BETWEEN ? AND ? AND deletedAt IS NULL", fromDate, toDate)

	defer rows.Close()

	if err != nil {
		log.Printf("Error counting users %s\n", err.Error())
		return nil, err
	}

	for rows.Next() {
		var t commentsPerDay
		log.Println(t)
		if err := rows.Scan(&t.Num); err != nil {
			log.Printf("Error getting total # of users %s\n", err.Error())
			return nil, err
		}
		total = append(total, t)
	}

	log.Println("##### Total # of users fetched #####", total)
	return total, nil
}

func getCommentedArticles(fromDate string, toDate string, db *sql.DB) ([]commentsPerDay, error) {
	total := []commentsPerDay{}

	rows, err := db.Query("SELECT count(DISTINCT articleId) AS articles FROM comments WHERE comments.createdAt >? AND comments.createdAt <? AND deletedAt IS NULL", fromDate, toDate)

	defer rows.Close()

	if err != nil {
		log.Printf("Error counting articles %s\n", err.Error())
		return nil, err
	}

	for rows.Next() {
		var t commentsPerDay
		log.Println(t)
		if err := rows.Scan(&t.Num); err != nil {
			log.Printf("Error getting total # of articles %s\n", err.Error())
			return nil, err
		}
		total = append(total, t)
	}

	log.Println("##### Total # of articles fetched #####", total)
	return total, nil
}

func getCustomers(db *sql.DB) ([]commentsPerDay, error) {
	customers := []commentsPerDay{}

	rows, err := db.Query("SELECT DISTINCT id, name FROM customers;")

	defer rows.Close()

	if err != nil {
		log.Printf("Error counting IDs %s\n", err.Error())
		return nil, err
	}

	for rows.Next() {
		var c commentsPerDay
		log.Println(c)
		if err := rows.Scan(&c.Num, &c.CreatedAt); err != nil {
			log.Printf("Error getting IDs %s\n", err.Error())
			return nil, err
		}
		customers = append(customers, c)
	}

	log.Println("##### Customer IDs fetched #####", customers)
	return customers, nil
}
