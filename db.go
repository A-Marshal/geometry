package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/go-sql-driver/mysql" // MySQL
	"github.com/joho/godotenv"
)

var (
	//DBDriver is
	DBDriver string
	//DBHost is
	DBHost string
	//DBUser is
	DBUser string
	//DBPassword is
	DBPassword string
	//DBName is
	DBName string
)

func initDB() (*sql.DB, error) {
	var connStr string

	// Env variables are injected at build, but when running in dev read from env-file
	if DBHost == "" {
		if err := godotenv.Load(); err != nil {
			log.Printf("Error reading env file %s\n", err.Error())
			return nil, err
		}

		DBDriver = os.Getenv("DB_DRIVER_LOCAL")
		DBHost = os.Getenv("DB_HOST_LOCAL")
		DBUser = os.Getenv("DB_USER_LOCAL")
		DBPassword = os.Getenv("DB_PASSWORD_LOCAL")
		DBName = os.Getenv("DB_NAME_LOCAL")
	}

	// Slightly different when connecting to localhost, so has to be a bit uggly
	if DBHost == "localhost" {
		connStr = fmt.Sprintf("%s:%s@/%s?parseTime=true", DBUser, DBPassword, DBName)
	} else {
		connStr = fmt.Sprintf("%s:%s@tcp(%s)/%s?parseTime=true", DBUser, DBPassword, DBHost, DBName)
	}

	log.Println(connStr)

	log.Println()
	db, err := sql.Open(DBDriver, connStr)
	if err != nil {
		log.Printf("Error open DB driver: %s\n", err.Error())
		return nil, err
	}

	if err := db.Ping(); err != nil {
		log.Printf("Error pinging DB: %s\n", err.Error())
		return nil, err
	}

	log.Println("Connected to db")

	return db, nil
}
