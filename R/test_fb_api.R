id <- "182925440635072"
endpoint <- "https://graph.facebook.com/"
version <- "v12.0/"
ACCESS_TOKEN <- "EAACmXqXo0MABALYqB8AJd8WeHub8noeYxQk2j3fTjFfIejBkv0sCdeQZBLn2fUkiD1yVPGZC3By3ZBFchZCA9RwaeHQqRIytXVhYmrR7qZB9q5kq27oNsEyCBsumokvLKUmRqn4xDZAuMAPDzZA1LtTCoZBCaVCz9w7RXPNP5g8nmLUrIWsG3LQZCJCOq0bZCB6bW9LM8xR0GURUKpW4B6iVwfZB69FoTDsmZBxBw7jTRueFOzAGzNF4k5Dt"

x <- httr::GET(glue::glue(endpoint, "me?access_token={ACCESS_TOKEN}")) %>% 
  httr::content()
x$id
USER_ID <- x$id


x <- httr::GET(glue::glue(endpoint, "{USER_ID}/photos?access_token={ACCESS_TOKEN}")) %>% 
  httr::content()
x$data

meta <- httr::GET(glue::glue(endpoint, "{USER_ID}?metadata=1&access_token={ACCESS_TOKEN}")) %>% 
  httr::content()

x <- httr::GET(glue::glue(endpoint, "{USER_ID}/friends?access_token={ACCESS_TOKEN}"))
x$status_code
x %>% 
  httr::content()


friends <- httr::GET("./data/friends.json")

x <- httr::GET(glue::glue("https://graph.facebook.com/{USER_ID}/friends?access_token=EAACmXqXo0MABAJGEJVKDvZCWbADqjCqGdWzjazGS1jvpScMonNYSB0tUIaCBJBE3o9adOepgfydct6KZCi3JajBEQAUYzTwkxvlkrAdfN9AQ2C58wyAlSnoktppbum1SeuLMNL4GQl41fARuyR5ZCvfklwwaLY2vXWKcgShN4SiXOC2Sl4FP3m4nrI8VZAY02d72AodUM5Od5gcUploH"))
x$status_code
x$request
z <- x %>% httr::content()
