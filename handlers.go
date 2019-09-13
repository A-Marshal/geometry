package main

import (
	"encoding/json"
	"log"
	"net/http"
	"path/filepath"
)

//index returns the index.html file used for testing the REST API
func index(w http.ResponseWriter, r *http.Request) {
	var urlPath string
	urlPath, _ = filepath.Abs("./static/index.htm")
	//urlPath, _ = filepath.Abs("./static/index.html")
	http.ServeFile(w, r, urlPath)
}

//favIconHandler sets a favicon
func favIconHandler(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "static/favicon.ico")
}

//alphaVantage executes the requested stocks function and returns the result as a JSON array
func alphaVantage(w http.ResponseWriter, r *http.Request) {
	stocks := r.URL.Query().Get("stocks")
	w.Header().Set("Content-Type", "application/json")

	//DB init
	db, err := initDB()
	if err != nil {
		log.Printf("Error DB init: %s\n", err.Error())
		defer db.Close()
		return
	}

	switch stocks {
	case "commentsMonth":
		fromDate := r.URL.Query().Get("fromDate")
		toDate := r.URL.Query().Get("toDate")
		errDate := validateDate(fromDate, toDate)
		if errDate != nil {
			w.WriteHeader(400)
		} else {
			//DB call
			dbResponse, err := getCommentCountMonth(fromDate, toDate, db)
			if err != nil {
				w.WriteHeader(500)
				log.Println("**** statOp ERROR: ", err, "****")
			} else {
				w.WriteHeader(200)
				json.NewEncoder(w).Encode(dbResponse)
				log.Println("##### statOp OK: ", stocks, "#####")
			}
		}
	case "commentsDate":
		fromDate := r.URL.Query().Get("fromDate")
		toDate := r.URL.Query().Get("toDate")
		errDate := validateDate(fromDate, toDate)
		if errDate != nil {
			w.WriteHeader(400)
		} else {
			//DB call
			dbResponse, err := getCommentCountDate(fromDate, toDate, db)
			if err != nil {
				w.WriteHeader(500)
				log.Println("**** statOp ERROR: ", err, "****")
			} else {
				w.WriteHeader(200)
				json.NewEncoder(w).Encode(dbResponse)
				log.Println("##### statOp OK: ", stocks, "#####")
			}
		}
	case "commentsHour":
		fromDate := r.URL.Query().Get("fromDate")
		toDate := r.URL.Query().Get("toDate")
		errDate := validateDate(fromDate, toDate)
		if errDate != nil {
			w.WriteHeader(400)
		} else {
			//DB call
			dbResponse, err := getCommentCountHour(fromDate, toDate, db)
			if err != nil {
				w.WriteHeader(500)
				log.Println("**** statOp ERROR: ", err, "****")
			} else {
				w.WriteHeader(200)
				json.NewEncoder(w).Encode(dbResponse)
				log.Println("##### statOp OK: ", stocks, "#####")
			}
		}
	case "commentsDateBtwHour":
		fromDate := r.URL.Query().Get("fromDate")
		toDate := r.URL.Query().Get("toDate")
		fromHour := r.URL.Query().Get("fromHour")
		toHour := r.URL.Query().Get("toHour")
		errDate := validateDate(fromDate, toDate)
		errTime := validateTime(fromHour, toHour)
		if errDate != nil || errTime != nil {
			w.WriteHeader(400)
		} else {
			//DB call
			dbResponse, err := getCommentCountDayBtwHours(fromDate, toDate, fromHour, toHour, db)
			if err != nil {
				w.WriteHeader(500)
				log.Println("**** statOp ERROR: ", err, "****")
			} else {
				w.WriteHeader(200)
				json.NewEncoder(w).Encode(dbResponse)
				log.Println("##### statOp OK: ", stocks, "#####")
			}
		}
	case "commentsDay":
		fromDate := r.URL.Query().Get("fromDate")
		toDate := r.URL.Query().Get("toDate")
		errDate := validateDate(fromDate, toDate)
		if errDate != nil {
			w.WriteHeader(400)
		} else {
			//DB call
			dbResponse, err := getCommentCountDay(fromDate, toDate, db)
			if err != nil {
				w.WriteHeader(500)
				log.Println("**** statOp ERROR: ", err, "****")
			} else {
				w.WriteHeader(200)
				json.NewEncoder(w).Encode(dbResponse)
				log.Println("##### statOp OK: ", stocks, "#####")
			}
		}
	case "totalComments":
		fromDate := r.URL.Query().Get("fromDate")
		toDate := r.URL.Query().Get("toDate")
		errDate := validateDate(fromDate, toDate)
		if errDate != nil {
			w.WriteHeader(400)
		} else {
			//DB call
			dbResponse, err := getTotalComments(fromDate, toDate, db)
			if err != nil {
				w.WriteHeader(500)
				log.Println("**** statOp ERROR: ", err, "****")
			} else {
				w.WriteHeader(200)
				json.NewEncoder(w).Encode(dbResponse)
				log.Println("##### statOp OK: ", stocks, "#####")
			}
		}
	case "deletedCommentsMonth":
		fromDate := r.URL.Query().Get("fromDate")
		toDate := r.URL.Query().Get("toDate")
		errDate := validateDate(fromDate, toDate)
		if errDate != nil {
			w.WriteHeader(400)
		} else {
			//DB call
			dbResponse, err := getDeletedCommentCountMonth(fromDate, toDate, db)
			if err != nil {
				w.WriteHeader(500)
				log.Println("**** statOp ERROR: ", err, "****")
			} else {
				w.WriteHeader(200)
				json.NewEncoder(w).Encode(dbResponse)
				log.Println("##### statOp OK: ", stocks, "#####")
			}
		}
	case "deletedCommentsDate":
		fromDate := r.URL.Query().Get("fromDate")
		toDate := r.URL.Query().Get("toDate")
		errDate := validateDate(fromDate, toDate)
		if errDate != nil {
			w.WriteHeader(400)
		} else {
			//DB call
			dbResponse, err := getDeletedCommentCountDate(fromDate, toDate, db)
			if err != nil {
				w.WriteHeader(500)
				log.Println("**** statOp ERROR: ", err, "****")
			} else {
				w.WriteHeader(200)
				json.NewEncoder(w).Encode(dbResponse)
				log.Println("##### statOp OK: ", stocks, "#####")
			}
		}
	case "deletedCommentsHour":
		fromDate := r.URL.Query().Get("fromDate")
		toDate := r.URL.Query().Get("toDate")
		errDate := validateDate(fromDate, toDate)
		if errDate != nil {
			w.WriteHeader(400)
		} else {
			//DB call
			dbResponse, err := getDeletedCommentCountHour(fromDate, toDate, db)
			if err != nil {
				w.WriteHeader(500)
				log.Println("**** statOp ERROR: ", err, "****")
			} else {
				w.WriteHeader(200)
				json.NewEncoder(w).Encode(dbResponse)
				log.Println("##### statOp OK: ", stocks, "#####")
			}
		}
	case "deletedCommentsDateBtwHour":
		fromDate := r.URL.Query().Get("fromDate")
		toDate := r.URL.Query().Get("toDate")
		fromHour := r.URL.Query().Get("fromHour")
		toHour := r.URL.Query().Get("toHour")
		errDate := validateDate(fromDate, toDate)
		errTime := validateTime(fromHour, toHour)
		if errDate != nil || errTime != nil {
			w.WriteHeader(400)
		} else {
			//DB call
			dbResponse, err := getDeletedCommentCountDayBtwHours(fromDate, toDate, fromHour, toHour, db)
			if err != nil {
				w.WriteHeader(500)
				log.Println("**** statOp ERROR: ", err, "****")
			} else {
				w.WriteHeader(200)
				json.NewEncoder(w).Encode(dbResponse)
				log.Println("##### statOp OK: ", stocks, "#####")
			}
		}
	case "deletedCommentsDay":
		fromDate := r.URL.Query().Get("fromDate")
		toDate := r.URL.Query().Get("toDate")
		errDate := validateDate(fromDate, toDate)
		if errDate != nil {
			w.WriteHeader(400)
		} else {
			//DB call
			dbResponse, err := getDeletedCommentCountDay(fromDate, toDate, db)
			if err != nil {
				w.WriteHeader(500)
				log.Println("**** statOp ERROR: ", err, "****")
			} else {
				w.WriteHeader(200)
				json.NewEncoder(w).Encode(dbResponse)
				log.Println("##### statOp OK: ", stocks, "#####")
			}
		}
	case "totalDeletedComments":
		fromDate := r.URL.Query().Get("fromDate")
		toDate := r.URL.Query().Get("toDate")
		errDate := validateDate(fromDate, toDate)
		if errDate != nil {
			w.WriteHeader(400)
		} else {
			//DB call
			dbResponse, err := getTotalDeletedComments(fromDate, toDate, db)
			if err != nil {
				w.WriteHeader(500)
				log.Println("**** statOp ERROR: ", err, "****")
			} else {
				w.WriteHeader(200)
				json.NewEncoder(w).Encode(dbResponse)
				log.Println("##### statOp OK: ", stocks, "#####")
			}
		}
	case "usersMonth":
		fromDate := r.URL.Query().Get("fromDate")
		toDate := r.URL.Query().Get("toDate")
		errDate := validateDate(fromDate, toDate)
		if errDate != nil {
			w.WriteHeader(400)
		} else {
			//DB call
			dbResponse, err := getCreatedUsersMonth(fromDate, toDate, db)
			if err != nil {
				w.WriteHeader(500)
				log.Println("**** statOp ERROR: ", err, "****")
			} else {
				w.WriteHeader(200)
				json.NewEncoder(w).Encode(dbResponse)
				log.Println("##### statOp OK: ", stocks, "#####")
			}
		}
	case "usersDate":
		fromDate := r.URL.Query().Get("fromDate")
		toDate := r.URL.Query().Get("toDate")
		errDate := validateDate(fromDate, toDate)
		if errDate != nil {
			w.WriteHeader(400)
		} else {
			//DB call
			dbResponse, err := getCreatedUsersDate(fromDate, toDate, db)
			if err != nil {
				w.WriteHeader(500)
				log.Println("**** statOp ERROR: ", err, "****")
			} else {
				w.WriteHeader(200)
				json.NewEncoder(w).Encode(dbResponse)
				log.Println("##### statOp OK: ", stocks, "#####")
			}
		}
	case "usersHour":
		fromDate := r.URL.Query().Get("fromDate")
		toDate := r.URL.Query().Get("toDate")
		errDate := validateDate(fromDate, toDate)
		if errDate != nil {
			w.WriteHeader(400)
		} else {
			//DB call
			dbResponse, err := getCreatedUsersHour(fromDate, toDate, db)
			if err != nil {
				w.WriteHeader(500)
				log.Println("**** statOp ERROR: ", err, "****")
			} else {
				w.WriteHeader(200)
				json.NewEncoder(w).Encode(dbResponse)
				log.Println("##### statOp OK: ", stocks, "#####")
			}
		}
	case "usersDay":
		fromDate := r.URL.Query().Get("fromDate")
		toDate := r.URL.Query().Get("toDate")
		errDate := validateDate(fromDate, toDate)
		if errDate != nil {
			w.WriteHeader(400)
		} else {
			//DB call
			dbResponse, err := getCreatedUsersDay(fromDate, toDate, db)
			if err != nil {
				w.WriteHeader(500)
				log.Println("**** statOp ERROR: ", err, "****")
			} else {
				w.WriteHeader(200)
				json.NewEncoder(w).Encode(dbResponse)
				log.Println("##### statOp OK: ", stocks, "#####")
			}
		}
	case "totalUsers":
		fromDate := r.URL.Query().Get("fromDate")
		toDate := r.URL.Query().Get("toDate")
		errDate := validateDate(fromDate, toDate)
		if errDate != nil {
			w.WriteHeader(400)
		} else {
			//DB call
			dbResponse, err := getTotalUsers(fromDate, toDate, db)
			if err != nil {
				w.WriteHeader(500)
				log.Println("**** statOp ERROR: ", err, "****")
			} else {
				w.WriteHeader(200)
				json.NewEncoder(w).Encode(dbResponse)
				log.Println("##### statOp OK: ", stocks, "#####")
			}
		}
	case "customers":
		//DB call
		dbResponse, err := getCustomers(db)
		if err != nil {
			w.WriteHeader(500)
			log.Println("**** statOp ERROR: ", err, "****")
		} else {
			w.WriteHeader(200)
			json.NewEncoder(w).Encode(dbResponse)
			log.Println("##### statOp OK: ", stocks, "#####")
		}
	case "commentedArticles":
		fromDate := r.URL.Query().Get("fromDate")
		toDate := r.URL.Query().Get("toDate")
		errDate := validateDate(fromDate, toDate)
		if errDate != nil {
			w.WriteHeader(400)
		} else {
			//DB call
			dbResponse, err := getCommentedArticles(fromDate, toDate, db)
			if err != nil {
				w.WriteHeader(500)
				log.Println("**** statOp ERROR: ", err, "****")
			} else {
				w.WriteHeader(200)
				json.NewEncoder(w).Encode(dbResponse)
				log.Println("##### statOp OK: ", stocks, "#####")
			}
		}
	default:
		log.Println("**** Error, invalid statOp called: ", stocks, "****")
		w.WriteHeader(400)
		json.NewEncoder(w).Encode("Error, invalid statOp called")
	}
	//Close DB conn
	defer db.Close()
}
