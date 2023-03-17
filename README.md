
# Projeto LabEddit (Back-End)

O LabEddit é uma rede social com o objetivo de promover a conexão e interação entre pessoas. 

Quem se cadastrar no aplicativo poderá criar e curtir publicações.
## Documentação da API
[Postman](https://documenter.getpostman.com/view/24460811/2s93JzKfno)

## LabEddit (Front-End)
[Repositório](https://github.com/luawyn/project-labeddit-frontend)

#### Cadastra um novo usuário

```http
  POST /users/signup
```
Endpoint público utilizado para cadastro. Devolve um token jwt.


| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `body`  | `object` | `name (string), email (string), password (string)` |

#### Login do usuário

```http
 POST /users/login
```
Endpoint público utilizado para login. Devolve um token jwt.

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `body`  | `object` | `email (string), password (string)` |


#### Retorna todos os posts cadastrados

```http
  GET /posts
```
Endpoint protegido, requer um token jwt para acessá-lo.



| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `authorization`      | `string` | **Obrigatório**. O Token jwt |

#### Cadastra um novo post

```http
  POST /posts
```
Endpoint protegido, requer um token jwt para acessá-lo.

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `authorization`  | `string` | **Obrigatório**. O Token jwt |
`body`  | `object` | `content (string)` |

#### Edita um post

```http
  PUT /posts/:id
```
Endpoint protegido, requer um token jwt para acessá-lo.

Só quem criou o post pode editá-lo e somente o conteúdo pode ser editado.

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `authorization`  | `string` | **Obrigatório**. O Token jwt |
| `id`      | `string` | **Obrigatório**. O ID do item que você quer |
`body`  | `object` | `content (string)` |

#### Deleta um post

```http
  DEL /posts/:id
```
Endpoint protegido, requer um token jwt para acessá-lo.

Só quem criou o post pode deletá-lo. Admins podem deletar o post de qualquer pessoa.

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `authorization`  | `string` | **Obrigatório**. O Token jwt |
| `id`      | `string` | **Obrigatório**. O ID do item que você quer |

#### Curtir ou descurtir um post

```http
  PUT /posts/:id/like
```
Endpoint protegido, requer um token jwt para acessá-lo.

Quem criou o post não pode dar like ou dislike no mesmo.

Caso dê um like em um post que já tenha dado like, o like é desfeito.
Caso dê um dislike em um post que já tenha dado dislike, o dislike é desfeito.

Caso dê um like em um post que tenha dado dislike, o like sobrescreve o dislike.
Caso dê um dislike em um post que tenha dado like, o dislike sobrescreve o like.

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `authorization`  | `string` | **Obrigatório**. O Token jwt |
| `id`      | `string` | **Obrigatório**. O ID do item que você quer | 
`body`  | `object` | `like (boolean)`  |

