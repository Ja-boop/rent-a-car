-- This file isn't useful anymore, for the implementation of the orm "sequelize"
-- SQLite
DROP TABLE IF EXISTS lista_vehiculos;
CREATE TABLE lista_vehiculos (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    image_url TEXT NOT NULL,
    year_manufactured INTEGER NOT NULL,
    kms INTEGER NOT NULL,
    color TEXT NOT NULL,
    air_conditioner BOOLEAN NOT NULL,
    passengers INTEGER NOT NULL,
    transmission TEXT NOT NULL,
    cost INTEGER NOT NULL,
    created_at DATE DEFAULT (datetime('now')) NOT NULL,
    updated_at DATE DEFAULT (datetime('now')) NOT NULL
);

INSERT INTO lista_vehiculos (brand, model, image_url, year_manufactured, kms, color, air_conditioner, passengers, transmission) VALUES('Audi', 'R8', 'https://periodismodelmotor.com/wp-content/uploads/2018/09/Audi-R8-V10-Plus-Strasse-Wheels-8.jpg', 2018, 20000, 'Red', 'Yes', 2, 'Automatic');
INSERT INTO lista_vehiculos (brand, model, image_url, year_manufactured, kms, color, air_conditioner, passengers, transmission) VALUES('Fiat', 'Duna', 'https://http2.mlstatic.com/D_NQ_NP_904339-MLA42677176754_072020-W.jpg', 1994, 150000, 'Red', 'No', 4, 'Manual');

DROP TABLE IF EXISTS user_database;
CREATE TABLE user_database (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    created_at DATE DEFAULT (datetime('now')) NOT NULL,
    updated_at DATE DEFAULT (datetime('now')) NOT NULL
);

INSERT INTO user_database (email, password) VALUES('viktor@hotmail.com', '1234');

DROP TABLE IF EXISTS reserve_cars; 
CREATE TABLE reserve_cars (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    user_id INTEGER NOT NULL,
    car_id INTEGER NOT NULL,
    car_image TEXT NOT NULL,
    take_day TEXT NOT NULL,
    return_day TEXT NOT NULL,
    cost NUMBER NOT NULL,
    created_at DATE DEFAULT (datetime('now')) NOT NULL,
    updated_at DATE DEFAULT (datetime('now')) NOT NULL
);

UPDATE reserve_cars SET car_id = 2 WHERE id = 2;

INSERT INTO reserve_cars (user_email, car_id, take_day, return_day, cost) VALUES('viktor@hotmail.com', '3', '06/03/2021', '10/03/2021', 20000);

SELECT brand FROM lista_vehiculos WHERE id = 1;