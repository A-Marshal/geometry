package main

import (
	"net/http"

	_ "github.com/go-sql-driver/mysql" // MySQL
	"github.com/gorilla/mux"
)

//Route struct - structure containing variables enabling http communication/routing
type Route struct {
	Name        string
	Method      string
	Pattern     string
	HandlerFunc http.HandlerFunc
}

//Routes array - array of Route structs
type Routes []Route

//NewRouter - function setting up a new router for the webpage project
func NewRouter() *mux.Router {

	router := mux.NewRouter().StrictSlash(true)
	// Serve CSS, JS & Images Statically.
	router.
		PathPrefix("/static/").
		Handler(http.StripPrefix("/static/", http.FileServer(http.Dir("."+"/static/"))))

	//Setup REST API routes
	for _, route := range routes {
		var handler http.Handler

		handler = route.HandlerFunc
		handler = Logger(handler, route.Name)

		router.
			Methods(route.Method).
			Path(route.Pattern).
			Name(route.Name).
			Handler(handler)
	}
	return router
}

var routes = Routes{
	Route{
		"index",
		"GET",
		"/",
		index,
	},
	Route{
		"favicon",
		"GET",
		"/favicon.ico",
		favIconHandler,
	},
}
