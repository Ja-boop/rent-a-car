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
    created_at DATE DEFAULT (datetime('now')) NOT NULL,
    updated_at DATE DEFAULT (datetime('now')) NOT NULL
);

INSERT INTO lista_vehiculos (brand, model, image_url, year_manufactured, kms, color, air_conditioner, passengers, transmission) VALUES('Audi', 'R8', 'https://periodismodelmotor.com/wp-content/uploads/2018/09/Audi-R8-V10-Plus-Strasse-Wheels-8.jpg', 2018, 20000, 'Red', 'Yes', 2, 'Automatic');
INSERT INTO lista_vehiculos (brand, model, image_url, year_manufactured, kms, color, air_conditioner, passengers, transmission) VALUES('Fiat', 'Duna', 'https://http2.mlstatic.com/D_NQ_NP_904339-MLA42677176754_072020-W.jpg', 1994, 150000, 'Red', 'No', 4, 'Manual');

CREATE TABLE user_database (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    created_at DATE DEFAULT (datetime('now')) NOT NULL,
    updated_at DATE DEFAULT (datetime('now')) NOT NULL
);

INSERT INTO user_database (email, password) VALUES('viktor@hotmail.com', '1234');

SELECT * FROM lista_vehiculos;