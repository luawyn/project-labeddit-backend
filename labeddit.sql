-- Active: 1679011158713@@127.0.0.1@3306

CREATE TABLE users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL
);

CREATE TABLE posts (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    creator_id TEXT NOT NULL,
    content TEXT NOT NULL,
    comments INTEGER DEFAULT (0) NOT NULL,
    likes INTEGER DEFAULT (0) NOT NULL,
    dislikes INTEGER DEFAULT (0) NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL,
    FOREIGN KEY (creator_id) REFERENCES users (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE likes_dislikes (
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    like INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE comments (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    post_id TEXT NOT NULL,
    creator_id TEXT NOT NULL,
    content TEXT NOT NULL, 
    likes INTEGER DEFAULT (0) NOT NULL,
    dislikes INTEGER DEFAULT (0) NOT NULL,
    created_at TEXT DEFAULT (DATETIME()) NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    FOREIGN KEY (creator_id) REFERENCES users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE likes_dislikes_comments(
    user_id TEXT NOT NULL,
    comment_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    like INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES comments (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

INSERT INTO users (id, name, email, password, role)
VALUES
	("u001", "fulano123", "fulano@email.com", "fulano123", "NORMAL"),
	("u002", "beltrana00", "beltrana@email.com", "beltrana00", "NORMAL"),
	("u003", "astrodev99", "astrodev@email.com", "astrodev99", "ADMIN");

INSERT INTO posts (id, creator_id, comments, content)
VALUES 
    ("p001", "u001", 2, "Porque a maioria dos desenvolvedores usam Linux? ou as empresas de tecnologia usam Linux ?"),
    ("p002", "u001", 0, "Qual super poder você gostaria de ter?"),
    ("p003", "u002", 0, "Se você pudesser ter qualquer tipo de pet, qual você escolheria?"),
    ("p004", "u003", 0, "Se você tivesse que comer apenas uma coisa para o resto de sua vida, o que você escolheria?");



INSERT INTO likes_dislikes (user_id, post_id, like)
VALUES
    ("u002", "p001", 1),
    ("u003", "p001", 1),
    ("u003", "p002", 1),
    ("u002", "p002", 0),
    ("u001", "p003", 0),
    ("u003", "p003", 0),
    ("u001", "p004", 1),
    ("u002", 'p004', 1);

INSERT INTO comments (id, post_id, creator_id, content)
VALUES 
    ("c001", "p001", "u002", "Não posso falar por todos, mas usar Linux ajudou meu pc a ter uma performance melhor (e evitou que eu precisasse comprar um novo)"),
    ("c002", "p001", "u003", "Não é a maioria, já vi umas enquetes, inclusive nesse sub se não me engano, onde Windows ganhava na qntd de usuários. Linux é rápido, tem várias opções pra diferentes gostos.");

INSERT INTO likes_dislikes_comments (user_id, comment_id, post_id, like)
VALUES
    ("u001", "c001", "p001", 1),
    ("u001", "c002", "p001", 1),
    ("u003", "c001", "p001", 1),
    ("u002", "c002", "p001", 0);
SELECT * FROM users;
SELECT * FROM posts;
SELECT * FROM likes_dislikes;
SELECT * FROM comments;
SELECT * FROM likes_dislikes_comments;
