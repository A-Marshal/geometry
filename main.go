package main

import (
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql" // MySQL
)

func main() {
	//Create new router containing the REST API routes
	router := NewRouter()

	//Log server interactions (Get, Post, etc)
	log.Fatal(http.ListenAndServe(":8096", router))
}
