package database

import (
    "database/sql"
    "fmt"

    _ "github.com/lib/pq"
)

type Database struct {
    db *sql.DB
}

var dbInstance *Database

func Init(host, port, user, password, dbname string) error {
    psqlInfo := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
        host, port, user, password, dbname)

    sqlDB, err := sql.Open("postgres", psqlInfo) // open connection
    if err != nil {
        return err
    }

    if err = sqlDB.Ping(); err != nil { //check if server is reachable
        return err
    }

    dbInstance = &Database{db: sqlDB} // initialize singleton instance
    return nil
}

func GetDB() *Database { // return singleton instance
    return dbInstance
}

func (d *Database) QueryRow(query string, args ...interface{}) *sql.Row { // for single row queries
    return d.db.QueryRow(query, args...)
}

func (d *Database) Query(query string, args ...interface{}) (*sql.Rows, error) { // for multi-row queries
    return d.db.Query(query, args...)
}

func (d *Database) Exec(query string, args ...interface{}) (sql.Result, error) { // for insert, update, delete
    return d.db.Exec(query, args...)
}