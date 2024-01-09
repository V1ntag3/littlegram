# eqp6
Equipe 6 - ES 2023.1
- Victor Emmanuel Vieira Soares 
- Marcos Vinicius Ribeiro Alencar
- Emanuel Mendes Monteiro
- Eduardo Bezerra de Sousa

# Documentação da API Littlegram

## Sobre a API

A API Littlegram fornece funcionalidades para gerenciar usuários, sessões e fotos.

## Base URL
A URL base para todas as requisições é `http://localhost:3333`.

## Autenticação
A maioria das rotas requer autenticação JWT. O token deve ser fornecido no cabeçalho de autorização no formato `Bearer <token>`.

---

## Rota: /users

### POST /users
Cria um novo usuário.

- **Body:**
    ```json
    {
        "realName": "nome real",
        "username": "nome de usuário",
        "email": "email",
        "password": "senha",
        "bio": "biografia"
    }
    ```
- **Response:** Retorna os detalhes do usuário criado.

---

### GET /users
Obtém todos os usuários.

- **Response:** Retorna uma lista de usuários.

---

## Rota: /sessions

### POST /sessions
Cria uma nova sessão, efetuando login do usuário.

- **Body:**
    ```json
    {
        "email": "email",
        "password": "senha"
    }
    ```
- **Response:** Retorna o token JWT.

---

### PATCH /sessions/confirm-account/
Confirma a conta do usuário a partir do email.

- **Body:**
    ```json
    {
        "email": "email",
        "token": "token de confirmação"
    }
    ```
- **Response:** Retorna a confirmação de que a conta foi verificada.

---

## Rota: /photos

### POST /photos/
Faz o upload de uma foto.

- **Body:** Multipart form-data com o parâmetro 'photo' contendo o arquivo de foto.
- **Response:** Retorna os detalhes da foto carregada.

---

### GET /photos/user/
Obtém todas as fotos do usuário autenticado.

- **Response:** Retorna uma lista de fotos do usuário autenticado.

---

### GET /files/photos/{photo_id}
Obtém uma foto específica.

- **Response:** Retorna a foto especificada.

---

### DELETE /photos
Exclui uma foto específica.

- **Query parameters:**
    - photoId: O identificador da foto.

- **Response:** Retorna a confirmação da foto excluída.

---

## Rota: /users/avatar

### PATCH /users/avatar
Atualiza o avatar do usuário.

- **Body:** Multipart form-data com o parâmetro 'avatar' contendo o arquivo de imagem.
- **Response:** Retorna os detalhes do usuário com o avatar atualizado.

---

### GET /files/avatar/{avatar_id}
Obtém o avatar do usuário.

- **Response:** Retorna o avatar do usuário.

---


### ENV EXEMPLE littlegram_server

``` javascript

SECRET_KEY="minhachavesecreta"

EMAIL_HOST="marcos.vinicius.r.alencar@gmail.com"
EMAIL_PORT="4444"
EMAIL_HOST_USER="marocs"
EMAIL_HOST_PASSWORD="marcos1302"

BACK_END_URL="http://localhost:3333"
FRONT_END_URL="http://localhost:3000"

```