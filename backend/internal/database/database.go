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

    sqlDB, err := sql.Open("postgres", psqlInfo)
    if err != nil {
        return err
    }

    if err = sqlDB.Ping(); err != nil {
        return err
    }

    dbInstance = &Database{db: sqlDB}
    return nil
}

func GetDB() *Database {
    return dbInstance
}

func (d *Database) QueryRow(query string, args ...interface{}) *sql.Row {
    return d.db.QueryRow(query, args...)
}

func (d *Database) Query(query string, args ...interface{}) (*sql.Rows, error) {
    return d.db.Query(query, args...)
}

func (d *Database) Exec(query string, args ...interface{}) (sql.Result, error) {
    return d.db.Exec(query, args...)
}