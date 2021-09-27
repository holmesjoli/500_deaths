library(magrittr)

sapply(list.files("R", full.names = T), source, .GlobalEnv)  
config <- yaml::read_yaml("config.yaml")

first_death <- as.Date("02-29-2020", "%m-%d-%Y")
today <- lubridate::today()
days_since_first_death <- today - first_death
minutes_since_first_death <- lubridate::time_length(days_since_first_death,
                                                    unit="minutes")
hours_since_first_death <- lubridate::time_length(days_since_first_death, 
                                                  unit="hours")
days_since_first_death <- lubridate::time_length(today - first_death, 
                                                 unit = "days")

df <- one_in_x_est.sex() %>%
  dplyr::bind_rows(one_in_x_est.ethnicity()) %>%
  dplyr::bind_rows(one_in_x_est.age()) %>%
  dplyr::bind_rows(one_in_x_est.state()) %>%
  dplyr::mutate(one_in_x = round(one_in_x),
                death_per_min = n/minutes_since_first_death,
                min_per_death = 1/death_per_min,
                death_per_hour = n/hours_since_first_death,
                hour_per_death = 1/death_per_hour,
                death_per_day = n/days_since_first_death,
                day_per_death = 1/death_per_day)


nyt_obits <- xml2::read_html("https://www.nytimes.com/interactive/2020/obituaries/people-died-coronavirus-obituaries.html")
  
img_urls <- nyt_obits %>%  
  rvest::html_nodes("img") %>%
  rvest::html_attrs()

names <- nyt_obits %>% 
  rvest::html_nodes("h1.g-name") %>% 
  rvest::html_text()

summ <- nyt_obits %>%
  rvest::html_nodes("div.g-summ") %>% 
  rvest::html_text()

ages <- names %>% 
  gsub(".*, ", "", .)

names <- names %>%
  gsub(",.*", "", .)

df <- data.frame(names = names,
           summary = summ,
           ages = ages
           #,
          # img_urls = img_urls
          )
